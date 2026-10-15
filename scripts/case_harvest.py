#!/usr/bin/env python3
"""
OPC Case Harvest (GitHub Actions 版) — 一人公司坟场 AI OPC 失败案例每日自动采集与入库

与 CodeAct 沙箱版不同，本脚本不依赖 codeact_sdk，可在 GitHub Actions ubuntu-latest 独立运行：
  1. 多源搜索：Google News RSS（中英）+ Hacker News Algolia（英文社区）+ 中文媒体 RSS（36氪），失败自动降级
  2. 并发抓取正文：requests + BeautifulSoup（Google News 跳转自动跟随到原文）
  3. LLM 抽取：OpenAI 兼容 /chat/completions（LLM_API_KEY / LLM_API_BASE / LLM_MODEL 由 secrets 注入）
  4. 严格校验（六死因、timeline/breakdown/lessons 数量）后追加 src/data/cases.ts
  5. 生成采集报告 codeact/output/opc_cases_YYYYMMDD.md

用法:
  python scripts/case_harvest.py [max_cases] [since_days]
  默认: max_cases=10, since_days=7
"""

import base64
import json
import os
import re
import shutil
import sys
import time
import urllib.parse
from datetime import datetime, timedelta, timezone

import requests
from bs4 import BeautifulSoup

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CASES_FILE = os.path.join(PROJECT_ROOT, "src/data/cases.ts")
REPORT_DIR = os.path.join(PROJECT_ROOT, "codeact", "output")

VALID_DEAD_CAUSES = ["获客失败", "需求验证缺失", "商业模式脆弱", "成本结构失衡", "同质化竞争", "合规与决策风险"]
VALID_STATUSES = ["dead", "acquired", "pivoted"]
VALID_FUNDING_TYPES = ["自筹", "融资", "混合"]
TZ_CST = timezone(timedelta(hours=8))

SEARCH_KW_ZH = ["AI创业失败", "AI公司倒闭", "AI产品关停", "创业失败复盘", "独立开发者 失败", "AI创业 关停"]
SEARCH_KW_EN = ["AI startup shutdown", "startup postmortem", "AI company closed", "indie hacker abandoned", "startup failure story"]
HN_QUERIES = ["we failed our startup", "shutting down my company", "why we shut down", "startup postmortem", "our startup died", "lessons from shutting down", "we closed our startup", "startup failure story", "indie hacker failed", "I shut down my startup", "we killed our startup", "shutting down the company", "failed startup lessons", "company winding down", "product shutdown postmortem"]
RELEVANCE_KW = ["失败", "倒闭", "关停", "关闭", "停止运营", "注销", "放弃", "解散", "破产", "shutdown", "closed", "shut down", "failed", "failure", "postmortem", "sunset", "discontinued", "abandoned", "laid off", "停止", "亏损", "烧光", "停服", "下线", "退市", "裁员", "终止", "关服", "暂停", "restructure", "wind down", "shutting down", "cease", "defunct"]

LLM_API_KEY = os.environ.get("LLM_API_KEY", "")
LLM_API_BASE = os.environ.get("LLM_API_BASE", "").rstrip("/")
LLM_MODEL = os.environ.get("LLM_MODEL", "")
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"


def log(*a):
    print(f"[{datetime.now(TZ_CST).strftime('%H:%M:%S')}]", *a, flush=True)


def build_tw(days):
    end = datetime.now(TZ_CST)
    start = end - timedelta(days=days)
    return {"start": start.isoformat(timespec="seconds"), "end": end.isoformat(timespec="seconds")}


def read_existing():
    if not os.path.exists(CASES_FILE):
        return set(), set()
    with open(CASES_FILE, "r", encoding="utf-8") as f:
        c = f.read()
    return set(re.findall(r'slug:\s*"([^"]+)"', c)), set(re.findall(r'name:\s*"([^"]+)"', c))


def ts_escape(s):
    return json.dumps(str(s), ensure_ascii=False)


def norm_url(u):
    return (u or "").split("#", 1)[0].split("?", 1)[0].rstrip("/")


def is_relevant(title, snippet=""):
    text = (str(title) + " " + str(snippet)).lower()
    if any(w in text for w in ["taskade", "合成案例", "hypothetical", "fictional"]):
        return False
    return any(kw in text for kw in RELEVANCE_KW)


def safe_json_array(raw):
    if not raw or not raw.strip():
        return []
    m = re.search(r'\[.*\]', raw, re.DOTALL)
    if m:
        raw = m.group()
    try:
        r = json.loads(raw)
        return r if isinstance(r, list) else []
    except Exception:
        return []


def ddg_search(query, tw):
    """DuckDuckGo HTML 搜索（备用源，可能被反爬返回 202）。"""
    params = {"q": query, "kl": "cn-zh" if any('\u4e00' <= ch <= '\u9fff' for ch in query) else "us-en"}
    url = "https://html.duckduckgo.com/html/?" + urllib.parse.urlencode(params)
    try:
        r = requests.get(url, headers={"User-Agent": UA}, timeout=20)
        if r.status_code != 200:
            log(f"[DDG] HTTP {r.status_code} for {query[:40]}")
            return []
        soup = BeautifulSoup(r.text, "html.parser")
        out = []
        for res in soup.select(".result"):
            a = res.select_one(".result__a")
            sn = res.select_one(".result__snippet")
            if not a or not a.get("href"):
                continue
            title = a.get_text(" ", strip=True)
            snippet = sn.get_text(" ", strip=True) if sn else ""
            href = a["href"]
            m = re.search(r'uddg=([^&]+)', href)
            real = urllib.parse.unquote(m.group(1)) if m else href
            if real.startswith("http"):
                out.append({"title": title, "snippet": snippet, "url": real})
        return out
    except Exception as e:
        log(f"[DDG] error {query[:30]}: {e}")
        return []


def parse_rss_items(text):
    """解析 RSS/Atom XML，返回 [{title, snippet, url, published}]。兼容 CDATA/嵌套 HTML。"""
    import xml.etree.ElementTree as ET
    items = []
    try:
        root = ET.fromstring(text)
    except Exception as e:
        log(f"[RSS] parse error: {e}")
        return items
    for item in root.iter():
        tag = item.tag.rsplit("}", 1)[-1]
        if tag not in ("item", "entry"):
            continue
        title = snippet = url = published = ""
        real_url = ""
        for child in item:
            ct = child.tag.rsplit("}", 1)[-1]
            if ct == "title":
                title = "".join(child.itertext()).strip()
            elif ct in ("description", "summary", "content"):
                # itertext 兼容 CDATA 内嵌套 HTML；先抓原文 href，再取纯文本摘要
                raw = "".join(child.itertext()).strip()
                hrefs = re.findall(r'href="(https?://[^"]+)"', raw)
                if hrefs:
                    real_url = hrefs[0]
                snippet = re.sub(r"<[^>]+>", "", raw)[:500]
            elif ct == "link":
                url = "".join(child.itertext()).strip() or child.get("href") or ""
            elif ct in ("pubDate", "published", "updated"):
                published = "".join(child.itertext()).strip()
        if title and url:
            items.append({"title": title, "snippet": snippet, "url": url.strip(),
                          "real_url": real_url, "published": published})
    return items


def google_news_search(query, tw, days):
    """Google News RSS 搜索，返回 [{title, snippet, url, published}]。Actions 环境(美国IP)通常可用。"""
    hl = "zh-CN" if any('\u4e00' <= ch <= '\u9fff' for ch in query) else "en-US"
    gl = "CN" if hl == "zh-CN" else "US"
    ceid = "CN:zh-Hans" if hl == "zh-CN" else "US:en"
    # after: 语法限制时间窗
    after = (datetime.now(TZ_CST) - timedelta(days=days)).strftime("%Y-%m-%d")
    q = f"{query} after:{after}"
    url = ("https://news.google.com/rss/search?q=" + urllib.parse.quote(q) +
           f"&hl={hl}&gl={gl}&ceid={ceid}")
    try:
        r = requests.get(url, headers={"User-Agent": UA}, timeout=12)
        if r.status_code != 200:
            log(f"[GNews] HTTP {r.status_code}")
            return []
        ct = r.headers.get("Content-Type", "")
        if "xml" not in ct and "rss" not in ct:
            log(f"[GNews] not RSS: {ct}")
            return []
        items = parse_rss_items(r.text)
        # Google News 的 link 是加密跳转链接，但 description 里常带真实 href 可抓原文；
        # 摘要足够时仍作为 body 兜底
        with_body = 0
        with_real = 0
        for it in items:
            rurl = it.get("real_url", "")
            if rurl and "news.google.com" not in rurl:
                it["url"] = rurl
                with_real += 1
            if it.get("snippet") and len(it["snippet"]) > 60:
                it["body"] = it["snippet"]
                with_body += 1
        log(f"[GNews] {len(items)} items ({with_body} body, {with_real} real_url) for {query[:30]}")
        return items
    except Exception as e:
        log(f"[GNews] error {query[:30]}: {e}")
        return []
    except Exception as e:
        log(f"[GNews] error {query[:30]}: {e}")
        return []


HN_STRONG = ["shut down", "shutting down", "we shut", "closed our", "we closed", "failed", "postmortem", "post-mortem", "died", "sunset", "winding down", "wind down", "killed our", "abandoned", "laid off", "bankrupt", "out of business", "called it quits", "shut the doors", "we're shutting", "shut it down", "shut the company", "close the company", "closing down", "gave up", "pulled the plug", "ran out of money", "dissolved", "had to shut", "decided to shut", "had to close", "shut down our", "shutting down our", "we closed down", "closed down"]

def hn_search(query, days):
    """Hacker News Algolia API 搜索（稳定免费）。全文搜索 + 强失败信号词过滤。
    返回 item 自带 body（story_text，复盘帖正文通常很长，无需外部抓取）。"""
    ts = int((datetime.now(TZ_CST) - timedelta(days=max(days, 60))).timestamp())
    url = ("https://hn.algolia.com/api/v1/search?query=" + urllib.parse.quote(query) +
           f"&tags=story&hitsPerPage=50&numericFilters=created_at_i%3E{ts}")
    try:
        r = requests.get(url, headers={"User-Agent": UA}, timeout=25)
        if r.status_code != 200:
            log(f"[HN] HTTP {r.status_code}")
            return []
        d = r.json()
        out = []
        for h in d.get("hits", []):
            title = h.get("title") or h.get("story_title") or ""
            st = (h.get("story_text") or "").strip()
            u = h.get("url") or h.get("story_url") or ""
            if st:
                st = re.sub(r"<[^>]+>", " ", st)
                st = re.sub(r"\s+", " ", st).strip()
            hay = (str(title) + " " + st).lower()
            # 只保留强失败信号且带自带正文的自发帖（外部新闻链接在 Actions 抓不到正文，放弃）
            if not any(k in hay for k in HN_STRONG):
                continue
            if st and len(st) > 100:
                out.append({"title": title, "snippet": st[:300],
                            "url": u, "published": h.get("created_at", ""),
                            "body": st, "is_selfpost": True})
        log(f"[HN] {len(out)} items for {query[:30]}")
        return out
    except Exception as e:
        log(f"[HN] error {query[:30]}: {e}")
        return []


def cn_media_search(days):
    """直接抓取中文科技媒体 RSS，按关键词筛选。仅解析 XML；多源候选，哪个可用用哪个。"""
    sources = {
        "36kr": "https://36kr.com/feed",
        "huxiu": "https://www.huxiu.com/rss/0.xml",
        "ifanr": "https://www.ifanr.com/feed",
        "pingwest": "https://www.pingwest.com/feed",
        "donews": "https://www.donews.com/rss",
    }
    out = []
    for name, url in sources.items():
        try:
            r = requests.get(url, headers={"User-Agent": UA}, timeout=15)
            if r.status_code != 200:
                log(f"[{name}] HTTP {r.status_code}")
                continue
            ct = r.headers.get("Content-Type", "")
            if "xml" not in ct and "rss" not in ct and "atom" not in ct:
                log(f"[{name}] not RSS: {ct}")
                continue
            items = parse_rss_items(r.text)
            log(f"[{name}] {len(items)} items")
            for it in items:
                # RSS description 摘要可作兜底正文；标题含失败词才保留
                if is_relevant(it["title"], it["snippet"]):
                    it["sourceName"] = name
                    if it.get("snippet") and len(it["snippet"]) > 60:
                        it["body"] = it["snippet"]
                    out.append(it)
        except Exception as e:
            log(f"[{name}] error: {e}")
    log(f"[中文媒体] {len(out)} 命中")
    return out


def search_all(since_days):
    tw = build_tw(since_days)
    pools = {"gnews": [], "hn": [], "cn": []}
    seen = set()

    def add_dedup(pool, it):
        u = norm_url(it.get("url", ""))
        if u and u not in seen:
            seen.add(u)
            pool.append(it)

    # 1) Google News RSS（中英文关键词，搜索词已保证相关，只去重，每词前 3 条防霸榜）
    #    优先取带摘要 body 的条目，避免把无正文的中文词条排进 fetch 名额
    for q in SEARCH_KW_ZH + SEARCH_KW_EN:
        qn = 0
        items = google_news_search(q, tw, since_days)
        items.sort(key=lambda x: 1 if (x.get("body") or "") else 0, reverse=True)
        for it in items:
            if qn >= 3:
                break
            add_dedup(pools["gnews"], it)
            qn += 1
        time.sleep(1.0)

    # 2) Hacker News（查询词相关，只去重，每词前 6 条）
    for q in HN_QUERIES:
        qn = 0
        for it in hn_search(q, since_days):
            if qn >= 6:
                break
            add_dedup(pools["hn"], it)
            qn += 1
        time.sleep(1.0)

    # 3) 中文媒体 RSS（全量 feed，需按关键词过滤）
    for it in cn_media_search(since_days):
        u = norm_url(it.get("url", ""))
        if u and u not in seen and is_relevant(it.get("title", ""), it.get("snippet", "")):
            seen.add(u)
            pools["cn"].append(it)

    # 三源交错合并，避免 fetch 阶段只取到单一来源
    cands = []
    i = j = k = 0
    while i < len(pools["gnews"]) or j < len(pools["hn"]) or k < len(pools["cn"]):
        if i < len(pools["gnews"]):
            cands.append(pools["gnews"][i]); i += 1
        if j < len(pools["hn"]):
            cands.append(pools["hn"][j]); j += 1
        if k < len(pools["cn"]):
            cands.append(pools["cn"][k]); k += 1

    log(f"[搜索] 候选: GNews={len(pools['gnews'])} HN={len(pools['hn'])} CN={len(pools['cn'])} 合计={len(cands)}")
    return cands


BROWSER_UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
              "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")

def gnews_decode(u):
    """解码 news.google.com/rss/articles/CBMi... 跳转链接，提取真实 URL。"""
    m = re.search(r"/articles/([A-Za-z0-9_-]+)", u)
    if not m:
        return None
    b = m.group(1)
    try:
        raw = base64.urlsafe_b64decode(b + "=" * (-len(b) % 4))
        for cand in re.findall(rb"https?://[^\x00-\x20\x7f]+", raw):
            s = cand.decode(errors="ignore").rstrip(".,;)\"'>")
            if "news.google.com" not in s and "google.com" not in s:
                return s
    except Exception:
        pass
    return None


def fetch_page(url, timeout=25):
    """抓取网页正文。Google News 跳转链接先 base64 解码取真实 URL，解码失败则跟随跳转。"""
    dec = gnews_decode(url)
    if dec:
        url = dec
    headers = {
        "User-Agent": BROWSER_UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8",
    }
    for attempt in range(2):
        try:
            r = requests.get(url, headers=headers, timeout=timeout, allow_redirects=True)
            if r.status_code != 200:
                log(f"[fetch] {url[:70]} HTTP {r.status_code}")
                return None
            final_url = r.url
            ct = r.headers.get("Content-Type", "")
            if "html" not in ct and "text" not in ct and "json" not in ct:
                log(f"[fetch] {url[:70]} CT={ct[:40]}")
                return None
            soup = BeautifulSoup(r.text, "html.parser")
            for t in soup(["script", "style", "nav", "footer", "header", "aside", "noscript"]):
                t.decompose()
            text = soup.get_text("\n", strip=True)
            text = re.sub(r"\n{3,}", "\n\n", text)
            if len(text) < 200 and attempt == 0 and "news.google.com" in url:
                # GNews 跳转页可能是 JS 壳，换无 referer 方式重试一次
                time.sleep(1.0)
                continue
            return text, final_url
        except Exception as e:
            log(f"[fetch] {url[:60]}: {e}")
            return None
    return None


def fetch_all(cands, n=20):
    ok = []
    remain = []
    # 第一轮：自带正文（HN 复盘帖 / GNews 摘要）直接使用，不占抓取名额
    for it in cands:
        body = it.get("body") or ""
        min_body = 120 if it.get("is_selfpost") else 60
        if body and len(body) > min_body:
            ok.append({"item": it, "content": body, "final_url": it.get("url", ""), "source": "body"})
        else:
            remain.append(it)
    # 第二轮：剩余候选抓取原文；GNews 加密跳转链接跳过（抓不到正文，不浪费名额）
    diag_gnews = 0
    for it in remain:
        if len(ok) >= n:
            # 名额已满：仅对前几条 GNews 候选做 decode 诊断（验证解码成功率，不占用名额）
            if diag_gnews < 5 and "news.google.com/rss/articles" in it.get("url", ""):
                diag_gnews += 1
                dec = gnews_decode(it["url"])
                log(f"[diag] GNews decode: {'OK '+dec[:60] if dec else 'FAIL'} url={it['url'][:70]}")
            continue
        u = it.get("url", "")
        if "news.google.com/rss/articles" in u:
            body = it.get("body") or it.get("snippet") or ""
            if len(body) > 60:
                ok.append({"item": it, "content": body, "final_url": u, "source": "body"})
            else:
                log(f"[fetch] 跳过GNews(无摘要): {u[:60]}")
            time.sleep(0.5)
            continue
        res = fetch_page(u)
        if res and len(res[0]) > 200:
            ok.append({"item": it, "content": res[0], "final_url": res[1], "source": "fetch"})
        elif res:
            log(f"[fetch] {u[:60]} 正文过短({len(res[0])}字), final={res[1][:60]}")
        time.sleep(0.5)
    log(f"[fetch] {len(ok)} 有效 / {n} 上限")
    return ok


EXTRACT_PROMPT = """你是创业失败案例研究员。阅读文章,提取 1 个 AI/科技创业失败的真实案例。

规则:
- 只提取真实案例。若无, slug 返回空字符串。
- 所有字段基于文章事实, 不编造。多个案例取最详细的 1 个。
- JSON 字符串值中所有双引号必须转义为 \"，禁止输出未转义的双引号。
- timelineJson/breakdownJson/lessonsJson 必须是真实 JSON 数组（不是字符串）。timelineJson 每项是 {"date": "...", "event": "..."} 对象；breakdownJson 每项是 {"factor": "...", "weight": ...} 对象；lessonsJson 每项是字符串。示例: "timelineJson":[{"date":"2024-01","event":"成立"}]
- 输出必须是一个完整的 JSON 对象，不要截断。示例: "timelineJson":[{{"date":"2024-01","event":"成立"}}]
- slug: 全小写英文短横线
- deadCause 必须六选一: 获客失败, 需求验证缺失, 商业模式脆弱, 成本结构失衡, 同质化竞争, 合规与决策风险
- epitaph: 2-3行墓志铭含关键数字
- motivation: 100-200字创业动机
- timelineJson: JSON数组字符串 如 [{{"time":"2024","event":"成立"}}] 3-6个元素
- breakdownJson: JSON数组字符串 如 [{{"layer":"表层原因","detail":"说明"}}] 至少3个
- lessonsJson: JSON字符串数组 如 ["教训1","教训2","教训3"] 3-5条
- source: 报道媒体名

只输出一个 JSON 对象, 字段:
slug,name,status,founderBg,region,industry,startedAt,closedAt,lifespanMonths,investment,fundingType,deadCause,deadCauseSub,source,verified,epitaph,motivation,timelineJson,breakdownJson,lessonsJson

文章({url}):
{content}"""


def call_llm(prompt, retries=1):
    if not LLM_API_KEY or not LLM_API_BASE or not LLM_MODEL:
        raise RuntimeError("LLM env missing: LLM_API_KEY/LLM_API_BASE/LLM_MODEL")
    headers = {"Authorization": f"Bearer {LLM_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": LLM_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
        "max_tokens": 8192,
        "response_format": {"type": "json_object"},
    }
    for attempt in range(retries + 1):
        try:
            r = requests.post(f"{LLM_API_BASE}/chat/completions", headers=headers, json=payload, timeout=120)
            if r.status_code != 200:
                log(f"[LLM] HTTP {r.status_code}: {r.text[:200]}")
                return None
            data = r.json()
            ch0 = data["choices"][0]
            content = ch0["message"]["content"]
            log(f"[LLM] finish={ch0.get('finish_reason')} use={data.get('usage', {}).get('completion_tokens')}t len={len(content)}")
            # 清理可能的 markdown code fence
            content = re.sub(r"```(?:json)?\s*|\s*```", "", content).strip()
            # 1) 整段就是 JSON
            try:
                return json.loads(content)
            except Exception:
                pass
            # 2) 提取第一个完整 JSON 对象
            try:
                obj, _ = json.JSONDecoder().raw_decode(content, content.find("{"))
                return obj
            except Exception:
                pass
            # 3) 贪婪提取最后兜底
            m = re.search(r'\{.*\}', content, re.DOTALL)
            if not m:
                log("[LLM] no JSON in response")
                return None
            try:
                return json.loads(m.group())
            except Exception as e:
                # 解析失败：把非法输出回喂 LLM 修复一次
                log(f"[LLM] json parse fail({len(content)}字): {str(e)[:80]}")
                fixed = fix_json_content(content, prompt)
                if fixed is not None:
                    return fixed
                log(f"[LLM] fix fail head: {content[:80]!r}")
                log(f"[LLM] fix fail tail: {content[-160:]!r}")
                return None
        except Exception as e:
            log(f"[LLM] attempt {attempt+1} error: {str(e)[:120]}")
            if attempt == retries:
                return None
    return None


def fix_json_content(content, orig_prompt):
    """把非法的 LLM 输出回喂模型，要求只输出合法 JSON。"""
    if not LLM_API_KEY or not LLM_API_BASE or not LLM_MODEL:
        return None
    headers = {"Authorization": f"Bearer {LLM_API_KEY}", "Content-Type": "application/json"}
    fix_prompt = (
        "你上一次的输出不是合法 JSON（可能漏转义引号或截断）。请只输出修复后的合法 JSON 对象，"
        "字符串值中的双引号一律转义。不要解释。\n\n原始要求摘要:\n" + orig_prompt[:800] +
        "\n\n你的非法输出:\n" + content[:4000]
    )
    payload = {
        "model": LLM_MODEL,
        "messages": [{"role": "user", "content": fix_prompt}],
        "temperature": 0.1,
        "max_tokens": 8192,
        "response_format": {"type": "json_object"},
    }
    for fix_try in range(2):
        try:
            r = requests.post(f"{LLM_API_BASE}/chat/completions", headers=headers, json=payload, timeout=120)
            if r.status_code != 200:
                log(f"[LLM-fix] HTTP {r.status_code}")
                return None
            data = r.json()
            c = data["choices"][0]["message"]["content"]
            c = re.sub(r"```(?:json)?\s*|\s*```", "", c).strip()
            try:
                return json.loads(c)
            except Exception:
                try:
                    obj, _ = json.JSONDecoder().raw_decode(c, c.find("{"))
                    return obj
                except Exception:
                    log(f"[LLM-fix] try{fix_try+1} still invalid, head={c[:60]!r}")
        except Exception as e:
            log(f"[LLM-fix] error: {str(e)[:100]}")
    return None


def format_case_ts(rec):
    L = ["  {"]
    for k in ["slug", "name", "founderBg", "region", "industry", "startedAt", "closedAt", "investment", "source"]:
        L.append(f"    {k}: {ts_escape(rec.get(k, ''))},")
    L.append(f"    status: {ts_escape(rec.get('status', 'dead'))},")
    L.append(f"    lifespanMonths: {int(rec.get('lifespanMonths', 0))},")
    L.append(f"    fundingType: {ts_escape(rec.get('fundingType', '自筹'))},")
    L.append(f"    deadCause: {ts_escape(rec.get('deadCause', ''))},")
    L.append(f"    deadCauseSub: {ts_escape(rec.get('deadCauseSub', ''))},")
    L.append(f"    verified: {'true' if rec.get('verified', True) else 'false'},")
    for k in ["epitaph", "motivation"]:
        L.append(f"    {k}: {ts_escape(rec.get(k, ''))},")
    L.append("    timeline: [")
    for ev in rec.get("timeline", []):
        if isinstance(ev, dict):
            t, e = str(ev.get("time", "")), str(ev.get("event", ""))
        else:
            t, e = "", ""
        L.append(f"      {{ time: {ts_escape(t)}, event: {ts_escape(e)} }},")
    L.append("    ],")
    L.append("    breakdown: [")
    for bl in rec.get("breakdown", []):
        if isinstance(bl, dict):
            la, d = str(bl.get("layer", "")), str(bl.get("detail", ""))
        else:
            la, d = "", ""
        L.append(f"      {{ layer: {ts_escape(la)}, detail: {ts_escape(d)} }},")
    L.append("    ],")
    L.append("    lessons: [")
    for ls in rec.get("lessons", []):
        L.append(f"      {ts_escape(ls)},")
    L.append("    ],")
    L.append("  }")
    return "\n".join(L)


def merge_cases(content, new_cases):
    idx = content.rfind("];")
    if idx == -1:
        raise ValueError("Cannot find ];")
    after = content[idx:]
    before = content[:idx].rstrip()
    if not before.endswith(","):
        before += ","
    fmt = ",\n".join(format_case_ts(c) for c in new_cases)
    return before + "\n" + fmt + "\n" + after


def extract_cases(fetched, exist_slugs, exist_names, max_n):
    extracted = []
    for fp in fetched:
        if len(extracted) >= max_n:
            break
        content = fp["content"]
        url = fp["item"].get("url", "")
        final_url = fp.get("final_url") or url
        if len(content) > 8000:
            content = content[:8000] + "\n[已截断]"
        prompt = EXTRACT_PROMPT.format(url=url, content=content)
        try:
            result = call_llm(prompt)
        except Exception as e:
            log(f"[LLM异常] {url[:60]}: {e}")
            continue
        if not result:
            log(f"[跳过] 无结果")
            continue

        slug = (str(result.get("slug", "")).strip().lower())
        name = str(result.get("name", "")).strip()
        if not slug:
            log(f"[跳过] 空slug")
            continue
        if slug in exist_slugs or (name and name in exist_names):
            log(f"[去重] {slug}")
            continue
        if result.get("deadCause") not in VALID_DEAD_CAUSES:
            log(f"[校验] 死因无效: {result.get('deadCause')}")
            continue

        tl = safe_json_array(result.get("timelineJson"))
        bd = safe_json_array(result.get("breakdownJson"))
        ls = safe_json_array(result.get("lessonsJson"))
        if len(tl) < 3:
            log(f"[校验] tl<3: {slug}")
            continue
        if len(bd) < 3:
            log(f"[校验] bd<3: {slug}")
            continue
        if len(ls) < 3:
            log(f"[校验] ls<3: {slug}")
            continue

        tl = [t if isinstance(t, dict) else {} for t in tl]
        bd = [b if isinstance(b, dict) else {} for b in bd]
        ls = [str(x) for x in ls]

        rec = {
            "slug": slug, "name": name,
            "status": result.get("status") if result.get("status") in VALID_STATUSES else "dead",
            "founderBg": str(result.get("founderBg", "")), "region": str(result.get("region", "")),
            "industry": str(result.get("industry", "")), "startedAt": str(result.get("startedAt", "")),
            "closedAt": str(result.get("closedAt", "")), "lifespanMonths": int(result.get("lifespanMonths", 0)),
            "investment": str(result.get("investment", "")),
            "fundingType": result.get("fundingType") if result.get("fundingType") in VALID_FUNDING_TYPES else "自筹",
            "deadCause": str(result.get("deadCause", "")), "deadCauseSub": str(result.get("deadCauseSub", "")),
            "source": str(result.get("source", "")), "verified": bool(result.get("verified", True)),
            "epitaph": str(result.get("epitaph", "")), "motivation": str(result.get("motivation", "")),
            "timeline": tl, "breakdown": bd, "lessons": ls, "sourceUrl": final_url,
        }
        extracted.append(rec)
        exist_slugs.add(slug)
        log(f"[✓] {slug} — {rec['name']} ({rec['deadCause']})")
    return extracted


def gen_report(new_cases, total):
    today = datetime.now(TZ_CST).strftime("%Y-%m-%d")
    lines = [f"# OPC 案例采集 — {today}", "",
             f"- 新增 **{len(new_cases)}** 条 | 累计 **{total}** 条",
             f"- {datetime.now(TZ_CST).strftime('%Y-%m-%d %H:%M')}", ""]
    if new_cases:
        lines += ["| # | Slug | 墓碑名 | 死因 | 来源 |", "|---|------|--------|------|------|"]
        for i, c in enumerate(new_cases, 1):
            lines.append(f"| {i} | `{c['slug']}` | {c['name']} | {c['deadCause']} | [{c['source']}]({c.get('sourceUrl','')}) |")
    else:
        lines.append("本次未找到新案例。")
    lines += ["", f"*累计: {total}*"]
    return "\n".join(lines)


def main():
    max_cases = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    since_days = int(sys.argv[2]) if len(sys.argv) > 2 else 7
    log(f"[OPC] max={max_cases} since={since_days}d")

    exist_slugs, exist_names = read_existing()
    n0 = len(exist_slugs)
    log(f"[init] {n0} 条")
    if os.path.exists(CASES_FILE):
        shutil.copy2(CASES_FILE, CASES_FILE + ".bak")

    os.makedirs(REPORT_DIR, exist_ok=True)
    rpath = os.path.join(REPORT_DIR, f"opc_cases_{datetime.now(TZ_CST).strftime('%Y%m%d')}.md")

    log("[1/4] 搜索...")
    cands = search_all(since_days)
    if not cands:
        with open(rpath, "w", encoding="utf-8") as f:
            f.write(gen_report([], n0))
        log("无候选")
        return 0

    log("[2/4] Fetch...")
    fetched = fetch_all(cands, n=20)
    if not fetched:
        with open(rpath, "w", encoding="utf-8") as f:
            f.write(gen_report([], n0))
        log("Fetch 失败")
        return 0

    log(f"[3/4] LLM抽取 (max={max_cases})...")
    new_cases = extract_cases(fetched, exist_slugs, exist_names, max_cases)
    log(f"[3/4] = {len(new_cases)} 条")

    if new_cases:
        log("[4/4] 写入...")
        with open(CASES_FILE, "r", encoding="utf-8") as f:
            orig = f.read()
        new_content = merge_cases(orig, new_cases)
        with open(CASES_FILE, "w", encoding="utf-8") as f:
            f.write(new_content)
        with open(CASES_FILE, "r", encoding="utf-8") as f:
            v = f.read()
        assert "export const CASES" in v, "结构丢失"
        for c in new_cases:
            assert f'slug: "{c["slug"]}"' in v, f"slug {c['slug']} 缺失"
        log(f"[4/4] ✓ +{len(new_cases)}")

    total = n0 + len(new_cases)
    with open(rpath, "w", encoding="utf-8") as f:
        f.write(gen_report(new_cases, total))
    log(f"完成: +{len(new_cases)}, 累计 {total}")
    log(f"报告: {rpath}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

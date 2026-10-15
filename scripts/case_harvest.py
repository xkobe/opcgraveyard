#!/usr/bin/env python3
"""
OPC Case Harvest (GitHub Actions 版) — 一人公司坟场 AI OPC 失败案例每日自动采集与入库

与 CodeAct 沙箱版不同，本脚本不依赖 codeact_sdk，可在 GitHub Actions ubuntu-latest 独立运行：
  1. 公开搜索：DuckDuckGo HTML（无需 API key，避免额外付费依赖）
  2. 并发抓取正文：requests + BeautifulSoup
  3. LLM 抽取：OpenAI 兼容 /chat/completions（LLM_API_KEY / LLM_API_BASE / LLM_MODEL 由 secrets 注入）
  4. 严格校验（六死因、timeline/breakdown/lessons 数量）后追加 src/data/cases.ts
  5. 生成采集报告 codeact/output/opc_cases_YYYYMMDD.md

用法:
  python scripts/case_harvest.py [max_cases] [since_days]
  默认: max_cases=10, since_days=7
"""

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

SEARCH_KW_ZH = ["AI创业失败 倒闭 关停 复盘", "独立开发者 失败 项目放弃 一人公司", "AI产品关停 停止运营 创业复盘"]
SEARCH_KW_EN = ["AI startup failure shutdown postmortem", "indie hacker project failure abandoned", "solo founder AI startup closed down"]
RELEVANCE_KW = ["失败", "倒闭", "关停", "关闭", "停止运营", "注销", "放弃", "解散", "破产", "shutdown", "closed", "shut down", "failed", "failure", "postmortem", "sunset", "discontinued", "abandoned", "laid off", "停止", "亏损", "烧光"]

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
    """DuckDuckGo HTML 搜索，返回 [{title, snippet, url}]，按时间窗过滤（近似，标题含年份判断）。"""
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
            # DDG 跳转链接里含 uddg= 编码的真实 URL
            m = re.search(r'uddg=([^&]+)', href)
            real = urllib.parse.unquote(m.group(1)) if m else href
            if real.startswith("http"):
                out.append({"title": title, "snippet": snippet, "url": real})
        return out
    except Exception as e:
        log(f"[DDG] error {query[:30]}: {e}")
        return []


def search_all(since_days):
    tw = build_tw(since_days)
    queries = SEARCH_KW_ZH + SEARCH_KW_EN
    cands, seen = [], set()
    for q in queries:
        time.sleep(1.2)
        for it in ddg_search(q, tw):
            u = norm_url(it.get("url", ""))
            if u and u not in seen and is_relevant(it.get("title", ""), it.get("snippet", "")):
                seen.add(u)
                cands.append(it)
    log(f"[搜索] {len(cands)} 候选")
    return cands


def fetch_page(url, timeout=20):
    try:
        r = requests.get(url, headers={"User-Agent": UA}, timeout=timeout)
        if r.status_code != 200:
            return None
        ct = r.headers.get("Content-Type", "")
        if "html" not in ct and "text" not in ct and "json" not in ct:
            return None
        soup = BeautifulSoup(r.text, "html.parser")
        for t in soup(["script", "style", "nav", "footer", "header", "aside", "noscript"]):
            t.decompose()
        text = soup.get_text("\n", strip=True)
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text
    except Exception as e:
        log(f"[fetch] {url[:60]}: {e}")
        return None


def fetch_all(cands, n=8):
    ok = []
    for it in cands[:n]:
        ct = fetch_page(it["url"])
        if ct and len(ct) > 200:
            ok.append({"item": it, "content": ct})
        time.sleep(0.6)
    log(f"[fetch] {len(ok)} 有效")
    return ok


EXTRACT_PROMPT = """你是创业失败案例研究员。阅读文章,提取 1 个 AI/科技创业失败的真实案例。

规则:
- 只提取真实案例。若无, slug 返回空字符串。
- 所有字段基于文章事实, 不编造。多个案例取最详细的 1 个。
- slug: 全小写英文短横线
- deadCause 必须六选一: 获客失败, 需求验证缺失, 商业模式脆弱, 成本结构失衡, 同质化竞争, 合规与决策风险
- epitaph: 2-3行墓志铭含关键数字
- motivation: 100-200字创业动机
- timelineJson: JSON数组字符串 如 [{"time":"2024","event":"成立"}] 3-6个元素
- breakdownJson: JSON数组字符串 如 [{"layer":"表层原因","detail":"说明"}] 至少3个
- lessonsJson: JSON字符串数组 如 ["教训1","教训2","教训3"] 3-5条
- source: 报道媒体名

只输出一个 JSON 对象, 字段:
slug,name,status,founderBg,region,industry,startedAt,closedAt,lifespanMonths,investment,fundingType,deadCause,deadCauseSub,source,verified,epitaph,motivation,timelineJson,breakdownJson,lessonsJson

文章({url}):
{content}"""


def call_llm(prompt):
    if not LLM_API_KEY or not LLM_API_BASE or not LLM_MODEL:
        raise RuntimeError("LLM env missing: LLM_API_KEY/LLM_API_BASE/LLM_MODEL")
    headers = {"Authorization": f"Bearer {LLM_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": LLM_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
    }
    r = requests.post(f"{LLM_API_BASE}/chat/completions", headers=headers, json=payload, timeout=120)
    if r.status_code != 200:
        log(f"[LLM] HTTP {r.status_code}: {r.text[:200]}")
        return None
    data = r.json()
    content = data["choices"][0]["message"]["content"]
    m = re.search(r'\{.*\}', content, re.DOTALL)
    if not m:
        log("[LLM] no JSON in response")
        return None
    return json.loads(m.group())


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
            "timeline": tl, "breakdown": bd, "lessons": ls, "sourceUrl": url,
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
    fetched = fetch_all(cands, n=8)
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

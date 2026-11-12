#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""沉默死亡追踪器 —— case_harvest.py 的第四个采集源。

背景
----
现有三个源（Google News / Hacker News 搜索 / 中文媒体 RSS）都只能被动捞到
"已经有人写出来的失败新闻"。但绝大多数一人公司是这样死的：产品悄悄关站、
域名到期不续、创始人默默去找工作，从头到尾没有任何一篇报道。这类"沉默死亡"
在现有采集里覆盖率是 0。

本模块换方向：不靠新闻，靠**时间戳 + 存在性**主动发现。

判定不靠单一信号，必须双闸门都过：
  闸门一（时间）：项目最后一次可观测活动距今 >= STALE_MONTHS 个月
  闸门二（存在性）：域名 DNS 返回 NXDOMAIN，或 HTTP 返回 404/410，或持续 5xx

只过闸门一的（停更但还活着）不算死，不进候选。宁可漏，不可错。

三条通道的实测状态（2026-11 验证）
--------------------------------
  hn_show_graveyard   可用    Show HN 发过、现在域名已消失。本模块主通道。
  gh_stale_repos      可用    GitHub 仓库停更 + 官网域名消失。备用，默认关闭。
  ih_probe            不可用  Indie Hackers 全站 403（Cloudflare）；
                              三个子 sitemap 共 105829 个 URL 全是 post，
                              /product/ 路径数为 0，拿不到产品列表。
                              函数保留仅作记录，不参与采集。

输出结构
--------
返回的每个 item 与 search_all() 的三源同构：
  {"title", "url", "published", "snippet", "body", "is_selfpost", "sourceName"}
其中 body 是一份人类可读的「沉默死亡检测报告」，同时充当 EXTRACT_PROMPT 的
{content}。因为 is_selfpost=True 且 body 远超 120 字，fetch_all() 第一轮就会
直接接住，不占用抓取名额，也不会去抓那个已经死掉的域名。
"""

import json
import os
import re
import socket
import subprocess
import time
import html
import random
from datetime import datetime, timedelta, timezone

import requests
try:
    requests.packages.urllib3.disable_warnings()
except Exception:
    pass

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")

# ── 阈值 ──────────────────────────────────────────────────────────────
STALE_MONTHS = 12          # 闸门一：至少 12 个月没有可观测活动
HN_MIN_POINTS = 3          # Show HN 至少 3 分（说明当时有人看，不是纯 spam）
HN_MIN_COMMENTS = 3        # 至少 3 条讨论，否则没有可考的证据
MIN_EVIDENCE_CHARS = 200   # 有效评论总字数下限
MAX_CANDIDATES = 12        # 单次采集最多吐多少个 stale 候选
MAX_RUNTIME = 480          # 单次扫描的硬上限（秒）。超了就带着已有结果返回，
                           # 不能因为个别 Algolia 慢响应把整条采集流水线拖死。

# 不是商业产品的域名，直接跳过
SKIP_HOSTS = (
    "github.com", "gitlab.com", "play.google.com", "apps.apple.com",
    "youtube.com", "youtu.be", "medium.com", "substack.com", "twitter.com",
    "x.com", "reddit.com", "linkedin.com", "itch.io", "netlify.app",
    "vercel.app", "pages.dev", "docs.google.com", "notion.site", "figma.com",
    "npmjs.com", "pypi.org", "arxiv.org", "wikipedia.org", "discord.gg",
    "discord.com", "chromewebstore.google.com", "news.ycombinator.com",
    "huggingface.co", "kaggle.com", "streamlit.app", "herokuapp.com",
    "onrender.com", "fly.dev", "glitch.me", "replit.com", "codepen.io",
)

# 这些子域不是产品主体，单独消失说明不了什么
NON_PRODUCT_SUB = {"blog", "docs", "doc", "wiki", "status", "api", "dev",
                   "staging", "stage", "test", "cdn", "static", "help", "support"}

# 死亡判定的 HTTP 状态
DEAD_STATUS = {404, 410, 500, 502, 503, 521, 522, 523, 525, 526, 530}


SEEN_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "stale_seen.json")


def log(msg):
    print(f"[stale] {msg}", flush=True)


def _load_seen():
    """已产出过的域名。每天重扫同一月份时，避免重复喂给 LLM 浪费调用。"""
    try:
        with open(SEEN_FILE, encoding="utf-8") as f:
            return set(json.load(f))
    except Exception:
        return set()


def _save_seen(hosts):
    try:
        with open(SEEN_FILE, "w", encoding="utf-8") as f:
            json.dump(sorted(hosts), f, ensure_ascii=False, indent=1)
    except Exception as e:
        log(f"写入 stale_seen 失败: {e}")


# ── 闸门二：存在性检测 ────────────────────────────────────────────────

def _dns_state(host):
    """返回 'RESOLVES' / 'NXDOMAIN' / 'UNRESOLVED'。

    只有拿到明确的 NXDOMAIN 才判死。并发打 DNS 容易拿到 EAI_AGAIN(-3)，
    那是临时失败不是域名不存在，所以标准库失败后立刻用 dig 看 RCODE 定案。
    """
    try:
        socket.getaddrinfo(host, None)
        return "RESOLVES"
    except socket.gaierror as e:
        if e.errno in (-2, -5):
            return "NXDOMAIN"
    except Exception:
        pass

    try:
        r = subprocess.run(
            ["dig", "+time=4", "+tries=1", "A", host],
            capture_output=True, text=True, timeout=8,
        )
        out = r.stdout or ""
        m = re.search(r"status:\s*(\w+)", out)
        if m:
            code = m.group(1)
            if code == "NXDOMAIN":
                return "NXDOMAIN"
            if code == "NOERROR":
                return "RESOLVES"
        # dig 不可用或没输出时，再给标准库一次机会
        try:
            socket.getaddrinfo(host, None)
            return "RESOLVES"
        except socket.gaierror as e:
            if e.errno in (-2, -5):
                return "NXDOMAIN"
    except FileNotFoundError:
        # 没装 dig 的环境（比如精简镜像）：串行重试，规避 EAI_AGAIN 的假阴性
        for _ in range(3):
            try:
                socket.getaddrinfo(host, None)
                return "RESOLVES"
            except socket.gaierror as e:
                if e.errno in (-2, -5):
                    return "NXDOMAIN"
            except Exception:
                pass
            time.sleep(1.0)
    except Exception:
        pass

    return "UNRESOLVED"


def _http_probe(url, timeout=8):
    """返回 (status:int|str, body:str)。status 为 'DNS_FAIL'/'TIMEOUT'/'ERR' 之一时 body 为空。"""
    try:
        r = requests.get(
            url, timeout=timeout, allow_redirects=True,
            headers={"User-Agent": UA}, verify=False,
        )
        body = ""
        if r.status_code < 400:
            body = r.text[:4000]
        return r.status_code, body
    except requests.exceptions.SSLError:
        return "ERR", ""
    except requests.exceptions.ConnectionError as e:
        s = str(e).lower()
        if "name or service not known" in s or "nodename nor servname" in s or "failed to resolve" in s:
            return "DNS_FAIL", ""
        return "ERR", ""
    except requests.exceptions.Timeout:
        return "TIMEOUT", ""
    except Exception:
        return "ERR", ""


_SECOND_LEVEL = {"co", "com", "net", "org", "gov", "edu", "ac", "or", "ne", "go"}


def _root_domain(host):
    """取根域：demo.duckui.com → duckui.com；a.foo.co.uk → foo.co.uk。"""
    parts = host.split(".")
    if len(parts) <= 2:
        return host
    if len(parts) >= 3 and parts[-2] in _SECOND_LEVEL and len(parts[-1]) == 2:
        return ".".join(parts[-3:])
    return ".".join(parts[-2:])


def _is_dead(host, url):
    """双闸门的存在性闸门。返回 (is_dead:bool, reason:str)。

    两个必须守住的坑：
      1. 只测根路径。原 URL 往往是 /blog/xxx 或 /app 这类子路径，子页面 404
         不代表产品死了——Nanonets 就是活得好好的公司，但那条 Show HN 指向的
         子页面早没了。一律换成 https://root/ 重测。
      2. 5xx 不判死。502/503/521 多半是临时故障或 CDN 抽风，一天之后再看好好的。
         只有 DNS 彻底不存在、或根路径持续 404/410，才算真的下线。
    """
    root = _root_domain(host)

    state = _dns_state(root)
    if state == "NXDOMAIN":
        return True, "DNS NXDOMAIN（域名已不存在，解析失败）"
    if state == "UNRESOLVED":
        return False, "DNS 无法确认（网络原因，不判死）"

    # 先测裸域。能打开就立刻返回（绝大多数活域名在这里就结束了，省掉一半请求）
    targets = [f"https://{root}/", f"https://www.{root}/"]
    results = []
    for t in targets:
        st, body = _http_probe(t)
        if isinstance(st, int) and st < 400:
            low = (body or "").lower()
            for kw, note in (
                ("no longer available", "页面提示服务已停止"),
                ("shutting down", "页面出现关停公告"),
                ("we have shut down", "页面出现关停公告"),
                ("service has been discontinued", "页面出现停服公告"),
                ("thanks for the memories", "页面出现告别文案"),
                ("domain is for sale", "域名已挂牌出售"),
                ("this domain is parked", "域名已停放"),
                ("account suspended", "主机账户已停用"),
            ):
                if kw in low:
                    return True, f"{t} 仍可访问，但{note}"
            return False, f"站点在线（{t} HTTP {st}），不判死"
        results.append((t, st, body))

    codes = [st for _, st, _ in results]
    if all(isinstance(c, int) and c in (404, 410) for c in codes):
        return True, f"根路径持续 {codes}，站点已下线"
    if any(c == "DNS_FAIL" for c in codes):
        return True, "HTTP 层 DNS 解析失败（域名已不存在）"
    if any(c == "TIMEOUT" for c in codes):
        return False, f"根路径超时 {codes}（可能只是网络或防火墙，不判死）"
    return False, f"HTTP 状态不确定 {codes}（可能临时故障，不判死）"


# ── 闸门一：时间窗口（HN Show HN）──────────────────────────────────────

def _hn_show_posts(months_ago_min=STALE_MONTHS, months_ago_max=36,
                   month=None, hits_per_page=500):
    """拉某一个月内发布的 Show HN。

    为什么按月切片而不是整段窗口翻页：Algolia 的 hitsPerPage*page 上限是 1000，
    24 个月的窗口有 18000+ 条，翻页根本拿不完。按月切，每次取一个月的全量，
    多跑几次自然覆盖整段历史，也不会每次都重复同一批。
    """
    now = datetime.now(timezone.utc)
    if month is None:
        month = random.randint(months_ago_min, months_ago_max - 1)
    lo = int((now - timedelta(days=(month + 1) * 30)).timestamp())
    hi = int((now - timedelta(days=month * 30)).timestamp())
    url = (
        "https://hn.algolia.com/api/v1/search_by_date?tags=show_hn"
        f"&numericFilters=created_at_i%3E{lo},created_at_i%3C{hi},points%3E{HN_MIN_POINTS - 1}"
        f"&hitsPerPage={hits_per_page}&page=0"
    )
    try:
        r = requests.get(url, headers={"User-Agent": UA}, timeout=30)
        if r.status_code != 200:
            log(f"Algolia HTTP {r.status_code}")
            return []
        d = r.json()
        hits = d.get("hits", [])
        log(f"Show HN 第 {month} 个月前这一档，拉到 {len(hits)} 条")
        return hits
    except Exception as e:
        log(f"Algolia 异常: {e}")
        return []


def _hn_comments(object_id, limit=14, min_len=25):
    """拉一条 HN 帖子的评论正文。返回 [(depth, text)]。"""
    try:
        r = requests.get(
            f"https://hn.algolia.com/api/v1/items/{object_id}",
            headers={"User-Agent": UA}, timeout=12,
        )
        if r.status_code != 200:
            return []
        tree = r.json()
    except Exception:
        return []

    out = []

    def walk(node, depth=0):
        if len(out) >= limit:
            return
        for c in node.get("children", []) or []:
            if len(out) >= limit:
                return
            t = c.get("text") or ""
            t = html.unescape(re.sub(r"<[^>]+>", " ", t))
            t = re.sub(r"\s+", " ", t).strip()
            if len(t) >= min_len:
                out.append((depth, t[:600]))
            walk(c, depth + 1)

    walk(tree)
    return out


# ── 商业性闸门 ────────────────────────────────────────────────────────
# 域名死了 ≠ 这是个创业项目。Show HN 上绝大多数是周末玩具、玩笑站、个人练习，
# 它们消失得比商业项目还快，但从来不是"一人公司"。如果不过这一关，案例库里
# 会塞满"地图记忆小游戏"和"Pitbull 歌词随机站"，直接毁掉档案的可信度。
#
# 判断依据只有一个：当时的讨论里有没有出现真实的付费/商业模式信号。
# 如果 80 条评论全是 "nice job" "great job"，那它就不是生意。
BIZ_SIGNALS = (
    "pricing", "price", "how much does", "how much is", "per month", "per year",
    "subscription", "i'd pay", "i would pay", "would pay for", "pay for",
    "purchase", "customer", "customers", "revenue", "mrr", "saas", "startup",
    "freelance", "b2b", "enterprise", "free tier", "trial", "premium",
    "license", "invoice", "charge", "monetiz", "business model",
    "market fit", "competitor", "competitors", "churn", "onboarding",
)
BIZ_MIN_HITS = 2


def _biz_hits(title, comments):
    """返回命中的商业信号词列表。"""
    text = (title or "").lower() + " " + " ".join(t.lower() for _, t in comments)
    return [w for w in BIZ_SIGNALS if w in text]


# ── 证据包 ────────────────────────────────────────────────────────────

def _build_report(title, url, published, points, ncomments, item_id,
                  dead_reason, comments, days_ago, biz_hits):
    """把检测结果拼成一份可直接喂给 LLM 的证据包。"""
    clean_title = re.sub(r"^show\s+hn:\s*", "", title, flags=re.I).strip()

    lines = [
        "【沉默死亡检测报告】",
        f"项目名称：{clean_title}",
        f"对外地址：{url}",
        f"HN 发布：{published}（距今约 {days_ago} 天）",
        f"HN 讨论：https://news.ycombinator.com/item?id={item_id}"
        f"（{points} 分，{ncomments} 条评论）",
        "",
        "━━ 存活检测 ━━",
        f"检测时间：{datetime.now(timezone.utc).strftime('%Y-%m-%d')}",
        f"判定结果：{dead_reason}",
        "说明：项目方没有发布任何关停公告，产品随域名一起消失。"
        "这是典型的「沉默死亡」——不裁员、不发告别信、不上新闻，只是某天打不开了。",
        f"商业信号：{'、'.join(biz_hits)}（说明当时讨论的是买卖，不只是好玩）",
        "",
        "━━ HN 讨论摘录（当时用户的真实反馈）━━",
    ]
    if comments:
        for i, (depth, t) in enumerate(comments, 1):
            lines.append(f"[{i}] {t}")
    else:
        lines.append("（无有效评论）")

    lines += [
        "",
        "【写作约束 —— 必须遵守】",
        "这是一个「沉默死亡」案例。原站已经消失，可核实的一手事实只有上面这份"
        "HN 帖子与评论，以及域名失效本身。因此：",
        "1. 融资额、收入、用户数、团队规模、创始人背景：材料里没有的，一律写"
        "「未披露」或空字符串，绝对不得推测或编造具体数字。",
        "2. 死因拆解只能基于两件事：HN 评论里暴露的产品/运营/需求问题，以及"
        "「域名到期未续、产品无公告消失」这一事实本身。",
        "3. closedAt 用「约 YYYY 年」（域名失效检测时间所在年份），不要编造月份。",
        "4. 如果上面的 HN 评论少于 3 条有效内容，或通篇只是「cool」「nice」之类"
        "无信息量的客套，说明证据不足——slug 直接返回空字符串，不要硬写。",
        "5. 如果这不是一个商业产品（纯开源工具、游戏 demo、个人博客、教程站），"
        "slug 直接返回空字符串。",
        "6. sourceType 固定为 public_record，source 填 Hacker News，"
        "sourcesJson 里必须包含上面那条 HN 讨论链接。",
    ]
    return "\n".join(lines)


# ── 主入口 ────────────────────────────────────────────────────────────

def collect_stale_candidates(limit=MAX_CANDIDATES, months_ago_min=STALE_MONTHS,
                             months_ago_max=36, month=None, max_hosts=240,
                             months_per_run=2):
    """扫描 Show HN 历史，找出域名已经消失的项目，返回候选列表。

    每次随机扫 months_per_run 个月份（默认 2），36 个月的历史 18 天轮完一遍。
    之后开始重复，重复的会被 case_harvest 的 existing 去重挡掉——这是预期的，
    存量挖完就靠新产生的 Show HN 随时间自然滑入 12 个月窗口。

    返回结构与 search_all() 的三源一致，可直接拼进 cands。
    """
    t0 = time.time()
    if month is not None:
        months = [month]
    else:
        span = list(range(months_ago_min, months_ago_max))
        months = random.sample(span, min(months_per_run, len(span)))

    already = _load_seen()
    if already:
        log(f"已产出过 {len(already)} 个域名，本次跳过")

    # 1) 提取独立域名，跳过平台站
    seen = set()
    pool = []
    for m in months:
        hits = _hn_show_posts(months_ago_min, months_ago_max, month=m)
        for h in hits:
            u = h.get("url") or ""
            if not u.startswith("http"):
                continue
            mm = re.match(r"https?://([^/?#]+)", u)
            if not mm:
                continue
            host = mm.group(1).lower().split(":")[0]
            if host.startswith("www."):
                host = host[4:]
            if any(x == host or host.endswith("." + x) for x in SKIP_HOSTS):
                continue
            # 博客/文档/状态页这些子域不是产品主体，产品死了它们也可能先死
            if host.split(".")[0] in NON_PRODUCT_SUB:
                continue
            if host in seen or host in already:
                continue
            seen.add(host)
            pool.append((host, u, h))

    log(f"独立域名 {len(pool)} 个（已剔除平台站）")
    if not pool:
        return []
    if max_hosts and len(pool) > max_hosts:
        # 按讨论量排序后截断，优先探测有人讨论过的（证据更足）
        pool.sort(key=lambda x: (x[2].get("num_comments") or 0), reverse=True)
        pool = pool[:max_hosts]
        log(f"截断至 {max_hosts} 个（按评论数优先）")
    if not pool:
        return []

    # 2) 闸门二：DNS + HTTP 存在性检测（并发度压低，避免 DNS 被打爆）
    from concurrent.futures import ThreadPoolExecutor

    def probe_one(item):
        host, u, h = item
        dead, reason = _is_dead(host, u)
        return item, dead, reason

    dead_list = []
    with ThreadPoolExecutor(max_workers=12) as ex:
        for item, dead, reason in ex.map(probe_one, pool):
            if dead:
                dead_list.append((item, reason))

    log(f"闸门二通过（域名已死）{len(dead_list)} 个 / {len(pool)}")
    if not dead_list:
        return []

    # 3) 按讨论量排序，优先捞有人讨论过的（证据更足）
    dead_list.sort(key=lambda x: (x[0][2].get("num_comments") or 0), reverse=True)

    # 4) 拉评论、拼证据包
    out = []
    now = datetime.now(timezone.utc)
    for (host, u, h), reason in dead_list:
        if len(out) >= limit:
            break
        if time.time() - t0 > MAX_RUNTIME:
            log(f"到达 {MAX_RUNTIME}s 上限，带着已有 {len(out)} 条返回")
            break
        ncomments = h.get("num_comments") or 0
        if ncomments < HN_MIN_COMMENTS:
            log(f"跳过 {host}：评论 {ncomments} 条 < {HN_MIN_COMMENTS}")
            continue

        comments = _hn_comments(h.get("objectID"))
        total_chars = sum(len(t) for _, t in comments)
        if len(comments) < 3 or total_chars < MIN_EVIDENCE_CHARS:
            log(f"跳过 {host}：有效评论不足（{len(comments)} 条 / {total_chars} 字）")
            continue

        biz_hits = _biz_hits(h.get("title"), comments)
        if len(biz_hits) < BIZ_MIN_HITS:
            log(f"跳过 {host}：未命中商业信号（{len(biz_hits)} 个）——是玩具不是生意")
            continue

        created = h.get("created_at", "")
        try:
            pub_dt = datetime.fromisoformat(created.replace("Z", "+00:00"))
            days_ago = (now - pub_dt).days
        except Exception:
            days_ago = 0

        body = _build_report(
            title=h.get("title") or "",
            url=u,
            published=created[:10],
            points=h.get("points") or 0,
            ncomments=ncomments,
            item_id=h.get("objectID"),
            dead_reason=reason,
            comments=comments,
            days_ago=days_ago,
            biz_hits=biz_hits,
        )

        out.append({
            "title": h.get("title") or "",
            "snippet": body[:300],
            "url": u,
            "published": created,
            "body": body,
            "is_selfpost": True,
            "sourceName": "hn_stale",
            "staleEvidence": {
                "host": host,
                "deadReason": reason,
                "hnItem": f"https://news.ycombinator.com/item?id={h.get('objectID')}",
                "points": h.get("points"),
                "comments": ncomments,
                "daysAgo": days_ago,
            },
        })
        log(f"✓ {host} | {reason} | {ncomments} 评论 | {days_ago} 天前")
        time.sleep(0.8)

    if out:
        _save_seen(already | {it["staleEvidence"]["host"] for it in out})

    log(f"共 {len(out)} 个沉默死亡候选，耗时 {time.time() - t0:.0f}s")
    return out


# ── 备用通道（默认不启用）─────────────────────────────────────────────

def gh_stale_repos(limit=5, stale_days=365, stars_min=20, stars_max=2000):
    """GitHub 通道：仓库长期停更 + 官网域名已死。

    默认不启用。原因：GitHub 上"停更的开源仓库"绝大多数是个人工具，
    不是商业产品，噪音比 HN 通道高一个量级。只有在 HN 通道连续几天
    无产出时才建议打开。
    """
    if not os.environ.get("GITHUB_TOKEN"):
        log("gh_stale_repos: 未配置 GITHUB_TOKEN，跳过")
        return []

    before = (datetime.now(timezone.utc) - timedelta(days=stale_days)).strftime("%Y-%m-%d")
    q = f"pushed:<{before} stars:{stars_min}..{stars_max} fork:false homepage:*"
    url = "https://api.github.com/search/repositories"
    try:
        r = requests.get(
            url,
            params={"q": q, "sort": "stars", "order": "desc", "per_page": 50},
            headers={"User-Agent": UA, "Authorization": f"token {os.environ['GITHUB_TOKEN']}"},
            timeout=30,
        )
        if r.status_code != 200:
            log(f"GitHub HTTP {r.status_code}")
            return []
        items = r.json().get("items", [])
    except Exception as e:
        log(f"GitHub 异常: {e}")
        return []

    out = []
    for repo in items:
        if len(out) >= limit:
            break
        homepage = (repo.get("homepage") or "").strip()
        if not homepage.startswith("http"):
            continue
        m = re.match(r"https?://([^/]+)", homepage)
        if not m:
            continue
        host = m.group(1).lower().split(":")[0]
        if host.startswith("www."):
            host = host[4:]
        if any(s == host or host.endswith("." + s) for s in SKIP_HOSTS):
            continue
        if host.endswith("github.io"):
            continue

        dead, reason = _is_dead(host, homepage)
        if not dead:
            continue

        pushed = repo.get("pushed_at", "")[:10]
        body = "\n".join([
            "【沉默死亡检测报告】",
            f"项目名称：{repo.get('full_name')}",
            f"项目描述：{repo.get('description') or '（无）'}",
            f"官网地址：{homepage}",
            f"仓库地址：{repo.get('html_url')}",
            f"Star：{repo.get('stargazers_count')}　最后推送：{pushed}",
            "",
            "━━ 存活检测 ━━",
            f"检测时间：{datetime.now(timezone.utc).strftime('%Y-%m-%d')}",
            f"判定结果：{reason}",
            "说明：代码仓库停止更新超过一年，官网域名同时失效，无任何关停公告。",
            "",
            "【写作约束 —— 必须遵守】",
            "1. 材料里没有的数字（融资、收入、用户量）一律写「未披露」，不得推测。",
            "2. 死因只能基于：仓库停更时间、官网失效、以及 README 里能看到的"
            "产品定位与实际交付之间的落差。",
            "3. 若这是一个纯技术库/脚手架而非面向终端用户的产品，slug 返回空字符串。",
            "4. sourceType 固定 public_record，sourcesJson 必须含仓库地址。",
        ])
        out.append({
            "title": f"{repo.get('full_name')} — {repo.get('description') or ''}"[:120],
            "snippet": body[:300],
            "url": homepage,
            "published": pushed,
            "body": body,
            "is_selfpost": True,
            "sourceName": "gh_stale",
        })
        log(f"✓ {repo.get('full_name')} | {reason}")

    return out


def ih_probe():
    """Indie Hackers 通道 —— 已确认不可用，保留函数仅作记录。

    2026-11 实测：
      /products          403  Cloudflare challenge
      /api/products      403
      /sitemap.xml       200  sitemapindex → 3 个子文件
      ih-sitemap-1.xml   200  50000 URL，全部 post
      ih-sitemap-2.xml   200  50000 URL，全部 post
      ih-sitemap-3.xml   200  5829 URL，post + ideas + 用户页
      合计 105829 个 URL 中 /product/ 路径数 = 0
    """
    log("ih_probe: Indie Hackers 全站 403，sitemap 内无产品页，通道不可用")
    return []


if __name__ == "__main__":
    cands = collect_stale_candidates(limit=3)
    print("\n" + "=" * 70)
    for c in cands:
        print(c["title"])
        print("  ", c["url"])
        print("  ", c["staleEvidence"]["deadReason"])
        print("  ", c["staleEvidence"]["hnItem"])
    print(f"\n合计 {len(cands)} 条")

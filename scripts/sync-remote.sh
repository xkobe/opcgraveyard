#!/bin/bash
# 把 GitHub 上每日采集的案例同步回本地工作区。
#
# 为什么需要这个：采集跑在 GitHub Actions（云端），它每天 push 一个 commit；
# 但本地云盘工作区不会自动 pull。结果就是「仓库里有 100 条，本地 demo 还停在 94 条」。
# 这个脚本在每次 prepare / dev 之前跑一次，把差距补上。
#
# 设计原则：只做快进合并，永不产生冲突。任何一步失败都静默跳过，绝不阻塞构建。

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd -P)"

cd "${PROJECT_ROOT}" || exit 0

count_cases() {
  local n
  n=$(grep -c '^    slug: "' src/data/cases.ts 2>/dev/null)
  echo "${n:-0}"
}

# 没有 .git（比如跑在 /tmp 镜像里）就什么都不做
if [ ! -d .git ]; then
  exit 0
fi

BEFORE=$(count_cases)

# 网络不好时 fetch 会卡很久，给它一个上限
if ! timeout 45 git fetch origin main --quiet 2>/dev/null; then
  echo "[sync] fetch 失败或超时，跳过同步（本地 ${BEFORE} 条）"
  exit 0
fi

LOCAL_HEAD=$(git rev-parse HEAD 2>/dev/null)
REMOTE_HEAD=$(git rev-parse origin/main 2>/dev/null)

if [ -z "${LOCAL_HEAD}" ] || [ -z "${REMOTE_HEAD}" ]; then
  exit 0
fi

if [ "${LOCAL_HEAD}" = "${REMOTE_HEAD}" ]; then
  echo "[sync] 已是最新（${BEFORE} 条案例）"
  exit 0
fi

BEHIND=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo 0)
AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo 0)

if [ "${BEHIND}" = "0" ]; then
  echo "[sync] 本地领先远端 ${AHEAD} 个提交，无需同步"
  exit 0
fi

# 工作区有未提交改动时不动，避免把用户的改动卷进合并
if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
  echo "[sync] 工作区有未提交改动，跳过自动合并（远端领先 ${BEHIND} 个提交）"
  exit 0
fi

if ! git merge --ff-only origin/main --quiet 2>/dev/null; then
  echo "[sync] 快进合并失败（可能有本地提交），跳过"
  exit 0
fi

AFTER=$(count_cases)
echo "[sync] 已同步远端 ${BEHIND} 个提交：${BEFORE} → ${AFTER} 条案例"

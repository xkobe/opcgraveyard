import type { Metadata } from 'next';
import Link from 'next/link';
import { CASES, DEATH_CAUSES, getCaseBySlug, type CaseRecord } from '@/data/cases';
import { DUELS, type CounterpartDuel } from '@/data/counterparts';
import { CaseCard } from '@/components/case-card';
import { SubscribeForm } from '@/components/subscribe-form';

export const metadata: Metadata = {
  title: '从 AI 一人公司的失败中学习',
  description:
    '全球首个聚焦 AI 一人公司（OPC）创业失败的案例档案馆。记录死亡，拆解死因，是为了让更多人活下来。',
};

export default function Home() {
  // 最新下葬：按 closedAt 倒序取最近 5 条，保证新增案例自动进入榜单
  const latest = [...CASES]
    .sort((a, b) => (b.closedYear || '').localeCompare(a.closedYear || ''))
    .slice(0, 5);
  const total = CASES.length;
  const verifiedCount = CASES.filter((c) => c.verified).length;
  const avgLifespan =
    total > 0
      ? Math.round(
          (CASES.reduce((s, c) => s + c.lifespanMonths, 0) / total) * 10,
        ) / 10
      : 0;
  const causeStats = DEATH_CAUSES.map((cause) => ({
    cause,
    count: CASES.filter((c) => c.primaryTag === cause.value).length,
  })).sort((a, b) => b.count - a.count);
  // 同题对撞：前 3 组，配到对应墓碑
  const duels = DUELS.slice(0, 3)
    .map((duel) => ({ duel, dead: getCaseBySlug(duel.caseSlug) }))
    .filter(
      (d): d is { duel: CounterpartDuel; dead: CaseRecord } =>
        d.dead !== undefined,
    );

  return (
    <main>
      {/* 品牌头区：对标 TrustMRR 顶部 */}
      <section className="border-b border-zinc-200/80 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                OPC GRAVEYARD · AI 一人公司失败档案馆
              </p>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
                90% 的 AI 一人公司会失败。
                <br />
                在这里，学学怎么不失败。
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
                AI 降低了「做出来」的门槛，却没有降低「卖出去」的门槛。
                我们记录 AI 一人公司（OPC）的真实死亡，拆解每座墓碑下的死因与教训——给所有准
                OPC 创业者一份现实校准。
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <Link
                href="/cases"
                className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
              >
                浏览失败案例库
              </Link>
              <Link
                href="/contribute"
                className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:border-zinc-500 hover:text-zinc-900"
              >
                投稿你的失败故事
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 搜索区：对标 TrustMRR 顶部搜索 */}
      <section className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <form action="/cases" method="get" className="flex gap-2">
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
              <input
                type="search"
                name="q"
                placeholder="搜索项目、行业、死因…"
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="h-10 shrink-0 rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              搜索
            </button>
          </form>
        </div>
      </section>

      {/* 数据概览：高信息密度统计 */}
      <section className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 sm:grid-cols-4">
            {[
              { label: '已收录案例', value: total, hint: '持续增长中' },
              { label: '已核实', value: verifiedCount, hint: '公开报道/当事人自述' },
              { label: '平均存活', value: `${avgLifespan} 月`, hint: '从成立到关闭' },
              { label: '死因分类', value: DEATH_CAUSES.length, hint: '六大类' },
            ].map((s) => (
              <div key={s.label} className="bg-white p-3.5">
                <div className="text-xl font-bold tabular-nums leading-none text-zinc-900 sm:text-2xl">
                  {s.value}
                </div>
                <div className="mt-1.5 text-xs font-medium text-zinc-700">
                  {s.label}
                </div>
                <div className="mt-0.5 text-[10px] text-zinc-400">{s.hint}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 死因分布：紧凑横向统计条（带刻度） */}
      <section className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-base font-semibold text-zinc-900">
              死因分布
              <span className="ml-2 text-xs font-normal text-zinc-500">
                基于 {total} 个已收录案例
              </span>
            </h2>
            <span className="text-xs text-zinc-500">数据随案例增长持续更新</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {causeStats.map(({ cause, count }) => {
              const pct = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={cause.value} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-xs font-medium text-zinc-800">
                    {cause.value}
                  </span>
                  <div className="relative h-1.5 flex-1 rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-zinc-900"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-14 shrink-0 text-right text-xs tabular-nums text-zinc-500">
                    {count}
                    <span className="text-zinc-400"> / {pct}%</span>
                  </span>
                </div>
              );
            })}
            <div className="mt-1 flex items-center gap-3 pl-28">
              <div className="flex flex-1 justify-between text-[10px] text-zinc-300">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
              <span className="w-14 shrink-0" />
            </div>
          </div>
        </div>
      </section>

      {/* 最新下葬：对标 TrustMRR 排行榜单 */}
      <section className="border-b border-zinc-200/80 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-base font-semibold text-zinc-900">最新下葬</h2>
            <Link
              href="/cases"
              className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
            >
              查看全部案例 →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {latest.map((c) => (
              <CaseCard key={c.slug} caseItem={c} />
            ))}
          </div>
        </div>
      </section>

      {/* 同题对撞：同一个点子，有人活有人死 */}
      {duels.length > 0 && (
        <section className="border-b border-zinc-200/80 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="mb-5 flex items-baseline justify-between">
              <div>
                <h2 className="text-base font-semibold text-zinc-900">
                  ⚔️ 同题对撞
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  同一个方向，一座墓碑 vs 一个还活着的赚钱项目
                </p>
              </div>
              <Link
                href="/duels"
                className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
              >
                全部对撞 →
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {duels.map(({ duel, dead }) => (
                <div
                  key={duel.caseSlug}
                  className="grid gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 md:grid-cols-2"
                >
                  <div className="bg-zinc-50 p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🪦</span>
                      <span className="text-xs font-semibold text-zinc-900">
                        {dead.name}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {duel.theme}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-500">
                      死因：{dead.primaryTag} · 存活 {dead.lifespanMonths} 个月
                    </p>
                  </div>
                  <div className="bg-emerald-50/60 p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🟢</span>
                      <span className="text-xs font-semibold text-emerald-900">
                        {duel.alive[0]?.name}
                      </span>
                      <span className="text-[10px] text-emerald-700">
                        {duel.alive[0]?.revenueNote}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 订阅 CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-col items-start gap-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-lg">
              <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
                📬 每周收到一座新墓碑
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                订阅「一人公司坟场」Newsletter：每周一封，拆解最新失败的 AI
                一人公司，提炼可复用的避坑清单。在投入之前，先看看别人是怎么死的。
              </p>
            </div>
            <SubscribeForm />
          </div>
        </div>
      </section>
    </main>
  );
}

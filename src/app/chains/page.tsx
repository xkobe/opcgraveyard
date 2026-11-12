import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import { CASES, getCaseBySlug, DEATH_CAUSES } from '@/data/cases';
import { FAILURE_CHAINS } from '@/data/failure-chains';

export const metadata: Metadata = {
  title: '死因传导',
  description:
    '一人公司的死因不是六个并列的标签，而是会互相传导的路径。自嗨螺旋、平权绞杀、命脉外包、一个人拍板、重资产陷阱——五条链，每一步都对应真实案例。',
};

export default function ChainsPage() {
  const chains = FAILURE_CHAINS.map((chain) => ({
    chain,
    cases: chain.caseSlugs
      .map((slug) => getCaseBySlug(slug))
      .filter((c): c is NonNullable<typeof c> => c !== undefined),
  }));

  const covered = new Set(FAILURE_CHAINS.flatMap((c) => c.caseSlugs));
  const total = CASES.length;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      {/* 头部 */}
      <div className="mb-10">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          死因传导 · FAILURE CHAINS
        </p>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          🔗 六个死因，不是六个格子，是五条路
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
          案例库里的六个死因标签，是分类用的。真实发生的过程不是这样——
          没有人是「死于商业模式脆弱」，人是先做了没人要的东西，然后拼命买流量，
          最后钱烧完了。标签是终点，传导才是过程。
        </p>
      </div>

      {/* 怎么读 */}
      <div className="mb-10 rounded-xl border border-zinc-200 bg-zinc-50/70 px-5 py-4">
        <p className="mb-2 text-xs font-bold tracking-wide text-zinc-900">
          这个页面怎么读
        </p>
        <ul className="space-y-1.5 text-xs leading-6 text-zinc-600">
          <li>
            · 每条链分三步：<span className="font-medium text-zinc-900">起点</span>（你已经在的地方）→{' '}
            <span className="font-medium text-zinc-900">加速</span>（让它变坏的那个动作）→{' '}
            <span className="font-medium text-zinc-900">终局</span>（结束的方式）。
          </li>
          <li>
            · 每一步下面标的是对应死因标签，方便回到案例库交叉查。
          </li>
          <li>
            · 链路上的文字只描述「发生过什么」，不判断你现在在哪一步，也不给建议。
          </li>
          <li>
            · 一条案例可以同时出现在不同链上——现实中很少有单一原因的死。
          </li>
        </ul>
      </div>

      {/* 五条链 */}
      <div className="flex flex-col gap-8">
        {chains.map(({ chain, cases }, idx) => (
          <section
            key={chain.id}
            id={chain.id}
            className="scroll-mt-20 overflow-hidden rounded-2xl border border-zinc-200 bg-white"
          >
            {/* 链头 */}
            <div className="border-b border-zinc-100 bg-zinc-50/80 px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-xs text-zinc-400">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h2 className="text-lg font-bold text-zinc-900">{chain.name}</h2>
                <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[11px] text-zinc-500">
                  本链收录 {cases.length} 个案例
                </span>
              </div>
              <p className="mt-1.5 text-sm text-zinc-600">{chain.subtitle}</p>
            </div>

            {/* 三步流程 */}
            <div className="px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
                {chain.steps.map((step, i) => (
                  <Fragment key={step.stage + i}>
                    <div className="flex-1 rounded-xl border border-zinc-200 bg-white p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] font-medium text-white">
                          {step.stage}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {step.tags.join(' / ')}
                        </span>
                      </div>
                      <p className="text-sm font-semibold leading-6 text-zinc-900">
                        {step.title}
                      </p>
                      <p className="mt-1.5 text-xs leading-6 text-zinc-500">
                        {step.detail}
                      </p>
                    </div>
                    {i < chain.steps.length - 1 && (
                      <div className="flex items-center justify-center py-1 text-zinc-300 md:w-5 md:py-0">
                        <span className="rotate-90 text-sm md:rotate-0">➜</span>
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>

              {/* 逻辑 */}
              <div className="mt-6 space-y-3 border-l-2 border-zinc-200 pl-4">
                {chain.logic.map((p, i) => (
                  <p key={i} className="text-sm leading-7 text-zinc-700">
                    {p}
                  </p>
                ))}
              </div>

              {/* 案例 */}
              <div className="mt-6 border-t border-dashed border-zinc-200 pt-4">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400">
                  走这条链的案例
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {cases.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/cases/${c.slug}`}
                      className="group flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-zinc-900 group-hover:underline">
                          {c.name}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                          {c.primaryTag} · 存活 {c.lifespanMonths} 个月 · {c.region}
                        </p>
                      </div>
                      <span className="mt-0.5 shrink-0 text-[11px] text-zinc-300 group-hover:text-zinc-500">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* 全库分布 */}
      <section className="mt-12 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5 sm:p-6">
        <h2 className="text-sm font-bold text-zinc-900">全库主标签分布</h2>
        <p className="mt-1.5 text-xs leading-6 text-zinc-500">
          下面的数字是案例库全部 {total} 条的统计，和上面五条链没有加总关系。
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {DEATH_CAUSES.map((d) => {
            const n = CASES.filter((c) => c.primaryTag === d.value).length;
            const pct = Math.round((n / total) * 100);
            return (
              <div key={d.value} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs text-zinc-700">
                  {d.value}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200">
                  <div
                    className="h-full rounded-full bg-zinc-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-14 shrink-0 text-right font-mono text-[11px] text-zinc-500">
                  {n} · {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 口径声明 */}
      <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 px-5 py-4">
        <p className="mb-2 text-xs font-bold text-amber-900">关于这五条链的口径</p>
        <ul className="space-y-1.5 text-xs leading-6 text-amber-900/80">
          <li>
            · 五条链共引用 {covered.size} 条案例，占全库 {total} 条的{' '}
            {Math.round((covered.size / total) * 100)}%。剩下{' '}
            {total - covered.size} 条没有被归入任何一条链——它们大多是个案，
            或者同时符合多条链但特征不够典型。
          </li>
          <li>
            · 链路名、分段、案例归属都是编辑归纳，不是聚类算法的输出，
            也不是对发生概率的估计。换个人来归纳，可能是四条或六条。
          </li>
          <li>
            · 每条链都只基于该案例公开可查的尸检记录与时间线，没有外部推测。
            案例正文里的出处都附在详情页。
          </li>
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/cases"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-700"
        >
          回到案例库 →
        </Link>
        <Link
          href="/duels"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          看同题对撞
        </Link>
      </div>
    </main>
  );
}

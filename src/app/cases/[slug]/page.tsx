import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CASES, getCaseBySlug, getCauseMeta } from '@/data/cases';
import { cn } from '@/lib/utils';

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseItem = getCaseBySlug(slug);
  if (!caseItem) return { title: '墓碑不存在' };
  return {
    title: `${caseItem.name}：${caseItem.primaryTag} | 死亡档案`,
    description: `${caseItem.epitaph.slice(0, 100)}…`,
  };
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseItem = getCaseBySlug(slug);
  if (!caseItem) notFound();

  const cause = getCauseMeta(caseItem.primaryTag);
  const related = CASES.filter(
    (c) => c.slug !== caseItem.slug && c.primaryTag === caseItem.primaryTag,
  ).slice(0, 3);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-xs text-zinc-500">
        <Link href="/cases" className="hover:text-zinc-900">
          ← 返回案例库
        </Link>
      </nav>

      {/* 墓碑头 */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          {cause && (
            <span
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs font-medium',
                cause.color,
              )}
            >
              {cause.value}
            </span>
          )}
          {caseItem.secondaryTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-600"
            >
              {tag}
            </span>
          ))}
          <span
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs',
              caseItem.verified
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-zinc-200 bg-zinc-50 text-zinc-500',
            )}
          >
            {caseItem.verified ? '✓ 已核实' : '待核实'}
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-bold text-zinc-900 sm:text-3xl">
          🪦 {caseItem.name}
        </h1>
        <p className="mt-4 border-l-2 border-zinc-900 pl-4 text-sm leading-7 text-zinc-600">
          {caseItem.epitaph}
        </p>
      </div>

      {/* 结构化墓碑数据 */}
      <section className="mt-8">
        <h2 className="mb-4 text-base font-semibold text-zinc-900">
          墓碑档案
        </h2>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 text-sm sm:grid-cols-3">
          {[
            ['创始人背景', caseItem.founderBg],
            ['地区', caseItem.region],
            ['行业', caseItem.industry],
            ['商业模式', caseItem.businessModel || '待补全'],
            ['成立', caseItem.foundedYear],
            ['关闭', caseItem.closedYear],
            ['存活时长', `${caseItem.lifespanMonths} 个月`],
            ['总融资额', caseItem.totalFunding],
            ['融资轮次', caseItem.fundingRounds > 0 ? `${caseItem.fundingRounds} 轮` : '待补全'],
            ['最后阶段', caseItem.lastStage || '待补全'],
            ['资金类型', caseItem.fundingType],
            ['投资方', caseItem.investors.length > 0 ? caseItem.investors.join('、') : '待补全'],
          ].map(([label, value]) => (
            <div key={label} className="bg-white p-4">
              <dt className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                {label}
              </dt>
              <dd className="mt-1 text-xs leading-5 text-zinc-800">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-[11px] text-zinc-400">
          信息来源：{caseItem.sources.join(" / ")}
        </p>
      </section>

      {/* 编辑摘要 */}
      <section className="mt-10">
        <h2 className="mb-4 text-base font-semibold text-zinc-900">
          编辑摘要
        </h2>
        <p className="text-sm leading-7 text-zinc-600">{caseItem.editorSummary}</p>
      </section>

      {/* 创业动机 */}
      <section className="mt-10">
        <h2 className="mb-4 text-base font-semibold text-zinc-900">
          创业动机与初衷
        </h2>
        <p className="text-sm leading-7 text-zinc-600">{caseItem.motivation}</p>
      </section>

      {/* 时间线 */}
      <section className="mt-10">
        <h2 className="mb-4 text-base font-semibold text-zinc-900">
          死亡时间线
        </h2>
        <ol className="relative border-l border-zinc-200 pl-6">
          {caseItem.timeline.map((t, i) => (
            <li key={i} className="relative pb-6 last:pb-0">
              <span className="absolute -left-[31px] top-1 flex h-3 w-3 items-center justify-center rounded-full border border-zinc-300 bg-white">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-800">{t.date}</span>
                <span className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] text-zinc-500">
                  {t.type}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-zinc-600">{t.event}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 死因拆解 */}
      <section className="mt-10">
        <h2 className="mb-4 text-base font-semibold text-zinc-900">
          死因拆解（三层因果）
        </h2>
        <div className="flex flex-col gap-4">
          {caseItem.breakdown.map((b, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <h3 className="text-sm font-semibold text-zinc-900">
                {i + 1}. {b.layer}
              </h3>
              <p className="mt-2 text-sm leading-7 text-zinc-600">{b.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 教训 */}
      <section className="mt-10 rounded-2xl border border-zinc-900 bg-zinc-900 p-6">
        <h2 className="mb-4 text-base font-semibold text-white">
          墓碑上的教训
        </h2>
        <ul className="flex flex-col gap-3">
          {caseItem.lessons.map((lesson, i) => (
            <li key={i} className="flex gap-3 text-sm leading-6 text-zinc-200">
              <span className="mt-0.5 shrink-0 text-zinc-400">⚠️</span>
              <span>{lesson}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 如果今天重做 */}
      {caseItem.rebuildPlan && (
        <section className="mt-12 rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-900">
              如果今天重做
            </h2>
            {caseItem.opportunityScore && (
              <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white">
                机会分 {caseItem.opportunityScore}/10
              </span>
            )}
          </div>
          <p className="text-sm leading-7 text-zinc-600">{caseItem.rebuildPlan}</p>
        </section>
      )}

      {/* 相关案例 */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-base font-semibold text-zinc-900">
            同一种死法的墓碑
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((c) => (
              <Link
                key={c.slug}
                href={`/cases/${c.slug}`}
                className="group rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
              >
                <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-zinc-700">
                  🪦 {c.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">
                  {c.epitaph}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

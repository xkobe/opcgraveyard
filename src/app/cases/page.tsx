import type { Metadata } from 'next';
import { CASES, DEATH_CAUSES } from '@/data/cases';
import { CaseFilter } from '@/components/case-filter';

export const metadata: Metadata = {
  title: '案例库',
  description:
    'AI 一人公司失败案例库：按行业、死因、地区筛选，深挖每座墓碑下的死因与教训。',
};

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const industries = [...new Set(CASES.map((c) => c.industry))].map(
    (value) => ({
      value,
      count: CASES.filter((c) => c.industry === value).length,
    }),
  );
  const causes = DEATH_CAUSES.filter((d) =>
    CASES.some((c) => c.primaryTag === d.value),
  ).map((d) => ({
    value: d.value,
    count: CASES.filter((c) => c.primaryTag === d.value).length,
  }));
  const regions = [...new Set(CASES.map((c) => c.region))].map((value) => ({
    value,
    count: CASES.filter((c) => c.region === value).length,
  }));

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          案例库 · CASE ARCHIVE
        </p>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          墓碑陈列室
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
          每一座墓碑都是一个真实消失的 AI 一人公司。按行业、死因或地区筛选，
          点进墓碑查看完整的死亡过程与三层死因拆解。
        </p>
      </div>

      <CaseFilter
        cases={CASES}
        industries={industries}
        causes={causes}
        regions={regions}
        initialQuery={q ?? ''}
      />
    </main>
  );
}

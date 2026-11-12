import type { Metadata } from 'next';
import Link from 'next/link';
import { getCaseBySlug } from '@/data/cases';
import { CHECK_QUESTIONS } from '@/data/self-check';
import { CheckClient, type CheckItem } from './check-client';

export const metadata: Metadata = {
  title: '你现在在哪一格',
  description:
    '六道题，不是风险测评。选项全是行为描述，答完不给分数、不给结论，只把你现在的状态对应到案例库里某一组真实项目。',
};

export default function CheckPage() {
  const items: CheckItem[] = CHECK_QUESTIONS.map((q) => ({
    id: q.id,
    tag: q.tag,
    question: q.question,
    why: q.why,
    options: q.options,
    cNote: q.cNote,
    bNote: q.bNote,
    cases: q.caseSlugs.flatMap((slug) => {
      const c = getCaseBySlug(slug);
      if (!c) return [];
      return [
        {
          slug: c.slug,
          name: c.name,
          primaryTag: c.primaryTag,
          lifespanMonths: c.lifespanMonths,
          region: c.region,
        },
      ];
    }),
  }));

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-9">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          情境对照 · SELF-CHECK
        </p>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          🪞 你现在在哪一格
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-600">
          这不是测评。没有分数，没有结论，没有「建议你尽快……」。
          六道题问的都是过去 4 周真实发生过的事，不问态度，不问计划。
          你答完会看到案例库里对应的项目，以及它们后来的样子。
        </p>
        <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 py-3">
          <p className="text-xs leading-6 text-zinc-500">
            <span className="font-medium text-zinc-900">为什么选项是这种写法：</span>
            态度自评（「你觉得你的产品有竞争力吗」）几乎人人都选「有」。
            行为描述（「产品明天关掉，用户会怎么办」）才有区分度。
            所以下面每一题问的都是已经发生的事。
          </p>
        </div>
      </div>

      <CheckClient items={items} />

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/chains"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          ← 看死因怎么传导
        </Link>
        <Link
          href="/cases"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          直接翻案例库
        </Link>
      </div>
    </main>
  );
}

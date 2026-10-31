import type { Metadata } from 'next';
import Link from 'next/link';
import { CASES, getCaseBySlug, type CaseRecord } from '@/data/cases';
import { DUELS, type CounterpartDuel } from '@/data/counterparts';

export const metadata: Metadata = {
  title: '同题对撞',
  description:
    '同一个创业方向，有人做成了一人公司，有人立起了墓碑。同题对撞：让失败的尸检与活着的样本面对面。',
};

export default function DuelsPage() {
  const duels = DUELS.map((duel) => {
    const dead = getCaseBySlug(duel.caseSlug);
    return { duel, dead };
  }).filter(
    (d): d is { duel: CounterpartDuel; dead: CaseRecord } => d.dead !== undefined,
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          同题对撞 · DUEL
        </p>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          ⚔️ 同一个点子，有人活，有人死
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
          每个方向都有大量创业者试过。这里把坟场里的一座墓碑，和同一赛道上
          真实存活、真实赚钱的项目放在一起——看死因，也看活法。
          活着的样本来自 Indie Hackers 社区与公开报道，数据均可核实。
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {duels.map(({ duel, dead }) => (
          <div
            key={duel.caseSlug}
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
          >
            {/* 对撞主题头 */}
            <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-5 py-3">
              <h2 className="text-sm font-bold text-zinc-900">{duel.theme}</h2>
              <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-[11px] text-zinc-500">
                {duel.alive.length} 个存活样本
              </span>
            </div>

            <div className="grid gap-px bg-zinc-200 md:grid-cols-2">
              {/* 死的那边 */}
              <div className="bg-white p-5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🪦</span>
                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] text-zinc-500">
                    坟场样本 · 已死
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-bold text-zinc-900">
                  {dead.name}
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  死因：{dead.primaryTag} · 存活 {dead.lifespanMonths} 个月
                </p>
                <p className="mt-3 line-clamp-3 text-xs leading-6 text-zinc-600">
                  {dead.epitaph}
                </p>
                <Link
                  href={`/cases/${dead.slug}`}
                  className="mt-3 inline-block text-xs font-medium text-zinc-900 underline-offset-2 hover:underline"
                >
                  查看墓碑档案 →
                </Link>
              </div>

              {/* 活的那边 */}
              <div className="bg-white p-5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🟢</span>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
                    存活样本 · 还在赚钱
                  </span>
                </div>
                <div className="mt-2 flex flex-col gap-3">
                  {duel.alive.map((alive) => (
                    <div key={alive.name}>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-zinc-900">
                          {alive.name}
                        </h4>
                        <a
                          href={alive.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-700 underline-offset-2 hover:underline"
                        >
                          {alive.url.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                      <p className="mt-1 text-xs font-medium text-emerald-800">
                        {alive.revenueNote}
                      </p>
                      <p className="mt-1 text-xs leading-6 text-zinc-600">
                        {alive.modelNote}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 对照结论 */}
            <div className="border-t border-zinc-100 bg-zinc-50/60 px-5 py-4">
              <p className="text-xs leading-6 text-zinc-700">
                <span className="font-semibold text-zinc-900">对照结论：</span>
                {duel.takeaway}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
        <h2 className="text-sm font-semibold text-zinc-900">
          想给一座墓碑找一个存活样本？
        </h2>
        <p className="mt-2 text-xs leading-6 text-zinc-600">
          如果你知道某个方向和案例库里某座墓碑同题、但还活得好好的项目
          （自己做的也行），欢迎去投稿页告诉我们。对撞越多，校准越准。
        </p>
        <Link
          href="/contribute"
          className="mt-3 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-700"
        >
          去投稿
        </Link>
      </div>
    </main>
  );
}

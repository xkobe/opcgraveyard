import Link from 'next/link';
import { getCauseMeta, type CaseRecord } from '@/data/cases';
import { cn } from '@/lib/utils';

export function CaseCard({ caseItem }: { caseItem: CaseRecord }) {
  const cause = getCauseMeta(caseItem.primaryTag);
  return (
    <Link
      href={`/cases/${caseItem.slug}`}
      className="group flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm shadow-zinc-900/[0.04] ring-1 ring-zinc-900/[0.04] transition-all hover:shadow-md hover:ring-zinc-900/[0.1] sm:flex-row sm:items-center sm:gap-5"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="shrink-0 text-lg">🪦</span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-zinc-900 group-hover:text-zinc-700">
            {caseItem.name}
          </h3>
          <p className="mt-0.5 truncate text-[11px] text-zinc-500">
            {caseItem.industry} · {caseItem.region}
          </p>
        </div>
      </div>

      {cause && (
        <span
          className={cn(
            'inline-flex w-max shrink-0 items-center rounded-md border px-2 py-1 text-[11px] font-medium',
            cause.color,
          )}
        >
          {cause.value}
        </span>
      )}

      <div className="flex shrink-0 items-center gap-4 text-[11px] text-zinc-600 sm:gap-5">
        <span className="tabular-nums">
          <span className="text-zinc-400">存活 </span>
          <span className="font-semibold text-zinc-900">
            {caseItem.lifespanMonths} 月
          </span>
        </span>
        <span className="tabular-nums">
          <span className="text-zinc-400">投入 </span>
          <span className="font-semibold text-zinc-900">
            {caseItem.totalFunding}
          </span>
        </span>
        <span
          className={cn(
            'hidden rounded-full px-2 py-0.5 text-[10px] font-medium sm:inline',
            caseItem.verified
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-zinc-100 text-zinc-500',
          )}
        >
          {caseItem.verified ? '✓ 已核实' : '待核实'}
        </span>
      </div>
    </Link>
  );
}

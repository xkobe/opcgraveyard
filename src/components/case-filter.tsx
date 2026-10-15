'use client';

import { useMemo, useState } from 'react';
import { CaseCard } from '@/components/case-card';
import type { CaseRecord } from '@/data/cases';

interface FilterOption {
  value: string;
  count: number;
}

interface CaseFilterProps {
  cases: CaseRecord[];
  industries: FilterOption[];
  causes: FilterOption[];
  regions: FilterOption[];
  initialQuery?: string;
}

type SortKey = 'default' | 'lifespan-desc' | 'lifespan-asc' | 'investment';

export function CaseFilter({
  cases,
  industries,
  causes,
  regions,
  initialQuery = '',
}: CaseFilterProps) {
  const [industry, setIndustry] = useState<string>('全部');
  const [cause, setCause] = useState<string>('全部');
  const [region, setRegion] = useState<string>('全部');
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortKey>('default');

  const filtered = useMemo(() => {
    const list = cases
      .filter((c) => industry === '全部' || c.industry === industry)
      .filter((c) => cause === '全部' || c.deadCause === cause)
      .filter((c) => region === '全部' || c.region === region)
      .filter((c) => {
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q) ||
          c.deadCause.toLowerCase().includes(q) ||
          c.epitaph.toLowerCase().includes(q)
        );
      });
    if (sort === 'lifespan-desc') {
      return [...list].sort((a, b) => b.lifespanMonths - a.lifespanMonths);
    }
    if (sort === 'lifespan-asc') {
      return [...list].sort((a, b) => a.lifespanMonths - b.lifespanMonths);
    }
    if (sort === 'investment') {
      return [...list].sort((a, b) =>
        String(b.investment).localeCompare(String(a.investment)),
      );
    }
    return list;
  }, [cases, industry, cause, region, query, sort]);

  function renderSelect(
    label: string,
    value: string,
    onChange: (v: string) => void,
    options: FilterOption[],
  ) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          {label}
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 rounded-lg border border-zinc-300 bg-white px-2 text-sm text-zinc-800 focus:border-zinc-900 focus:outline-none"
        >
          <option value="全部">
            全部（{options.reduce((s, o) => s + o.count, 0)}）
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.value}（{o.count}）
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
        {renderSelect('行业', industry, setIndustry, industries)}
        {renderSelect('死因', cause, setCause, causes)}
        {renderSelect('地区', region, setRegion, regions)}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            搜索
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="项目名 / 行业关键词…"
            className="h-9 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            排序
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-9 rounded-lg border border-zinc-300 bg-white px-2 text-sm text-zinc-800 focus:border-zinc-900 focus:outline-none"
          >
            <option value="default">默认排序</option>
            <option value="lifespan-desc">存活时长 ↓</option>
            <option value="lifespan-asc">存活时长 ↑</option>
            <option value="investment">投入金额</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500">
          共 <span className="font-semibold text-zinc-800">{filtered.length}</span>{' '}
          座墓碑
        </p>
        <button
          type="button"
          onClick={() => {
            setIndustry('全部');
            setCause('全部');
            setRegion('全部');
            setQuery('');
            setSort('default');
          }}
          className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
        >
          重置筛选
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500">
          🕳️ 这片坟地暂时没有匹配的墓碑。换个筛选条件试试，或{' '}
          <a href="/contribute" className="font-medium text-zinc-800 hover:text-zinc-900">
            投稿一个
          </a>
          。
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((c) => (
            <CaseCard key={c.slug} caseItem={c} />
          ))}
        </div>
      )}
    </div>
  );
}

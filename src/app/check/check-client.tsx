'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface CheckCase {
  slug: string;
  name: string;
  primaryTag: string;
  lifespanMonths: number;
  region: string;
}

export interface CheckItem {
  id: string;
  tag: string;
  question: string;
  why: string;
  options: { key: 'A' | 'B' | 'C'; label: string }[];
  cases: CheckCase[];
  cNote: string;
  bNote: string;
}

export function CheckClient({ items }: { items: CheckItem[] }) {
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C'>>({});

  const answered = Object.keys(answers).length;

  return (
    <div>
      <div className="flex flex-col gap-5">
        {items.map((item, idx) => {
          const picked = answers[item.id];
          const showResult = picked === 'B' || picked === 'C';
          return (
            <section
              key={item.id}
              className="rounded-2xl border border-zinc-200 bg-white"
            >
              <div className="px-5 py-4 sm:px-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-[11px] text-zinc-400">
                    Q{idx + 1}
                  </span>
                  <span className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] text-zinc-500">
                    {item.tag}
                  </span>
                </div>
                <p className="text-sm font-semibold leading-7 text-zinc-900">
                  {item.question}
                </p>

                <div className="mt-3 flex flex-col gap-2">
                  {item.options.map((opt) => {
                    const active = picked === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) =>
                            prev[item.id] === opt.key
                              ? prev
                              : { ...prev, [item.id]: opt.key },
                          )
                        }
                        className={[
                          'flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-xs leading-6 transition-colors',
                          active
                            ? 'border-zinc-900 bg-zinc-900 text-white'
                            : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold',
                            active
                              ? 'border-white/60 text-white'
                              : 'border-zinc-300 text-zinc-400',
                          ].join(' ')}
                        >
                          {opt.key}
                        </span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>

                {showResult && (
                  <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4">
                    <p className="text-xs leading-6 text-zinc-600">
                      {picked === 'C' ? item.cNote : item.bNote}
                    </p>
                    <p className="mt-3 mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400">
                      这一格对应的案例
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {item.cases.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/cases/${c.slug}`}
                          className="group flex items-start justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-zinc-900 group-hover:underline">
                              {c.name}
                            </p>
                            <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                              {c.primaryTag} · 存活 {c.lifespanMonths} 个月
                            </p>
                          </div>
                          <span className="mt-0.5 shrink-0 text-[11px] text-zinc-300 group-hover:text-zinc-500">
                            →
                          </span>
                        </Link>
                      ))}
                    </div>
                    <p className="mt-3 border-t border-dashed border-zinc-200 pt-2.5 text-[11px] leading-5 text-zinc-400">
                      选 A 的情况，本库没有对应样本——坟场里只收已死的项目，
                      这一档的对照要另找活着的样本（
                      <Link href="/duels" className="underline underline-offset-2">
                        同题对撞
                      </Link>
                      里有一部分）。
                    </p>
                  </div>
                )}

                {!picked && (
                  <p className="mt-3 text-[11px] leading-5 text-zinc-400">
                    {item.why}
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* 结尾 */}
      <div className="mt-8 rounded-2xl border border-zinc-900 bg-zinc-900 px-5 py-6 text-white sm:px-6">
        <p className="text-sm font-bold">以上六题没有总分。</p>
        <p className="mt-2 max-w-2xl text-xs leading-6 text-zinc-300">
          坟场里没有及格线，也没有「你的风险分是 72」这种东西。
          六道题只做一件事：把你现在的状态，翻译成案例库里某一组项目。
          你看到的是它们后来的样子，怎么判断是你的事。
        </p>
        <p className="mt-3 font-mono text-[11px] text-zinc-500">
          已作答 {answered} / {items.length} · 不保存，不追踪，刷新即清空
        </p>
      </div>
    </div>
  );
}

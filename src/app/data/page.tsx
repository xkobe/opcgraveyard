import type { Metadata } from 'next';
import Link from 'next/link';
import { CASES, DEATH_CAUSES } from '@/data/cases';

export const metadata: Metadata = {
  title: '数据口径',
  description:
    '这个库有多少条案例、统计怎么算、哪些字段不可靠、不能用来推断什么。所有数字旁边都带 n。',
};

function quantile(sorted: number[], p: number) {
  if (sorted.length === 0) return 0;
  const i = (sorted.length - 1) * p;
  const lo = Math.floor(i);
  const hi = Math.min(lo + 1, sorted.length - 1);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
}

export default function DataPage() {
  const total = CASES.length;
  const lifes = CASES.map((c) => c.lifespanMonths).sort((a, b) => a - b);
  const median = quantile(lifes, 0.5);
  const p25 = quantile(lifes, 0.25);
  const p75 = quantile(lifes, 0.75);
  const avg = Math.round((lifes.reduce((s, x) => s + x, 0) / total) * 10) / 10;

  const buckets = [
    { label: '≤ 12 个月', lo: 0, hi: 12 },
    { label: '13–24 个月', lo: 13, hi: 24 },
    { label: '25–36 个月', lo: 25, hi: 36 },
    { label: '37–60 个月', lo: 37, hi: 60 },
    { label: '> 60 个月', lo: 61, hi: Number.MAX_SAFE_INTEGER },
  ].map((b) => ({
    ...b,
    n: lifes.filter((x) => x >= b.lo && x <= b.hi).length,
  }));

  const causeStats = DEATH_CAUSES.map((c) => ({
    ...c,
    n: CASES.filter((x) => x.primaryTag === c.value).length,
  })).sort((a, b) => b.n - a.n);

  const noSecondary = CASES.filter((c) => c.secondaryTags.length === 0).length;
  const verified = CASES.filter((c) => c.verified).length;
  const zeroLife = CASES.filter((c) => c.lifespanMonths === 0).length;

  const industryValues = new Set(CASES.map((c) => c.industry));
  const unknownRegion = CASES.filter(
    (c) => !c.region.trim() || /未知|未披露|未提及/.test(c.region),
  ).length;
  const blankYear = CASES.filter((c) => !c.closedYear.trim()).length;

  const knownIssues = [
    {
      field: 'industry（行业）',
      issue: `${total} 条案例里出现了 ${industryValues.size} 个不同的 industry 取值，没有做归一化。`,
      impact:
        '所以本站不做任何「行业维度」的统计和排序。想做也做不了——归并方式是主观的，归并完的结论也就不可信。',
    },
    {
      field: 'fundingType（资金类型）',
      issue:
        '存在误标。例如 Character.AI 公开融资超过 1.5 亿美元，库内被标为「自筹」；同类的还有几个。',
      impact:
        '所以本站不按「自筹 / 融资」拆分做任何对比。这个字段目前只作为背景信息展示，不参与统计。',
    },
    {
      field: 'region（地区）',
      issue:
        `有 ${unknownRegion} 条是「未知」「未披露」「未提及（推测欧美）」或空白，另外还有「美国西雅图」「美国加州」这类和美国重复的写法。`,
      impact:
        '地区统计只在粗粒度上做，且不把「未知」并入任何一档。',
    },
    {
      field: 'closedYear（关闭年份）',
      issue:
        `格式不统一：有「2025」「2025-06」「约 2024 年」「未披露」「未知」和 ${blankYear} 条空白。`,
      impact:
        '所以本站没有「逐年关闭数量」这张图。强行做会得到一个看起来精确、实际错误的曲线。',
    },
    {
      field: 'secondaryTags（副标签）',
      issue: `${noSecondary} 条案例（占 ${Math.round((noSecondary / total) * 100)}%）没有副标签，其余有 1–3 个。而且副标签的语义层级和主标签不同——主标签是「死于什么」，副标签多半是「最后以什么形式结束」（资金断裂、团队解散、收购后关停）。`,
      impact:
        '两者不能相加，也不能互相当作因果。本站的死因分布只用主标签。',
    },
    {
      field: 'lifespanMonths（存活时长）',
      issue: `有 ${zeroLife} 条记为 0 个月，多数是「成立当年即关闭」或者成立月份不可考。`,
      impact:
        '中位数和分位数把这些 0 一并计算，会让下四分位偏低。看的时候注意这一点。',
    },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-9">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          数据口径 · METHOD
        </p>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          📐 这个库有多少东西，哪些不能信
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-600">
          失败案例库最常见的问题是数字口径不一致：首页说一千个，详情页说一千六，
          分类加起来又是一千一。这里反过来做——把每个数字的 n、每个字段的已知问题、
          以及「不能用来推断什么」全部摊开。
        </p>
      </div>

      {/* 样本概况 */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <h2 className="text-sm font-bold text-zinc-900">样本概况</h2>
        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 sm:grid-cols-4">
          {[
            { label: '收录案例', value: total, hint: 'n = 全部' },
            { label: '已核实', value: verified, hint: '有公开出处' },
            { label: '中位存活', value: `${median} 月`, hint: '含 0 值' },
            { label: '平均存活', value: `${avg} 月`, hint: '易被极值拉高' },
          ].map((s) => (
            <div key={s.label} className="bg-white p-3.5">
              <div className="text-xl font-bold tabular-nums leading-none text-zinc-900">
                {s.value}
              </div>
              <div className="mt-1.5 text-xs font-medium text-zinc-700">
                {s.label}
              </div>
              <div className="mt-0.5 text-[10px] text-zinc-400">{s.hint}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-6 text-zinc-500">
          <span className="font-medium text-zinc-900">收录范围：</span>
          AI 一人公司（OPC）及接近一人规模的 AI 创业项目，已停止运营。
          含少量「被收购后关停」「母公司战略调整关停」的项目——它们的结束方式不同，
          但同样不再独立存在，所以在库内标注了 status 区分。
          <br />
          <span className="font-medium text-zinc-900">不是：</span>
          不是随机样本，不是全量清单，也不代表所有 AI 创业的失败率。
          它是「被公开记录下来的那一部分」。
        </p>
      </section>

      {/* 死因分布 */}
      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-bold text-zinc-900">死因分布（主标签）</h2>
          <span className="text-[11px] text-zinc-400">n = {total}</span>
        </div>
        <div className="mt-4 flex flex-col gap-2.5">
          {causeStats.map((c) => {
            const pct = Math.round((c.n / total) * 100);
            return (
              <div key={c.value} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs font-medium text-zinc-800">
                  {c.value}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-zinc-900"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-20 shrink-0 text-right font-mono text-[11px] text-zinc-500">
                  {c.n} · {pct}%
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/60 px-3.5 py-3">
          <p className="text-[11px] leading-5 text-amber-900/85">
            <span className="font-medium">样本量提示：</span>
            最少的「获客失败」只有 {causeStats[causeStats.length - 1].n} 条。
            在这个量级上，两个死因之间相差 2–3 条不足以说明谁更常见——
            换一条案例进来就可能改变排序。占比数字只作参考，不作结论。
          </p>
        </div>
      </section>

      {/* 存活时长 */}
      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-bold text-zinc-900">存活时长分布</h2>
          <span className="text-[11px] text-zinc-400">n = {total}</span>
        </div>
        <p className="mt-2 text-xs leading-6 text-zinc-500">
          中位数 {median} 个月，下四分位 {p25} 个月，上四分位 {p75} 个月。
          用中位数而不是平均，是因为最大值 216 个月会把平均拉高到 {avg} 个月。
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {buckets.map((b) => (
            <div key={b.label} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs text-zinc-700">
                {b.label}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-zinc-700"
                  style={{ width: `${(b.n / total) * 100}%` }}
                />
              </div>
              <span className="w-12 shrink-0 text-right font-mono text-[11px] text-zinc-500">
                {b.n}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 已知问题 */}
      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <h2 className="text-sm font-bold text-zinc-900">已知的数据问题</h2>
        <p className="mt-1.5 text-xs leading-6 text-zinc-500">
          下面这些不是「将来会修」的待办，是现在就知道的缺陷。写在这里，
          是因为看数字的人有权知道数字是怎么来的。
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {knownIssues.map((k) => (
            <div
              key={k.field}
              className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4"
            >
              <p className="font-mono text-[11px] text-zinc-500">{k.field}</p>
              <p className="mt-1.5 text-xs leading-6 text-zinc-800">{k.issue}</p>
              <p className="mt-1.5 text-xs leading-6 text-zinc-500">
                <span className="font-medium text-zinc-700">影响：</span>
                {k.impact}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 不能做什么 */}
      <section className="mt-6 rounded-2xl border border-zinc-900 bg-zinc-900 p-5 text-white sm:p-6">
        <h2 className="text-sm font-bold">这个库不能用来推断什么</h2>
        <ul className="mt-3 space-y-2 text-xs leading-6 text-zinc-300">
          <li>
            · <span className="font-medium text-white">不能说「AI 创业失败率是 X%」。</span>
            分母不在库里。这里只有死掉的，没有活着但没被记录的，也没有根本没开始的。
          </li>
          <li>
            · <span className="font-medium text-white">不能说「某某死因最致命」。</span>
            收录偏好本身有偏：写出来、被报道的失败，往往比沉默关停的更戏剧化。
          </li>
          <li>
            · <span className="font-medium text-white">不能把占比当概率。</span>
            「26 条死于商业模式脆弱」不等于「26% 的项目会死于此」。
          </li>
          <li>
            · <span className="font-medium text-white">不能反向推出成功路径。</span>
            避开所有死因不等于活下来——这是幸存者偏差的反面，同样是个坑。
          </li>
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/cases"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-700"
        >
          回案例库 →
        </Link>
        <Link
          href="/chains"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          看死因传导
        </Link>
      </div>
    </main>
  );
}

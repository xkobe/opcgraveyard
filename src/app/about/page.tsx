import type { Metadata } from 'next';
import Link from 'next/link';
import { CASES, DEATH_CAUSES } from '@/data/cases';

export const metadata: Metadata = {
  title: '关于本站',
  description: '一人公司坟场的定位、方法论、内容来源与免责声明。',
};

export default function AboutPage() {
  const total = CASES.length;
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          关于 · ABOUT
        </p>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          为什么会有这座坟场
        </h1>
      </div>

      <div className="flex flex-col gap-6 text-sm leading-7 text-zinc-600">
        <section>
          <h2 className="mb-2 text-base font-semibold text-zinc-900">
            我们相信
          </h2>
          <p>
            2026 年，AI 让「一个人开公司」成为热潮：OPC（One Person
            Company，一人公司）在全国涌现，注册量爆发，政策扶持，社区林立。
            但技术平权有一个残酷的另一面——AI 降低了「做出来」的门槛，却没有降低
            「卖出去」的门槛。市场正在经历「注册爆发」与「淘汰飙升」并存的悖论。
          </p>
          <p className="mt-3">
            大多数报道只歌颂活下来的超级个体。我们选择记录死去的那些——
            因为从失败中学到的东西，往往比从成功中学到的更真实。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-zinc-900">
            我们做什么
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-zinc-800">案例库：</strong>
              收录真实消失的 AI 一人公司，目前已有 {total} 座墓碑，持续增长
            </li>
            <li>
              <strong className="text-zinc-800">三层死因拆解：</strong>
              每个案例按「表层原因 → 中间机制 → 深层机制」拆解，不做表面归因
            </li>
            <li>
              <strong className="text-zinc-800">死因分类：</strong>
              基于调研归纳的六类死因：
              {DEATH_CAUSES.map((d) => d.value).join('、')}
            </li>
            <li>
              <strong className="text-zinc-800">预防导向：</strong>
              每个案例都提炼可复用的避坑清单，而不是制造焦虑
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-zinc-900">
            内容从哪来
          </h2>
          <p>
            案例信息来自公开报道（媒体、行业社区）、创始人自述与社区记录。
            每个案例都标注来源与「已核实 / 待核实」状态；涉及个人与公司的表述
            会做必要的脱敏与匿名化处理。我们对每一个失败故事的当事人保持尊重——
            他们的勇气，是我们记录的理由。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-zinc-900">
            免责声明
          </h2>
          <p>
            本站内容仅作创业风险教育与经验参考，不构成投资、经营或法律建议。
            案例中的信息以来源方表述为准，可能存在偏差或遗漏，欢迎指正。
            如果你发现案例信息有误，或希望撤下相关案例，请联系我们。
          </p>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
          <h2 className="mb-2 text-base font-semibold text-zinc-900">
            联系我们
          </h2>
          <p className="text-xs">
            投稿失败故事：前往{' '}
            <Link href="/contribute" className="font-medium text-zinc-800 hover:text-zinc-900">
              投稿页
            </Link>{' '}
            · 纠错/撤稿/合作：hello@opcgraveyard.com
          </p>
        </section>
      </div>
    </main>
  );
}

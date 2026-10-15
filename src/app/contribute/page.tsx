import type { Metadata } from 'next';
import { ContributeForm } from '@/components/contribute-form';

export const metadata: Metadata = {
  title: '投稿你的失败故事',
  description:
    '把你的 AI 一人公司失败经历投稿给一人公司坟场：填一份结构化表单，让更多创业者看到你的教训。',
};

export default function ContributePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          投稿 · CONTRIBUTE
        </p>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          为你的项目立一座墓碑
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-600">
          你的失败故事，是别人最需要的避坑指南。填一份结构化表单（约 10
          分钟），我们会核实信息、补全叙事后上线。可选择匿名发布。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            '🚫 不评判、不嘲笑',
            '🔒 支持匿名',
            '✅ 发布前与你确认',
            '💡 你的教训将帮助上千名准 OPC 创业者',
          ].map((t) => (
            <span
              key={t}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <ContributeForm />
    </main>
  );
}

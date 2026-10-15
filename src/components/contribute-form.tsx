'use client';

import { useState } from 'react';
import { DEATH_CAUSES } from '@/data/cases';

interface FormState {
  name: string;
  founderBg: string;
  region: string;
  industry: string;
  startedAt: string;
  closedAt: string;
  investment: string;
  fundingType: string;
  deadCause: string;
  deadCauseSub: string;
  motivation: string;
  story: string;
  lessons: string;
  contact: string;
  anonymous: boolean;
}

const INITIAL: FormState = {
  name: '',
  founderBg: '',
  region: '',
  industry: '',
  startedAt: '',
  closedAt: '',
  investment: '',
  fundingType: '自筹',
  deadCause: '',
  deadCauseSub: '',
  motivation: '',
  story: '',
  lessons: '',
  contact: '',
  anonymous: false,
};

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-zinc-700">
        {label}
        {required && <span className="ml-0.5 text-zinc-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] leading-4 text-zinc-400">{hint}</p>}
    </div>
  );
}

const inputCls =
  'rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none';

export function ContributeForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [sent, setSent] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const lines = [
      '【一人公司坟场 · 失败案例投稿】',
      '',
      `项目名称：${form.name}`,
      `创始人背景：${form.founderBg}`,
      `地区：${form.region}`,
      `行业：${form.industry}`,
      `成立时间：${form.startedAt}`,
      `关闭时间：${form.closedAt}`,
      `投入金额：${form.investment}`,
      `资金类型：${form.fundingType}`,
      `一级死因：${form.deadCause}`,
      `死因细分：${form.deadCauseSub}`,
      '',
      '创业动机与初衷：',
      form.motivation,
      '',
      '时间线与关键事件：',
      form.story,
      '',
      '想对其他 OPC 创业者说的教训：',
      form.lessons,
      '',
      `联系方式（可不填）：${form.contact}`,
      `是否匿名发布：${form.anonymous ? '是' : '否'}`,
    ].join('\n');

    const subject = encodeURIComponent(
      `【案例投稿】${form.name || '未命名项目'}`,
    );
    const body = encodeURIComponent(lines);
    window.location.href = `mailto:hello@opcgraveyard.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="项目名称" required>
          <input
            required
            className={inputCls}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="你的项目/公司名字"
          />
        </Field>
        <Field label="创始人背景">
          <input
            className={inputCls}
            value={form.founderBg}
            onChange={(e) => set('founderBg', e.target.value)}
            placeholder="如：前大厂程序员 / 产品经理 / 金融从业者…"
          />
        </Field>
        <Field label="地区">
          <input
            className={inputCls}
            value={form.region}
            onChange={(e) => set('region', e.target.value)}
            placeholder="如：上海 / 苏州 / 美国…"
          />
        </Field>
        <Field label="行业">
          <input
            className={inputCls}
            value={form.industry}
            onChange={(e) => set('industry', e.target.value)}
            placeholder="如：AI 工具 / 内容创作 / 电商…"
          />
        </Field>
        <Field label="成立时间">
          <input
            className={inputCls}
            value={form.startedAt}
            onChange={(e) => set('startedAt', e.target.value)}
            placeholder="如：2025-06"
          />
        </Field>
        <Field label="关闭时间">
          <input
            className={inputCls}
            value={form.closedAt}
            onChange={(e) => set('closedAt', e.target.value)}
            placeholder="如：2026-03"
          />
        </Field>
        <Field label="投入金额">
          <input
            className={inputCls}
            value={form.investment}
            onChange={(e) => set('investment', e.target.value)}
            placeholder="如：3 万元 / $120万…"
          />
        </Field>
        <Field label="资金类型">
          <select
            className={inputCls}
            value={form.fundingType}
            onChange={(e) => set('fundingType', e.target.value)}
          >
            <option value="自筹">自筹</option>
            <option value="融资">融资</option>
            <option value="混合">混合</option>
          </select>
        </Field>
        <Field label="一级死因" required>
          <select
            required
            className={inputCls}
            value={form.deadCause}
            onChange={(e) => set('deadCause', e.target.value)}
          >
            <option value="">选择最接近的死因…</option>
            {DEATH_CAUSES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.value}
              </option>
            ))}
          </select>
        </Field>
        <Field label="死因细分">
          <input
            className={inputCls}
            value={form.deadCauseSub}
            onChange={(e) => set('deadCauseSub', e.target.value)}
            placeholder="如：大客户依赖 / 数据源缺失 / 回款风险…"
          />
        </Field>
      </div>

      <Field label="创业动机与初衷" required>
        <textarea
          required
          rows={3}
          className={inputCls}
          value={form.motivation}
          onChange={(e) => set('motivation', e.target.value)}
          placeholder="当初为什么做这件事？对 OPC 有过什么期待？"
        />
      </Field>

      <Field
        label="时间线与关键事件"
        required
        hint="从启动到结束，发生了什么？哪些节点是转折点？"
      >
        <textarea
          required
          rows={5}
          className={inputCls}
          value={form.story}
          onChange={(e) => set('story', e.target.value)}
          placeholder="时间线：成立 → 开发 → 获客 → 转折 → 结束…"
        />
      </Field>

      <Field
        label="想对其他 OPC 创业者说的教训"
        hint="哪怕只有一句话也很有价值"
      >
        <textarea
          rows={3}
          className={inputCls}
          value={form.lessons}
          onChange={(e) => set('lessons', e.target.value)}
          placeholder="如果重来一次，你会做什么不同的事？"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="联系方式（选填）">
          <input
            className={inputCls}
            value={form.contact}
            onChange={(e) => set('contact', e.target.value)}
            placeholder="邮箱 / 微信 / 社交账号，便于我们核实与访谈"
          />
        </Field>
        <Field label="发布方式">
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={form.anonymous}
              onChange={(e) => set('anonymous', e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 bg-white"
            />
            匿名发布（不展示我的姓名与身份）
          </label>
        </Field>
      </div>

      <button
        type="submit"
        className="mt-2 h-11 rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
      >
        提交投稿（生成邮件草稿）
      </button>

      {sent ? (
        <p className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs leading-6 text-zinc-600">
          ✅ 邮件客户端已打开，点击发送即可完成投稿。我们会核实信息、补充访谈后整理上线；
          涉及个人与公司信息会按你的选择做脱敏处理。
        </p>
      ) : (
        <p className="text-[11px] leading-5 text-zinc-400">
          投稿采用「填表 → 生成邮件」的方式，暂不要求注册登录。填完这份表单，
          你的失败故事已经完成了 60%——剩下的交给我们的编辑补全叙事。
        </p>
      )}
    </form>
  );
}

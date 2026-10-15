'use client';

import { useState } from 'react';

export function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent('订阅一人公司坟场 Newsletter');
    const body = encodeURIComponent(
      `你好，我想订阅一人公司坟场的 Newsletter。\n\n我的邮箱：${email}\n\n请把我的邮箱加入订阅列表，谢谢！`,
    );
    window.location.href = `mailto:hello@opcgraveyard.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="你的邮箱"
          className="h-10 flex-1 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
        />
        <button
          type="submit"
          className="h-10 rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          订阅
        </button>
      </div>
      {sent ? (
        <p className="text-xs leading-5 text-zinc-600">
          ✅ 已为你打开邮件客户端，点击发送即可完成订阅。正式订阅通道上线后，我们会用这个邮箱与你联系。
        </p>
      ) : (
        <p className="text-xs leading-5 text-zinc-500">
          每周一封：最新下葬的失败案例 + 死因拆解 + 避坑清单。免费，可随时退订。
        </p>
      )}
    </form>
  );
}

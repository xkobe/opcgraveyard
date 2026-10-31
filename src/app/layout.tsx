import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '一人公司坟场 | 从 AI 一人公司的失败中学习',
    template: '%s | 一人公司坟场',
  },
  description:
    '全球首个聚焦 AI 一人公司（OPC, One Person Company）创业失败的案例档案馆。记录一人公司的死亡，拆解失败原因，是为了让更多人活下来。',
  keywords: [
    '一人公司',
    'OPC',
    'One Person Company',
    'AI 创业',
    '创业失败',
    '失败案例',
    '超级个体',
    'AI 一人公司',
    '创业避坑',
  ],
  openGraph: {
    title: '一人公司坟场 | 从 AI 一人公司的失败中学习',
    description:
      '记录 AI 一人公司的死亡，拆解失败原因，是为了让更多人活下来。',
    siteName: '一人公司坟场',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const NAV_ITEMS = [
  { href: '/', label: '首页' },
  { href: '/cases', label: '案例库' },
  { href: '/duels', label: '同题对撞' },
  { href: '/contribute', label: '投稿' },
  { href: '/about', label: '关于' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-white text-zinc-900 antialiased">
        <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">🪦</span>
              <span className="text-sm font-bold tracking-wide text-zinc-900">
                一人公司坟场
              </span>
              <span className="hidden rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-500 sm:inline">
                OPC GRAVEYARD
              </span>
            </Link>
            <nav className="flex items-center gap-1 sm:gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-2.5 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {children}

        <footer className="border-t border-zinc-200/80 py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-md">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🪦</span>
                  <span className="text-sm font-bold text-zinc-900">
                    一人公司坟场
                  </span>
                </div>
                <p className="mt-3 text-xs leading-6 text-zinc-500">
                  记录 AI 一人公司的死亡，拆解失败原因，是为了让更多人活下来。
                  AI 降低了「做出来」的门槛，却没有降低「卖出去」的门槛——这里是给所有准 OPC 创业者的现实校准。
                </p>
              </div>
              <div className="text-sm text-zinc-500">
                <p className="mb-2 font-semibold text-zinc-700">快速导航</p>
                <ul className="space-y-1.5 text-xs">
                  <li>
                    <Link href="/cases" className="hover:text-zinc-900">
                      浏览案例库
                    </Link>
                  </li>
                  <li>
                    <Link href="/contribute" className="hover:text-zinc-900">
                      投稿你的失败故事
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-zinc-900">
                      关于本站
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <p className="mt-8 border-t border-zinc-200/80 pt-4 text-[11px] leading-5 text-zinc-400">
              本站案例信息来自公开报道、社区记录与当事人自述，标注验证状态，仅作创业风险教育参考，不构成投资或经营建议。涉及个人与公司的表述已做必要的脱敏与匿名化处理。
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

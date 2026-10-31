// 同题对撞 · 对照数据
// 每个坟场案例配 1-2 个「同一方向但还活着」的成功项目，形成成败对照。
// 所有 alive 项目均为真实存在、可核实的公开项目，收入/规模数据来自公开报道。

export interface AliveProject {
  name: string;
  url: string;
  revenueNote: string; // 收入 / 规模说明
  modelNote: string; // 商业模式 / 差异化说明
}

export interface CounterpartDuel {
  caseSlug: string; // 坟场案例 slug
  theme: string; // 对撞主题
  alive: AliveProject[];
  takeaway: string; // 一句话对照结论
}

export const DUELS: CounterpartDuel[] = [
  {
    caseSlug: 'tome-ai-deck',
    theme: 'AI 演示文稿',
    alive: [
      {
        name: 'Gamma',
        url: 'https://gamma.app',
        revenueNote: '约 7000 万用户，Pro 版 $10/月',
        modelNote:
          '坚持订阅制变现：免费额度用完即付费，靠 prompt-to-deck 的速度优势成为品类头部。',
      },
    ],
    takeaway:
      '同一个「AI 生成演示文稿」的点子：Tome 先发但商业模式脆弱、烧钱后倒下；Gamma 用订阅制活成龙头。区别不在谁先做，而在有没有可持续收钱的模型。',
  },
  {
    caseSlug: 'neuropixel',
    theme: 'AI 图像生成',
    alive: [
      {
        name: 'PhotoAI（Pieter Levels）',
        url: 'https://photoai.com',
        revenueNote: '单人 0 员工，$105K~138K/月（公开自报）',
        modelNote:
          '付费制第一天就开始收费，订阅制 + 个人品牌 + 快速迭代，把 AI 照片生成做成了持续现金流。',
      },
    ],
    takeaway:
      '同一个「AI 生成图片」的赛道：NeuroPixel 死在同质化竞争（大家都在做、没有差异）；PhotoAI 靠「从第一天就收费 + 个人品牌护城河」活成一人公司标杆。',
  },
  {
    caseSlug: 'saturn-sql',
    theme: '数据工具 / SQL',
    alive: [
      {
        name: 'AI2SQL（Mustafa Ergisi）',
        url: 'https://ai2sql.io',
        revenueNote: '约 $2.3K~3K MRR，175+ 订阅（Stripe 验证）',
        modelNote:
          '一人开发，聚焦「自然语言转 SQL」单一细分，从 2021 年活到现在，订阅分层定价。',
      },
    ],
    takeaway:
      '同一个「SQL 工具」赛道：Saturn SQL 死在同质化竞争；AI2SQL 不做大而全，只把 text-to-SQL 一个点做到可收费，小而稳地活着。',
  },
  {
    caseSlug: 'architect-zero-income',
    theme: '服务型一人业务',
    alive: [
      {
        name: 'Designjoy（Brett Williams）',
        url: 'https://www.designjoy.co/',
        revenueNote: '$4,995~7,995/月订阅，累计 $1M+ ARR（公开报道）',
        modelNote:
          '把设计服务产品化成「订阅制」：固定月费、固定流程、Trello 队列交付，一人运营不外包。',
      },
    ],
    takeaway:
      '同样是「卖服务」：大厂架构师接散活半年零收入（获客失败、时薪陷阱）；Designjoy 把服务产品化成订阅，客户预付、收入稳定。服务型一人公司活下来的关键是产品化，不是更拼。',
  },
  {
    caseSlug: 'jingen-ai-editor',
    theme: 'AI 视频剪辑',
    alive: [
      {
        name: 'Descript',
        url: 'https://www.descript.com',
        revenueNote: '600 万+创作者/团队，$16~24/月（年度订阅）',
        modelNote:
          '面向创作者的自助订阅：文本式剪辑成为品类标准，用户自己上手，无需定制交付。',
      },
    ],
    takeaway:
      '同一个「AI 剪辑工具」方向：景恩做 toB 定制、每个客户都要贴身交付，商业模式脆弱；Descript 面向海量创作者做自助订阅，把产品做标准、把交付做轻，规模完全不同。',
  },
  {
    caseSlug: 'character-ai',
    theme: 'AI 情感陪伴',
    alive: [
      {
        name: 'Replika',
        url: 'https://replika.ai',
        revenueNote: '约 4000 万注册用户，Pro $19.99/月（第三方估 $14M~35M/年）',
        modelNote:
          '2017 年创立至今：走「情感支持/健康陪伴」定位，靠订阅制变现，即使经历监管处罚也活了下来。',
      },
    ],
    takeaway:
      '同一个「AI 陪伴」赛道：Character.AI 死于成本结构失衡（推理成本压垮模型）；Replika 从第一天收订阅费，成本可控、定位清晰，扛过监管风波仍活着。',
  },
  {
    caseSlug: 'relay',
    theme: '浏览器 / Chrome 扩展工具',
    alive: [
      {
        name: 'Tailscan（Erwin Lengkeek）',
        url: 'https://tailscan.com',
        revenueNote: '约 $30K/年（公开自报）',
        modelNote:
          '1 周做出 MVP，聚焦「Tailwind CSS 调试」这一个垂直痛点，小而专注、持续盈利。',
      },
    ],
    takeaway:
      '同一个「浏览器扩展工具」方向：Relay 死在同质化竞争；Tailscan 只切 Tailwind 调试这一个窄点，做得深、做得专，小生意也活得很好。',
  },
];

export function getDuelByCase(slug: string): CounterpartDuel | undefined {
  return DUELS.find((d) => d.caseSlug === slug);
}

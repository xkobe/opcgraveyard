// 情境对照 —— 不是测评，没有分数，没有结论。
//
// 每道题只做一件事：把「你现在的状态」翻译成「案例库里的某一组项目」。
// 选项全部是行为描述，不是态度自评。答完不给你判断，只给你案例链接。
//
// 设计原则：
// 1. 题目本身不含答案，选项不带褒贬，用户读完不知道自己「该选哪个」。
// 2. A 档在本库没有对应样本——坟场里只有死掉的，这是样本的局限，如实说明。
// 3. 每题只对应一个死因标签，方便回到案例库交叉查。

import type { FailureTag } from './cases';

export interface CheckOption {
  key: 'A' | 'B' | 'C';
  label: string;
}

export interface CheckQuestion {
  id: string;
  /** 对应死因 */
  tag: FailureTag;
  /** 题目 */
  question: string;
  /** 为什么问这个（事实说明，不是提醒） */
  why: string;
  options: CheckOption[];
  /** 这一格对应的案例 */
  caseSlugs: string[];
  /** 选 C 时的一句话，只描述案例库事实 */
  cNote: string;
  /** 选 B 时的一句话 */
  bNote: string;
}

export const CHECK_QUESTIONS: CheckQuestion[] = [
  {
    id: 'strangers-paid',
    tag: '需求验证缺失',
    question:
      '过去 4 周，有多少陌生人——不是你认识的人、不是朋友、不是社群里的熟人——为这个东西付过钱？',
    why: '案例库里「需求验证缺失」这一类，共同点不是没做调研，是调研对象一直是熟人。',
    options: [
      { key: 'A', label: '有，而且有人付了第二次' },
      { key: 'B', label: '有，但只有一两个，而且没有复购' },
      { key: 'C', label: '没有。目前只有认识的人在试用，或者还没收过钱' },
    ],
    caseSlugs: ['incidentops', 'shouldibuild-it', 'agentplace', 'babylovegrowth'],
    cNote:
      '这四个项目的起点都在这一步：IncidentOps 只在自家团队跑过两个月，AgentPlace 是创始人在自家团队里用得顺手就判断外部也需要。它们的产品都做出来了，也都能跑。',
    bNote:
      '这四个项目里有两个曾经走到「一两个付费用户」这一步，然后停在那里——BabyLoveGrowth 有 500+ 注册用户，付费转化极低。',
  },
  {
    id: 'inbound-flow',
    tag: '获客失败',
    question:
      '除了你自己发的帖子和朋友的转发，过去 4 周有新的客户主动找过来吗？',
    why: '「获客失败」这一类不是没流量，是流量全部来自一次性动作。停下来就不来。',
    options: [
      { key: 'A', label: '有，而且不是靠某一次活动带来的' },
      { key: 'B', label: '有一点，但我不推就没了' },
      { key: 'C', label: '没有。所有用户都来自我主动推送的那几次' },
    ],
    caseSlugs: [
      'architect-zero-income',
      'indie-dev-two-years-app-store-featured',
      'kortyx',
    ],
    cNote:
      'Indie Dev 做了两年，月收入不到 3000 元，增长完全依赖 App Store 首页推荐这一次偶发流量——推荐结束后没有任何自有渠道。Architect 关停时的状态就是「没有客户」。',
    bNote:
      '这三个项目都经历过「推一次来一点」的阶段。Kortyx 的问题不是没有用户，是用户来了不留下。',
  },
  {
    id: 'replacement-cost',
    tag: '同质化竞争',
    question: '如果你的产品明天关掉，用户会怎么办？',
    why: '「同质化竞争」这一类不是产品差，是替代成本低到接近零。',
    options: [
      { key: 'A', label: '找不到替代品，或者换掉要付出明显代价' },
      { key: 'B', label: '能找到差不多的，但要花点时间重新配置' },
      { key: 'C', label: '直接打开通用 AI 工具，或者用免费方案，几乎无感' },
    ],
    caseSlugs: [
      'saturn-sql',
      'figma-ai-plugin-shutdown',
      'phind-ai-search',
      'charlie-labs',
    ],
    cNote:
      'Saturn SQL 的功能可以被「免费的 cron job 加 Python 脚本」完全替代；Figma 官方发布原生 AI 功能后，独立插件失去存在理由。这两个都不是被更强的对手打败，是被「已经够用的东西」打败。',
    bNote:
      '这四个项目里，Charlie Labs 的处境是「通用模型自己长出了我的功能」——换掉要花点时间，但不需要重新学习。',
  },
  {
    id: 'marginal-cost',
    tag: '成本结构失衡',
    question: '你的收入每多 1 块钱，需要多付出的变动成本大概是多少？',
    why: '「成本结构失衡」这一类不是成本高，是边际成本不随规模下降。',
    options: [
      { key: 'A', label: '几乎不涨，或者涨一点点' },
      { key: 'B', label: '涨一半左右，还有毛利' },
      { key: 'C', label: '涨得比 1 块还多，或者我还没算过这件事' },
    ],
    caseSlugs: [
      'character-ai',
      'anbu-eggverse',
      'moxie-children-robot',
      '80-acres-farms',
    ],
    cNote:
      'Character.AI 月运营成本 3000 万美元，订阅 9.99 美元，付费转化不足 0.7%，免费用户无限制对话——亏损随互动时长线性增长。80 Acres Farms 的电费、折旧、人工都是刚性成本，扩产同步放大亏损。',
    bNote:
      '这四个项目里有三个在「还有毛利」的阶段继续扩张，然后发现扩得越大，绝对值亏得越多。German Bionic 申请破产时订单簿依然饱满。',
  },
  {
    id: 'revenue-concentration',
    tag: '商业模式脆弱',
    question: '你最近一个月的收入里，最大的那一个来源占多少？',
    why: '「商业模式脆弱」这一类最常见的形式不是没有收入，是收入集中在一个不能控制的来源上。',
    options: [
      { key: 'A', label: '没有单一来源超过一半' },
      { key: 'B', label: '一半到八成' },
      { key: 'C', label: '八成以上，或者这个月的钱我还不确定能不能收到' },
    ],
    caseSlugs: [
      'jingen-ai-editor',
      'twice-opc-programmer',
      'afiniti-ai-unicorn-fire-sale',
      'coreweave-ai-cycle-stall',
    ],
    cNote:
      'Jingen AI Editor 死于唯一投资人撤资，现金流瞬间断裂——没有第二个资金来源，也没有跑通的独立收入。Twice OPC Programmer 死于客户拖款：外包用时间换钱，AI 改变不了回款结构。',
    bNote:
      '这四个项目里，CoreWeave 的收入来自少数几个 AI 公司的资本开支——客户集中度高，别人的预算表一改，股权价值就可能归零。',
  },
  {
    id: 'solo-decision',
    tag: '合规与决策风险',
    question:
      '最近三个月，有没有一个决定是你一个人拍板、做完之后才告诉别人的？',
    why: '「合规与决策风险」这一类的关键不是判断错，是没有任何机制在错误发生时拦住它。',
    options: [
      { key: 'A', label: '有，但都是能撤回的小事' },
      { key: 'B', label: '有过，事后我自己复盘过风险' },
      {
        key: 'C',
        label:
          '有。而且是撤不回来的那种：已经发出去的宣传、已经动过的数据、已经签下的合同、已经给 AI 的权限',
      },
    ],
    caseSlugs: [
      'medvi',
      'cursor-opus-agent-database-deletion',
      'moonwell-mamo-oracle-exploit',
      'builder-ai',
    ],
    cNote:
      'Medvi 用 AI 生成整套「看起来像正规医疗公司」的官网与资质，被监管和媒体戳穿。Cursor Opus Agent 被授予过高生产权限、缺少人工确认，直接清空生产数据库。Builder AI 是 700 人手动写代码冒充 AI，虚报 300% 收入——这不是某一天的决定，是一连串「这次先这样」。',
    bNote:
      '这四个项目里，Moonwell 的归因写得很直白：为了 TVL 增长，把安全审计和风控的优先级放在扩张之后。事后复盘过，但没有改流程。',
  },
];

// 死因传导链 —— OPC Graveyard
//
// 说明：本文件是编辑层的归纳，不是统计结论。
// 每一条链的每一步都对应案例库里真实存在的项目，链路上的描述只陈述
// 「发生过什么」，不包含「你应该怎么做」。案例数量标注为「本链收录 N 个」，
// 不代表全库分布，也不代表该路径的发生概率。
//
// 数据来源：CASES 中每条案例的 breakdown 字段（三层因果拆解）+ postmortem。

import type { FailureTag } from './cases';

export interface ChainStep {
  /** 阶段标签 */
  stage: '起点' | '加速' | '终局';
  /** 这一步在 OPC 身上具体表现成什么 */
  title: string;
  /** 事实描述 */
  detail: string;
  /** 对应的死因标签（可多个） */
  tags: FailureTag[];
}

export interface FailureChain {
  id: string;
  /** 链路名 */
  name: string;
  /** 一句话概括 */
  subtitle: string;
  steps: ChainStep[];
  /** 这条链怎么走通的，按段落组织 */
  logic: string[];
  /** 走这条链的案例 */
  caseSlugs: string[];
}

export const FAILURE_CHAINS: FailureChain[] = [
  {
    id: 'self-hype-spiral',
    name: '自嗨螺旋',
    subtitle: '从自己的痛点出发，做完了才发现只有自己需要',
    steps: [
      {
        stage: '起点',
        title: '把自己的痛点当成市场需求',
        detail:
          '创始人在自己的日常里遇到一个麻烦，直接开工。没有陌生人访谈，没有预售，没有付费意愿测试。',
        tags: ['需求验证缺失'],
      },
      {
        stage: '加速',
        title: '做出来后卖不动，于是加大投入',
        detail:
          '产品功能完整、能跑、自己也用得上，但没人付钱。判断是「曝光不够」，于是换渠道、加投放、再迭代一版。',
        tags: ['获客失败'],
      },
      {
        stage: '终局',
        title: '钱花完了，产品还在',
        detail:
          '产品没有崩，代码还在跑，服务器还在计费。结束的方式通常是静默关停，而不是某个戏剧性的事件。',
        tags: ['成本结构失衡', '商业模式脆弱'],
      },
    ],
    logic: [
      '这条链上的案例，起点高度一致：创始人自己被一个麻烦绊住了，然后直接动手解决它。BabyLoveGrowth 的创始人觉得 SEO 太复杂，做了自动化互链工具——这个功能本身违反搜索引擎反作弊规则，但这不是它死的原因，它死在没人愿意为「简化 SEO」付钱。IncidentOps 只在自家团队内部跑过两个月，没有外部用户、没有付费转化、也没有开源获取社区。ShouldIBuildIt 面对的是「还没决定要不要创业」的人，而这群人本来就不付钱。AgentPlace 的创始人在自家团队里用得顺手，就判断外部客户也需要，结果是「大量 Agent 想法无人使用」。',
      '产品做出来之后，一致的表现是：没有陌生人付钱。Architect 关停时的状态就是四个字——没有客户。Indie Dev 做了两年，月收入不到 3000 元，增长完全依赖 App Store 首页推荐这一次偶发流量，推荐结束后没有任何自有渠道。',
      '这条链有一个容易被忽略的特征：**没有一个是「产品做不出来」**。产品都做出来了，做得还挺完整。死在「做完了」之后。所以在这条链上，「再完善一下产品」这个动作从来不起作用——问题不在产品。',
    ],
    caseSlugs: [
      'babylovegrowth',
      'incidentops',
      'shouldibuild-it',
      'agentplace',
      'kortyx',
      'architect-zero-income',
      'indie-dev-two-years-app-store-featured',
    ],
  },
  {
    id: 'commodity-squeeze',
    name: '平权绞杀',
    subtitle: '你的护城河是「比它更好」，而「更好」的保质期只有几个月',
    steps: [
      {
        stage: '起点',
        title: 'AI 抹平了门槛，差异只剩「效果更好一点」',
        detail:
          '产品能力是真的，但它的领先建立在「我这一版模型/工作流更好」上，而不是数据、分发或工作流绑定。',
        tags: ['同质化竞争'],
      },
      {
        stage: '加速',
        title: '平台或通用模型一次升级，客户没有理由留下',
        detail:
          '通用模型长出了你的功能，或者平台官方发布了原生版本。客户不需要被说服，他们只是不再需要额外装一个东西。',
        tags: ['同质化竞争'],
      },
      {
        stage: '终局',
        title: '定价权消失，收入结构不成立',
        detail:
          '要么降价到没有毛利，要么客户流向「已经长在工作流里的东西」。收入曲线掉下来，成本曲线不动。',
        tags: ['商业模式脆弱', '成本结构失衡'],
      },
    ],
    logic: [
      'NeuroPixel 做了四年时尚行业专用图像模型，服务 Myntra、Fabindia、Van Heusen、Decathlon，第二轮融资估值约 580 万美元。CEO 的原话是「我们在 2025 年底的某个夜晚被彻底碾压了」——Google 发布通用图像模型之后，专业模型的边际优势在几个月内蒸发。它死于现金断流，直接触发点是最大客户倒闭、拖欠超过六个月账款；但在此之前，护城河已经先消失了。',
      'Charlie Labs 的处境更直接：通用模型自己长出了它的产品能力。Phind 的流量被通用模型的原生搜索吸干。Figma 官方发布原生 AI 功能后，独立插件失去存在理由——用户不需要再安装什么。',
      'Saturn SQL 值得单独看：它的功能可以被「免费的 cron job 加 Python 脚本」完全替代。这不是被更强的对手打败，是被「足够用的免费方案」打败。',
      '这条链有一个共同结构：护城河只有「我的效果更好」。而效果更好的保质期，取决于一个你控制不了的东西——通用模型下一次更新的时间。你跑得再快，也快不过别人发布会的日程表。',
    ],
    caseSlugs: [
      'neuropixel',
      'charlie-labs',
      'phind-ai-search',
      'figma-ai-plugin-shutdown',
      'saturn-sql',
      'liaoran-ai-t-shirt',
      'tome-ai-deck',
    ],
  },
  {
    id: 'single-thread-life',
    name: '命脉外包',
    subtitle: '收入来自一个来源，这个来源的任何变动都是生死事件',
    steps: [
      {
        stage: '起点',
        title: '收入结构集中在单一来源',
        detail:
          '一个投资人、一个大客户、一个平台、一个母公司。集中带来效率，也带来单点故障。',
        tags: ['商业模式脆弱'],
      },
      {
        stage: '加速',
        title: '这个来源有自己的议程，与你无关',
        detail:
          '投资人有自己的资金周期，客户有自己的经营风险，母公司有自己的战略优先级。这些议程的调整不需要通知你。',
        tags: ['商业模式脆弱'],
      },
      {
        stage: '终局',
        title: '一次撤资、一次调整、一次欠款，公司直接结束',
        detail:
          '没有第二个资金来源，也没有已经跑通的独立收入，所以没有缓冲带。',
        tags: ['合规与决策风险', '成本结构失衡'],
      },
    ],
    logic: [
      'Jingen AI Editor 死于唯一投资人撤资，现金流瞬间断裂。它没有第二个资金来源，也没有已经跑通的收入——「内部孵化模式把命脉交到了别人手里」。',
      'Twice OPC Programmer 死于回款：外包是用时间换钱的模式，AI 改变不了回款结构。客户拖款就是你的现金流断点，而这跟你做得好不好无关。',
      'QClaw 和 Zupee Studio 是另一种：它们不是独立公司，是母公司的项目。腾讯「业务发展调整」、母公司「战略重心转向 AI」——这类决定的会议桌上没有你，也不需要你在场。',
      'CoreWeave 的案例把这件事讲得最清楚：客户集中度高，收入依赖少数几个 AI 公司的资本开支。分析师一旦质疑 AI 周期，股权价值就可能归零。它的死因不是技术，是别人的预算表。',
      '这条链的共同点：命脉不在自己手里。而「不在自己手里」这件事，在做决定的那一刻通常看起来是优势——因为这意味着有人给你钱。',
    ],
    caseSlugs: [
      'jingen-ai-editor',
      'twice-opc-programmer',
      'afiniti-ai-unicorn-fire-sale',
      'coreweave-ai-cycle-stall',
      'qclaw',
      'zupee-studio-neoastro',
    ],
  },
  {
    id: 'single-decider',
    name: '一个人拍板',
    subtitle: '没有第二个人能拦住你，所以一次误判就是全部',
    steps: [
      {
        stage: '起点',
        title: '关键决定由一个人做出，没有第二道审核',
        detail:
          '不是能力问题。一人公司的结构决定了：没有人有权在关键时刻说「等一下」。',
        tags: ['合规与决策风险'],
      },
      {
        stage: '加速',
        title: '后果不可逆：信任崩塌、数据丢失、监管处罚',
        detail:
          '这类错误的特征是修复成本极高——不是「改进一下」，而是「这件事已经发生了」。',
        tags: ['合规与决策风险'],
      },
      {
        stage: '终局',
        title: '一次事件直接结束公司',
        detail:
          '区别于缓慢失血。这条链上的结束往往是突然的，而且事后回看，触发点都很小。',
        tags: ['合规与决策风险', '商业模式脆弱'],
      },
    ],
    logic: [
      'Medvi 的创始人是 Matthew Gallagher，两名员工加十余种 AI 工具，做远程医疗。AI 让「看起来像一家正规医疗公司」的成本趋近于零——官网、宣传、客服、甚至医生资质都能生成。结果是被监管和媒体戳穿。',
      'Cursor Opus Agent 是另一种：AI 编程代理被授予过高的生产环境权限，缺少强制人工确认和 dry-run，直接清空了生产数据库。技术本身没问题，问题是没有人在那一步拦住它。',
      'Builder AI 的案例更极端：700 名工程师手动写代码冒充 AI，为维持高估值虚报 300% 收入。这个决定不可能在某一天突然做出，它是一系列「这次先这样」累积的结果——而一人决策的结构，恰恰最擅长累积「这次先这样」。',
      'Moonwell 是 DeFi 协议：为了 TVL 增长，把安全审计和风控的优先级放在扩张之后。预言机报价漏洞被利用，资金被抽走。它的归因里写得很直白——「团队在追求资产多样化和 TVL 增长时，将安全审计与风控优先级置于扩张之后」。',
      'Tusen Future 是广州一个百人游戏团队，自动驾驶公司跨界做游戏，成立半年被整体解散。它的深层原因不是市场，是「转型更多服务于资本市场叙事而非业务闭环」。',
      '这条链的共同结构：没有第二个人的意义，不是「多一双眼睛」，是「有一个必须说服的对象」。',
    ],
    caseSlugs: [
      'medvi',
      'cursor-opus-agent-database-deletion',
      'builder-ai',
      'moonwell-mamo-oracle-exploit',
      'tusen-future-guangzhou-gaming-studio',
    ],
  },
  {
    id: 'fixed-cost-trap',
    name: '重资产陷阱',
    subtitle: '先建成本，再找收入，然后发现边际成本不降',
    steps: [
      {
        stage: '起点',
        title: '业务需要先投入固定成本',
        detail:
          '硬件、算力、供应链、实体场地、云端服务。这些投入发生在第一笔收入之前，而且不可逆。',
        tags: ['成本结构失衡'],
      },
      {
        stage: '加速',
        title: '每多一个用户，成本也涨',
        detail:
          '不是 SaaS 的成本曲线。推理费、电费、设备折旧、内容审核、售后，都随使用量上升。',
        tags: ['成本结构失衡'],
      },
      {
        stage: '终局',
        title: '规模越大亏越多，收入永远追不上',
        detail:
          '「规模摊薄成本」的假设不成立，因为扩张同步放大亏损。融资一断，业务立即停摆。',
        tags: ['成本结构失衡', '商业模式脆弱'],
      },
    ],
    logic: [
      'Character.AI 的数字最直白：月运营成本高达 3000 万美元，订阅 9.99 美元，付费转化率不足 0.7%，免费用户无限制对话——亏损随用户互动时长线性增长。用户越多，亏得越快。',
      'Anbu Eggverse 是同一个结构的小型版本：AWS 免费额度用完，EC2 托管成本付不起，游戏只能缩减成浏览器街机厅。',
      '80 Acres Farms 做室内种植：电费、设备折旧、人工都是刚性成本，而生菜香草的单价低、保质期短。它靠持续融资扩建产能来摊薄成本，但产能扩张同步放大亏损。',
      'German Bionic 的细节值得记住：申请破产时订单簿依然饱满——不是没有需求，是钱撑不到收入确认那一天。成本结构失衡可以杀死一个「有订单」的公司。',
      'Moxie 儿童机器人：硬件售价高但利润薄，依赖持续订阅和云端服务。融资一断，云端服务停，硬件变成一块砖。',
      '这条链不是「成本高」的问题，是「成本结构的方向」问题：固定成本先于收入建立，且边际成本不随规模下降。在这个方向上，努力扩张等于努力亏钱。',
    ],
    caseSlugs: [
      'character-ai',
      'anbu-eggverse',
      '80-acres-farms',
      'moxie-children-robot',
      'arkeon',
      'german-bionic',
    ],
  },
];

export function getChainById(id: string): FailureChain | undefined {
  return FAILURE_CHAINS.find((c) => c.id === id);
}

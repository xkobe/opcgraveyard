// 一人公司坟场 (OPC Graveyard) —— 案例数据模型与首发案例库
// 数据结构规范：
//   基础（公司名/slug/成立年份/关闭年份/国家地区/行业/商业模式）
//   资金（总融资额/融资轮次/最后阶段/投资方）
//   失败标签（主标签 1 + 副标签 0-3，统一字典）
//   时间线（3-8 个关键事件，带日期与类型）
//   叙事（创始人自述/编辑摘要/详细 post-mortem/来源链接）
//   可信度（source_type + verified）
//   差异化（可选 rebuild plan / opportunity score）
// 死因体系基于《AI OPC创业失败案例市场调研报告》六大类

// ── 统一失败标签字典 ──
// 主标签：六死因
export type FailureTag =
  | "获客失败"
  | "需求验证缺失"
  | "商业模式脆弱"
  | "成本结构失衡"
  | "同质化竞争"
  | "合规与决策风险"
  // 副标签（扩展字典）
  | "资金断裂"
  | "团队解散"
  | "创始人退出"
  | "监管处罚"
  | "技术淘汰"
  | "数据泄露"
  | "恶性竞争"
  | "增长失速"
  | "收购后关停"
  | "平台封禁";

export type SourceType =
  | "interview"      // 创始人/当事人自述
  | "public_record"  // 公开记录（监管、法院、工商）
  | "ai_assisted"    // AI 辅助采集 + 人工核实
  | "crowdsourced";  // 社区投稿

export type TimelineType = "成立" | "融资" | "产品发布" | "关键招聘" | "危机" | "关闭";

export interface DeathCauseLabel {
  value: FailureTag;
  color: string;
  description: string;
}

export const DEATH_CAUSES: DeathCauseLabel[] = [
  {
    value: "获客失败",
    color: "border-zinc-200 bg-white text-red-600",
    description: "做出来了，卖不出去：品牌、渠道、销售能力未被 AI 同步降低",
  },
  {
    value: "需求验证缺失",
    color: "border-zinc-200 bg-white text-amber-700",
    description: "做出来没人要：未验证市场需求就投入开发，先做再想",
  },
  {
    value: "商业模式脆弱",
    color: "border-zinc-200 bg-white text-orange-700",
    description: "没有经常性收入、大客户依赖、回款风险，模式无法自洽",
  },
  {
    value: "成本结构失衡",
    color: "border-zinc-200 bg-white text-purple-700",
    description: "AI 工具等刚性成本持续消耗，盈亏平衡点反而更高",
  },
  {
    value: "同质化竞争",
    color: "border-zinc-200 bg-white text-sky-700",
    description: "技术平权：AI 让所有人做出 70 分产品，定价权被抹平",
  },
  {
    value: "合规与决策风险",
    color: "border-zinc-200 bg-white text-emerald-700",
    description: "一人决策无纠偏 + 数据源/版权/监管合规意识薄弱",
  },
];

// 副标签字典（统一选取，不参与主标签统计）
export const SECONDARY_TAGS: string[] = [
  "资金断裂", "团队解散", "创始人退出", "监管处罚", "技术淘汰",
  "数据泄露", "恶性竞争", "增长失速", "收购后关停", "平台封禁",
];

export interface TimelineEvent {
  date: string;
  type: TimelineType;
  event: string;
}

export interface CaseRecord {
  // ── 基础 ──
  slug: string;
  name: string;
  status: "dead" | "acquired" | "pivoted";
  foundedYear: string;      // 成立年份
  closedYear: string;       // 关闭年份
  region: string;           // 国家/地区
  industry: string;         // 行业
  businessModel: string;    // 商业模式
  lifespanMonths: number;   // 存活时长（月）
  // ── 资金 ──
  totalFunding: string;     // 总融资额
  fundingRounds: number;    // 融资轮次
  lastStage: string;        // 最后阶段
  investors: string[];      // 投资方（如公开）
  fundingType: "自筹" | "融资" | "混合";
  // ── 失败标签 ──
  primaryTag: FailureTag;       // 主标签（1 个）
  secondaryTags: FailureTag[];  // 副标签（0-3 个）
  // ── 时间线 ──
  timeline: TimelineEvent[];    // 3-8 个关键事件，带日期与类型
  // ── 叙事 ──
  founderAccount: string;   // 创始人自述（如有）
  editorSummary: string;    // 编辑摘要
  postmortem: string;       // 详细 post-mortem
  sources: string[];        // 来源链接
  // OPC 特色叙事（保留）
  founderBg: string;        // 创始人背景
  epitaph: string;          // 墓碑摘要（3 行内）
  motivation: string;       // 创业动机与初衷
  breakdown: { layer: string; detail: string }[]; // 死因拆解（至少 3 层）
  lessons: string[];        // 教训与避坑清单
  // ── 可信度 ──
  sourceType: SourceType;   // interview / public_record / ai_assisted / crowdsourced
  verified: boolean;        // 是否人工核实
  // ── 差异化（可选）──
  rebuildPlan?: string;        // 如果今天重做
  opportunityScore?: number;   // 机会分（1-10）
}

export const CASES: CaseRecord[] = [
  {
    slug: "medvi",  // MEDVi
    name: "MEDVi",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2024",  // 成立年份
    closedYear: "2026",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "AI 远程医疗",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 18,  // 存活时长
    totalFunding: "未披露（约数千万美元级估值）",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "融资",  // 自筹 | 融资 | 混合
    primaryTag: "合规与决策风险",  // 主标签（六死因）
    secondaryTags: ["监管处罚"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2024", type: "成立", event: "公司成立，以「极致效率的一人公司」形象对外宣传" },
      { date: "2024-2025", type: "产品发布", event: "宣称年入 4 亿美元，并预期 2026 年营收达 18 亿美元，连 OpenAI CEO 也公开惊叹" },
      { date: "2025", type: "危机", event: "投资人与科技媒体开始质疑：Futurism 报道其宣传内容可疑" },
      { date: "2026-02", type: "危机", event: "被曝在 Facebook 创建 800+ 虚假医生账号，其中一个「Dr. Tuckr Carlzyn MD」经 AI 核实根本不是执业医师" },
      { date: "2026-04", type: "危机", event: "FDA 发出警告信：网站宣传内容「虚假或误导」，销售的复方 GLP-1 减肥药未经批准；虚假营销、法律诉讼集中爆发" },
      { date: "2026-04", type: "危机", event: "神话破灭，公司崩盘，创始人面临刑事责任风险" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "创始人 Matthew Gallagher 想用「两名员工 + 十余种 AI 工具」证明一人公司可以创造商业奇迹。远程医疗是个诱人的赛道，AI 降低了「看起来像一家正规医疗公司」的成本——官网、宣传、客服、甚至医生资质，都可以由 AI 生成。",  // 编辑摘要
    postmortem: "表层原因：虚假营销被监管与媒体戳穿\nAI 被用来生成虚假医生账号、夸大宣传、销售未经批准的药品。当 FDA 警告信和媒体报道落地时，公司信誉在数日内归零。\n中间机制：AI 让造假成本趋近于零，也把风险放大了无限倍\n一人公司的「极致效率」同样适用于造假——一个人 + AI 可以批量制造虚假资质。但传统公司造假要承担组织风险，一人公司把全部风险集中在创始人身上，没有任何防火墙。\n深层机制：把「AI 效率」当成了商业模式本身\nMEDVi 的故事不是「AI 一人公司失败了」，而是「一个人用 AI 造假被抓住了」。真正的商业真理从未改变：产品为核、用户为本、诚信为基。AI 提升效率，但不改变合规底线。",  // 详细 post-mortem
    sources: ["每经网", "博客园", "人人都是产品经理"],  // 来源链接
    founderBg: "Matthew Gallagher，医药行业创业者",  // 创始人背景
    epitaph: "两名员工、十余种 AI 工具，宣称年入 4 亿美元、剑指 18 亿美元营收的「一人公司神话」，因用 AI 批量伪造 800 多个虚假医生账号而在 18 个月内崩塌——创始人可能面临的不只是倾家荡产，还有刑事责任。",  // 墓碑摘要
    motivation: "创始人 Matthew Gallagher 想用「两名员工 + 十余种 AI 工具」证明一人公司可以创造商业奇迹。远程医疗是个诱人的赛道，AI 降低了「看起来像一家正规医疗公司」的成本——官网、宣传、客服、甚至医生资质，都可以由 AI 生成。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因：虚假营销被监管与媒体戳穿", detail: "AI 被用来生成虚假医生账号、夸大宣传、销售未经批准的药品。当 FDA 警告信和媒体报道落地时，公司信誉在数日内归零。" },
      { layer: "中间机制：AI 让造假成本趋近于零，也把风险放大了无限倍", detail: "一人公司的「极致效率」同样适用于造假——一个人 + AI 可以批量制造虚假资质。但传统公司造假要承担组织风险，一人公司把全部风险集中在创始人身上，没有任何防火墙。" },
      { layer: "深层机制：把「AI 效率」当成了商业模式本身", detail: "MEDVi 的故事不是「AI 一人公司失败了」，而是「一个人用 AI 造假被抓住了」。真正的商业真理从未改变：产品为核、用户为本、诚信为基。AI 提升效率，但不改变合规底线。" },
    ],
    lessons: [  // 教训与避坑清单
      "AI 提升的是执行效率，不是合规豁免权；医疗、金融等强监管行业，资质与宣传合规是生死线",
      "「极致效率 + 惊人营收」的故事越漂亮，越要接受独立核查——真实商业没有一夜神话",
      "一人公司做高风险行业时，缺少组织防火墙意味着创始人要独自承担全部法律后果",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "pulley",  // Pulley
    name: "Pulley",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2020",  // 成立年份
    closedYear: "2026",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "SaaS / 股权管理",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 72,  // 存活时长
    totalFunding: "累计融资 $5000 万，估值 $2.5 亿",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "融资",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2020", type: "成立", event: "公司成立，定位为 Carta 的挑战者" },
      { date: "2021-2023", type: "融资", event: "持续获得融资，累计 $5000 万，估值 $2.5 亿" },
      { date: "2024", type: "危机", event: "客户增长 83% 至 7700 家，业务处于上升期" },
      { date: "2026-09", type: "关闭", event: "宣布 2026 年 12 月停止运营：AI 工具已能帮助公司清理和维护股权表格" },
      { date: "2026-12", type: "关闭", event: "停止运营（计划），并把客户资源引向曾经的对手 Carta" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "Pulley 曾是挑战巨头 Carta 的挑战者，为创业公司提供股权结构管理服务。产品本身并不失败——2024 年客户增长 83% 达 7700 家，这是一个健康增长的 SaaS。",  // 编辑摘要
    postmortem: "表层原因：客户付费意愿下降，收入无法维持运营\n当 AI 工具可以免费或极低成本地完成股权表格的整理与维护时，客户不愿意再为一套独立软件支付费用。增长没有崩塌，但收入模型崩塌了。\n中间机制：通用工具的替代，挤压了垂直 SaaS 的定价权\nAI 把「整理股权表格」这类任务从专业软件的领地变成了通用能力。垂直 SaaS 的价值主张（专业、可靠、合规）在「AI 免费能干 80%」面前失去说服力。\n深层机制：单点功能的 SaaS 在 AI 时代没有护城河\nPulley 的教训对所有 OPC 和轻量 SaaS 都成立：如果你的产品核心是一个「单点功能」，而 AI 可以复现这个功能，你的定价权就归零。护城河必须来自工作流集成、数据积累或品牌信任。",  // 详细 post-mortem
    sources: ["Failory Newsletter", "调研报告"],  // 来源链接
    founderBg: "Yin Wu，连续创业者",  // 创始人背景
    epitaph: "累计融资 5000 万美元、客户一年增长 83% 的股权管理 SaaS，2026 年 9 月宣布 12 月停止运营。杀死它的不是竞争对手，而是 AI——当 AI 工具能免费完成同样工作时，客户为独立软件付费的意愿急剧下降。",  // 墓碑摘要
    motivation: "Pulley 曾是挑战巨头 Carta 的挑战者，为创业公司提供股权结构管理服务。产品本身并不失败——2024 年客户增长 83% 达 7700 家，这是一个健康增长的 SaaS。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因：客户付费意愿下降，收入无法维持运营", detail: "当 AI 工具可以免费或极低成本地完成股权表格的整理与维护时，客户不愿意再为一套独立软件支付费用。增长没有崩塌，但收入模型崩塌了。" },
      { layer: "中间机制：通用工具的替代，挤压了垂直 SaaS 的定价权", detail: "AI 把「整理股权表格」这类任务从专业软件的领地变成了通用能力。垂直 SaaS 的价值主张（专业、可靠、合规）在「AI 免费能干 80%」面前失去说服力。" },
      { layer: "深层机制：单点功能的 SaaS 在 AI 时代没有护城河", detail: "Pulley 的教训对所有 OPC 和轻量 SaaS 都成立：如果你的产品核心是一个「单点功能」，而 AI 可以复现这个功能，你的定价权就归零。护城河必须来自工作流集成、数据积累或品牌信任。" },
    ],
    lessons: [  // 教训与避坑清单
      "做 SaaS 前先问：这个功能 3 年后 AI 能不能免费做？能，就别做单点工具",
      "客户增长 ≠ 商业模式成立：付费意愿断崖比流失更致命",
      "轻量产品必须向「工作流的一部分」或「数据资产」升级，否则只是 AI 的过渡方案",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "neuropixel",  // NeuroPixel
    name: "NeuroPixel",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2020",  // 成立年份
    closedYear: "2026",  // 关闭年份
    region: "印度",  // 国家/地区
    industry: "AI 时尚图像生成",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 72,  // 存活时长
    totalFunding: "累计融资约 $120 万",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "融资",  // 自筹 | 融资 | 混合
    primaryTag: "同质化竞争",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2020", type: "成立", event: "成立，专注时尚行业 AI 图像生成，累计融资约 $120 万" },
      { date: "2021-2025", type: "融资", event: "四年时间构建深度 IP，服务 Myntra、Fabindia、Van Heusen、Decathlon 等品牌；第二轮融资估值约 $580 万" },
      { date: "2025 末", type: "产品发布", event: "Google NanoBanana Pro 等通用图像模型发布，专业工具与前沿模型的差距被抹平" },
      { date: "2026-04", type: "产品发布", event: "停止服务运营。CEO 公开承认产品「顶不住」通用模型" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "NeuroPixel 成立于 2020 年，赌注是「时尚行业需要专门的图像生成模型」：声称能把目录生产时间缩短 90%、图像生产成本降低 70%。它没有错过 GenAI 浪潮，甚至抓得很早。",  // 编辑摘要
    postmortem: "表层原因：通用 AI 模型进步太快，专用工具失去技术优势\nCEO 说公司「massively outgunned overnight sometime in late 2025」。前沿图像模型的能力曲线陡峭到超出任何创业者的预期，专业模型的边际优势在几个月内蒸发。\n中间机制：分销比产品质量更重要\n客户自然流向已集成到更大生态的工具：API、企业关系、海量算力、现成用户群。即使 NeuroPixel 输出质量仍能打，客户也更愿意用「已经长在工作流里的东西」。\n深层机制：AI 时代的护城河不是模型质量\n当你的护城河只是「模型更好」，而模型进步速度不由你控制时，你其实没有护城河。AI 创业的壁垒必须来自数据、分发、品牌或工作流集成——纯模型质量的领先，保质期只有几个月。\n致命一击：最大客户倒闭拖欠 6 个月款项\n在压力最大的时候，最大客户倒闭并拖欠超过 6 个月的账款。对已处于下风的创业公司，一笔大额坏账可以单独结束公司。",  // 详细 post-mortem
    sources: ["Failory Newsletter（Too Early To AI）", "调研报告"],  // 来源链接
    founderBg: "CEO Arvind Venugopal Nair 及团队",  // 创始人背景
    epitaph: "做了四年「时尚行业专用 AI 图像」深度 IP，服务 Myntra、Fabindia、Decathlon 等品牌——然后通用大模型一夜之间赶上了它。「我们被碾压了，就在 2025 年底的某个夜晚。」",  // 墓碑摘要
    motivation: "NeuroPixel 成立于 2020 年，赌注是「时尚行业需要专门的图像生成模型」：声称能把目录生产时间缩短 90%、图像生产成本降低 70%。它没有错过 GenAI 浪潮，甚至抓得很早。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因：通用 AI 模型进步太快，专用工具失去技术优势", detail: "CEO 说公司「massively outgunned overnight sometime in late 2025」。前沿图像模型的能力曲线陡峭到超出任何创业者的预期，专业模型的边际优势在几个月内蒸发。" },
      { layer: "中间机制：分销比产品质量更重要", detail: "客户自然流向已集成到更大生态的工具：API、企业关系、海量算力、现成用户群。即使 NeuroPixel 输出质量仍能打，客户也更愿意用「已经长在工作流里的东西」。" },
      { layer: "深层机制：AI 时代的护城河不是模型质量", detail: "当你的护城河只是「模型更好」，而模型进步速度不由你控制时，你其实没有护城河。AI 创业的壁垒必须来自数据、分发、品牌或工作流集成——纯模型质量的领先，保质期只有几个月。" },
      { layer: "致命一击：最大客户倒闭拖欠 6 个月款项", detail: "在压力最大的时候，最大客户倒闭并拖欠超过 6 个月的账款。对已处于下风的创业公司，一笔大额坏账可以单独结束公司。" },
    ],
    lessons: [  // 教训与避坑清单
      "AI 工具创业别赌「模型永远差我们一点」——通用模型的进步速度不受你控制",
      "尽早建立分销和客户工作流集成，技术优势会过期，关系不会",
      "大客户集中度过高是定时炸弹：应收账款管理是 AI 创业的隐形生死线",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "chitu-zhineng",  // 赤兔智能工业
    name: "赤兔智能工业",  // 基础：公司名
    status: "pivoted",  // dead | acquired | pivoted
    foundedYear: "2024",  // 成立年份
    closedYear: "2025",  // 关闭年份
    region: "中国苏州",  // 国家/地区
    industry: "工业 AI 智能体",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 12,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2024", type: "成立", event: "成立，自研「飒露紫」智能体，切入工业场景" },
      { date: "2025 前段", type: "危机", event: "斩获某车企 30 万元软件采购订单，验证了产品价值" },
      { date: "2025 中段", type: "危机", event: "大订单交付后陷入订单断档，无持续新客户流入" },
      { date: "2025 后段", type: "危机", event: "入驻苏州 OPC 社区，借助苏州市人工智能协会资源对接，业务才得以重启" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "赤兔智能工业选择了一条「重」的路：自研工业智能体进入制造业场景。工业软件单价高、付费意愿真实，但销售周期长、决策链复杂——这正是 OPC 最不擅长的战场。",  // 编辑摘要
    postmortem: "表层原因：订单断档，无法建立持续收入\n一个 30 万的订单能证明产品有人要，但一人团队没有销售体系去复制它。交付完一单，下一单遥遥无期。\n中间机制：OPC 缺乏组织化的客户获取能力\n工业客户的采购决策依赖人脉、资质、信任与漫长的销售周期。这些能力无法被 AI 工具替代，也难以由一个人同时承担「交付」和「销售」。\n深层机制：ToB 大单是 OPC 的陷阱\n大客户依赖症在 OPC 中被放大：一单 30 万可能覆盖一年成本，但它的存在反而掩盖了「没有获客体系」这个致命问题。当大单耗尽，公司立刻回到零收入状态。",  // 详细 post-mortem
    sources: ["调研报告（苏州 OPC 社区案例）"],  // 来源链接
    founderBg: "工业智能化创业者",  // 创始人背景
    epitaph: "自研「飒露紫」工业智能体，曾拿下车企 30 万元软件采购订单——然后陷入订单断档，无法持续获取新客户。大客户的一笔大单，反而成了最深的坑。",  // 墓碑摘要
    motivation: "赤兔智能工业选择了一条「重」的路：自研工业智能体进入制造业场景。工业软件单价高、付费意愿真实，但销售周期长、决策链复杂——这正是 OPC 最不擅长的战场。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因：订单断档，无法建立持续收入", detail: "一个 30 万的订单能证明产品有人要，但一人团队没有销售体系去复制它。交付完一单，下一单遥遥无期。" },
      { layer: "中间机制：OPC 缺乏组织化的客户获取能力", detail: "工业客户的采购决策依赖人脉、资质、信任与漫长的销售周期。这些能力无法被 AI 工具替代，也难以由一个人同时承担「交付」和「销售」。" },
      { layer: "深层机制：ToB 大单是 OPC 的陷阱", detail: "大客户依赖症在 OPC 中被放大：一单 30 万可能覆盖一年成本，但它的存在反而掩盖了「没有获客体系」这个致命问题。当大单耗尽，公司立刻回到零收入状态。" },
    ],
    lessons: [  // 教训与避坑清单
      "拿到大单不等于商业模式成立，先问自己：下一单从哪里来？",
      "OPC 做 ToB 必须前置建立获客渠道（社区、协会、合作伙伴），而不是靠单点突破",
      "把一次项目交付转化为经常性收入（维护、订阅、按效果付费），否则永远是「打一单吃一单」",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "hexiangzhu-ai",  // 合香珠 AI 创业项目
    name: "合香珠 AI 创业项目",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2025",  // 成立年份
    closedYear: "2026",  // 关闭年份
    region: "中国",  // 国家/地区
    industry: "AI + 传统工艺电商",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 6,  // 存活时长
    totalFunding: "约 3 万元",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "需求验证缺失",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2025", type: "成立", event: "启动合香珠 AI 创业项目，投入约 3 万元" },
      { date: "2025-2026", type: "产品发布", event: "AI 文案、视觉、运营陆续上线，但产品核心无法突破" },
      { date: "2026 前段", type: "危机", event: "香方配比、供应链、原材料稳定性连环出问题" },
      { date: "2026 中段", type: "危机", event: "项目注销退场" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "郭琪想用 AI 改造传统合香珠生意：AI 写文案、做设计、管运营，把一门传统手艺变成「AI + 电商」的轻创业。这个想法在 OPC 浪潮里非常典型——AI 负责一切「可复制」的部分。",  // 编辑摘要
    postmortem: "表层原因：产品交付不稳定\n每一批香粉的湿度、纯度稍有不同，AI 给出的「完美配比」就瞬间失效。合香珠的质量依赖老师傅的经验与供应链把控，AI 替代不了。\n中间机制：AI 只覆盖了「表达层」，没覆盖「价值层」\nAI 能解决文案、图片、营销这些「怎么卖」的问题，但解决不了「产品本身好不好」的问题。当产品价值依赖非标准化的工艺与供应链，AI 的杠杆就失灵了。\n深层机制：轻资产幻觉撞上重供应链现实\nOPC 模式的前提是「产品可以数字化生产」。合香珠是实物、是工艺、是供应链生意——AI 一人公司在这类赛道里，只是在轻资产的壳里做着重资产的活。",  // 详细 post-mortem
    sources: ["36氪（3万", "半年", "注销）"],  // 来源链接
    founderBg: "郭琪，跨界创业者",  // 创始人背景
    epitaph: "3 万投入、半年注销。AI 能写出漂亮的文案，却调不出一味合格的香料——合香珠的核心是「香方配比」，那是老师傅几十年的经验，不是代码。",  // 墓碑摘要
    motivation: "郭琪想用 AI 改造传统合香珠生意：AI 写文案、做设计、管运营，把一门传统手艺变成「AI + 电商」的轻创业。这个想法在 OPC 浪潮里非常典型——AI 负责一切「可复制」的部分。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因：产品交付不稳定", detail: "每一批香粉的湿度、纯度稍有不同，AI 给出的「完美配比」就瞬间失效。合香珠的质量依赖老师傅的经验与供应链把控，AI 替代不了。" },
      { layer: "中间机制：AI 只覆盖了「表达层」，没覆盖「价值层」", detail: "AI 能解决文案、图片、营销这些「怎么卖」的问题，但解决不了「产品本身好不好」的问题。当产品价值依赖非标准化的工艺与供应链，AI 的杠杆就失灵了。" },
      { layer: "深层机制：轻资产幻觉撞上重供应链现实", detail: "OPC 模式的前提是「产品可以数字化生产」。合香珠是实物、是工艺、是供应链生意——AI 一人公司在这类赛道里，只是在轻资产的壳里做着重资产的活。" },
    ],
    lessons: [  // 教训与避坑清单
      "先分清你的产品是「数字产品」还是「物理产品」——AI 只对前者有真正的杠杆",
      "供应链和工艺壁垒不能用 AI 抹平，选赛道前先问：最难的部分是不是 AI 能做的？",
      "小投入不代表小风险：3 万块和时间成本同样是真实投入，退场前做好最小验证",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "ai-stock-tool",  // AI 智能选股工具
    name: "AI 智能选股工具",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2025",  // 成立年份
    closedYear: "2026",  // 关闭年份
    region: "中国",  // 国家/地区
    industry: "AI 金融工具",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 6,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "合规与决策风险",  // 主标签（六死因）
    secondaryTags: ["监管处罚", "数据泄露"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2025", type: "成立", event: "启动 AI 智能选股工具开发" },
      { date: "2025-2026", type: "危机", event: "产品功能完成，但 A 股实时数据接口缺失/成本高企" },
      { date: "2026 前段", type: "危机", event: "无法以可负担的方式获得合规实时数据，项目失败" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "开发者看到 AI 热潮，认为「AI + 股票分析」是必然风口：AI 读财报、算指标、给建议。工具开发顺利，但商业化需要 A 股实时行情数据。",  // 编辑摘要
    postmortem: "表层原因：数据接口缺失，产品无法落地\nA 股实时数据是金融工具的血液。个人开发者很难拿到合规、稳定、可负担的数据源，产品功能再完整也只能停留在 Demo。\n中间机制：数据即合规，金融行业的数据门槛是资本门槛\n金融数据接口不仅是技术问题，更是牌照与合规问题。个人 OPC 面对的是机构玩家的护城河——数据授权、合规审查、成本结构。\n深层机制：选赛道时没盘点「上游依赖」\n任何产品的商业模式都依赖上游。OPC 创业者往往只评估「我能不能做出来」，忽略了「我能不能拿到做出来所需的上游资源」——数据、API、供应链、资质。",  // 详细 post-mortem
    sources: ["DoNews（五位一人公司创业者实录）"],  // 来源链接
    founderBg: "独立开发者（DoNews 实录）",  // 创始人背景
    epitaph: "开发 AI 智能选股工具，却因 A 股实时数据接口缺失而失败——产品做得再好，拿不到合规的数据源，一切都是空中楼阁。",  // 墓碑摘要
    motivation: "开发者看到 AI 热潮，认为「AI + 股票分析」是必然风口：AI 读财报、算指标、给建议。工具开发顺利，但商业化需要 A 股实时行情数据。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因：数据接口缺失，产品无法落地", detail: "A 股实时数据是金融工具的血液。个人开发者很难拿到合规、稳定、可负担的数据源，产品功能再完整也只能停留在 Demo。" },
      { layer: "中间机制：数据即合规，金融行业的数据门槛是资本门槛", detail: "金融数据接口不仅是技术问题，更是牌照与合规问题。个人 OPC 面对的是机构玩家的护城河——数据授权、合规审查、成本结构。" },
      { layer: "深层机制：选赛道时没盘点「上游依赖」", detail: "任何产品的商业模式都依赖上游。OPC 创业者往往只评估「我能不能做出来」，忽略了「我能不能拿到做出来所需的上游资源」——数据、API、供应链、资质。" },
    ],
    lessons: [  // 教训与避坑清单
      "动工前盘点上游依赖：数据源、API、资质、供应链，每一项都可能是隐形门槛",
      "强监管行业的数据成本与合规成本远超个人创业者想象，先做成本测算再投入",
      "AI 能做好「分析层」，但「数据层」的获得能力决定金融工具能否商业化",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "architect-zero-income",  // 大厂架构师的半年零收入
    name: "大厂架构师的半年零收入",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2025",  // 成立年份
    closedYear: "2026",  // 关闭年份
    region: "中国",  // 国家/地区
    industry: "AI 咨询 / 软件",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 6,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "获客失败",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2025 中段", type: "关键招聘", event: "离职，正式投入 OPC" },
      { date: "2025-2026", type: "危机", event: "半年内未能获得收入，个人品牌与销售渠道未建立" },
      { date: "2026", type: "危机", event: "项目停滞/放弃" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "资深架构师带着十多年技术积累离开大厂，想用 AI + 专业能力服务中小企业。技术栈完备、执行力强，但服务型 OPC 的获客依赖个人品牌与信任积累。",  // 编辑摘要
    postmortem: "表层原因：没有客户\n专业能力不等于客户来源。没有可触达的渠道、没有可验证的案例、没有持续的内容输出，潜在客户根本不知道你的存在。\n中间机制：服务型 OPC 的获客=信任前置\n企业采购技术咨询或外包服务，买的是信任。信任需要时间积累：内容、案例、口碑、人脉。AI 能帮你写方案，但帮你不了「让人信任你」。\n深层机制：把「离职」当成了「客户会来」\nOPC 创业最危险的假设是「我技术好所以有人买单」。技术是必要条件，但获客、定价、交付、收款是四条完全不同的能力。大厂的光环会消失，而独立市场的规则完全不同。",  // 详细 post-mortem
    sources: ["DoNews（五位一人公司创业者实录）"],  // 来源链接
    founderBg: "前大厂架构师",  // 创始人背景
    epitaph: "大厂架构师离职做 OPC，半年零收入。技术能力是行业顶级的，但「别人不知道你、不信任你、找不到你」——能力不会自动变成客户。",  // 墓碑摘要
    motivation: "资深架构师带着十多年技术积累离开大厂，想用 AI + 专业能力服务中小企业。技术栈完备、执行力强，但服务型 OPC 的获客依赖个人品牌与信任积累。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因：没有客户", detail: "专业能力不等于客户来源。没有可触达的渠道、没有可验证的案例、没有持续的内容输出，潜在客户根本不知道你的存在。" },
      { layer: "中间机制：服务型 OPC 的获客=信任前置", detail: "企业采购技术咨询或外包服务，买的是信任。信任需要时间积累：内容、案例、口碑、人脉。AI 能帮你写方案，但帮你不了「让人信任你」。" },
      { layer: "深层机制：把「离职」当成了「客户会来」", detail: "OPC 创业最危险的假设是「我技术好所以有人买单」。技术是必要条件，但获客、定价、交付、收款是四条完全不同的能力。大厂的光环会消失，而独立市场的规则完全不同。" },
    ],
    lessons: [  // 教训与避坑清单
      "做服务型 OPC，先用 3 个月建立「内容 + 人脉」获客管道，再离职",
      "第一单的价值不是钱，是案例：哪怕低价也要先拿到可验证的交付记录",
      "技术专家转 OPC 最缺的不是技术，而是销售、定价和客户管理",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "twice-opc-programmer",  // 两度折戟的 OPC 程序员
    name: "两度折戟的 OPC 程序员",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2025",  // 成立年份
    closedYear: "2026",  // 关闭年份
    region: "中国",  // 国家/地区
    industry: "软件外包 / 产品",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 12,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2025 上", type: "危机", event: "第一次 OPC：接单开发，客户中途毁约，项目中止" },
      { date: "2025 下", type: "危机", event: "第二次 OPC：再次接单，尾款被长期拖欠" },
      { date: "2026", type: "危机", event: "合作方失能，项目最终中止" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "程序员认为「接单开发」是 OPC 最稳妥的起步：有人付钱、技术可控、不需要获客创新。第一次接单顺利启动，直到客户中途毁约。",  // 编辑摘要
    postmortem: "表层原因：客户与回款风险\n外包模式的现金流完全系于客户信用。一人公司没有法务、没有预付款机制、没有团队分摊风险，一次毁约或一笔坏账就足以让项目归零。\n中间机制：用时间换钱的模式，AI 改变不了回款结构\nAI 提高了开发速度，但外包的定价、收款、合同结构没有变。AI 让你干得更快，也让你更快地发现自己赚的是「被拖欠的钱」。\n深层机制：外包不是生意，是换一种形式打工\n按项目收费的外包本质是把自己的时间零售出去。OPC 的价值在于「产品化」——一份投入可以被重复售卖。外包模式的规模上限、回款风险与情绪消耗，AI 都无法解决。",  // 详细 post-mortem
    sources: ["DoNews（五位一人公司创业者实录）"],  // 来源链接
    founderBg: "程序员（DoNews 实录）",  // 创始人背景
    epitaph: "两度投身 OPC，两度中止——一次客户毁约，一次尾款拖欠，中间还夹着合作方失能。一个人可以扛下所有开发，但扛不下别人的失信。",  // 墓碑摘要
    motivation: "程序员认为「接单开发」是 OPC 最稳妥的起步：有人付钱、技术可控、不需要获客创新。第一次接单顺利启动，直到客户中途毁约。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因：客户与回款风险", detail: "外包模式的现金流完全系于客户信用。一人公司没有法务、没有预付款机制、没有团队分摊风险，一次毁约或一笔坏账就足以让项目归零。" },
      { layer: "中间机制：用时间换钱的模式，AI 改变不了回款结构", detail: "AI 提高了开发速度，但外包的定价、收款、合同结构没有变。AI 让你干得更快，也让你更快地发现自己赚的是「被拖欠的钱」。" },
      { layer: "深层机制：外包不是生意，是换一种形式打工", detail: "按项目收费的外包本质是把自己的时间零售出去。OPC 的价值在于「产品化」——一份投入可以被重复售卖。外包模式的规模上限、回款风险与情绪消耗，AI 都无法解决。" },
    ],
    lessons: [  // 教训与避坑清单
      "外包接单前必须设计收款结构：预付 + 里程碑 + 尾款分拆，合同和担保比技术更重要",
      "警惕「客户毁约、尾款拖欠、合作方失能」三连击：一人公司没有容错空间，合作对象比项目本身更重要",
      "想清楚外包 vs 产品：AI 时代做产品的时间成本已经大幅降低，外包是把 AI 的红利让给了客户",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "four-unused-ai-tools",  // 四款无人使用的 AI 工具
    name: "四款无人使用的 AI 工具",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2025",  // 成立年份
    closedYear: "2026",  // 关闭年份
    region: "中国",  // 国家/地区
    industry: "AI 工具产品",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 4,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "需求验证缺失",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2025 底", type: "成立", event: "启动 OPC，开始快速生产 AI 工具" },
      { date: "2026 初", type: "产品发布", event: "4 个月内连续上线 4 款 AI 工具" },
      { date: "2026 初-中", type: "危机", event: "4 款产品均无人使用，账面收入趋近于零" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "产品经理把 AI 工具创业当成「快速试错」：AI 让开发成本降到几乎为零，那就多做几个，总有一个能成。四个月，四款产品，全部无人使用。",  // 编辑摘要
    postmortem: "表层原因：产品没有用户\n四款产品都没有触达真实用户，更没有付费用户。开发速度快得惊人，但「被使用」这个环节完全缺席。\n中间机制：AI 降低了试错成本，也取消了「想清楚」的环节\n当开发成本趋近于零，「先做再想」变得毫无心理负担。但需求验证恰恰是 AI 不能替代的：你得先知道有人要，再动手做。快速生产掩盖了「从不验证需求」的事实。\n深层机制：把「数量」当成了「策略」\n多做几个产品不是策略，是逃避选择。真正的 OPC 成功者（Pieter Levels、Marc Lou）是「高频试错」没错，但每个试错都带着明确的验证假设与获客动作，而不是盲目发射。",  // 详细 post-mortem
    sources: ["DoNews（五位一人公司创业者实录）"],  // 来源链接
    founderBg: "产品经理（DoNews 实录）",  // 创始人背景
    epitaph: "四个月内上线四款 AI 工具，账面总收入趋近于零。开发速度是 AI 给的，方向却是自己拍的——AI 让「做出来」变快了，也让「做错」变快了。",  // 墓碑摘要
    motivation: "产品经理把 AI 工具创业当成「快速试错」：AI 让开发成本降到几乎为零，那就多做几个，总有一个能成。四个月，四款产品，全部无人使用。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因：产品没有用户", detail: "四款产品都没有触达真实用户，更没有付费用户。开发速度快得惊人，但「被使用」这个环节完全缺席。" },
      { layer: "中间机制：AI 降低了试错成本，也取消了「想清楚」的环节", detail: "当开发成本趋近于零，「先做再想」变得毫无心理负担。但需求验证恰恰是 AI 不能替代的：你得先知道有人要，再动手做。快速生产掩盖了「从不验证需求」的事实。" },
      { layer: "深层机制：把「数量」当成了「策略」", detail: "多做几个产品不是策略，是逃避选择。真正的 OPC 成功者（Pieter Levels、Marc Lou）是「高频试错」没错，但每个试错都带着明确的验证假设与获客动作，而不是盲目发射。" },
    ],
    lessons: [  // 教训与避坑清单
      "AI 时代最大的陷阱是「做出来太容易」：每个产品上线前先写清楚：为谁解决什么问题？怎么触达他们？",
      "试错的正确姿势是「验证需求」而不是「开发产品」——先用落地页/访谈/原型验证，再写代码",
      "连续失败四次的共同点，就是没有一次做过需求验证",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "charlie-labs",  // Charlie Labs
    name: "Charlie Labs",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2024",  // 成立年份
    closedYear: "2026-10",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "AI 工程师工具",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 24,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "同质化竞争",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2024", type: "成立", event: "成立，定位 AI 工程师智能体" },
      { date: "2025", type: "危机", event: "Claude、Codex 等通用 Agent 能力快速逼近" },
      { date: "2026-10", type: "关闭", event: "宣布关停：通用 AI 工程师能力已内置到头部模型生态" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "Charlie Labs 押注「AI 工程师」这一细分：为企业提供自动化编码、测试与修复的智能体。方向看起来无比正确——但巨头也在做同样的事，而且做得更快。",  // 编辑摘要
    postmortem: "表层原因：通用模型内置了产品能力\n当 Claude/Codex 原生就能完成「AI 工程师」的工作时，单独的产品层价值消失。用户直接用模型生态内的工具，不再需要第三方封装。\n中间机制：与平台竞争没有胜算\n创业公司的 AI 智能体依赖头部模型的 API。当模型厂商自己把智能体做成产品时，创业公司同时失去了「供应商」和「客户」——这是结构性劣势。\n深层机制：AI 创业的「中间层诅咒」\n在模型与用户之间做「薄封装」的 AI 创业，永远面临被上游模型「向下吞噬」的风险。价值必须建在模型生态之外：专有数据、工作流集成、垂直行业理解。",  // 详细 post-mortem
    sources: ["Failory Newsletter（Who Needs Charlie?）"],  // 来源链接
    founderBg: "AI 工程师创业者",  // 创始人背景
    epitaph: "又一个 AI 工程师产品关停了。当 Claude 和 Codex 自己就能写代码、跑测试、修 bug 时，专门做「AI 工程师」的创业公司，成了被 AI 干掉的 AI 公司。",  // 墓碑摘要
    motivation: "Charlie Labs 押注「AI 工程师」这一细分：为企业提供自动化编码、测试与修复的智能体。方向看起来无比正确——但巨头也在做同样的事，而且做得更快。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因：通用模型内置了产品能力", detail: "当 Claude/Codex 原生就能完成「AI 工程师」的工作时，单独的产品层价值消失。用户直接用模型生态内的工具，不再需要第三方封装。" },
      { layer: "中间机制：与平台竞争没有胜算", detail: "创业公司的 AI 智能体依赖头部模型的 API。当模型厂商自己把智能体做成产品时，创业公司同时失去了「供应商」和「客户」——这是结构性劣势。" },
      { layer: "深层机制：AI 创业的「中间层诅咒」", detail: "在模型与用户之间做「薄封装」的 AI 创业，永远面临被上游模型「向下吞噬」的风险。价值必须建在模型生态之外：专有数据、工作流集成、垂直行业理解。" },
    ],
    lessons: [  // 教训与避坑清单
      "AI 创业要问的不是「这个功能能不能做」，而是「这个功能会不会被模型厂商顺手做了」",
      "依赖头部模型 API 的产品，必须警惕「平台向下吞噬」——把价值建在数据与工作流上",
      "关注模型能力路线图，给产品留出差异化的生存空间",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "liaoran-ai-t-shirt",  // 廖然 · AI 文创电商
    name: "廖然 · AI 文创电商",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2025-10",  // 成立年份
    closedYear: "2026",  // 关闭年份
    region: "中国",  // 国家/地区
    industry: "AI 文创电商",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 6,  // 存活时长
    totalFunding: "约 3 万元（个人积蓄）",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "同质化竞争",  // 主标签（六死因）
    secondaryTags: ["恶性竞争"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2025-10", type: "成立", event: "辞职创业，投入 3 万积蓄启动宠物 AI 文创电商" },
      { date: "2025-11", type: "产品发布", event: "上线店铺，用 AI 批量生成卡通设计、上架 T 恤与帆布包" },
      { date: "2026-01", type: "危机", event: "发现全网同款泛滥：AI 让所有人都能做出一样的卡通设计，价格被卷到 19.9 元" },
      { date: "2026", type: "危机", event: "五险一金、库存与推广持续吞噬现金，3 万积蓄耗尽" },
      { date: "2026", type: "危机", event: "注销公司，重回职场" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "廖然原以为 AI 能让他用最少的成本把「设计」这门手艺工业化：上传宠物照片，AI 生成卡通形象，印在 T 恤和帆布包上，主打「治愈感 + 个性化」。辞职时他相信这是 AI 时代最小可行的生意——设计零门槛、生产外包、线上开店。",  // 编辑摘要
    postmortem: "表层原因：AI 抹平了设计门槛，也抹平了差异\n廖然以为 AI 是护城河，实际上 AI 把设计能力变成了公共资源。他做出来的宠物卡通图，和成千上万个同样用 AI 的人做出来的一模一样——差异化消失，只能打价格战。\n中间机制：创意无壁垒 + 固定成本压顶\n当产品没有独特壁垒时，定价权归平台与同行。19.9 元的客单价扣掉生产成本、快递与平台抽成后所剩无几，而每月的社保公积金、库存与推广费用是刚性支出——收入端萎缩，成本端刚性，现金流迅速归零。\n深层机制：把「AI 能做什么」误当成「用户会为什么付钱」\nAI 让「做出来」变得极其廉价，但商业的本质是「有人愿意为差异化的价值付钱」。当供给被 AI 无限放大而需求没有同步增长时，商品化不可避免。廖然的教训不是别用 AI，而是别把 AI 的通用能力当成自己的核心竞争力。",  // 详细 post-mortem
    sources: ["澎湃新闻"],  // 来源链接
    founderBg: "95 后，前大厂员工",  // 创始人背景
    epitaph: "95 后前大厂员工，用 3 万积蓄半年做宠物照片转卡通 T 恤的 AI 文创生意，最后全网同款卖 19.9 元、月固定成本近 3000 元，半年烧光积蓄注销回职场。「AI 给了所有人一支画笔，大多数人画出一模一样的图案。」",  // 墓碑摘要
    motivation: "廖然原以为 AI 能让他用最少的成本把「设计」这门手艺工业化：上传宠物照片，AI 生成卡通形象，印在 T 恤和帆布包上，主打「治愈感 + 个性化」。辞职时他相信这是 AI 时代最小可行的生意——设计零门槛、生产外包、线上开店。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因：AI 抹平了设计门槛，也抹平了差异", detail: "廖然以为 AI 是护城河，实际上 AI 把设计能力变成了公共资源。他做出来的宠物卡通图，和成千上万个同样用 AI 的人做出来的一模一样——差异化消失，只能打价格战。" },
      { layer: "中间机制：创意无壁垒 + 固定成本压顶", detail: "当产品没有独特壁垒时，定价权归平台与同行。19.9 元的客单价扣掉生产成本、快递与平台抽成后所剩无几，而每月的社保公积金、库存与推广费用是刚性支出——收入端萎缩，成本端刚性，现金流迅速归零。" },
      { layer: "深层机制：把「AI 能做什么」误当成「用户会为什么付钱」", detail: "AI 让「做出来」变得极其廉价，但商业的本质是「有人愿意为差异化的价值付钱」。当供给被 AI 无限放大而需求没有同步增长时，商品化不可避免。廖然的教训不是别用 AI，而是别把 AI 的通用能力当成自己的核心竞争力。" },
    ],
    lessons: [  // 教训与避坑清单
      "AI 提供的通用能力不是护城河——稀缺的永远是数据、渠道、品牌与真实客户关系",
      "算清固定成本再创业：月固定支出必须由已验证的毛利覆盖，而不是靠积蓄硬扛",
      "「做出来就有人买单」是顺序错误：先找到愿意付钱的客户，再动手做产品",
      "避开价格战的方法只有一个——做 AI 做不到的差异化：独家供应链、真实 IP、深度服务",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "jingen-ai-editor",  // 景恩 · AI 剪辑工具
    name: "景恩 · AI 剪辑工具",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2024-12",  // 成立年份
    closedYear: "2025-12",  // 关闭年份
    region: "中国",  // 国家/地区
    industry: "AI 视频剪辑（toB）",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 12,  // 存活时长
    totalFunding: "累计投入超 320 万元",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "融资",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: ["资金断裂"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2024-12", type: "成立", event: "拿到第一笔资金，项目启动" },
      { date: "2025-04", type: "危机", event: "进入开发阶段，团队搭建完成" },
      { date: "2025-07-30", type: "产品发布", event: "首个版本上线，累计 5000 种子用户" },
      { date: "2025-08", type: "危机", event: "收到 20 笔付费订单（约 2000 元/笔），周留存从 13% 提升到 17.5%" },
      { date: "2025-12-05", type: "关闭", event: "投资人突然宣布撤资（主营业务收缩），要求三天内关停" },
      { date: "2025-12-08", type: "关闭", event: "项目正式关停，团队解散" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "景恩在跨境电商和数据分析领域积累多年，被投资人看中后以「内部孵化」身份创业，做面向企业的 AI 视频剪辑工具。他以为拿到了资金和渠道的双重保障，却没想到融资来源越单一，命运就越不掌握在自己手里。",  // 编辑摘要
    postmortem: "表层原因：唯一投资人撤资，现金流瞬间断裂\n项目全部资金来自单一投资人。对方因自身主营业务收缩决定撤资，三天内项目必须关停——产品指标明明在变好（留存提升、有付费），但资金供给方一撤，一切归零。\n中间机制：内部孵化模式把命脉交到了别人手里\n「投资人内部孵化」意味着景恩没有独立融资能力、没有多元资金来源，甚至连客户渠道都依附于投资人。公司像金主手里的一个项目，而不是一个有独立生命力的组织。\n深层机制：商业模式依赖他人意志，而非市场验证\n真正的商业安全，来自「客户愿意付费」的市场闭环，而不是「投资人愿意继续投」的资本意愿。景恩的 20 笔付费订单证明需求存在，但量级太小、速度太慢，来不及在撤资前形成自我造血。",  // 详细 post-mortem
    sources: ["36氪"],  // 来源链接
    founderBg: "33 岁，跨境电商 / 数据分析背景，投资人内部孵化",  // 创始人背景
    epitaph: "投资人内部孵化的 AI 剪辑工具：拿钱、开发、上线、撤资、关停，一年走完。320 万投入、5000 种子用户、20 笔付费订单、周留存做到 17.5%——产品在变好，但唯一金主突然撤资，三天后项目归零。",  // 墓碑摘要
    motivation: "景恩在跨境电商和数据分析领域积累多年，被投资人看中后以「内部孵化」身份创业，做面向企业的 AI 视频剪辑工具。他以为拿到了资金和渠道的双重保障，却没想到融资来源越单一，命运就越不掌握在自己手里。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因：唯一投资人撤资，现金流瞬间断裂", detail: "项目全部资金来自单一投资人。对方因自身主营业务收缩决定撤资，三天内项目必须关停——产品指标明明在变好（留存提升、有付费），但资金供给方一撤，一切归零。" },
      { layer: "中间机制：内部孵化模式把命脉交到了别人手里", detail: "「投资人内部孵化」意味着景恩没有独立融资能力、没有多元资金来源，甚至连客户渠道都依附于投资人。公司像金主手里的一个项目，而不是一个有独立生命力的组织。" },
      { layer: "深层机制：商业模式依赖他人意志，而非市场验证", detail: "真正的商业安全，来自「客户愿意付费」的市场闭环，而不是「投资人愿意继续投」的资本意愿。景恩的 20 笔付费订单证明需求存在，但量级太小、速度太慢，来不及在撤资前形成自我造血。" },
    ],
    lessons: [  // 教训与避坑清单
      "融资来源越单一，抗风险能力越弱——至少要有 2 个以上独立资金来源或足够长的现金跑道",
      "「内部孵化」的便宜资金有隐形价格：你的命运由金主的战略决定，随时可能被砍",
      "付费验证要跑得比资本耐心快：20 笔订单证明不了商业模式，要的是可规模化的付费曲线",
      "拿到钱的第一天就要规划：如果明天撤资，我靠什么活下来？",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "phind-ai-search",  // Phind · 程序员 AI 搜索引擎
    name: "Phind · 程序员 AI 搜索引擎",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2022",  // 成立年份
    closedYear: "2026-01",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "AI 编程搜索",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 48,  // 存活时长
    totalFunding: "融资超 1000 万美元（最后一轮 1040 万美元）",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "融资",  // 自筹 | 融资 | 混合
    primaryTag: "同质化竞争",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2022", type: "成立", event: "成立（YC S22），定位程序员 AI 搜索引擎" },
      { date: "2024-04", type: "危机", event: "流量达到历史峰值，成为开发者常用工具" },
      { date: "2024-2025", type: "危机", event: "ChatGPT、Claude、Perplexity 陆续内置联网搜索，代码问答能力逼近" },
      { date: "2025-12-03", type: "融资", event: "宣布融资 1040 万美元，试图最后冲刺" },
      { date: "2026-01-13", type: "关闭", event: "宣布关停" },
      { date: "2026-01-16", type: "危机", event: "服务正式下线" },
      { date: "2026-01-30", type: "危机", event: "用户数据全部删除" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "Phind 的定位很性感：专门为程序员优化答案的 AI 搜索引擎——代码问答比通用模型更准、更快。2022 年成立（YC S22），一度是开发者工具圈的明星，流量在 2024 年 4 月达到峰值。",  // 编辑摘要
    postmortem: "表层原因：流量被通用模型原生能力吸干\n当 ChatGPT、Claude、Perplexity 都自带联网搜索和代码问答时，「专门做搜索的程序员工具」这个品类失去了存在理由。流量从峰值跌去 91%，是典型的功能被平台吸收。\n中间机制：独立搜索没有数据与生态壁垒\nPhind 的答案质量建立在通用模型 + 网络索引之上，没有独家数据、没有开发者生态绑定。用户切换到 ChatGPT 的成本几乎为零——切换成本为零的生意，护城河为零。\n深层机制：AI 应用的「特征 vs 产品」困境\n很多 AI 创业做的其实是大模型的一个「特征」而非一个「产品」。特征的价值来自模型能力，模型升级时特征会被原生吸收。真正能活下来的 AI 产品，要么有独家数据闭环，要么有用户生态，要么解决了模型做不好的重工作流。",  // 详细 post-mortem
    sources: ["TechUnfoldedAI", "AI Wiki", "36氪"],  // 来源链接
    founderBg: "YC S22，两位创始人",  // 创始人背景
    epitaph: "面向程序员的 AI 搜索引擎，从 2024 年流量巅峰到被 ChatGPT、Claude、Perplexity 的原生联网搜索吸干，流量跌去 91%。2025 年 12 月刚融到 1040 万美元，2026 年 1 月就宣布关停、2 周内下线删库。",  // 墓碑摘要
    motivation: "Phind 的定位很性感：专门为程序员优化答案的 AI 搜索引擎——代码问答比通用模型更准、更快。2022 年成立（YC S22），一度是开发者工具圈的明星，流量在 2024 年 4 月达到峰值。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因：流量被通用模型原生能力吸干", detail: "当 ChatGPT、Claude、Perplexity 都自带联网搜索和代码问答时，「专门做搜索的程序员工具」这个品类失去了存在理由。流量从峰值跌去 91%，是典型的功能被平台吸收。" },
      { layer: "中间机制：独立搜索没有数据与生态壁垒", detail: "Phind 的答案质量建立在通用模型 + 网络索引之上，没有独家数据、没有开发者生态绑定。用户切换到 ChatGPT 的成本几乎为零——切换成本为零的生意，护城河为零。" },
      { layer: "深层机制：AI 应用的「特征 vs 产品」困境", detail: "很多 AI 创业做的其实是大模型的一个「特征」而非一个「产品」。特征的价值来自模型能力，模型升级时特征会被原生吸收。真正能活下来的 AI 产品，要么有独家数据闭环，要么有用户生态，要么解决了模型做不好的重工作流。" },
    ],
    lessons: [  // 教训与避坑清单
      "如果你的产品价值 = 大模型能力的封装，那么模型升级之日就是你的死期",
      "流量跌 91% 时融资续命救不了一家公司——需求消失后，钱只会延长痛苦",
      "工具类 AI 创业要建「切换成本」：独家数据、工作流集成、团队协作绑定",
      "识别「特征 vs 产品」：能原生嵌进头部模型的功能，不要拿来创业",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "tome-ai-deck",  // Tome · AI 演示文稿
    name: "Tome · AI 演示文稿",  // 基础：公司名
    status: "pivoted",  // dead | acquired | pivoted
    foundedYear: "2020",  // 成立年份
    closedYear: "2025-04",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "AI 演示文稿",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 64,  // 存活时长
    totalFunding: "融资约 8100 万美元",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "融资",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2020", type: "成立", event: "成立，创始人来自 Meta/Instagram 产品线" },
      { date: "2022-09", type: "产品发布", event: "上线，134 天突破 100 万用户，称当时生产力软件最快纪录" },
      { date: "2023-02", type: "融资", event: "完成 4300 万美元 B 轮，估值 3 亿美元" },
      { date: "2024-04", type: "危机", event: "裁掉约 20% 团队（59 人中裁 20%），转向企业销售" },
      { date: "2024-12", type: "融资", event: "累计 2500 万用户，年收入仅约 300 万美元，账上还剩一半融资" },
      { date: "2025-04-30", type: "关闭", event: "Tome Slides 正式停止服务，用户内容不可访问" },
      { date: "2025-11", type: "产品发布", event: "6 人团队推出 AI CRM Lightfield，重新出发" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "Tome 曾是第一波生成式 AI 创业热潮的代表：输入一句话，生成整套演示文稿。2022 年 9 月上线后 134 天破百万用户，投资人包括 LinkedIn 创始人 Reid Hoffman、Google 前 CEO Eric Schmidt，估值一度 3 亿美元。",  // 编辑摘要
    postmortem: "表层原因：2500 万用户里几乎没有付费用户\nTome 的用户增长是现象级的，但绝大多数用户停在免费版：学生做一次课堂作业、普通用户偶尔做一次 PPT，用完即走。年收入 300 万美元对应 2500 万用户，付费率低得可怜。\n中间机制：产品不是「mission-critical」\n创始人 Keith Peiris 事后评价：产品有增长，但不是企业非用不可的核心工具。大模型擅长把 0 做到 60 分（帮你跨过空白页），但大量真正值钱的专业工作，难点恰恰不在 60 分之前——这是 AI 生产力工具普遍的商业化天花板。\n深层机制：增长指标误导了商业判断\nTome 的故事说明「用户很多」可能是 AI 创业最危险的指标。融资逻辑追逐 MAU 神话，但商业逻辑只看复购与毛利。当增长叙事与付费现实脱节时，再多的用户也只是展示性的繁荣。",  // 详细 post-mortem
    sources: ["人人都是产品经理", "AI Wiki", "36氪"],  // 来源链接
    founderBg: "Keith Peiris & Henri Liriani，前 Meta/Instagram 产品负责人",  // 创始人背景
    epitaph: "134 天破 100 万用户、累计 2500 万用户、融资 8100 万美元的 AI 演示文稿爆款，2024 年底年收入却只有约 300 万美元。创始人裁掉两成团队转企业销售也没能救活，2025 年 4 月 30 日主动关停，6 人团队转做 AI CRM。",  // 墓碑摘要
    motivation: "Tome 曾是第一波生成式 AI 创业热潮的代表：输入一句话，生成整套演示文稿。2022 年 9 月上线后 134 天破百万用户，投资人包括 LinkedIn 创始人 Reid Hoffman、Google 前 CEO Eric Schmidt，估值一度 3 亿美元。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因：2500 万用户里几乎没有付费用户", detail: "Tome 的用户增长是现象级的，但绝大多数用户停在免费版：学生做一次课堂作业、普通用户偶尔做一次 PPT，用完即走。年收入 300 万美元对应 2500 万用户，付费率低得可怜。" },
      { layer: "中间机制：产品不是「mission-critical」", detail: "创始人 Keith Peiris 事后评价：产品有增长，但不是企业非用不可的核心工具。大模型擅长把 0 做到 60 分（帮你跨过空白页），但大量真正值钱的专业工作，难点恰恰不在 60 分之前——这是 AI 生产力工具普遍的商业化天花板。" },
      { layer: "深层机制：增长指标误导了商业判断", detail: "Tome 的故事说明「用户很多」可能是 AI 创业最危险的指标。融资逻辑追逐 MAU 神话，但商业逻辑只看复购与毛利。当增长叙事与付费现实脱节时，再多的用户也只是展示性的繁荣。" },
    ],
    lessons: [  // 教训与避坑清单
      "用户量是虚荣指标，付费率与复购才是生意——上线第一天就该设计付费闭环",
      "AI 生产力工具要警惕「60 分陷阱」：大模型把活干到 60 分，用户不愿为剩下的 40 分付费",
      "增长叙事能融资，但不能造血；账上还有一半钱时主动关停，也是一种商业理性",
      "小团队（两张大披萨喂饱）才是转型的生存形态——70 人转型失败，6 人转型成功",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "yupp-ai-eval",  // Yupp.ai · 模型评测平台
    name: "Yupp.ai · 模型评测平台",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2024-06",  // 成立年份
    closedYear: "2026-04",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "AI 模型评测",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 22,  // 存活时长
    totalFunding: "种子轮 3300 万美元",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "融资",  // 自筹 | 融资 | 混合
    primaryTag: "需求验证缺失",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2024-06", type: "成立", event: "成立，种子轮 3300 万美元（a16z crypto 领投，45+ 天使跟投）" },
      { date: "2025-06", type: "产品发布", event: "正式上线，用户可免费对比 500+ 模型并赚积分" },
      { date: "2025 下半年", type: "危机", event: "用户超 130 万，但 Agent 成为行业主题，Chatbot 评测需求骤降" },
      { date: "2026-03-31", type: "关闭", event: "宣布停止服务（创始人称 PMF 不够，剩余资金返还投资人）" },
      { date: "2026-04-15", type: "危机", event: "平台完全下线，存活 22 个月" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "2024 年 6 月成立，创始团队全是硅谷精英：CEO 曾在 Twitter/Google/Coinbase，联合创始人曾是 Google X 机器学习负责人。创业逻辑是构建「人类反馈数据」的双边市场：免费让用户对比数百个模型并投票，把偏好数据卖给模型厂商做 RLHF。",  // 编辑摘要
    postmortem: "表层原因：行业从 Chatbot 转向 Agent，评测市场消失\nYupp 上线时主流交互是 Chatbot——「哪个模型回答得更好」确实有市场。但几个月内行业风向剧变：用户要的是把事情完成的 Agent，不再关心两段文字哪个更好。评测 Chatbot 的需求消失了。\n中间机制：数据质量拼不过专业玩家\nYupp 提供的是普通消费者随手点击的偏好数据，而模型厂商的主流选择是与 Scale AI、Mercor 等合作，用 PhD 级专家提供高质量 RLHF 反馈。质量不在一个量级，客户买单意愿自然低。\n深层机制：需求验证缺失——市场变化比融资烧钱更快\n3300 万美元的豪华种子轮证明资本看好这个方向，但市场验证的是「当下的需求」，而 AI 市场以季度为单位剧变。Yupp 的产品逻辑建立在 Chatbot 时代，当范式切换时，它没有来得及验证和转型。",  // 详细 post-mortem
    sources: ["36氪", "投资界", "Economic Times", "Yupp 官网"],  // 来源链接
    founderBg: "Pankaj Gupta（前 Twitter/Google/Coinbase）联合创业，豪华种子轮",  // 创始人背景
    epitaph: "a16z crypto 领投 3300 万美元、45 位硅谷顶级天使、130 万用户的模型评测平台，上线不到一年就关闭——投资人钱还没花完，AI 技术演进就让它的市场不复存在：行业从 Chatbot 转向 Agent，众包模型评测成了没人需要的旧生意。",  // 墓碑摘要
    motivation: "2024 年 6 月成立，创始团队全是硅谷精英：CEO 曾在 Twitter/Google/Coinbase，联合创始人曾是 Google X 机器学习负责人。创业逻辑是构建「人类反馈数据」的双边市场：免费让用户对比数百个模型并投票，把偏好数据卖给模型厂商做 RLHF。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因：行业从 Chatbot 转向 Agent，评测市场消失", detail: "Yupp 上线时主流交互是 Chatbot——「哪个模型回答得更好」确实有市场。但几个月内行业风向剧变：用户要的是把事情完成的 Agent，不再关心两段文字哪个更好。评测 Chatbot 的需求消失了。" },
      { layer: "中间机制：数据质量拼不过专业玩家", detail: "Yupp 提供的是普通消费者随手点击的偏好数据，而模型厂商的主流选择是与 Scale AI、Mercor 等合作，用 PhD 级专家提供高质量 RLHF 反馈。质量不在一个量级，客户买单意愿自然低。" },
      { layer: "深层机制：需求验证缺失——市场变化比融资烧钱更快", detail: "3300 万美元的豪华种子轮证明资本看好这个方向，但市场验证的是「当下的需求」，而 AI 市场以季度为单位剧变。Yupp 的产品逻辑建立在 Chatbot 时代，当范式切换时，它没有来得及验证和转型。" },
    ],
    lessons: [  // 教训与避坑清单
      "豪华融资不代表需求真实——市场范式切换时，钱只会让失败更体面，不会让失败不发生",
      "AI 创业要持续做需求验证：你的用户需求是否会被上游能力升级直接消灭？",
      "众包数据的商业价值取决于质量壁垒：普通人随手点击的偏好，拼不过专家标注",
      "融资额越大越要警惕「叙事惯性」：投资人相信的是昨天的故事，市场只认明天的需求",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "ai-social-miniapp",  // 校园 AI 社交小程序
    name: "校园 AI 社交小程序",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2026-03",  // 成立年份
    closedYear: "2026-09",  // 关闭年份
    region: "中国",  // 国家/地区
    industry: "AI 社交",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 6,  // 存活时长
    totalFunding: "未披露（个人资金 + AI 工具成本）",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2026-03", type: "成立", event: "一人 + AI 启动 AI 社交小程序项目" },
      { date: "2026 上半年", type: "产品发布", event: "产品上线：次日留存 35%+，付费用户过百且有续费" },
      { date: "2026-09", type: "危机", event: "判断商业模式跑不通，主动暂停项目" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "作者用一个人 + AI 的方式尝试做 AI 社交小程序，最初设想用 AI 重构陌生人社交的效率。产品生产很顺利：AI 承担了开发、运营、客服的大量工作，从 0 到上线周期极短。",  // 编辑摘要
    postmortem: "表层原因：有用户、有付费，但没有可规模化的商业模式\n次日留存 35%+、付费用户过百、有续费——这些指标证明产品有真实需求。但纯线上社交的付费场景单薄，客单价低、复购不稳定，没有跑出可持续的商业模式。\n中间机制：一人公司的「生产成功」不等于「商业成功」\nAI 让生产端变得极其高效，作者把「做出来、有人用、有人付钱」误当成终点。但商业闭环的最后一环——单位经济模型为正且可规模化——没有打通。生产端的成功掩盖了商业端的虚弱。\n深层机制：社交产品的冷启动是伪命题，留存变现才是真命题\n陌生人社交天然面临「关系沉淀后逃离平台」的困境，纯线上形态缺少线下/场景绑定，用户价值难以货币化。AI 能解决生产效率，但解决不了社交品类的商业天花板。",  // 详细 post-mortem
    sources: ["36氪"],  // 来源链接
    founderBg: "36氪作者，一人 + AI 全职创业",  // 创始人背景
    epitaph: "一人 + AI 做纯线上 AI 社交小程序：生产端全面成功——次日留存 35%+、付费用户过百、有真实续费，却因「商业模式没跑通」半年后暂停。产品能做出来、用户留得住、有人付钱，生意还是没成。",  // 墓碑摘要
    motivation: "作者用一个人 + AI 的方式尝试做 AI 社交小程序，最初设想用 AI 重构陌生人社交的效率。产品生产很顺利：AI 承担了开发、运营、客服的大量工作，从 0 到上线周期极短。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因：有用户、有付费，但没有可规模化的商业模式", detail: "次日留存 35%+、付费用户过百、有续费——这些指标证明产品有真实需求。但纯线上社交的付费场景单薄，客单价低、复购不稳定，没有跑出可持续的商业模式。" },
      { layer: "中间机制：一人公司的「生产成功」不等于「商业成功」", detail: "AI 让生产端变得极其高效，作者把「做出来、有人用、有人付钱」误当成终点。但商业闭环的最后一环——单位经济模型为正且可规模化——没有打通。生产端的成功掩盖了商业端的虚弱。" },
      { layer: "深层机制：社交产品的冷启动是伪命题，留存变现才是真命题", detail: "陌生人社交天然面临「关系沉淀后逃离平台」的困境，纯线上形态缺少线下/场景绑定，用户价值难以货币化。AI 能解决生产效率，但解决不了社交品类的商业天花板。" },
    ],
    lessons: [  // 教训与避坑清单
      "留存和付费不等于商业模式：还要验证单位经济模型是否为正、能否规模化",
      "AI 把「做出来」的成本打下来之后，创业难点前移到「卖给谁、怎么持续收钱」",
      "做社交之前先想清楚货币化路径——纯线上陌生人社交的商业天花板普遍很低",
      "一人公司要选「AI 放大个人能力」而非「AI 对抗平台生态」的赛道",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "character-ai",  // Character.AI
    name: "Character.AI",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2021",  // 成立年份
    closedYear: "2026-10",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "AI情感陪伴",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 60,  // 存活时长
    totalFunding: "1.5亿美元A轮融资",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "成本结构失衡",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2021", type: "成立", event: "两位谷歌前AI研究员离职创立Character.AI" },
      { date: "2022-09", type: "产品发布", event: "推出测试版，移动端首周下载量破170万" },
      { date: "2023-03", type: "融资", event: "完成a16z领投的1.5亿美元A轮融资，估值达10亿美元" },
      { date: "2024-08", type: "危机", event: "谷歌获得技术许可并挖走创始人及核心团队" },
      { date: "2026-10", type: "关闭", event: "申请破产保护，迪士尼以2000万美元作为底价竞购" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "两位前谷歌AI研究员离职创业，旨在探索AI在情感陪伴与娱乐领域的巨大潜力。他们希望打破传统AI单纯问答的模式，让用户能够自主创建动漫、历史名人或原创虚构等虚拟角色，并与之进行持续、深度的个性化对话，从而提供独特的情感交互体验。",  // 编辑摘要
    postmortem: "表层原因\n高推理成本与低订阅收入严重倒挂，月运营成本高达3000万美元，9.99美元订阅费无法覆盖算力成本\n深层原因\n商业模式脆弱，付费转化率不足0.7%，免费用户无限制对话导致亏损随用户互动时长增加而扩大\n外部原因\n面临严峻的合规与诉讼风险，青少年自杀等诉讼导致监管收紧，限制未成年人使用直接砍去核心用户群",  // 详细 post-mortem
    sources: ["21世纪经济报道"],  // 来源链接
    founderBg: "两位前谷歌AI研究员",  // 创始人背景
    epitaph: "曾估值10亿美元、月活2000万，\\n却因月均3000万算力成本与不足0.7%的付费率走向破产，\\n最终仅以2000万美元底价拍卖资产。",  // 墓碑摘要
    motivation: "两位前谷歌AI研究员离职创业，旨在探索AI在情感陪伴与娱乐领域的巨大潜力。他们希望打破传统AI单纯问答的模式，让用户能够自主创建动漫、历史名人或原创虚构等虚拟角色，并与之进行持续、深度的个性化对话，从而提供独特的情感交互体验。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "高推理成本与低订阅收入严重倒挂，月运营成本高达3000万美元，9.99美元订阅费无法覆盖算力成本" },
      { layer: "深层原因", detail: "商业模式脆弱，付费转化率不足0.7%，免费用户无限制对话导致亏损随用户互动时长增加而扩大" },
      { layer: "外部原因", detail: "面临严峻的合规与诉讼风险，青少年自杀等诉讼导致监管收紧，限制未成年人使用直接砍去核心用户群" },
    ],
    lessons: [  // 教训与避坑清单
      "用户规模和互动时长不能自动转化为商业成功，必须设计能覆盖边际成本的盈利模式",
      "AI情感陪伴赛道的高推理成本是致命伤，需在产品体验与算力成本间找到平衡",
      "合规风险是AI产品的生死线，尤其是涉及未成年人保护时，必须提前建立防护机制",
      "过度依赖外部大厂存在核心团队被抽离的风险，需建立稳固的团队护城河",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "26yo-ai-startup-failure",  // 26岁工程师AI情感陪伴与无人直播创业失败
    name: "26岁工程师AI情感陪伴与无人直播创业失败",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2024",  // 成立年份
    closedYear: "2025",  // 关闭年份
    region: "中国",  // 国家/地区
    industry: "人工智能",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 6,  // 存活时长
    totalFunding: "初期有投资意向，后因合伙人私人恩怨撤资，后续资金断裂",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "需求验证缺失",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2024年初", type: "危机", event: "与上一家公司CEO相识，决定进军AI领域创业" },
      { date: "2024年中", type: "危机", event: "公司组建完成，原定投资因合伙人私人恩怨撤资" },
      { date: "2024年下半年", type: "产品发布", event: "团队持续3个月探索业务，推出AI情感陪伴与无人直播产品" },
      { date: "2025年初", type: "关闭", event: "产品未获市场认可，资金耗尽，公司破产清算" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "作者2022年毕业后担任软件工程师，2024年与上一家公司CEO因对AI时代的共同兴趣决定创业。作者渴望尝试新事物，认为创业能让人在短时间内实现能力的质的飞跃，不愿在毕业一两年后就陷入买房结婚的舒适圈，希望将创业经历作为人生的宝贵财富。",  // 编辑摘要
    postmortem: "表层原因\n原定投资因合伙人私人恩怨撤资，导致公司迅速陷入资金断裂的危险边缘。\n深层原因\n缺乏明确且经过验证的核心业务方向，团队在3个月内频繁试错AI情感陪伴、无人直播等方向，做出来的产品不被市场认可。\n根本原因\n初创团队在资源匮乏时，未能有效进行市场需求验证与商业模式闭环，过度依赖方向调整而非深耕单一痛点，导致获客与变现失败。",  // 详细 post-mortem
    sources: ["https:", "blog.csdn.net", "weixin_43891901", "article", "details", "151776879"],  // 来源链接
    founderBg: "26岁，2022年毕业，前软件工程师，与上一家公司CEO合伙",  // 创始人背景
    epitaph: "26岁首战AI创业，历经3个月业务试错与方向频调。\\n情感陪伴与无人直播终未获市场认可，大半年心血随资金断裂而破产。",  // 墓碑摘要
    motivation: "作者2022年毕业后担任软件工程师，2024年与上一家公司CEO因对AI时代的共同兴趣决定创业。作者渴望尝试新事物，认为创业能让人在短时间内实现能力的质的飞跃，不愿在毕业一两年后就陷入买房结婚的舒适圈，希望将创业经历作为人生的宝贵财富。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "原定投资因合伙人私人恩怨撤资，导致公司迅速陷入资金断裂的危险边缘。" },
      { layer: "深层原因", detail: "缺乏明确且经过验证的核心业务方向，团队在3个月内频繁试错AI情感陪伴、无人直播等方向，做出来的产品不被市场认可。" },
      { layer: "根本原因", detail: "初创团队在资源匮乏时，未能有效进行市场需求验证与商业模式闭环，过度依赖方向调整而非深耕单一痛点，导致获客与变现失败。" },
    ],
    lessons: [  // 教训与避坑清单
      "创业初期必须谨慎选择合伙人，避免因私人恩怨导致核心资金链断裂。",
      "AI创业不能盲目追逐热点，必须在投入开发前进行充分的市场需求验证。",
      "初创公司资源有限，频繁调整业务方向会耗尽现金流，应聚焦单一痛点打透而非不断试错。",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "builder-ai",  // Builder.ai
    name: "Builder.ai",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2016",  // 成立年份
    closedYear: "2025-05",  // 关闭年份
    region: "",  // 国家/地区
    industry: "AI软件开发",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 113,  // 存活时长
    totalFunding: "$445M",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2016", type: "成立", event: "公司成立，推出AI应用构建器概念" },
      { date: "2022", type: "融资", event: "获得微软等投资，估值达到15亿美元" },
      { date: "2023", type: "危机", event: "被曝出AI实为700名印度工程师手动写代码" },
      { date: "2024", type: "危机", event: "被揭露虚报300%收入" },
      { date: "2025-05", type: "关闭", event: "债权人扣押3700万美元，公司在五国破产" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "Builder.ai成立于2016年，旨在打造一款革命性的AI应用构建器，让非技术人员也能通过简单指令自动生成软件应用。在微软等巨头的背书与支持下，公司试图打破传统软件开发的门槛，利用所谓的神经网络实现代码自动化编写。其动机是抓住AI赋能开发的风口，通过自动化技术重塑开发流程，从而在15亿美元估值的愿景中获取巨大商业回报。",  // 编辑摘要
    postmortem: "表层原因\n资金链断裂，债权人扣押3700万美元导致公司在五国破产\n中层原因\n成本结构失衡，所谓的AI实为700名工程师手动写代码\n深层原因\n商业模式脆弱，为维持高估值虚报300%收入，伪AI模式无法产生真实价值",  // 详细 post-mortem
    sources: ["https:", "techcrunch.com", "2025", "05", "20", "once-worth-over-1b-microsoft-backed-builder-ai-is-running-out-of-money"],  // 来源链接
    founderBg: "",  // 创始人背景
    epitaph: "融资4.45亿美元，估值曾达15亿美元。\\n700名工程师用血肉之躯伪装神经网络，\\n最终在虚报300%收入的谎言中破产。",  // 墓碑摘要
    motivation: "Builder.ai成立于2016年，旨在打造一款革命性的AI应用构建器，让非技术人员也能通过简单指令自动生成软件应用。在微软等巨头的背书与支持下，公司试图打破传统软件开发的门槛，利用所谓的神经网络实现代码自动化编写。其动机是抓住AI赋能开发的风口，通过自动化技术重塑开发流程，从而在15亿美元估值的愿景中获取巨大商业回报。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "资金链断裂，债权人扣押3700万美元导致公司在五国破产" },
      { layer: "中层原因", detail: "成本结构失衡，所谓的AI实为700名工程师手动写代码" },
      { layer: "深层原因", detail: "商业模式脆弱，为维持高估值虚报300%收入，伪AI模式无法产生真实价值" },
    ],
    lessons: [  // 教训与避坑清单
      "技术包装无法掩盖产品本质缺陷，用人工伪装AI的伪科技模式注定无法长期维持",
      "企业必须坚守财务与商业诚信，通过虚报收入维持高估值最终会导致毁灭性危机",
      "评估AI创业项目应穿透技术噱头，严格验证核心技术的自动化程度与真实单位经济效益",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "kestrel-freight-systems",  // Kestrel Freight Systems
    name: "Kestrel Freight Systems",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2016",  // 成立年份
    closedYear: "2024",  // 关闭年份
    region: "爱尔兰",  // 国家/地区
    industry: "物流软件",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 96,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: ["数据泄露"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2016", type: "成立", event: "公司在爱尔兰成立，切入物流软件赛道" },
      { date: "2016-2024", type: "危机", event: "累计14个Git仓库、约6.1万次提交、2.2万张Jira工单、8年Slack记录、28个公司邮箱、约240GB规格文档" },
      { date: "峰值期", type: "融资", event: "团队规模达31人，融资阶段为Series A" },
      { date: "2024", type: "关闭", event: "公司停止运营，业务关闭" },
      { date: "2026", type: "危机", event: "在BuyMyDeadStartup挂牌，标价4.5万美元，截止2026年10月14日接受报价" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "Kestrel Freight Systems 于2016年在爱尔兰成立，做的是物流软件，一路做到 Series A，团队峰值31人。八年里，公司积累了14个Git仓库、约6.1万次提交、2.2万张Jira工单、8年Slack记录、28个公司邮箱和约240GB规格文档。但物流软件赛道竞争激烈、客户付费意愿有限，公司没能把产品做成可持续的生意，2024年停止运营。创始人没有选择让这些资产随公司一起消失，而是把它挂到 BuyMyDeadStartup 上，希望AI实验室愿意为这些真实运营数据付费——毕竟公开互联网已经被训练完了，剩下的价值藏在死掉的创业公司档案里。",  // 编辑摘要
    postmortem: "表层原因\n物流软件业务未能持续经营，公司于2024年停止运营，峰值31人、Series A的规模未能转化为长期收入\n深层原因\n商业模式脆弱：产品面向物流行业，客户付费能力和续约意愿有限，八年运营未能建立稳定现金流，最终只能靠出售数据资产回收残值\n行业背景\nAI实验室已耗尽公开互联网数据，转而高价收购死掉创业公司的内部代码、工单、邮件等运营记录，医疗和金融行业数据报价最高，单笔交易普遍在1万至10万美元，个别达10万美元以上\n处置方式\n创始人选择在BuyMyDeadStartup免费挂牌，自行设定4.5万美元要价，平台不抽成、不托管数据、不参与谈判，买卖双方直接对接",  // 详细 post-mortem
    sources: ["BuyMyDeadStartup（援引 Forbes", "2026年4月）"],  // 来源链接
    founderBg: "未披露（文章未提及创始人背景）",  // 创始人背景
    epitaph: "八年物流软件，31人团队，14个代码库、6.1万次提交。\\n业务停了，数据还活着——挂牌4.5万美元，等一个AI实验室。\\n2026年10月14日前，欢迎出价。",  // 墓碑摘要
    motivation: "Kestrel Freight Systems 于2016年在爱尔兰成立，做的是物流软件，一路做到 Series A，团队峰值31人。八年里，公司积累了14个Git仓库、约6.1万次提交、2.2万张Jira工单、8年Slack记录、28个公司邮箱和约240GB规格文档。但物流软件赛道竞争激烈、客户付费意愿有限，公司没能把产品做成可持续的生意，2024年停止运营。创始人没有选择让这些资产随公司一起消失，而是把它挂到 BuyMyDeadStartup 上，希望AI实验室愿意为这些真实运营数据付费——毕竟公开互联网已经被训练完了，剩下的价值藏在死掉的创业公司档案里。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "物流软件业务未能持续经营，公司于2024年停止运营，峰值31人、Series A的规模未能转化为长期收入" },
      { layer: "深层原因", detail: "商业模式脆弱：产品面向物流行业，客户付费能力和续约意愿有限，八年运营未能建立稳定现金流，最终只能靠出售数据资产回收残值" },
      { layer: "行业背景", detail: "AI实验室已耗尽公开互联网数据，转而高价收购死掉创业公司的内部代码、工单、邮件等运营记录，医疗和金融行业数据报价最高，单笔交易普遍在1万至10万美元，个别达10万美元以上" },
      { layer: "处置方式", detail: "创始人选择在BuyMyDeadStartup免费挂牌，自行设定4.5万美元要价，平台不抽成、不托管数据、不参与谈判，买卖双方直接对接" },
    ],
    lessons: [  // 教训与避坑清单
      "Series A 和31人团队不等于可持续商业模式，融资阶段只是过程指标，现金流才是生死线",
      "创业公司死掉后，代码、工单、邮件等运营数据仍有残值，AI训练数据市场正在为这些'死资产'定价",
      "关停不是终点：提前整理好Git、Jira、Slack、邮件等资产清单，能在清算阶段换回真金白银",
      "物流等传统行业的软件创业，客户付费意愿和续约率需要在早期就验证，不能靠融资掩盖需求不足",
      "创始人应把数据资产视为公司资产负债表的一部分，在关停决策时同步评估其可出售价值",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: false,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "petal-live",  // Petal
    name: "Petal",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "未披露",  // 成立年份
    closedYear: "2026-07-31",  // 关闭年份
    region: "未披露（产品文档为英文，推测为欧美团队）",  // 国家/地区
    industry: "AI/科技协作工具（远程结对编程与窗口共享）",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 0,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "未披露", type: "成立", event: "Mira 与 Theo 启动 Petal 项目，开发 Rust 合成器与窗口共享功能" },
      { date: "未披露", type: "产品发布", event: "发布 Petal Cloud 与自托管两种部署模式，基于 LiveKit 提供视频基础设施" },
      { date: "2026-07-31", type: "关闭", event: "产品页面显示最后活动时间 9:41 AM，此后停止运营" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "Mira 与 Theo 在远程协作中反复遭遇屏幕共享的割裂感：视频会议里的窗口只是网格中的一块瓦片，模糊、不可交互、无法同时操作。他们希望把共享窗口变成桌面上真实存在的窗口——可移动、可缩放、清晰锐利，并支持多人同时共享与即时远程键鼠输入。基于 Rust 自研合成器与 LiveKit 视频基础设施，他们打造了 Petal，让远程结对编程像并肩坐在同一台电脑前一样自然，并以开源方式让团队完全掌控数据与部署。",  // 编辑摘要
    postmortem: "表层原因\n产品页面停留在 2026 年 7 月 31 日 9:41 AM，此后无更新，服务实际停止\n商业模式\n核心卖点是开源与自托管，用户可自行部署、无需付费，云端订阅缺乏不可替代的增值点，收入难以覆盖 LiveKit 媒体服务器与开发成本\n市场定位\n远程结对编程属于小众场景，目标用户规模有限，且面临 VS Code Live Share、Tuple、Pop 等成熟竞品的同质化竞争\n团队与资源\n仅两名技术创始人，缺乏销售与增长职能，开源项目难以转化为可持续经营的公司",  // 详细 post-mortem
    sources: ["petal.live"],  // 来源链接
    founderBg: "两名开发者 Mira 与 Theo，具备 Rust 系统编程与实时音视频（LiveKit）工程背景，属于技术型创始人组合",  // 创始人背景
    epitaph: "这里曾让远程结对像坐在一起。\\n2026年7月31日 9:41，最后一个窗口关闭。\\n代码开源，公司没有。",  // 墓碑摘要
    motivation: "Mira 与 Theo 在远程协作中反复遭遇屏幕共享的割裂感：视频会议里的窗口只是网格中的一块瓦片，模糊、不可交互、无法同时操作。他们希望把共享窗口变成桌面上真实存在的窗口——可移动、可缩放、清晰锐利，并支持多人同时共享与即时远程键鼠输入。基于 Rust 自研合成器与 LiveKit 视频基础设施，他们打造了 Petal，让远程结对编程像并肩坐在同一台电脑前一样自然，并以开源方式让团队完全掌控数据与部署。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "产品页面停留在 2026 年 7 月 31 日 9:41 AM，此后无更新，服务实际停止" },
      { layer: "商业模式", detail: "核心卖点是开源与自托管，用户可自行部署、无需付费，云端订阅缺乏不可替代的增值点，收入难以覆盖 LiveKit 媒体服务器与开发成本" },
      { layer: "市场定位", detail: "远程结对编程属于小众场景，目标用户规模有限，且面临 VS Code Live Share、Tuple、Pop 等成熟竞品的同质化竞争" },
      { layer: "团队与资源", detail: "仅两名技术创始人，缺乏销售与增长职能，开源项目难以转化为可持续经营的公司" },
    ],
    lessons: [  // 教训与避坑清单
      "开源可以赢得开发者信任，但不能替代商业模式设计，自托管越彻底，付费转化越困难",
      "技术差异化（真实窗口、远程控制）必须绑定可量化的付费场景，否则只是极客玩具",
      "小众协作工具需在早期验证付费意愿，而非默认开发者会为便利性买单",
      "两人技术团队应尽早引入增长与商业化角色，避免产品优秀却无人经营",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: false,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "coscreen",  // CoScreen
    name: "CoScreen",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2016",  // 成立年份
    closedYear: "2025-07-31",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "企业协作/屏幕共享",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 114,  // 存活时长
    totalFunding: "未披露具体金额，Datadog 收购后持续投入多年",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "合规与决策风险",  // 主标签（六死因）
    secondaryTags: ["收购后关停"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2016", type: "成立", event: "CoScreen 成立，开始构建实时屏幕共享工具" },
      { date: "2022", type: "危机", event: "被 Datadog 收购，团队并入并继续开发独立产品" },
      { date: "2022-2025", type: "危机", event: "在 Datadog 内持续投入，同时开发集成功能与 MCP server" },
      { date: "2025-07-31", type: "危机", event: "Datadog 日落 CoScreen 服务" },
      { date: "2025", type: "危机", event: "原团队四人用不到八周构建开源替代品 Petal" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "Jason Thomas 与 Till、Max 曾亲历 Screenhero 被 Slack 收购后关停的行业悲剧，他们希望打破屏幕共享工具被平台收购即消失的循环。2016年前后，三人创立 CoScreen，目标是打造比 Screenhero 更神奇的协作体验：把窗口从你的笔记本抛到别人屏幕上，零摩擦开始协作。他们相信实时屏幕共享可以成为团队协作的核心入口，而非大平台的一个附属功能。",  // 编辑摘要
    postmortem: "表层原因\nCoScreen 作为独立屏幕共享工具，与 Datadog 核心客户群和监控使命过于边缘化，无法获得足够战略优先级\n中层原因\n被收购后团队精力被分散到 Datadog 其他通信功能、视频平台集成和 MCP server 等项目，独立产品迭代资源被稀释\n深层原因\n行业反复出现同一模式：小团队做出优秀工具，平台为团队或功能收购，独立产品在整合中消亡，Screenhero、Around、Multi 均如此\n根本原因\n被收购的独立产品缺乏可持续的独立商业模式和用户增长路径，命运完全取决于母公司战略决策，而非市场需求",  // 详细 post-mortem
    sources: ["Hacker News"],  // 来源链接
    founderBg: "Jason Thomas、Till、Max 等联合创立，团队具备实时协作与屏幕共享技术背景",  // 创始人背景
    epitaph: "六年打造零摩擦协作体验，\\n三年融入 Datadog 生态，\\n2025年7月31日被母公司亲手日落。",  // 墓碑摘要
    motivation: "Jason Thomas 与 Till、Max 曾亲历 Screenhero 被 Slack 收购后关停的行业悲剧，他们希望打破屏幕共享工具被平台收购即消失的循环。2016年前后，三人创立 CoScreen，目标是打造比 Screenhero 更神奇的协作体验：把窗口从你的笔记本抛到别人屏幕上，零摩擦开始协作。他们相信实时屏幕共享可以成为团队协作的核心入口，而非大平台的一个附属功能。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "CoScreen 作为独立屏幕共享工具，与 Datadog 核心客户群和监控使命过于边缘化，无法获得足够战略优先级" },
      { layer: "中层原因", detail: "被收购后团队精力被分散到 Datadog 其他通信功能、视频平台集成和 MCP server 等项目，独立产品迭代资源被稀释" },
      { layer: "深层原因", detail: "行业反复出现同一模式：小团队做出优秀工具，平台为团队或功能收购，独立产品在整合中消亡，Screenhero、Around、Multi 均如此" },
      { layer: "根本原因", detail: "被收购的独立产品缺乏可持续的独立商业模式和用户增长路径，命运完全取决于母公司战略决策，而非市场需求" },
    ],
    lessons: [  // 教训与避坑清单
      "被收购不等于成功，独立产品可能因与母公司战略不符而被关停",
      "平台收购往往为团队或功能，而非产品本身，创始人需警惕产品被边缘化",
      "开源与自托管是抵御平台日落风险的一种路径，但需提前设计",
      "实时协作工具技术壁垒高，但商业壁垒未必同样高，需验证独立付费意愿",
      "创业公司应尽早建立不依赖单一收购方的用户增长和收入模式",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "saturn-sql",  // Saturn SQL
    name: "Saturn SQL",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "未披露",  // 成立年份
    closedYear: "未披露",  // 关闭年份
    region: "未披露",  // 国家/地区
    industry: "数据工具 / SaaS",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 0,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "同质化竞争",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "未披露", type: "危机", event: "PopSQL 和 SeekWell 相继宣布停运" },
      { date: "未披露", type: "危机", event: "创始人决定自建替代工具 Saturn SQL" },
      { date: "未披露", type: "产品发布", event: "产品上线，聚焦数据库连接、SQL 共享与定时推送" },
      { date: "未披露", type: "危机", event: "面临免费 cron job + Python 脚本的替代竞争" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "创始人的团队原本使用 PopSQL 和 SeekWell 来定时将数据库数据同步到 Google Sheets，并共享公司专属的 SQL 查询库。然而这两款工具相继停运，团队失去了赖以工作的数据管道。创始人坚信数据属于公司里的每一个人，当人们能够自由访问数据时，会自发找到使用场景，生产力也会大幅提升。因此他决定亲手打造一个替代品，只覆盖团队真正用到的功能：连接数据库、编写和共享 SQL、将结果定时推送到 Sheets 或 Slack，并刻意保持产品范围狭窄，以便快速响应需求。",  // 编辑摘要
    postmortem: "表层原因\n产品功能可被免费的 cron job 加 Python 脚本完全替代，用户缺乏付费动机\n深层原因\n产品定位过于狭窄，仅覆盖团队自用的少数功能，难以形成差异化壁垒和付费价值\n根本原因\n数据工具赛道同质化严重，开源与免费方案泛滥，独立开发者难以在价格与功能上建立可持续的商业模式",  // 详细 post-mortem
    sources: ["saturnsql.com"],  // 来源链接
    founderBg: "未披露，创始人为解决自身团队数据共享需求而开发工具的开发者",  // 创始人背景
    epitaph: "为替代两款停运工具而生，\\n却敌不过一行免费的 cron job，\\n数据民主化的理想止步于付费意愿。",  // 墓碑摘要
    motivation: "创始人的团队原本使用 PopSQL 和 SeekWell 来定时将数据库数据同步到 Google Sheets，并共享公司专属的 SQL 查询库。然而这两款工具相继停运，团队失去了赖以工作的数据管道。创始人坚信数据属于公司里的每一个人，当人们能够自由访问数据时，会自发找到使用场景，生产力也会大幅提升。因此他决定亲手打造一个替代品，只覆盖团队真正用到的功能：连接数据库、编写和共享 SQL、将结果定时推送到 Sheets 或 Slack，并刻意保持产品范围狭窄，以便快速响应需求。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "产品功能可被免费的 cron job 加 Python 脚本完全替代，用户缺乏付费动机" },
      { layer: "深层原因", detail: "产品定位过于狭窄，仅覆盖团队自用的少数功能，难以形成差异化壁垒和付费价值" },
      { layer: "根本原因", detail: "数据工具赛道同质化严重，开源与免费方案泛滥，独立开发者难以在价格与功能上建立可持续的商业模式" },
    ],
    lessons: [  // 教训与避坑清单
      "免费替代方案是独立工具最致命的竞争对手，必须在便利性或协作体验上建立不可替代的价值",
      "从自身需求出发做产品容易陷入范围过窄的陷阱，需验证更广泛市场的付费意愿",
      "面向非技术用户的数据工具，真正的壁垒在于降低使用门槛而非功能本身",
      "在成熟赛道中创业，必须明确回答用户为什么愿意付费而不是用免费方案",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: false,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "moondream",  // Moondream
    name: "Moondream",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2023",  // 成立年份
    closedYear: "2025",  // 关闭年份
    region: "美国西雅图",  // 国家/地区
    industry: "计算机视觉/多模态AI",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 24,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "同质化竞争",  // 主标签（六死因）
    secondaryTags: ["团队解散", "恶性竞争", "收购后关停"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2023", type: "成立", event: "两位AWS资深员工在西雅图创立Moondream" },
      { date: "2023", type: "产品发布", event: "发布开源视觉语言模型Moondream，获得开发者关注" },
      { date: "2024", type: "危机", event: "持续迭代模型，在开源社区积累用户" },
      { date: "2025", type: "危机", event: "被Prime Intellect收购，结束独立运营" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "两位创始人来自亚马逊AWS，深耕云计算与AI基础设施多年，希望将大模型能力带入视觉理解领域，打造轻量、高效、可本地部署的视觉AI模型。他们相信在通用大模型之外，专注视觉的垂直模型仍有空间，于是离开大厂创办Moondream，试图以更小的团队和更聚焦的产品切入多模态AI市场。",  // 编辑摘要
    postmortem: "表层原因\n视觉AI模型赛道竞争激烈，独立小团队难以获得足够市场份额和收入\n深层原因\n通用大模型巨头快速覆盖多模态能力，开源模型免费替代，Moondream的差异化优势被迅速稀释\n根本原因\n缺乏可持续商业模式，依赖开源和社区难以变现，融资和增长空间受限，最终选择被收购退出",  // 详细 post-mortem
    sources: ["GeekWire"],  // 来源链接
    founderBg: "由两位亚马逊AWS资深员工在西雅图创立",  // 创始人背景
    epitaph: "两位AWS老兵打造视觉AI模型Moondream，\\n在巨头林立的赛道中苦撑两年，\\n最终被Prime Intellect收购，独立之路就此终结。",  // 墓碑摘要
    motivation: "两位创始人来自亚马逊AWS，深耕云计算与AI基础设施多年，希望将大模型能力带入视觉理解领域，打造轻量、高效、可本地部署的视觉AI模型。他们相信在通用大模型之外，专注视觉的垂直模型仍有空间，于是离开大厂创办Moondream，试图以更小的团队和更聚焦的产品切入多模态AI市场。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "视觉AI模型赛道竞争激烈，独立小团队难以获得足够市场份额和收入" },
      { layer: "深层原因", detail: "通用大模型巨头快速覆盖多模态能力，开源模型免费替代，Moondream的差异化优势被迅速稀释" },
      { layer: "根本原因", detail: "缺乏可持续商业模式，依赖开源和社区难以变现，融资和增长空间受限，最终选择被收购退出" },
    ],
    lessons: [  // 教训与避坑清单
      "垂直AI模型需警惕巨头通用能力的快速覆盖，差异化窗口期可能极短",
      "开源策略能带来关注但未必带来收入，需提前设计商业化路径",
      "小团队在资本密集的AI赛道中，独立生存难度极高，被收购可能是理性退出",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "vespper",  // Vespper
    name: "Vespper",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2023",  // 成立年份
    closedYear: "",  // 关闭年份
    region: "以色列",  // 国家/地区
    industry: "AI 文档编辑 / 开发者工具",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 0,  // 存活时长
    totalFunding: "",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "需求验证缺失",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2023", type: "成立", event: "Dudu 与 Topaz 创立 Vespper，开发面向药企的 AI 文档编辑器" },
      { date: "2024", type: "危机", event: "客户坚持使用自有 Word 模板，AI 编辑 .docx 频繁失败" },
      { date: "2024", type: "危机", event: "实测填充单份 CSR 耗时约 50 分钟且结果质量差" },
      { date: "2025", type: "危机", event: "放弃原编辑器方向，转向 DOCX MCP" },
      { date: "2025", type: "产品发布", event: "发布 v1，内部基准显示比 DOCX skill 快约 3 倍、便宜约 2 倍" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "我们最初想给药企做 AI 文档编辑器，帮他们自动生成监管文件（如临床研究报告 CSR），加速申报流程。团队背景让我们相信 AI 能大幅压缩这类高重复、高合规的写作工作。产品早期输出 Markdown，配 WYSIWYG 编辑器，看起来顺理成章。但真实客户坚持用他们自己的 Word 模板，一旦把 AI 生成内容塞进 .docx，问题全面爆发：OOXML 极其冗长，加个编号列表要改 numbering.xml 并回链 document.xml，加粗一句话要拆成多个 run。代理把上下文和时间全烧在 Word 机制上，而非任务本身。填一份 CSR 要约 50 分钟，还漏字段、坏样式。我们这才意识到，原方向的需求验证并不成立，真正卡住客户的是 Word 编辑本身。",  // 编辑摘要
    postmortem: "表层原因\nAI 代理不擅长编辑 Word 文档，OOXML 冗长复杂，小改动也需大量底层操作，导致耗时耗 token 且易出错。\n深层原因\n原产品假设客户愿意用 Markdown/WYSIWYG 工作流，但药企坚持自有 Word 模板，需求验证缺失，产品与真实工作流错位。\n根本原因\n团队把资源押在 AI 文档编辑器这一错误方向上，直到实测 CSR 填充失败才被迫转型，前期一年投入未能形成可持续商业模式。",  // 详细 post-mortem
    sources: ["Hacker News"],  // 来源链接
    founderBg: "Topaz 曾任 Snyk 高级软件工程师，专注分布式系统；Dudu 曾任 Viz.ai 深度学习工程师，构建中风检测计算机视觉模型",  // 创始人背景
    epitaph: "我们花一年为药企造 AI 文档编辑器，\\n客户却只想要自己的 Word 模板，\\n50 分钟填一份 CSR，结果满是破绽。",  // 墓碑摘要
    motivation: "我们最初想给药企做 AI 文档编辑器，帮他们自动生成监管文件（如临床研究报告 CSR），加速申报流程。团队背景让我们相信 AI 能大幅压缩这类高重复、高合规的写作工作。产品早期输出 Markdown，配 WYSIWYG 编辑器，看起来顺理成章。但真实客户坚持用他们自己的 Word 模板，一旦把 AI 生成内容塞进 .docx，问题全面爆发：OOXML 极其冗长，加个编号列表要改 numbering.xml 并回链 document.xml，加粗一句话要拆成多个 run。代理把上下文和时间全烧在 Word 机制上，而非任务本身。填一份 CSR 要约 50 分钟，还漏字段、坏样式。我们这才意识到，原方向的需求验证并不成立，真正卡住客户的是 Word 编辑本身。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "AI 代理不擅长编辑 Word 文档，OOXML 冗长复杂，小改动也需大量底层操作，导致耗时耗 token 且易出错。" },
      { layer: "深层原因", detail: "原产品假设客户愿意用 Markdown/WYSIWYG 工作流，但药企坚持自有 Word 模板，需求验证缺失，产品与真实工作流错位。" },
      { layer: "根本原因", detail: "团队把资源押在 AI 文档编辑器这一错误方向上，直到实测 CSR 填充失败才被迫转型，前期一年投入未能形成可持续商业模式。" },
    ],
    lessons: [  // 教训与避坑清单
      "先验证客户真实工作流，再投入产品开发，避免用理想流程替代客户既有习惯。",
      "AI 代理的上下文与 token 是稀缺资源，应把机制性复杂度从代理侧移走。",
      "面对复杂格式，投影加原地回写比全量往返转换更能保真。",
      "小模型在窄任务上可达到前沿模型水平，且更适合放在热路径。",
      "转型不是失败，但一年试错成本提醒团队尽早做最小可行验证。",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "anbu-eggverse",  // Anbu (EggVerse)
    name: "Anbu (EggVerse)",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2021",  // 成立年份
    closedYear: "2022",  // 关闭年份
    region: "未知",  // 国家/地区
    industry: "云游戏/浏览器游戏平台",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 12,  // 存活时长
    totalFunding: "15000",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "成本结构失衡",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2021", type: "成立", event: "投入约1.5万美元启动Anbu项目" },
      { date: "2021", type: "产品发布", event: "完成平台设计、美术、外包开发，推出首款游戏《Egg on the Run》" },
      { date: "2022", type: "危机", event: "首款游戏吸引力不足，玩家增长有限" },
      { date: "2022", type: "关闭", event: "AWS免费额度耗尽，EC2托管费用过高，项目关闭" },
      { date: "2024", type: "危机", event: "在开发另一家初创公司Sky时，作为周末副业重启项目" },
      { date: "2025", type: "产品发布", event: "EggVerse重新上线，扩展至18款多人游戏" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "2021年，我投入约1.5万美元启动Anbu项目，最初想做去中心化云游戏平台，但因没有联合创始人和资金限制，缩减为浏览器街机游戏厅，让玩家能和好友一起玩游戏。我亲自在Figma设计平台、手绘原创美术和Logo，并外包开发、像素艺术、音乐、音效和部分3D模型。这笔预算只够做出一款游戏《Egg on the Run》，以及游戏大厅、好友邀请、聊天和发布平台。我计划用第一款游戏吸引玩家，让玩家带来朋友，最终吸引其他开发者发布游戏。",  // 编辑摘要
    postmortem: "表层原因\n首款游戏《Egg on the Run》不够吸引人，未能吸引足够玩家和兴趣\n深层原因\n缺乏联合创始人和充足资金，只能缩减为浏览器街机游戏厅，产品内容单薄\n根本原因\nEC2托管成本高昂，AWS免费额度耗尽后无法承担持续运营费用，商业模式无法覆盖基础设施成本\n外部因素\n作为独立开发者，没有团队分担开发和运营压力，难以同时兼顾产品迭代和成本控制",  // 详细 post-mortem
    sources: ["eggverse.co"],  // 来源链接
    founderBg: "独立创始人，无联合创始人，自行设计平台、绘制美术与Logo，外包开发、像素艺术、音乐、音效和3D模型",  // 创始人背景
    epitaph: "投入1.5万美元，做出1款游戏，\\n吸引不到玩家，却等来天价EC2账单。\\nAWS额度一断，梦想被迫下线。",  // 墓碑摘要
    motivation: "2021年，我投入约1.5万美元启动Anbu项目，最初想做去中心化云游戏平台，但因没有联合创始人和资金限制，缩减为浏览器街机游戏厅，让玩家能和好友一起玩游戏。我亲自在Figma设计平台、手绘原创美术和Logo，并外包开发、像素艺术、音乐、音效和部分3D模型。这笔预算只够做出一款游戏《Egg on the Run》，以及游戏大厅、好友邀请、聊天和发布平台。我计划用第一款游戏吸引玩家，让玩家带来朋友，最终吸引其他开发者发布游戏。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "首款游戏《Egg on the Run》不够吸引人，未能吸引足够玩家和兴趣" },
      { layer: "深层原因", detail: "缺乏联合创始人和充足资金，只能缩减为浏览器街机游戏厅，产品内容单薄" },
      { layer: "根本原因", detail: "EC2托管成本高昂，AWS免费额度耗尽后无法承担持续运营费用，商业模式无法覆盖基础设施成本" },
      { layer: "外部因素", detail: "作为独立开发者，没有团队分担开发和运营压力，难以同时兼顾产品迭代和成本控制" },
    ],
    lessons: [  // 教训与避坑清单
      "基础设施成本必须提前纳入商业模式验证，免费额度不是长期方案",
      "单款游戏难以支撑平台生态，内容供给需要持续投入",
      "独立创始人资源有限，应优先验证核心需求再扩大开发",
      "云服务成本结构可能成为早期创业的致命负担",
      "失败项目中的资产和经验可以在后续创业中复用",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "deno",  // Deno
    name: "Deno",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2018",  // 成立年份
    closedYear: "2025",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "开发者工具/JavaScript 运行时",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 84,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "同质化竞争",  // 主标签（六死因）
    secondaryTags: ["恶性竞争"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2018", type: "产品发布", event: "Ryan Dahl 发布 Deno 项目，提出替代 Node.js 的愿景" },
      { date: "2020", type: "产品发布", event: "Deno 1.0 正式发布" },
      { date: "2021", type: "产品发布", event: "推出 Deno Deploy 边缘计算平台" },
      { date: "2024", type: "关键招聘", event: "Deno 团队整体加入 Cloudflare" },
      { date: "2025", type: "关闭", event: "Deno runtime 停止开发，Deno Deploy 六个月后关停" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "Ryan Dahl 在 2018 年公开承认 Node.js 的十大设计失误，随后创立 Deno，试图打造一个更安全、更现代的 JavaScript/TypeScript 运行时，内置权限控制、原生 TypeScript 支持和标准化模块系统。团队希望借 Deno Deploy 切入边缘计算与 Serverless 市场，与 Cloudflare Workers、Vercel 等竞争，建立可持续的开发者平台商业模式。",  // 编辑摘要
    postmortem: "表层原因\nDeno 团队整体加入 Cloudflare，独立公司实体不再继续运营\n中层原因\nDeno runtime 与 Node.js 生态高度重叠，开发者迁移成本高，采用率不及预期\n深层原因\nDeno Deploy 面对 Cloudflare Workers、Vercel 等成熟边缘平台，缺乏差异化壁垒，商业化难以支撑团队\n根本原因\n开源运行时项目本身难以直接变现，而商业化产品又陷入同质化竞争，最终只能被收购整合",  // 详细 post-mortem
    sources: ["OSCHINA"],  // 来源链接
    founderBg: "由 Node.js 创始人 Ryan Dahl 创立，核心团队来自 Node.js 与 JavaScript 运行时领域",  // 创始人背景
    epitaph: "曾想取代 Node.js 的运行时，\\n最终被 Cloudflare 收编，\\nDeno runtime 一年后停更，Deploy 六个月后关停。",  // 墓碑摘要
    motivation: "Ryan Dahl 在 2018 年公开承认 Node.js 的十大设计失误，随后创立 Deno，试图打造一个更安全、更现代的 JavaScript/TypeScript 运行时，内置权限控制、原生 TypeScript 支持和标准化模块系统。团队希望借 Deno Deploy 切入边缘计算与 Serverless 市场，与 Cloudflare Workers、Vercel 等竞争，建立可持续的开发者平台商业模式。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "Deno 团队整体加入 Cloudflare，独立公司实体不再继续运营" },
      { layer: "中层原因", detail: "Deno runtime 与 Node.js 生态高度重叠，开发者迁移成本高，采用率不及预期" },
      { layer: "深层原因", detail: "Deno Deploy 面对 Cloudflare Workers、Vercel 等成熟边缘平台，缺乏差异化壁垒，商业化难以支撑团队" },
      { layer: "根本原因", detail: "开源运行时项目本身难以直接变现，而商业化产品又陷入同质化竞争，最终只能被收购整合" },
    ],
    lessons: [  // 教训与避坑清单
      "开源项目替代成熟生态时，技术优势不足以抵消迁移成本与网络效应",
      "商业化产品必须与开源核心形成差异化壁垒，否则容易陷入同质化竞争",
      "边缘计算/Serverless 赛道巨头林立，独立小团队难以长期独立支撑",
      "被收购整合虽非最差结局，但独立创业愿景已实质失败",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "huxe",  // Huxe
    name: "Huxe",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "未知",  // 成立年份
    closedYear: "2025",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "AI音频/播客",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 0,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: ["收购后关停"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "未知", type: "成立", event: "Huxe成立，专注AI音频" },
      { date: "2025", type: "危机", event: "苹果与Huxe达成协议" },
      { date: "2025", type: "关闭", event: "Huxe关闭，引发播客未来疑问" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "Huxe作为AI音频初创公司，旨在利用人工智能技术革新播客和音频内容创作。创始团队可能看到了AI在语音合成、内容生成和个性化推荐方面的潜力，希望打造一个能够自动生成或优化音频内容的平台，降低播客制作门槛，吸引更多创作者和听众。然而，在竞争激烈的音频市场中，Huxe未能建立起可持续的商业模式，最终在苹果收购后走向关闭。",  // 编辑摘要
    postmortem: "表层原因\n苹果收购后Huxe被关闭，独立运营终止\n深层原因\nAI音频创业公司难以在巨头林立的播客市场建立护城河\n根本原因\n商业模式脆弱，未能实现可持续盈利，最终依赖收购退出",  // 详细 post-mortem
    sources: ["WION"],  // 来源链接
    founderBg: "未披露",  // 创始人背景
    epitaph: "AI音频新星Huxe，未及绽放便已关停；苹果一纸协议，播客未来再添变数。",  // 墓碑摘要
    motivation: "Huxe作为AI音频初创公司，旨在利用人工智能技术革新播客和音频内容创作。创始团队可能看到了AI在语音合成、内容生成和个性化推荐方面的潜力，希望打造一个能够自动生成或优化音频内容的平台，降低播客制作门槛，吸引更多创作者和听众。然而，在竞争激烈的音频市场中，Huxe未能建立起可持续的商业模式，最终在苹果收购后走向关闭。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "苹果收购后Huxe被关闭，独立运营终止" },
      { layer: "深层原因", detail: "AI音频创业公司难以在巨头林立的播客市场建立护城河" },
      { layer: "根本原因", detail: "商业模式脆弱，未能实现可持续盈利，最终依赖收购退出" },
    ],
    lessons: [  // 教训与避坑清单
      "AI音频创业需警惕巨头收购后的整合风险",
      "播客市场竞争激烈，独立商业模式难以维系",
      "技术优势不等于商业成功，需验证可持续盈利路径",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: false,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "sora-openai-shutdown",  // Sora (OpenAI)
    name: "Sora (OpenAI)",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2024",  // 成立年份
    closedYear: "2025",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "AI视频生成",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 18,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "合规与决策风险",  // 主标签（六死因）
    secondaryTags: ["监管处罚"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2024年初", type: "产品发布", event: "OpenAI发布Sora预览，引发全球关注" },
      { date: "2024年中", type: "危机", event: "版权争议升级，好莱坞与创作者抗议" },
      { date: "2024年底", type: "危机", event: "监管压力增大，Sora公测推迟" },
      { date: "2025年", type: "关闭", event: "OpenAI关停Sora，转向授权谈判" },
      { date: "2025年", type: "危机", event: "与DreamWorks联合创始人初创公司洽谈授权" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "OpenAI推出Sora，旨在通过文本生成高质量视频，颠覆影视、广告与内容创作行业。团队希望借助生成式AI降低视频制作门槛，让创意快速可视化。然而，训练数据来源与输出内容的版权问题始终悬而未决，引发好莱坞与创作者强烈反弹。在监管压力与法律风险下，OpenAI选择关停Sora，并转而与DreamWorks动画联合创始人创立的初创公司洽谈授权，试图以合规方式延续技术价值。",  // 编辑摘要
    postmortem: "表层原因\n版权与合规争议导致产品无法持续运营\n深层原因\n训练数据来源不透明，输出内容侵犯影视版权\n根本原因\n生成式AI与现有版权法律体系冲突，商业模式缺乏合规基础",  // 详细 post-mortem
    sources: ["BigGo Finance"],  // 来源链接
    founderBg: "OpenAI团队开发，与DreamWorks动画联合创始人共同创立的初创公司洽谈授权",  // 创始人背景
    epitaph: "曾以秒级生成惊艳世界，却在版权风暴中熄火；18个月，从颠覆者到被授权方。",  // 墓碑摘要
    motivation: "OpenAI推出Sora，旨在通过文本生成高质量视频，颠覆影视、广告与内容创作行业。团队希望借助生成式AI降低视频制作门槛，让创意快速可视化。然而，训练数据来源与输出内容的版权问题始终悬而未决，引发好莱坞与创作者强烈反弹。在监管压力与法律风险下，OpenAI选择关停Sora，并转而与DreamWorks动画联合创始人创立的初创公司洽谈授权，试图以合规方式延续技术价值。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "版权与合规争议导致产品无法持续运营" },
      { layer: "深层原因", detail: "训练数据来源不透明，输出内容侵犯影视版权" },
      { layer: "根本原因", detail: "生成式AI与现有版权法律体系冲突，商业模式缺乏合规基础" },
    ],
    lessons: [  // 教训与避坑清单
      "AI生成内容必须提前解决版权与合规问题",
      "技术领先不等于商业可行，法律风险可致命",
      "与内容产业合作而非对抗，或能避免关停",
      "监管环境变化是AI创业的关键变量",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "coreweave-ai-cycle-stall",  // CoreWeave
    name: "CoreWeave",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2017",  // 成立年份
    closedYear: "",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "AI算力云服务（GPU云）",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 0,  // 存活时长
    totalFunding: "累计融资数十亿美元，含债务与股权融资，2025年IPO",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2017", type: "成立", event: "公司成立，最初从事加密货币挖矿" },
      { date: "2022", type: "危机", event: "以太坊合并后转型AI GPU云服务" },
      { date: "2023-2024", type: "融资", event: "借助生成式AI浪潮快速扩张，获多轮巨额融资" },
      { date: "2025", type: "危机", event: "完成IPO，成为AI算力代表性上市公司" },
      { date: "2025", type: "危机", event: "D.A. Davidson分析师Luria警告：若AI周期失速，股权价值可能归零" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "CoreWeave最初是一家加密货币挖矿公司，在以太坊转向权益证明后，创始人敏锐地将大量GPU算力转向AI云服务。凭借与英伟达的紧密关系和快速扩张的数据中心，公司抓住了生成式AI爆发带来的算力饥渴，迅速成为AI基础设施领域最受瞩目的新星之一，并成功登陆资本市场。",  // 编辑摘要
    postmortem: "表层原因\n分析师警告AI周期若失速，CoreWeave股权价值可能归零，引发市场对其估值可持续性的担忧\n深层原因\n商业模式高度依赖AI资本开支的持续高速增长，客户集中度高，且以GPU等快速折旧资产为核心\n根本原因\n以巨额债务和股权融资支撑重资产扩张，成本结构刚性，一旦需求增速放缓，现金流与偿债压力将迅速放大，股权价值被杠杆侵蚀",  // 详细 post-mortem
    sources: ["Moomoo（引述D.A. Davidson分析师Luria）"],  // 来源链接
    founderBg: "创始人Michael Intrator等，原大宗商品交易与对冲基金背景，后转型GPU云服务",  // 创始人背景
    epitaph: "AI浪潮托起的GPU帝国，\\n债务与算力堆砌的估值，\\n周期一旦失速，股权归零。",  // 墓碑摘要
    motivation: "CoreWeave最初是一家加密货币挖矿公司，在以太坊转向权益证明后，创始人敏锐地将大量GPU算力转向AI云服务。凭借与英伟达的紧密关系和快速扩张的数据中心，公司抓住了生成式AI爆发带来的算力饥渴，迅速成为AI基础设施领域最受瞩目的新星之一，并成功登陆资本市场。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "分析师警告AI周期若失速，CoreWeave股权价值可能归零，引发市场对其估值可持续性的担忧" },
      { layer: "深层原因", detail: "商业模式高度依赖AI资本开支的持续高速增长，客户集中度高，且以GPU等快速折旧资产为核心" },
      { layer: "根本原因", detail: "以巨额债务和股权融资支撑重资产扩张，成本结构刚性，一旦需求增速放缓，现金流与偿债压力将迅速放大，股权价值被杠杆侵蚀" },
    ],
    lessons: [  // 教训与避坑清单
      "重资产、高杠杆的算力生意对周期极度敏感，需警惕需求失速带来的股权归零风险",
      "客户与收入高度集中于少数AI巨头，抗周期能力弱",
      "GPU折旧速度快，技术迭代可能使资产迅速贬值",
      "估值建立在AI资本开支永续高增长的假设上，假设一旦动摇，估值体系崩塌",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "afiniti-ai-unicorn-fire-sale",  // Afiniti
    name: "Afiniti",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2006",  // 成立年份
    closedYear: "2024",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "AI 企业服务/呼叫中心优化",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 216,  // 存活时长
    totalFunding: "数亿美元风险投资",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: ["技术淘汰"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "2006", type: "成立", event: "公司成立" },
      { date: "2010年代", type: "融资", event: "获得多轮融资，估值持续攀升" },
      { date: "2018", type: "融资", event: "估值达到50亿美元峰值" },
      { date: "2020", type: "危机", event: "业务增长放缓，客户流失" },
      { date: "2024", type: "危机", event: "以不到峰值1%的价格被贱卖" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "创始人 Zia Chishti 希望利用AI技术优化呼叫中心运营，通过分析客户通话数据提升销售转化率。他相信AI可以颠覆传统客服行业，创造巨大商业价值。凭借其连续创业背景，他成功吸引大量风险投资，将公司估值推高至50亿美元，成为AI领域的明星独角兽。",  // 编辑摘要
    postmortem: "表层原因\n公司以不到峰值1%的价格被贱卖，估值从50亿美元暴跌至不足5000万美元\n深层原因\n商业模式过度依赖单一AI技术叙事，实际商业化落地困难，客户集中度高，收入增长无法支撑高估值\n根本原因\nAI创业泡沫下，资本追捧导致估值虚高，但缺乏可持续的盈利模式和护城河，最终在市场竞争和资本退潮中崩溃",  // 详细 post-mortem
    sources: ["36Kr"],  // 来源链接
    founderBg: "连续创业者 Zia Chishti，拥有丰富的科技创业经验，曾创办多家公司",  // 创始人背景
    epitaph: "估值50亿美元的AI独角兽，最终以不到1%的价格贱卖。技术光环难掩商业脆弱，AI创业的泡沫警示。",  // 墓碑摘要
    motivation: "创始人 Zia Chishti 希望利用AI技术优化呼叫中心运营，通过分析客户通话数据提升销售转化率。他相信AI可以颠覆传统客服行业，创造巨大商业价值。凭借其连续创业背景，他成功吸引大量风险投资，将公司估值推高至50亿美元，成为AI领域的明星独角兽。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "公司以不到峰值1%的价格被贱卖，估值从50亿美元暴跌至不足5000万美元" },
      { layer: "深层原因", detail: "商业模式过度依赖单一AI技术叙事，实际商业化落地困难，客户集中度高，收入增长无法支撑高估值" },
      { layer: "根本原因", detail: "AI创业泡沫下，资本追捧导致估值虚高，但缺乏可持续的盈利模式和护城河，最终在市场竞争和资本退潮中崩溃" },
    ],
    lessons: [  // 教训与避坑清单
      "AI创业不能仅靠技术叙事，必须验证真实商业需求",
      "高估值不等于高价值，资本泡沫终会破裂",
      "客户集中度过高是重大风险，需多元化收入来源",
      "持续创新和落地能力比融资能力更重要",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "zirp-class-startup-shutdowns-2026",  // ZIRP Class of 2019-2021 Startups
    name: "ZIRP Class of 2019-2021 Startups",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2019",  // 成立年份
    closedYear: "2026",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "科技创业（多行业）",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 84,  // 存活时长
    totalFunding: "未披露具体金额",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: ["增长失速"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "成立", event: "零利率时期开启，大量创业公司成立" },
      { date: "", type: "融资", event: "风险资本涌入，融资与估值达到高峰" },
      { date: "", type: "融资", event: "利率上升，资本退潮，融资环境收紧" },
      { date: "", type: "危机", event: "烧钱模式难以为继，公司陆续裁员收缩" },
      { date: "", type: "关闭", event: "创业公司倒闭数量创下历史纪录，ZIRP一代集中出清" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "2019至2021年，全球处于零利率（ZIRP）时期，风险资本极度充裕，融资门槛极低。大量创业者在这一窗口期创立公司，凭借高估值、烧钱换增长的逻辑快速扩张。他们相信资本会持续输血，增长可以优先于盈利。然而随着利率上升、资本退潮，这批公司普遍面临融资枯竭与商业模式无法自持的双重困境，最终在2026年集中倒闭，创下历史纪录。",  // 编辑摘要
    postmortem: "表层原因\n利率上升导致风险资本枯竭，融资渠道关闭，公司现金流断裂\n深层原因\nZIRP时期依赖廉价资本维持高估值与烧钱增长，商业模式本身无法盈利自持\n结构性原因\n2019-2021年创业潮中大量公司同质化严重，缺乏真实需求验证与差异化壁垒\n外部环境\n宏观经济转向，资本市场从追求增长转向要求盈利，估值逻辑重构",  // 详细 post-mortem
    sources: ["Startup Fortune"],  // 来源链接
    founderBg: "2019至2021年零利率时期（ZIRP）创立公司的创始人群体，多为科技行业连续创业者或首次创业者",  // 创始人背景
    epitaph: "生于零利率的黄金年代，死于资本退潮的寒冬。\\n2019-2021届的创业公司，在2026年创下倒闭纪录。\\n当免费的钱消失，故事便讲不下去了。",  // 墓碑摘要
    motivation: "2019至2021年，全球处于零利率（ZIRP）时期，风险资本极度充裕，融资门槛极低。大量创业者在这一窗口期创立公司，凭借高估值、烧钱换增长的逻辑快速扩张。他们相信资本会持续输血，增长可以优先于盈利。然而随着利率上升、资本退潮，这批公司普遍面临融资枯竭与商业模式无法自持的双重困境，最终在2026年集中倒闭，创下历史纪录。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "利率上升导致风险资本枯竭，融资渠道关闭，公司现金流断裂" },
      { layer: "深层原因", detail: "ZIRP时期依赖廉价资本维持高估值与烧钱增长，商业模式本身无法盈利自持" },
      { layer: "结构性原因", detail: "2019-2021年创业潮中大量公司同质化严重，缺乏真实需求验证与差异化壁垒" },
      { layer: "外部环境", detail: "宏观经济转向，资本市场从追求增长转向要求盈利，估值逻辑重构" },
    ],
    lessons: [  // 教训与避坑清单
      "融资环境宽松时创立的公司，必须假设资本终将退潮，提前建立盈利模型",
      "高估值不等于健康商业模式，烧钱换增长在利率上升周期中极其脆弱",
      "创业窗口期红利会掩盖需求验证的缺失，退潮后问题集中暴露",
      "依赖单一融资渠道的公司抗风险能力差，应尽早探索多元收入来源",
      "ZIRP一代的集中倒闭提醒创业者：资本周期是创业成败的关键外部变量",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "pulse-local",  // Pulse Local
    name: "Pulse Local",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2025",  // 成立年份
    closedYear: "",  // 关闭年份
    region: "全球/远程",  // 国家/地区
    industry: "个人理财 AI 软件",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 0,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "合规与决策风险",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "产品发布", event: "发布 Pulse Local Mac 测试版，支持本地模型与 CSV 导入" },
      { date: "", type: "产品发布", event: "在 Hugging Face 发布微调权重 PulseOS/pulse-local-qwen3-0.6b" },
      { date: "", type: "危机", event: "引入 4B 检查模型，将错误答案从约五分之一降至 494 题中 5 题" },
      { date: "", type: "产品发布", event: "推出可选 Connected 模式，Sync Pass 每年 29 美元，通过 Plaid 同步美国银行" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "Niz 认为市面上缺少真正本地运行、不向外部发送数据的消费级应用，尤其是在管理个人财务这类敏感领域。他开发 Pulse Local，希望让用户在 Mac 上通过本地模型询问自己的消费情况，账本和问题都留在本机，不发送分析或崩溃日志。项目免费分享，并希望通过可选的 Connected 模式获得收入，以继续微调模型和扩展方向。",  // 编辑摘要
    postmortem: "表层原因\n文章未描述失败，项目处于活跃测试阶段，因此不存在表层失败原因。\n深层原因\n若考虑潜在风险，本地小模型在开放式问题上仍可能误读，首次启动需下载约 2.9 GB 模型，回答耗时 12-14 秒。\n根本原因\n消费级本地 AI 应用的商业化路径尚不清晰，免费模式依赖捐赠或订阅，Connected 模式涉及 Plaid 与服务器内存处理，可能带来合规与信任成本。",  // 详细 post-mortem
    sources: ["Hacker News"],  // 来源链接
    founderBg: "独立开发者 Niz，专注于本地优先的消费级 AI 应用，具备模型微调与工程能力",  // 创始人背景
    epitaph: "这里没有墓碑。\\nPulse Local 仍在运行，\\n用 0.6B 模型守护你的账本。",  // 墓碑摘要
    motivation: "Niz 认为市面上缺少真正本地运行、不向外部发送数据的消费级应用，尤其是在管理个人财务这类敏感领域。他开发 Pulse Local，希望让用户在 Mac 上通过本地模型询问自己的消费情况，账本和问题都留在本机，不发送分析或崩溃日志。项目免费分享，并希望通过可选的 Connected 模式获得收入，以继续微调模型和扩展方向。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "文章未描述失败，项目处于活跃测试阶段，因此不存在表层失败原因。" },
      { layer: "深层原因", detail: "若考虑潜在风险，本地小模型在开放式问题上仍可能误读，首次启动需下载约 2.9 GB 模型，回答耗时 12-14 秒。" },
      { layer: "根本原因", detail: "消费级本地 AI 应用的商业化路径尚不清晰，免费模式依赖捐赠或订阅，Connected 模式涉及 Plaid 与服务器内存处理，可能带来合规与信任成本。" },
    ],
    lessons: [  // 教训与避坑清单
      "本地优先的 AI 应用可以解决隐私敏感场景，但需平衡模型体积、响应速度与准确性。",
      "小模型加规则与检查模型能显著降低错误率，但无法完全消除开放式问题的误读。",
      "免费加可选订阅的模式需要明确的价值主张，否则难以覆盖持续微调与维护成本。",
      "涉及银行数据同步时，即使不存储交易，也需谨慎处理合规与用户信任问题。",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: false,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "spirit-airlines",  // Spirit Airlines
    name: "Spirit Airlines",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "未知",  // 成立年份
    closedYear: "2024",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "航空运输",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 0,  // 存活时长
    totalFunding: "未知",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "成本结构失衡",  // 主标签（六死因）
    secondaryTags: ["恶性竞争"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "成立", event: "Spirit Airlines 成立，以超低成本模式运营" },
      { date: "", type: "关闭", event: "公司申请破产保护" },
      { date: "", type: "关闭", event: "谷歌以千万美元收购其破产数据资产，包括1亿封邮件和5亿条Teams记录" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "Spirit Airlines 以超低成本航空模式起家，试图通过极低票价和附加服务收费吸引价格敏感旅客，在竞争激烈的美国航空市场占据一席之地。然而，疫情后燃油成本飙升、劳动力短缺和同质化竞争使其成本结构失衡，最终走向破产。",  // 编辑摘要
    postmortem: "表层原因\n疫情后燃油成本上升、劳动力短缺导致运营成本大幅增加\n深层原因\n超低成本航空模式在竞争加剧下利润空间被持续压缩，缺乏差异化优势\n根本原因\n成本结构失衡，无法在票价与成本之间找到可持续平衡，最终破产",  // 详细 post-mortem
    sources: ["凤凰网"],  // 来源链接
    founderBg: "航空业资深管理者，具体创始人信息未在报道中详述",  // 创始人背景
    epitaph: "曾以超低成本模式翱翔天际，最终在成本与竞争的双重风暴中折翼。1亿封邮件、5亿条Teams记录，成了谷歌AI的养料。",  // 墓碑摘要
    motivation: "Spirit Airlines 以超低成本航空模式起家，试图通过极低票价和附加服务收费吸引价格敏感旅客，在竞争激烈的美国航空市场占据一席之地。然而，疫情后燃油成本飙升、劳动力短缺和同质化竞争使其成本结构失衡，最终走向破产。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "疫情后燃油成本上升、劳动力短缺导致运营成本大幅增加" },
      { layer: "深层原因", detail: "超低成本航空模式在竞争加剧下利润空间被持续压缩，缺乏差异化优势" },
      { layer: "根本原因", detail: "成本结构失衡，无法在票价与成本之间找到可持续平衡，最终破产" },
    ],
    lessons: [  // 教训与避坑清单
      "低成本模式需警惕成本波动风险，建立弹性成本结构",
      "同质化竞争中，仅靠低价难以形成长期壁垒",
      "破产后数据资产仍具价值，但需注意合规与隐私风险",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "qclaw",  // QClaw
    name: "QClaw",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2025",  // 成立年份
    closedYear: "2026",  // 关闭年份
    region: "中国",  // 国家/地区
    industry: "AI Agent / 本地智能体",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 12,  // 存活时长
    totalFunding: "未披露（腾讯内部资源投入）",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "成立", event: "腾讯基于开源 OpenClaw 启动 QClaw 本地 Agent 项目" },
      { date: "", type: "危机", event: "QClaw 进入内部孵化与测试阶段，主打本地部署与隐私安全" },
      { date: "", type: "关闭", event: "腾讯决定关停 QClaw，放弃基于 OpenClaw 的本地 Agent 路线" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "QClaw 诞生于 2025 年 AI Agent 爆发期，腾讯希望借助开源项目 OpenClaw 快速切入本地智能体赛道，利用自身生态与流量优势，探索个人电脑端 AI 助手的落地场景。团队试图以本地部署、隐私安全为卖点，区别于云端 Agent 产品，在巨头林立的市场中抢占先机。然而，本地 Agent 路线在用户付费意愿、生态整合与商业变现上始终未能跑通，最终被腾讯战略放弃。",  // 编辑摘要
    postmortem: "表层原因\n腾讯官方宣布关停 QClaw，产品停止运营\n中层原因\n基于 OpenClaw 的本地 Agent 路线未能形成清晰的商业化路径，用户付费与生态整合困难\n深层原因\n大厂内部孵化项目面临战略优先级调整，本地 Agent 与腾讯现有云端 AI 布局存在资源冲突\n根本原因\nAI Agent 赛道竞争激烈，本地部署模式在成本、体验与变现上难以与云端方案抗衡",  // 详细 post-mortem
    sources: ["OSCHINA"],  // 来源链接
    founderBg: "腾讯内部团队（大厂内部孵化项目）",  // 创始人背景
    epitaph: "背靠腾讯，借力 OpenClaw，\\n本地 Agent 的梦只做了一年，\\n大厂资源也救不了没有商业闭环的路线。",  // 墓碑摘要
    motivation: "QClaw 诞生于 2025 年 AI Agent 爆发期，腾讯希望借助开源项目 OpenClaw 快速切入本地智能体赛道，利用自身生态与流量优势，探索个人电脑端 AI 助手的落地场景。团队试图以本地部署、隐私安全为卖点，区别于云端 Agent 产品，在巨头林立的市场中抢占先机。然而，本地 Agent 路线在用户付费意愿、生态整合与商业变现上始终未能跑通，最终被腾讯战略放弃。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "腾讯官方宣布关停 QClaw，产品停止运营" },
      { layer: "中层原因", detail: "基于 OpenClaw 的本地 Agent 路线未能形成清晰的商业化路径，用户付费与生态整合困难" },
      { layer: "深层原因", detail: "大厂内部孵化项目面临战略优先级调整，本地 Agent 与腾讯现有云端 AI 布局存在资源冲突" },
      { layer: "根本原因", detail: "AI Agent 赛道竞争激烈，本地部署模式在成本、体验与变现上难以与云端方案抗衡" },
    ],
    lessons: [  // 教训与避坑清单
      "开源项目二次封装不等于产品壁垒，缺乏核心差异化容易被战略放弃",
      "大厂内部孵化项目需尽早验证商业闭环，否则随时可能因战略调整被关停",
      "本地 Agent 路线在用户付费意愿和生态整合上挑战巨大，需谨慎评估",
      "AI 创业应避免与母公司主业资源冲突，否则难以获得持续投入",
      "技术路线选择需匹配市场需求，隐私安全卖点未必能转化为商业价值",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "tencent-lobster",  // 腾讯龙虾
    name: "腾讯龙虾",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "",  // 成立年份
    closedYear: "2024-12-24",  // 关闭年份
    region: "中国",  // 国家/地区
    industry: "AI办公/智能助手",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 0,  // 存活时长
    totalFunding: "",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "同质化竞争",  // 主标签（六死因）
    secondaryTags: ["收购后关停"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "产品发布", event: "腾讯内部孵化推出“龙虾”AI助手产品" },
      { date: "", type: "危机", event: "腾讯宣布“龙虾”因业务发展调整停运" },
      { date: "", type: "关闭", event: "“龙虾”正式停止服务，用户可迁移至WorkBuddy" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "腾讯推出“龙虾”意在切入AI智能助手与办公协作赛道，借助大厂技术与流量优势快速占领市场。然而在腾讯内部，同类产品WorkBuddy已占据相似定位，龙虾未能形成差异化壁垒。当公司战略聚焦、资源需要集中时，功能重叠的产品便成为被整合对象。创业动机源于对AI办公风口的追逐，却忽视了内部赛马带来的同质化消耗，最终在业务调整中黯然退场。",  // 编辑摘要
    postmortem: "表层原因\n腾讯官方称停运系业务发展调整，产品功能与WorkBuddy重叠，用户被引导迁移\n中层原因\n腾讯内部同类AI办公产品并行，资源分散，龙虾未能建立独立用户心智与差异化场景\n深层原因\n大厂赛马机制下，非核心产品在战略收缩期优先被裁撤，缺乏独立商业化验证与外部获客能力",  // 详细 post-mortem
    sources: ["ThePaper.cn"],  // 来源链接
    founderBg: "腾讯内部孵化项目，背靠腾讯大厂资源与AI技术团队",  // 创始人背景
    epitaph: "生于大厂光环，死于内部重叠。\\n2024年12月24日，龙虾停止服务，\\n用户被劝迁至WorkBuddy，连告别都只是一句业务调整。",  // 墓碑摘要
    motivation: "腾讯推出“龙虾”意在切入AI智能助手与办公协作赛道，借助大厂技术与流量优势快速占领市场。然而在腾讯内部，同类产品WorkBuddy已占据相似定位，龙虾未能形成差异化壁垒。当公司战略聚焦、资源需要集中时，功能重叠的产品便成为被整合对象。创业动机源于对AI办公风口的追逐，却忽视了内部赛马带来的同质化消耗，最终在业务调整中黯然退场。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "腾讯官方称停运系业务发展调整，产品功能与WorkBuddy重叠，用户被引导迁移" },
      { layer: "中层原因", detail: "腾讯内部同类AI办公产品并行，资源分散，龙虾未能建立独立用户心智与差异化场景" },
      { layer: "深层原因", detail: "大厂赛马机制下，非核心产品在战略收缩期优先被裁撤，缺乏独立商业化验证与外部获客能力" },
    ],
    lessons: [  // 教训与避坑清单
      "大厂内部创业需警惕同类产品赛马，功能重叠会加速被整合",
      "AI助手赛道同质化严重，缺乏差异化场景难以独立存活",
      "背靠大厂不等于安全，战略调整时非核心业务最先被牺牲",
      "产品停运前应提前构建用户迁移与数据保留方案，减少信任损耗",
      "创业项目需尽早验证独立商业模式，避免完全依赖内部资源输血",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "yola-fresh",  // YoLa Fresh
    name: "YoLa Fresh",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "",  // 成立年份
    closedYear: "",  // 关闭年份
    region: "摩洛哥",  // 国家/地区
    industry: "农业科技",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 0,  // 存活时长
    totalFunding: "",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: ["资金断裂"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "成立", event: "YoLa Fresh 成立，进入摩洛哥农业科技领域" },
      { date: "", type: "危机", event: "尝试搭建农产品数字化流通平台" },
      { date: "", type: "融资", event: "未能获得后续融资，公司宣布关闭" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "YoLa Fresh 的创始团队希望借助科技手段改造摩洛哥传统农业供应链，解决农户与市场之间的信息不对称和流通效率低下的问题。他们相信，通过数字化平台可以缩短中间环节，让农产品更快、更便宜地到达消费者手中，同时提高农民收入。带着这一愿景，团队投身农业科技创业，试图在摩洛哥这片农业占重要地位的土地上，打造一个可持续的农产品流通新模式。然而，理想丰满，现实骨感，融资的失败最终让这一愿景戛然而止。",  // 编辑摘要
    postmortem: "表层原因\n未能成功获得新一轮融资，导致资金链断裂，无法继续运营。\n深层原因\n农业科技创业在摩洛哥属于新兴领域，资本市场对这类项目的投资意愿有限，且盈利周期长，难以在短期内证明商业价值。\n根本原因\n商业模式可能过度依赖外部融资，缺乏自我造血能力，一旦融资环境收紧便难以为继。",  // 详细 post-mortem
    sources: ["Tech In Africa"],  // 来源链接
    founderBg: "未披露",  // 创始人背景
    epitaph: "曾想用科技连接农田与餐桌，\\n却在资本的寒冬里断了粮，\\n摩洛哥农技梦，止于融资失败。",  // 墓碑摘要
    motivation: "YoLa Fresh 的创始团队希望借助科技手段改造摩洛哥传统农业供应链，解决农户与市场之间的信息不对称和流通效率低下的问题。他们相信，通过数字化平台可以缩短中间环节，让农产品更快、更便宜地到达消费者手中，同时提高农民收入。带着这一愿景，团队投身农业科技创业，试图在摩洛哥这片农业占重要地位的土地上，打造一个可持续的农产品流通新模式。然而，理想丰满，现实骨感，融资的失败最终让这一愿景戛然而止。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "未能成功获得新一轮融资，导致资金链断裂，无法继续运营。" },
      { layer: "深层原因", detail: "农业科技创业在摩洛哥属于新兴领域，资本市场对这类项目的投资意愿有限，且盈利周期长，难以在短期内证明商业价值。" },
      { layer: "根本原因", detail: "商业模式可能过度依赖外部融资，缺乏自我造血能力，一旦融资环境收紧便难以为继。" },
    ],
    lessons: [  // 教训与避坑清单
      "农业科技创业需警惕长回报周期与融资环境的不确定性。",
      "在资本不活跃的市场，尽早探索自我造血能力比依赖融资更重要。",
      "创业前应充分验证商业模式在本地市场的可行性，避免盲目扩张。",
      "融资失败往往是表象，深层问题在于价值主张与市场需求的匹配度。",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "relay",  // Relay
    name: "Relay",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "",  // 成立年份
    closedYear: "",  // 关闭年份
    region: "未在文章中披露",  // 国家/地区
    industry: "AI/科技（浏览器/Chrome扩展工具）",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 0,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "同质化竞争",  // 主标签（六死因）
    secondaryTags: ["团队解散"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "危机", event: "Relay 作为科技产品/团队运营" },
      { date: "", type: "关闭", event: "Relay 关停" },
      { date: "", type: "危机", event: "团队被 Google Chrome acqui-hire" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "文章仅报道 Relay 关停、团队加入 Google Chrome 的 acqui-hire 结果，未披露创始人的具体创业动机、背景或产品初衷。因此无法基于事实还原其创业动机，只能确认这是一次以团队被收购、产品停止运营为结局的科技创业案例。",  // 编辑摘要
    postmortem: "表层原因\nRelay 宣布关停，团队整体加入 Google Chrome，属于 acqui-hire 而非产品独立成功退出。\n深层原因\n文章未披露具体经营数据与失败细节，仅能确认产品未能独立持续运营，最终以团队被大厂吸收收场。\n行业背景\n浏览器与 Chrome 扩展赛道竞争激烈，同类工具众多，独立产品面临同质化竞争与平台方挤压。",  // 详细 post-mortem
    sources: ["The Tech Buzz"],  // 来源链接
    founderBg: "未在文章中披露",  // 创始人背景
    epitaph: "Relay 关停，团队并入 Google Chrome。\\n没有独立退出，只有 acqui-hire。\\n产品止步，人继续走。",  // 墓碑摘要
    motivation: "文章仅报道 Relay 关停、团队加入 Google Chrome 的 acqui-hire 结果，未披露创始人的具体创业动机、背景或产品初衷。因此无法基于事实还原其创业动机，只能确认这是一次以团队被收购、产品停止运营为结局的科技创业案例。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "Relay 宣布关停，团队整体加入 Google Chrome，属于 acqui-hire 而非产品独立成功退出。" },
      { layer: "深层原因", detail: "文章未披露具体经营数据与失败细节，仅能确认产品未能独立持续运营，最终以团队被大厂吸收收场。" },
      { layer: "行业背景", detail: "浏览器与 Chrome 扩展赛道竞争激烈，同类工具众多，独立产品面临同质化竞争与平台方挤压。" },
    ],
    lessons: [  // 教训与避坑清单
      "acqui-hire 不等于创业成功，产品关停意味着用户价值未持续兑现。",
      "浏览器工具赛道同质化严重，独立产品需建立难以复制的壁垒。",
      "平台方既是分发渠道也是潜在竞争者，需提前评估被吸收风险。",
      "文章信息有限，提醒研究者对未披露数据保持谨慎，不编造细节。",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: false,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "moonwell-mamo-oracle-exploit",  // Moonwell
    name: "Moonwell",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2020",  // 成立年份
    closedYear: "2025-11",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "DeFi 借贷协议",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 60,  // 存活时长
    totalFunding: "870万美元（被盗损失）",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "合规与决策风险",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "成立", event: "Moonwell 协议成立，定位为去中心化借贷市场" },
      { date: "", type: "产品发布", event: "上线 MAMO 等新抵押资产，扩大借贷品类" },
      { date: "", type: "危机", event: "攻击者操纵 MAMO 价格，从协议中盗取 870 万美元" },
      { date: "", type: "危机", event: "协议流动性枯竭，Moonwell 实质停运" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "Moonwell 团队希望构建一个开放、无需许可的 DeFi 借贷市场，让全球用户都能通过加密资产获得流动性。他们相信去中心化金融能替代传统银行的中介角色，并通过 MAMO 等资产扩展抵押品类。然而，协议在追求资产多样化和高收益的同时，低估了预言机价格操纵的风险，最终因一次针对 MAMO 价格的攻击而损失 870 万美元，暴露了 DeFi 协议在安全与风控上的结构性脆弱。",  // 编辑摘要
    postmortem: "表层原因\n攻击者通过操纵 MAMO 代币价格，利用预言机报价漏洞超额借贷并抽走资金\n中层原因\n协议对低流动性抵押资产的预言机设计缺乏防护，未设置价格偏差阈值与延迟机制\n深层原因\n团队在追求资产多样化和 TVL 增长时，将安全审计与风控优先级置于扩张之后\n根本原因\nDeFi 协议依赖外部价格源，但治理与决策层未建立足够的风险缓冲和应急熔断机制",  // 详细 post-mortem
    sources: ["Startup Fortune"],  // 来源链接
    founderBg: "DeFi 借贷协议团队，核心成员来自区块链与金融工程背景",  // 创始人背景
    epitaph: "预言机被操纵，870 万美元一夜蒸发；\\n代码审计的缺口，成了协议的墓穴；\\nDeFi 的信任，比价格更脆弱。",  // 墓碑摘要
    motivation: "Moonwell 团队希望构建一个开放、无需许可的 DeFi 借贷市场，让全球用户都能通过加密资产获得流动性。他们相信去中心化金融能替代传统银行的中介角色，并通过 MAMO 等资产扩展抵押品类。然而，协议在追求资产多样化和高收益的同时，低估了预言机价格操纵的风险，最终因一次针对 MAMO 价格的攻击而损失 870 万美元，暴露了 DeFi 协议在安全与风控上的结构性脆弱。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "攻击者通过操纵 MAMO 代币价格，利用预言机报价漏洞超额借贷并抽走资金" },
      { layer: "中层原因", detail: "协议对低流动性抵押资产的预言机设计缺乏防护，未设置价格偏差阈值与延迟机制" },
      { layer: "深层原因", detail: "团队在追求资产多样化和 TVL 增长时，将安全审计与风控优先级置于扩张之后" },
      { layer: "根本原因", detail: "DeFi 协议依赖外部价格源，但治理与决策层未建立足够的风险缓冲和应急熔断机制" },
    ],
    lessons: [  // 教训与避坑清单
      "低流动性资产的预言机必须设置价格偏差阈值和延迟更新机制",
      "协议扩张抵押品类时，安全审计应与业务增长同步甚至优先",
      "DeFi 协议需建立应急熔断与资金隔离机制，防止单点漏洞掏空全部流动性",
      "治理决策不能只看 TVL 和收益率，必须量化预言机操纵风险",
      "被盗后的偿付能力危机往往比黑客攻击本身更致命",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "vinyasa-ai-saas",  // Vinyasa
    name: "Vinyasa",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "",  // 成立年份
    closedYear: "",  // 关闭年份
    region: "印度",  // 国家/地区
    industry: "AI SaaS（面向心理治疗师）",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 0,  // 存活时长
    totalFunding: "",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "需求验证缺失",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "成立", event: "Divya Shah 创立 Vinyasa，定位为面向心理治疗师的 AI SaaS" },
      { date: "", type: "危机", event: "产品开发与运营推进，尝试获取治疗师用户" },
      { date: "", type: "关闭", event: "创始人 Divya Shah 宣布关停 Vinyasa" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "Divya Shah 观察到心理治疗师在日常运营中面临行政负担重、记录与排程繁琐等痛点，希望借助 AI 技术为这一专业群体打造一款垂直 SaaS 工具，提升治疗师的工作效率，让他们能把更多精力放在患者身上。她相信心理健康赛道的数字化需求正在增长，AI 能成为撬动这一市场的关键杠杆，于是创立 Vinyasa，试图以技术切入治疗师工作流。",  // 编辑摘要
    postmortem: "表层原因\n创始人主动宣布关停产品，业务停止运营\n深层原因\n面向心理治疗师的 AI SaaS 未能验证出足够真实、持续的市场需求\n根本原因\n垂直细分赛道用户规模有限，产品价值主张与付费意愿未被打通",  // 详细 post-mortem
    sources: ["ascendants.in"],  // 来源链接
    founderBg: "创始人 Divya Shah，具体背景文章未详细披露",  // 创始人背景
    epitaph: "为治疗师打造的AI SaaS，\\n在需求验证前就耗尽了时间与信任，\\n创始人亲手按下终止键。",  // 墓碑摘要
    motivation: "Divya Shah 观察到心理治疗师在日常运营中面临行政负担重、记录与排程繁琐等痛点，希望借助 AI 技术为这一专业群体打造一款垂直 SaaS 工具，提升治疗师的工作效率，让他们能把更多精力放在患者身上。她相信心理健康赛道的数字化需求正在增长，AI 能成为撬动这一市场的关键杠杆，于是创立 Vinyasa，试图以技术切入治疗师工作流。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "创始人主动宣布关停产品，业务停止运营" },
      { layer: "深层原因", detail: "面向心理治疗师的 AI SaaS 未能验证出足够真实、持续的市场需求" },
      { layer: "根本原因", detail: "垂直细分赛道用户规模有限，产品价值主张与付费意愿未被打通" },
    ],
    lessons: [  // 教训与避坑清单
      "垂直 SaaS 必须先验证真实付费需求，再投入产品开发",
      "小众专业群体的市场规模可能不足以支撑独立 SaaS 业务",
      "创始人主动关停也是一种止损，避免持续消耗资源",
      "AI 技术本身不是需求，找到愿意付费的场景才是关键",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: false,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "vostorq",  // Vostorq
    name: "Vostorq",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2025",  // 成立年份
    closedYear: "",  // 关闭年份
    region: "未知",  // 国家/地区
    industry: "企业协作软件/内部沟通工具",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 0,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "需求验证缺失",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "关键招聘", event: "创始人加入一家Slack优先公司，约一个月后离职" },
      { date: "", type: "关键招聘", event: "受离职经历触动，决定将搁置多年的“工作论坛”概念落地" },
      { date: "", type: "危机", event: "借助AI工具，独立完成Vostorq大部分MVP开发及周边内容" },
      { date: "", type: "产品发布", event: "发布公开演示工作区，公开征求反馈并询问企业是否存在该沟通问题" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "创始人曾加入一家推行Slack优先沟通政策的公司，原以为能解决多工具混乱，实际却遭遇问题被淹没、讨论碎片化、重要话题被跳过遗忘。他仅待了约一个月便离职，这段经历让他确信需要一种“工作论坛”式的沟通工具。他此前已有一个概念验证搁置多年，始终不确定是否有人需要，这一个月的经历说服了他。借助AI，他作为独立创始人用几个月完成了代码、落地页、帮助文档和视频等大部分工作，推出Vostorq。",  // 编辑摘要
    postmortem: "表层原因\n产品仍处MVP阶段，缺少移动应用和第三方集成，功能不完整\n深层原因\n需求验证缺失，创始人仅凭个人一个月的负面体验推断企业普遍存在沟通痛点，未做系统性市场验证\n根本原因\n以“论坛替代聊天”为卖点，在2026年属于逆主流方向，企业协作市场已被Slack、Teams等占据，切换成本高且缺乏明确付费意愿证据\n外部环境\n同类尝试如Threads.com已关闭，Twist、Basecamp等也未成为主流，说明该品类长期难以突破",  // 详细 post-mortem
    sources: ["vostorq.com"],  // 来源链接
    founderBg: "独立开发者，曾在一家推行Slack优先沟通政策的公司工作约一个月后离职，拥有多年论坛式工作沟通的产品构想",  // 创始人背景
    epitaph: "一个人的论坛梦，\\n用AI几个月造出MVP，\\n却还没找到第二个相信的人。",  // 墓碑摘要
    motivation: "创始人曾加入一家推行Slack优先沟通政策的公司，原以为能解决多工具混乱，实际却遭遇问题被淹没、讨论碎片化、重要话题被跳过遗忘。他仅待了约一个月便离职，这段经历让他确信需要一种“工作论坛”式的沟通工具。他此前已有一个概念验证搁置多年，始终不确定是否有人需要，这一个月的经历说服了他。借助AI，他作为独立创始人用几个月完成了代码、落地页、帮助文档和视频等大部分工作，推出Vostorq。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "产品仍处MVP阶段，缺少移动应用和第三方集成，功能不完整" },
      { layer: "深层原因", detail: "需求验证缺失，创始人仅凭个人一个月的负面体验推断企业普遍存在沟通痛点，未做系统性市场验证" },
      { layer: "根本原因", detail: "以“论坛替代聊天”为卖点，在2026年属于逆主流方向，企业协作市场已被Slack、Teams等占据，切换成本高且缺乏明确付费意愿证据" },
      { layer: "外部环境", detail: "同类尝试如Threads.com已关闭，Twist、Basecamp等也未成为主流，说明该品类长期难以突破" },
    ],
    lessons: [  // 教训与避坑清单
      "个人痛点不等于市场需求，创业前应做系统性用户验证而非凭单一经历下结论",
      "逆主流的产品方向需要更强的价值证明和迁移理由，否则难以撼动既有生态",
      "MVP阶段缺少移动端和集成会显著限制企业采用，应优先补齐关键能力",
      "独立开发者借助AI可快速构建产品，但产品成功仍取决于需求真实性和分发能力",
      "公开询问“是否只有我遇到这个问题”本身说明需求验证尚未完成，不应在此时投入过多开发",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: false,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "anuneko",  // AnuNeko
    name: "AnuNeko",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2025-11",  // 成立年份
    closedYear: "2025-12",  // 关闭年份
    region: "中国",  // 国家/地区
    industry: "AI游戏/虚拟陪伴",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 1,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "需求验证缺失",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "产品发布", event: "AnuNeko上线Steam平台" },
      { date: "", type: "产品发布", event: "官方宣布停服，上线不到一个月" },
      { date: "", type: "危机", event: "媒体报道引发行业关注与讨论" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "米哈游在AI与虚拟角色领域持续布局，希望借助大模型技术打造新一代互动陪伴产品。AnuNeko被定位为AI驱动的虚拟角色项目，承载着公司在AI游戏化方向上的探索野心。团队试图用Agent技术让虚拟角色具备更自然的对话与情感反馈，从而开辟区别于传统二次元游戏的新赛道。然而这一尝试从立项到上线节奏极快，产品尚未经过充分的需求验证与打磨便仓促面世，最终在市场上未能激起水花。",  // 编辑摘要
    postmortem: "表层原因\n产品上线不到一个月即宣布停服，用户留存与活跃度极低\n中层原因\nAI虚拟陪伴产品定位模糊，未能形成清晰的差异化体验\n深层原因\n立项到上线周期过短，缺乏充分的需求验证与用户测试\n外部因素\nAI陪伴赛道竞争激烈，同类产品已占据用户心智",  // 详细 post-mortem
    sources: ["新浪财经"],  // 来源链接
    founderBg: "米哈游旗下团队",  // 创始人背景
    epitaph: "上线不足一月便谢幕，\\nAI陪伴的想象未能留住玩家，\\n米哈游的新作成了最短命的实验。",  // 墓碑摘要
    motivation: "米哈游在AI与虚拟角色领域持续布局，希望借助大模型技术打造新一代互动陪伴产品。AnuNeko被定位为AI驱动的虚拟角色项目，承载着公司在AI游戏化方向上的探索野心。团队试图用Agent技术让虚拟角色具备更自然的对话与情感反馈，从而开辟区别于传统二次元游戏的新赛道。然而这一尝试从立项到上线节奏极快，产品尚未经过充分的需求验证与打磨便仓促面世，最终在市场上未能激起水花。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "产品上线不到一个月即宣布停服，用户留存与活跃度极低" },
      { layer: "中层原因", detail: "AI虚拟陪伴产品定位模糊，未能形成清晰的差异化体验" },
      { layer: "深层原因", detail: "立项到上线周期过短，缺乏充分的需求验证与用户测试" },
      { layer: "外部因素", detail: "AI陪伴赛道竞争激烈，同类产品已占据用户心智" },
    ],
    lessons: [  // 教训与避坑清单
      "AI概念不能替代需求验证，仓促上线只会加速失败",
      "大厂内部孵化项目同样需要遵循产品打磨的基本规律",
      "虚拟陪伴赛道需明确核心用户场景，避免定位模糊",
      "上线节奏过快会压缩迭代空间，导致问题无法及时修正",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "openai-atlas-browser",  // OpenAI Atlas 浏览器
    name: "OpenAI Atlas 浏览器",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2025-10",  // 成立年份
    closedYear: "2026-08",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "AI 浏览器 / 消费级互联网产品",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 9,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "同质化竞争",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "产品发布", event: "OpenAI 推出 AI 浏览器 Atlas，被外界称为 Chrome 杀手" },
      { date: "", type: "危机", event: "Atlas 以 AI 搜索、网页摘要等能力吸引早期尝鲜用户" },
      { date: "", type: "产品发布", event: "Atlas 上线 292 天后宣布关停" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "OpenAI 在 ChatGPT 获得巨大成功后，希望把 AI 能力从对话窗口延伸到用户上网的第一入口——浏览器。团队判断，生成式 AI 可以重构搜索、摘要与网页交互，从而绕开 Google 的搜索广告体系，直接掌握流量入口。Atlas 被定位为“Chrome 杀手”，试图用 AI 原生体验吸引用户迁移。然而浏览器是典型的高迁移成本、强网络效应产品，用户习惯、扩展生态与默认设置构成坚固护城河，仅靠 AI 功能难以完成入口替代。",  // 编辑摘要
    postmortem: "表层原因\n产品功能与 Chrome 高度重叠，AI 特性可被插件和竞品快速复制，缺乏不可替代性\n深层原因\n浏览器市场由默认入口、扩展生态和账号体系锁定，用户迁移成本极高，网络效应向 Chrome 集中\n战略原因\nOpenAI 以对话产品思维做入口型产品，低估了浏览器分发的渠道壁垒与长期补贴需求\n商业原因\n缺乏独立变现路径，难以在 Chrome 的广告与生态体系外建立可持续商业模式",  // 详细 post-mortem
    sources: ["CSDN博客"],  // 来源链接
    founderBg: "OpenAI 团队，依托 ChatGPT 生态与 AI 技术积累",  // 创始人背景
    epitaph: "号称 Chrome 杀手，只活了 292 天。\\nAI 能重写搜索框，却撬不动十亿人的默认浏览器。\\n入口之战，输在习惯而非技术。",  // 墓碑摘要
    motivation: "OpenAI 在 ChatGPT 获得巨大成功后，希望把 AI 能力从对话窗口延伸到用户上网的第一入口——浏览器。团队判断，生成式 AI 可以重构搜索、摘要与网页交互，从而绕开 Google 的搜索广告体系，直接掌握流量入口。Atlas 被定位为“Chrome 杀手”，试图用 AI 原生体验吸引用户迁移。然而浏览器是典型的高迁移成本、强网络效应产品，用户习惯、扩展生态与默认设置构成坚固护城河，仅靠 AI 功能难以完成入口替代。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "产品功能与 Chrome 高度重叠，AI 特性可被插件和竞品快速复制，缺乏不可替代性" },
      { layer: "深层原因", detail: "浏览器市场由默认入口、扩展生态和账号体系锁定，用户迁移成本极高，网络效应向 Chrome 集中" },
      { layer: "战略原因", detail: "OpenAI 以对话产品思维做入口型产品，低估了浏览器分发的渠道壁垒与长期补贴需求" },
      { layer: "商业原因", detail: "缺乏独立变现路径，难以在 Chrome 的广告与生态体系外建立可持续商业模式" },
    ],
    lessons: [  // 教训与避坑清单
      "技术领先不等于入口替代，浏览器竞争的核心是默认设置与生态锁定",
      "AI 功能容易被插件化复制，产品护城河不能只建立在模型能力上",
      "大厂内部孵化项目同样需要独立的需求验证与分发策略，不能依赖品牌光环",
      "进入高迁移成本市场前，应评估用户习惯与渠道壁垒，而非只评估技术可行性",
      "292 天的生命周期说明，入口级产品的失败往往不是技术问题，而是生态与习惯问题",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "figma-ai-plugin-shutdown",  // Figma AI 插件（独立开发者产品）
    name: "Figma AI 插件（独立开发者产品）",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "未知",  // 成立年份
    closedYear: "2024",  // 关闭年份
    region: "全球（远程）",  // 国家/地区
    industry: "AI 设计工具 / 插件",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 0,  // 存活时长
    totalFunding: "百亿 Token（约合大量 API 调用成本）",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "同质化竞争",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "成立", event: "独立开发者启动 Figma AI 插件项目" },
      { date: "", type: "产品发布", event: "产品上线，消耗百亿 Token 进行 AI 功能调用" },
      { date: "", type: "产品发布", event: "Figma 官方推出原生 AI 功能，直接覆盖插件核心能力" },
      { date: "", type: "关闭", event: "用户迅速流失，产品一夜归零，被迫关停" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "独立开发者看准 Figma 生态中 AI 辅助设计的空白，投入大量资源调用大模型 Token，打造了一款能自动生成设计稿、优化图层结构的 AI 插件。产品上线后获得一定用户，开发者希望借助 Figma 庞大的设计师群体实现增长与变现。然而，Figma 官方随后推出原生 AI 功能，直接覆盖了该插件的核心价值，用户迅速流失，产品被迫关停。",  // 编辑摘要
    postmortem: "表层原因\nFigma 官方发布原生 AI 功能，与独立插件功能高度重合，用户无需再安装第三方插件\n深层原因\n独立开发者依赖平台生态，缺乏护城河，平台一旦自研即可瞬间取代\n根本原因\nAI 插件同质化严重，核心能力可被平台快速复制，商业模式建立在平台善意之上\n成本因素\n百亿 Token 的 API 调用成本高昂，产品关停后投入无法回收",  // 详细 post-mortem
    sources: ["80aj.com"],  // 来源链接
    founderBg: "独立开发者，具体背景未披露",  // 创始人背景
    epitaph: "烧掉百亿 Token，换来一夜归零。\\n平台一出手，插件即坟墓。\\n独立开发者的 AI 梦，碎在 Figma 的更新日志里。",  // 墓碑摘要
    motivation: "独立开发者看准 Figma 生态中 AI 辅助设计的空白，投入大量资源调用大模型 Token，打造了一款能自动生成设计稿、优化图层结构的 AI 插件。产品上线后获得一定用户，开发者希望借助 Figma 庞大的设计师群体实现增长与变现。然而，Figma 官方随后推出原生 AI 功能，直接覆盖了该插件的核心价值，用户迅速流失，产品被迫关停。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "Figma 官方发布原生 AI 功能，与独立插件功能高度重合，用户无需再安装第三方插件" },
      { layer: "深层原因", detail: "独立开发者依赖平台生态，缺乏护城河，平台一旦自研即可瞬间取代" },
      { layer: "根本原因", detail: "AI 插件同质化严重，核心能力可被平台快速复制，商业模式建立在平台善意之上" },
      { layer: "成本因素", detail: "百亿 Token 的 API 调用成本高昂，产品关停后投入无法回收" },
    ],
    lessons: [  // 教训与避坑清单
      "不要在大平台生态上构建核心功能，平台随时可能自研并取代你",
      "AI 应用层创业需建立数据、网络效应或垂直深度等护城河",
      "Token 成本是 AI 产品的重要成本结构，需提前评估可持续性",
      "独立开发者应选择平台难以覆盖的细分场景或跨平台方案",
      "产品归零往往不是技术失败，而是生态位被平台挤压",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: false,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "reforged-labs",  // Reforged Labs
    name: "Reforged Labs",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "",  // 成立年份
    closedYear: "",  // 关闭年份
    region: "未知",  // 国家/地区
    industry: "AI游戏营销",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 0,  // 存活时长
    totalFunding: "",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "需求验证缺失",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "成立", event: "Reforged Labs 成立，定位 AI 游戏营销" },
      { date: "", type: "危机", event: "公司对外运营，向游戏发行商销售 AI 营销方案" },
      { date: "", type: "产品发布", event: "创始人公开表示所售卖的缺口正在关闭" },
      { date: "", type: "关闭", event: "公司宣布关闭" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "Reforged Labs 是一家试图用人工智能改造游戏营销环节的初创公司。创始团队相信，游戏发行商在用户获取与营销素材制作上存在效率痛点，AI 可以自动生成和优化广告创意，从而替代昂贵且缓慢的人工流程。他们押注这一细分需求会持续扩大，并以此为核心构建产品与商业模式。然而，这一判断建立在市场缺口长期存在的前提之上，当行业环境变化、缺口收窄，公司便失去了立足之地。",  // 编辑摘要
    postmortem: "表层原因\n公司所依赖的市场缺口正在关闭，客户不再需要其提供的 AI 营销解决方案\n深层原因\n需求验证不足，商业模式建立在行业结构性缺口长期存在的假设之上\n根本原因\nAI 营销赛道同质化与平台方自建能力增强，独立第三方空间被压缩",  // 详细 post-mortem
    sources: ["GamesIndustry.biz"],  // 来源链接
    founderBg: "未披露",  // 创始人背景
    epitaph: "我们卖的是正在消失的缺口，\\n当缺口合上，\\n公司也随之关闭。",  // 墓碑摘要
    motivation: "Reforged Labs 是一家试图用人工智能改造游戏营销环节的初创公司。创始团队相信，游戏发行商在用户获取与营销素材制作上存在效率痛点，AI 可以自动生成和优化广告创意，从而替代昂贵且缓慢的人工流程。他们押注这一细分需求会持续扩大，并以此为核心构建产品与商业模式。然而，这一判断建立在市场缺口长期存在的前提之上，当行业环境变化、缺口收窄，公司便失去了立足之地。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "公司所依赖的市场缺口正在关闭，客户不再需要其提供的 AI 营销解决方案" },
      { layer: "深层原因", detail: "需求验证不足，商业模式建立在行业结构性缺口长期存在的假设之上" },
      { layer: "根本原因", detail: "AI 营销赛道同质化与平台方自建能力增强，独立第三方空间被压缩" },
    ],
    lessons: [  // 教训与避坑清单
      "创业假设必须验证市场缺口是否可持续，而非仅确认当下存在",
      "当核心价值依赖外部结构性缺口时，需提前准备转型路径",
      "AI 应用层公司要警惕平台方或行业变化快速抹平自身价值",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "unnamed-founder-startup-failure",  // 未具名创业公司（创始人自述）
    name: "未具名创业公司（创始人自述）",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "未知",  // 成立年份
    closedYear: "未知",  // 关闭年份
    region: "印度",  // 国家/地区
    industry: "科技/互联网创业",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 0,  // 存活时长
    totalFunding: "未知",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: ["创始人退出"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "危机", event: "创始人持有年薪45万卢比的工作" },
      { date: "", type: "危机", event: "放弃高薪工作，全职投入创业" },
      { date: "", type: "危机", event: "创业项目未能建立可持续商业模式" },
      { date: "", type: "危机", event: "资金耗尽，创业失败，失去一切" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "创始人原本拥有一份年薪45万卢比的稳定工作，但内心对创业的渴望让他选择放弃高薪，投身创业浪潮。他希望通过自己的努力打造一番事业，实现财务自由与个人价值。然而，创业的残酷远超预期，缺乏对市场需求的充分验证和可持续商业模式的构建，最终导致积蓄耗尽、事业归零。他的故事成为许多冲动创业者的警示：高薪不是枷锁，盲目创业才是真正的风险。",  // 编辑摘要
    postmortem: "表层原因\n创业项目未能产生稳定收入，资金链断裂\n中层原因\n创始人缺乏对市场需求的充分验证，产品与市场匹配度不足\n深层原因\n放弃高薪后缺乏风险缓冲，个人财务与创业资金混同，抗风险能力极低\n根本原因\n商业模式脆弱，未能找到可复制、可盈利的路径",  // 详细 post-mortem
    sources: ["NDTV"],  // 来源链接
    founderBg: "创始人此前年薪45万卢比（约合人民币3.8万元），放弃高薪工作全职创业",  // 创始人背景
    epitaph: "他放弃了45万卢比的年薪，\\n换来的是一无所有。\\n创业不是勇气的赌注，而是验证的修行。",  // 墓碑摘要
    motivation: "创始人原本拥有一份年薪45万卢比的稳定工作，但内心对创业的渴望让他选择放弃高薪，投身创业浪潮。他希望通过自己的努力打造一番事业，实现财务自由与个人价值。然而，创业的残酷远超预期，缺乏对市场需求的充分验证和可持续商业模式的构建，最终导致积蓄耗尽、事业归零。他的故事成为许多冲动创业者的警示：高薪不是枷锁，盲目创业才是真正的风险。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "创业项目未能产生稳定收入，资金链断裂" },
      { layer: "中层原因", detail: "创始人缺乏对市场需求的充分验证，产品与市场匹配度不足" },
      { layer: "深层原因", detail: "放弃高薪后缺乏风险缓冲，个人财务与创业资金混同，抗风险能力极低" },
      { layer: "根本原因", detail: "商业模式脆弱，未能找到可复制、可盈利的路径" },
    ],
    lessons: [  // 教训与避坑清单
      "高薪不是创业的障碍，但盲目放弃高薪是高风险决策，应保留至少6-12个月的生活缓冲金",
      "创业前必须验证市场需求，而非仅凭热情和想法就全职投入",
      "个人财务与创业资金必须严格分离，避免失败后陷入全面财务危机",
      "创业失败不等于人生失败，但需要从失败中提炼可复用的认知，而非仅停留在情绪宣泄",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: false,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "vinovest-wine-tech",  // VinoVest
    name: "VinoVest",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2019",  // 成立年份
    closedYear: "2023",  // 关闭年份
    region: "美国加州",  // 国家/地区
    industry: "葡萄酒科技/投资平台",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 48,  // 存活时长
    totalFunding: "约2000万美元",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "需求验证缺失",  // 主标签（六死因）
    secondaryTags: ["平台封禁"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "成立", event: "公司成立，获得种子轮融资" },
      { date: "", type: "产品发布", event: "平台上线，主打葡萄酒份额化投资" },
      { date: "", type: "融资", event: "完成A轮融资，估值达数千万美元" },
      { date: "", type: "危机", event: "用户增长停滞，获客成本居高不下" },
      { date: "", type: "关闭", event: "宣布关闭，创始人承认‘It totally failed’" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "创始人因热爱葡萄酒且看好另类投资市场，希望用科技降低葡萄酒投资门槛，让普通消费者也能参与高端葡萄酒交易。团队认为加州葡萄酒产业规模庞大却数字化落后，存在巨大改造空间，于是搭建线上平台连接投资者与酒庄，试图复制股票交易体验。",  // 编辑摘要
    postmortem: "表层原因\n用户增长远低于预期，平台交易活跃度低\n深层原因\n葡萄酒投资属于小众需求，普通消费者缺乏兴趣和信任\n根本原因\n未验证真实市场需求，盲目假设科技能改变传统行业\n加速因素\n经济下行导致另类投资降温，融资环境恶化",  // 详细 post-mortem
    sources: ["Los Angeles Times"],  // 来源链接
    founderBg: "连续创业者，曾从事金融科技与葡萄酒投资",  // 创始人背景
    epitaph: "曾想用科技颠覆加州葡萄酒业，\\n烧掉2000万美元后，\\n只留下一句‘It totally failed’。",  // 墓碑摘要
    motivation: "创始人因热爱葡萄酒且看好另类投资市场，希望用科技降低葡萄酒投资门槛，让普通消费者也能参与高端葡萄酒交易。团队认为加州葡萄酒产业规模庞大却数字化落后，存在巨大改造空间，于是搭建线上平台连接投资者与酒庄，试图复制股票交易体验。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "用户增长远低于预期，平台交易活跃度低" },
      { layer: "深层原因", detail: "葡萄酒投资属于小众需求，普通消费者缺乏兴趣和信任" },
      { layer: "根本原因", detail: "未验证真实市场需求，盲目假设科技能改变传统行业" },
      { layer: "加速因素", detail: "经济下行导致另类投资降温，融资环境恶化" },
    ],
    lessons: [  // 教训与避坑清单
      "创业前必须验证真实需求，而非假设技术能创造需求",
      "小众投资品类难以规模化，获客成本可能吞噬所有利润",
      "传统行业数字化改造需尊重行业规律，不能简单套用互联网模式",
      "融资顺利不等于模式成立，烧钱换增长不可持续",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "malaysian-ai-startup-first-day-loss",  // 听豆包建议的马来西亚AI创业项目
    name: "听豆包建议的马来西亚AI创业项目",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2025",  // 成立年份
    closedYear: "2025",  // 关闭年份
    region: "马来西亚",  // 国家/地区
    industry: "AI创业（具体方向未披露）",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 1,  // 存活时长
    totalFunding: "2.9万令吉",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "需求验证缺失",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "危机", event: "男子向AI助手豆包咨询创业建议" },
      { date: "", type: "成立", event: "听从建议投入2.9万令吉启动项目" },
      { date: "", type: "危机", event: "创业首日即赔光全部资金" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "该男子希望借助AI工具寻找创业方向，认为AI能提供可靠建议，于是听从豆包的建议投入2.9万令吉启动项目。他相信技术能降低创业门槛，却忽略了AI建议无法替代真实的市场调研与需求验证，最终在开业首日便亏损殆尽。",  // 编辑摘要
    postmortem: "表层原因\n创业首日即亏损全部2.9万令吉投入\n深层原因\n完全依赖AI建议做创业决策，未进行独立市场调研和需求验证\n根本原因\n将AI生成内容误认为商业判断，缺乏对行业和用户的真实理解",  // 详细 post-mortem
    sources: ["Sin Chew Daily"],  // 来源链接
    founderBg: "一名马来西亚男子，无明确技术或创业背景，依赖AI助手豆包的建议进行创业决策",  // 创始人背景
    epitaph: "他问AI该做什么生意，AI给了答案，市场给了否决。2.9万令吉，一天归零。",  // 墓碑摘要
    motivation: "该男子希望借助AI工具寻找创业方向，认为AI能提供可靠建议，于是听从豆包的建议投入2.9万令吉启动项目。他相信技术能降低创业门槛，却忽略了AI建议无法替代真实的市场调研与需求验证，最终在开业首日便亏损殆尽。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "创业首日即亏损全部2.9万令吉投入" },
      { layer: "深层原因", detail: "完全依赖AI建议做创业决策，未进行独立市场调研和需求验证" },
      { layer: "根本原因", detail: "将AI生成内容误认为商业判断，缺乏对行业和用户的真实理解" },
    ],
    lessons: [  // 教训与避坑清单
      "AI可以辅助决策，但不能替代真实的市场验证",
      "创业前必须亲自调研需求，而非轻信任何单一信息源",
      "投入资金前应设置止损线和验证节点",
      "把AI当顾问可以，把AI当决策者很危险",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "snaplet",  // Snaplet
    name: "Snaplet",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2021",  // 成立年份
    closedYear: "2023",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "开发者工具 / 数据库工具",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 24,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "需求验证缺失",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "成立", event: "创立 Snaplet，开始构建开发者工具" },
      { date: "", type: "危机", event: "产品开发与迭代，尝试寻找产品市场契合" },
      { date: "", type: "危机", event: "创业失败，关闭 Snaplet" },
      { date: "", type: "关键招聘", event: "重新加入 Redwood 项目，探索 RSC 集成" },
      { date: "", type: "危机", event: "开始构建 RedwoodSDK，选择 Cloudflare 平台" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "作为 RedwoodJS 的联合创始人，我在疫情期间与 Tom Preston-Werner 等人一起构建了该框架。之后我尝试独立创业，打造开发者工具公司 Snaplet，希望解决开发者在数据库工作流中的痛点。然而，尽管投入了大量精力，产品始终未能获得足够的市场认可，最终以失败告终。这次经历让我重新思考框架与平台的关系，并促使我回归 Redwood 项目，最终催生了与 Cloudflare 紧密集成的 RedwoodSDK。",  // 编辑摘要
    postmortem: "表层原因\n产品未能获得足够的用户采用和收入，无法维持运营\n深层原因\n开发者工具市场竞争激烈，Snaplet 未能找到明确的差异化价值\n根本原因\n需求验证不足，未能确认开发者对数据库工具的真实付费意愿",  // 详细 post-mortem
    sources: ["rwsdk.com"],  // 来源链接
    founderBg: "RedwoodJS 联合创始人，曾与 Tom Preston-Werner 等共同构建 RedwoodJS 框架",  // 创始人背景
    epitaph: "曾梦想为开发者打造数据库工具，\\n两年后只剩一句『我失败了』，\\n转身投入 RedwoodSDK 的怀抱。",  // 墓碑摘要
    motivation: "作为 RedwoodJS 的联合创始人，我在疫情期间与 Tom Preston-Werner 等人一起构建了该框架。之后我尝试独立创业，打造开发者工具公司 Snaplet，希望解决开发者在数据库工作流中的痛点。然而，尽管投入了大量精力，产品始终未能获得足够的市场认可，最终以失败告终。这次经历让我重新思考框架与平台的关系，并促使我回归 Redwood 项目，最终催生了与 Cloudflare 紧密集成的 RedwoodSDK。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "产品未能获得足够的用户采用和收入，无法维持运营" },
      { layer: "深层原因", detail: "开发者工具市场竞争激烈，Snaplet 未能找到明确的差异化价值" },
      { layer: "根本原因", detail: "需求验证不足，未能确认开发者对数据库工具的真实付费意愿" },
    ],
    lessons: [  // 教训与避坑清单
      "创业前必须充分验证市场需求，而非仅凭技术直觉",
      "开发者工具需要清晰的差异化定位，否则难以在红海中突围",
      "失败后应复盘并调整方向，将经验转化为新项目的优势",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "german-bionic",  // German Bionic
    name: "German Bionic",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2016",  // 成立年份
    closedYear: "2025",  // 关闭年份
    region: "德国（German Bionic，总部位于德国）",  // 国家/地区
    industry: "工业外骨骼机器人（Exoskelett / 可穿戴助力机器人）",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 108,  // 存活时长
    totalFunding: "未披露具体金额（曾为行业明星企业，获多轮融资）",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "成本结构失衡",  // 主标签（六死因）
    secondaryTags: ["资金断裂"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "成立", event: "German Bionic 成立，切入工业外骨骼机器人赛道" },
      { date: "", type: "融资", event: "多轮融资，成为欧洲外骨骼明星企业，产品进入物流与制造场景" },
      { date: "", type: "危机", event: "订单持续增长，但硬件成本与交付压力上升" },
      { date: "", type: "关闭", event: "尽管订单簿饱满，仍因资金链断裂申请破产（Insolvenz）" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "German Bionic 诞生于工业 4.0 与劳动力老龄化的大背景之下。创始人希望用可穿戴外骨骼机器人减轻物流、制造一线工人的腰部与背部负担，降低工伤率，同时提升搬运效率。凭借这一愿景，公司迅速成为欧洲外骨骼赛道的明星，登上各大科技展会，被视为'人机协作'的样板。它相信只要产品足够好、订单足够多，就能在工业市场站稳脚跟，却低估了硬件制造的资金消耗速度与规模化交付的现金流压力。2025 年 11 月公司申请破产，2026 年 3 月由瑞士投资方 Archimedes Partners 重组接管。",  // 编辑摘要
    postmortem: "表层原因\n公司申请破产时订单簿依然饱满，说明并非没有市场需求，而是资金链无法支撑运营\n深层原因\n硬件创业成本结构失衡：研发、生产、供应链与售后投入巨大，收入确认与回款周期长，形成现金流缺口\n结构性原因\n工业外骨骼属于重资产、慢渗透市场，客户采购决策周期长，规模化交付需要持续输血，融资环境收紧后难以为继\n决策风险\n在订单增长期未能有效控制成本与现金消耗节奏，扩张速度与资金储备不匹配",  // 详细 post-mortem
    sources: ["Xpert.Digital - Konrad Wolfenstein"],  // 来源链接
    founderBg: "德国外骨骼机器人创业团队，创始人具备机器人/工业技术背景（文章未详述具体履历）",  // 创始人背景
    epitaph: "订单簿满满，账本却空空。\\n外骨骼明星 German Bionic，\\n在满手订单中走向破产法庭。",  // 墓碑摘要
    motivation: "German Bionic 诞生于工业 4.0 与劳动力老龄化的大背景之下。创始人希望用可穿戴外骨骼机器人减轻物流、制造一线工人的腰部与背部负担，降低工伤率，同时提升搬运效率。凭借这一愿景，公司迅速成为欧洲外骨骼赛道的明星，登上各大科技展会，被视为'人机协作'的样板。它相信只要产品足够好、订单足够多，就能在工业市场站稳脚跟，却低估了硬件制造的资金消耗速度与规模化交付的现金流压力。2025 年 11 月公司申请破产，2026 年 3 月由瑞士投资方 Archimedes Partners 重组接管。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "公司申请破产时订单簿依然饱满，说明并非没有市场需求，而是资金链无法支撑运营" },
      { layer: "深层原因", detail: "硬件创业成本结构失衡：研发、生产、供应链与售后投入巨大，收入确认与回款周期长，形成现金流缺口" },
      { layer: "结构性原因", detail: "工业外骨骼属于重资产、慢渗透市场，客户采购决策周期长，规模化交付需要持续输血，融资环境收紧后难以为继" },
      { layer: "决策风险", detail: "在订单增长期未能有效控制成本与现金消耗节奏，扩张速度与资金储备不匹配" },
    ],
    lessons: [  // 教训与避坑清单
      "订单饱满不等于商业健康，现金流才是硬件创业的生死线",
      "重资产硬件创业必须把成本结构与回款周期算清楚，再谈规模化",
      "明星光环与展会声量无法替代可持续的单位经济模型",
      "融资环境变化时，扩张节奏必须与现金储备严格匹配",
      "工业市场的慢渗透特性要求更保守的烧钱策略与更长的耐心资本",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "rec-room",  // Rec Room
    name: "Rec Room",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2016",  // 成立年份
    closedYear: "2026",  // 关闭年份
    region: "美国西雅图",  // 国家/地区
    industry: "社交 VR / 元宇宙游戏平台",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 120,  // 存活时长
    totalFunding: "约 2.94 亿美元（估值峰值 35 亿美元）",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "成立", event: "Rec Room 成立，推出 VR 社交创作平台" },
      { date: "", type: "融资", event: "完成多轮融资，用户规模快速增长，跨平台上线" },
      { date: "", type: "融资", event: "元宇宙热潮推动估值达到 35 亿美元" },
      { date: "", type: "危机", event: "用户增长放缓，单位经济模型持续恶化，多轮裁员" },
      { date: "", type: "关闭", event: "宣布关闭，服务终止" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "Rec Room 诞生于 2016 年 VR 热潮，创始人 Nick Fajt 希望打造一个跨平台的社交游戏空间，让用户用简单的积木工具创造并分享自己的 VR 世界。凭借免费游玩、UGC 创作和跨设备联机，它迅速积累数千万注册用户，被视为元宇宙社交的代表产品。资本也一路加注，估值一度冲上 35 亿美元。然而，海量免费用户带来的服务器与内容审核成本，始终无法被虚拟货币和订阅收入覆盖，团队在扩张与盈利之间反复摇摆，最终在 2026 年 3 月宣布、6 月正式关停。",  // 编辑摘要
    postmortem: "表层原因\n免费用户占比过高，虚拟货币与订阅收入无法覆盖服务器、带宽和内容审核成本\n深层原因\n单位经济模型长期不成立，每新增一个活跃用户的边际成本高于其带来的收入\n战略原因\n过度依赖元宇宙概念估值，在盈利模式未验证时快速扩张团队与平台功能\n外部原因\nVR 硬件普及不及预期，元宇宙热度退潮，广告与投资环境收紧",  // 详细 post-mortem
    sources: ["The Tech Buzz"],  // 来源链接
    founderBg: "联合创始人 Nick Fajt 与 Cameron Brown，源自西雅图创业团队，早期获 Sequoia 等投资",  // 创始人背景
    epitaph: "估值 35 亿美元的社交 VR 乌托邦，\\n最终败给一行算不平的单位经济公式。\\n十年造梦，一朝关服。",  // 墓碑摘要
    motivation: "Rec Room 诞生于 2016 年 VR 热潮，创始人 Nick Fajt 希望打造一个跨平台的社交游戏空间，让用户用简单的积木工具创造并分享自己的 VR 世界。凭借免费游玩、UGC 创作和跨设备联机，它迅速积累数千万注册用户，被视为元宇宙社交的代表产品。资本也一路加注，估值一度冲上 35 亿美元。然而，海量免费用户带来的服务器与内容审核成本，始终无法被虚拟货币和订阅收入覆盖，团队在扩张与盈利之间反复摇摆，最终在 2026 年 3 月宣布、6 月正式关停。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "免费用户占比过高，虚拟货币与订阅收入无法覆盖服务器、带宽和内容审核成本" },
      { layer: "深层原因", detail: "单位经济模型长期不成立，每新增一个活跃用户的边际成本高于其带来的收入" },
      { layer: "战略原因", detail: "过度依赖元宇宙概念估值，在盈利模式未验证时快速扩张团队与平台功能" },
      { layer: "外部原因", detail: "VR 硬件普及不及预期，元宇宙热度退潮，广告与投资环境收紧" },
    ],
    lessons: [  // 教训与避坑清单
      "免费增值模式必须尽早验证单位经济模型，用户规模不等于商业价值",
      "高估值融资会掩盖商业模式缺陷，资本退潮时问题集中爆发",
      "UGC 平台的服务器与审核成本是刚性支出，需在增长早期就设计可持续的变现路径",
      "元宇宙等概念风口退潮后，缺乏真实付费意愿的产品将迅速失去生存空间",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "vint-wine-investing",  // Vint
    name: "Vint",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2019",  // 成立年份
    closedYear: "2026",  // 关闭年份
    region: "美国弗吉尼亚州里士满",  // 国家/地区
    industry: "葡萄酒投资科技平台",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 84,  // 存活时长
    totalFunding: "约 694 万美元（三轮融资）",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "融资",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: ["平台封禁"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "成立", event: "Vint 成立，定位葡萄酒份额投资平台" },
      { date: "", type: "融资", event: "平台上线并完成早期融资，吸引个人投资者" },
      { date: "", type: "危机", event: "尝试扩大酒品品类与用户规模，但交易活跃度有限" },
      { date: "", type: "危机", event: "运营成本高企，流动性问题显现" },
      { date: "", type: "关闭", event: "2026 年 6 月邮件通知投资者清盘，出售剩余酒藏，由 G2 Capital 与 SimpleClosure 处理清算" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "Vint 的创立源于一个朴素的设想：让普通投资者也能像买股票一样，以小额资金参与稀有葡萄酒的收藏与增值。团队认为葡萄酒作为另类资产长期回报稳健，但传统市场门槛高、流动性差，于是搭建线上平台，将名酒拆分为份额，降低参与门槛。他们希望用科技打破拍卖行与私人酒窖的壁垒，让葡萄酒投资民主化，同时为酒庄和藏家提供新的退出渠道。",  // 编辑摘要
    postmortem: "表层原因\n平台交易量不足，无法产生足够收入覆盖托管、保险与合规成本\n深层原因\n葡萄酒作为非标准化资产，估值与退出依赖线下拍卖，线上份额模式难以形成持续流动性\n根本原因\n目标用户群体有限，另类资产投资需求低频，商业模式缺乏规模化基础",  // 详细 post-mortem
    sources: ["Richmond BizSense"],  // 来源链接
    founderBg: "未披露",  // 创始人背景
    epitaph: "曾想让普通人也能投资名酒，\\n却在五年后连一瓶都卖不动，\\nVint 于 2026 年悄然清盘。",  // 墓碑摘要
    motivation: "Vint 的创立源于一个朴素的设想：让普通投资者也能像买股票一样，以小额资金参与稀有葡萄酒的收藏与增值。团队认为葡萄酒作为另类资产长期回报稳健，但传统市场门槛高、流动性差，于是搭建线上平台，将名酒拆分为份额，降低参与门槛。他们希望用科技打破拍卖行与私人酒窖的壁垒，让葡萄酒投资民主化，同时为酒庄和藏家提供新的退出渠道。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "平台交易量不足，无法产生足够收入覆盖托管、保险与合规成本" },
      { layer: "深层原因", detail: "葡萄酒作为非标准化资产，估值与退出依赖线下拍卖，线上份额模式难以形成持续流动性" },
      { layer: "根本原因", detail: "目标用户群体有限，另类资产投资需求低频，商业模式缺乏规模化基础" },
    ],
    lessons: [  // 教训与避坑清单
      "非标资产证券化需先解决流动性，否则平台只是把低流动性从线下搬到线上",
      "低频高客单的另类投资，获客成本与教育成本容易被低估",
      "科技平台无法改变底层资产的估值与退出机制，商业模式必须尊重资产特性",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "now-push",  // Now Push
    name: "Now Push",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "约2020-2021年",  // 成立年份
    closedYear: "约2023-2024年",  // 关闭年份
    region: "未提及（推测欧美）",  // 国家/地区
    industry: "效率工具 / 跨平台推送通知应用",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 30,  // 存活时长
    totalFunding: "未披露",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: ["团队解散", "增长失速"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "产品发布", event: "PushBullet停止iOS更新，团队推出Now Push替代品" },
      { date: "", type: "关键招聘", event: "用户增长至超过1万，加入加速器" },
      { date: "", type: "关闭", event: "因生活变故和首次创业失误，项目关闭" },
      { date: "", type: "危机", event: "宣布重启，开启社区意向登记，计划Q2发货" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "PushBullet停止支持iOS更新后，大量用户急需替代品。我们抓住这个窗口推出Now Push，迅速获得超过1万名用户，并加入加速器。但作为首次创业的团队，我们低估了持续运营的难度，生活变故让项目难以为继，最终不得不关闭。我们始终认为产品本身是好的，只是关得太早。如今看到Digg、Pebble等老牌产品回归，加上PushBullet服务持续恶化，我们决定再试一次，以更成熟的姿态重新出发。",  // 编辑摘要
    postmortem: "表层原因\n创始人生活变故导致无法继续投入运营\n深层原因\n首次创业缺乏经验，团队未能建立可持续的运营和盈利模式\n根本原因\n产品虽获1万用户，但未形成足够收入支撑团队全职投入，商业模式脆弱",  // 详细 post-mortem
    sources: ["Now Push 官方博客"],  // 来源链接
    founderBg: "未具名独立开发者/小团队，首次创业，曾加入加速器",  // 创始人背景
    epitaph: "从0到1万用户，却在生活变故前倒下；如今带着'一次买断、终身使用'的承诺，试图在PushBullet衰败的缝隙里重生。",  // 墓碑摘要
    motivation: "PushBullet停止支持iOS更新后，大量用户急需替代品。我们抓住这个窗口推出Now Push，迅速获得超过1万名用户，并加入加速器。但作为首次创业的团队，我们低估了持续运营的难度，生活变故让项目难以为继，最终不得不关闭。我们始终认为产品本身是好的，只是关得太早。如今看到Digg、Pebble等老牌产品回归，加上PushBullet服务持续恶化，我们决定再试一次，以更成熟的姿态重新出发。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "创始人生活变故导致无法继续投入运营" },
      { layer: "深层原因", detail: "首次创业缺乏经验，团队未能建立可持续的运营和盈利模式" },
      { layer: "根本原因", detail: "产品虽获1万用户，但未形成足够收入支撑团队全职投入，商业模式脆弱" },
    ],
    lessons: [  // 教训与避坑清单
      "用户增长不等于商业成功，必须尽早验证付费意愿",
      "首次创业应预留应对生活变故的缓冲机制",
      "产品关停前可尝试转让或开源，而非直接放弃",
      "重启前先做社区意向验证，降低二次失败风险",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "lancode-ai",  // 澜码科技
    name: "澜码科技",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2023-01",  // 成立年份
    closedYear: "2025-02",  // 关闭年份
    region: "中国上海",  // 国家/地区
    industry: "AI Agent/企业级AI",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 25,  // 存活时长
    totalFunding: "数千万人民币",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "成立", event: "澜码科技成立，定位企业级AI Agent" },
      { date: "", type: "融资", event: "完成数千万人民币融资，团队扩张" },
      { date: "", type: "危机", event: "产品商业化进展缓慢，客户付费意愿低" },
      { date: "", type: "融资", event: "资金链紧张，融资困难" },
      { date: "", type: "危机", event: "员工遭停薪，创始人回应正寻求被并购" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "周健在谷歌、阿里云等大厂积累了深厚的技术背景，看到大模型浪潮下企业级AI Agent的广阔前景，决定创业。他希望通过澜码科技打造能自动完成复杂任务的AI Agent，替代传统RPA，提升企业效率。2023年初公司成立，迅速获得资本青睐，完成数千万融资，团队扩张至百人规模，一度被视为上海AI明星企业。然而，产品落地和商业化进展缓慢，客户付费意愿低，最终在2025年初资金耗尽，员工遭停薪，创始人承认正寻求被并购。",  // 编辑摘要
    postmortem: "表层原因\n融资断裂，资金耗尽，无法支付员工薪资\n深层原因\n企业级AI Agent产品商业化困难，客户付费意愿低，收入无法覆盖成本\n根本原因\n商业模式脆弱，过度依赖融资，缺乏自我造血能力\n外部因素\n大模型竞争激烈，大厂挤压，创业公司生存空间受限",  // 详细 post-mortem
    sources: ["钛媒体AGI"],  // 来源链接
    founderBg: "创始人周健，曾任职于谷歌、阿里云等，技术背景深厚",  // 创始人背景
    epitaph: "曾获数千万融资的明星AI Agent公司，\\n最终停薪、寻求并购，\\n25个月烧完所有故事。",  // 墓碑摘要
    motivation: "周健在谷歌、阿里云等大厂积累了深厚的技术背景，看到大模型浪潮下企业级AI Agent的广阔前景，决定创业。他希望通过澜码科技打造能自动完成复杂任务的AI Agent，替代传统RPA，提升企业效率。2023年初公司成立，迅速获得资本青睐，完成数千万融资，团队扩张至百人规模，一度被视为上海AI明星企业。然而，产品落地和商业化进展缓慢，客户付费意愿低，最终在2025年初资金耗尽，员工遭停薪，创始人承认正寻求被并购。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "融资断裂，资金耗尽，无法支付员工薪资" },
      { layer: "深层原因", detail: "企业级AI Agent产品商业化困难，客户付费意愿低，收入无法覆盖成本" },
      { layer: "根本原因", detail: "商业模式脆弱，过度依赖融资，缺乏自我造血能力" },
      { layer: "外部因素", detail: "大模型竞争激烈，大厂挤压，创业公司生存空间受限" },
    ],
    lessons: [  // 教训与避坑清单
      "企业级AI产品必须尽早验证付费需求，不能只靠融资输血",
      "技术背景不等于商业能力，创始人需补齐商业化短板",
      "AI Agent赛道竞争激烈，创业公司应聚焦垂直场景做深做透",
      "融资环境变化时，必须提前裁员降本，保留核心团队",
      "被并购不是失败，但应在资金耗尽前主动寻求退出",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "tachi-code",  // Tachi Code
    name: "Tachi Code",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2024",  // 成立年份
    closedYear: "2025",  // 关闭年份
    region: "未知",  // 国家/地区
    industry: "开发者工具 / 浏览器扩展",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 12,  // 存活时长
    totalFunding: "未知",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "需求验证缺失",  // 主标签（六死因）
    secondaryTags: [],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "危机", event: "开始开发Tachi Code" },
      { date: "", type: "产品发布", event: "发布浏览器扩展和TachiCode.dev沙盒" },
      { date: "", type: "关闭", event: "项目停止维护，关闭" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "作者在上一家创业公司倒闭后，因健康原因无法立即投入新工作，决定通过个人项目保持思维活跃。当时AI增强的VS Code分支盛行，他选择用Monaco编辑器构建浏览器扩展Tachi Code，旨在简化临时代码任务，减少在编辑器和浏览器间切换。项目集成了语法高亮、折叠、正则搜索等功能，并支持离线使用，但最终未能获得足够用户或收入。",  // 编辑摘要
    postmortem: "表层原因\n产品功能虽完整但缺乏独特卖点，用户可轻易用现有工具替代\n深层原因\n未验证市场需求，开发者对浏览器内代码编辑器的付费意愿低\n根本原因\n独立开发者资源有限，无法持续推广和迭代，导致项目自然死亡",  // 详细 post-mortem
    sources: ["tachicode.dev"],  // 来源链接
    founderBg: "独立开发者，前创业公司员工，因健康原因无法全职工作",  // 创始人背景
    epitaph: "一个漂亮的浏览器代码编辑器，\\n解决了没人愿意付费的问题。\\n死于2025，享年约1岁。",  // 墓碑摘要
    motivation: "作者在上一家创业公司倒闭后，因健康原因无法立即投入新工作，决定通过个人项目保持思维活跃。当时AI增强的VS Code分支盛行，他选择用Monaco编辑器构建浏览器扩展Tachi Code，旨在简化临时代码任务，减少在编辑器和浏览器间切换。项目集成了语法高亮、折叠、正则搜索等功能，并支持离线使用，但最终未能获得足够用户或收入。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "产品功能虽完整但缺乏独特卖点，用户可轻易用现有工具替代" },
      { layer: "深层原因", detail: "未验证市场需求，开发者对浏览器内代码编辑器的付费意愿低" },
      { layer: "根本原因", detail: "独立开发者资源有限，无法持续推广和迭代，导致项目自然死亡" },
    ],
    lessons: [  // 教训与避坑清单
      "个人项目也需先验证需求再投入开发",
      "开发者工具市场免费替代品众多，付费转化极难",
      "独立开发者应设定明确的成功指标和退出机制",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "moxie-children-robot",  // Moxie 儿童陪伴机器人（Embodied 公司）
    name: "Moxie 儿童陪伴机器人（Embodied 公司）",  // 基础：公司名
    status: "dead",  // dead | acquired | pivoted
    foundedYear: "2019",  // 成立年份
    closedYear: "2024",  // 关闭年份
    region: "美国",  // 国家/地区
    industry: "AI 儿童陪伴机器人",  // 行业
    businessModel: "",  // 商业模式（待补）
    lifespanMonths: 60,  // 存活时长
    totalFunding: "约 4000 万美元以上（含多轮融资）",  // 总融资额
    fundingRounds: 0,  // 融资轮次（待补）
    lastStage: "",  // 最后阶段（待补）
    investors: [],  // 投资方（待补）
    fundingType: "自筹",  // 自筹 | 融资 | 混合
    primaryTag: "商业模式脆弱",  // 主标签（六死因）
    secondaryTags: ["资金断裂", "收购后关停"],  // 副标签 0-3
    timeline: [  // 3-8 个关键事件，带日期与类型
      { date: "", type: "成立", event: "Embodied 公司成立，启动 Moxie 儿童陪伴机器人项目" },
      { date: "", type: "产品发布", event: "Moxie 正式发布并开始交付，主打儿童情感陪伴与社交训练" },
      { date: "", type: "危机", event: "依靠风险投资维持运营，硬件加订阅模式持续烧钱" },
      { date: "", type: "危机", event: "融资失败，公司宣布关停，Moxie 云端服务即将停止，产品变砖" },
    ],
    founderAccount: "",  // 创始人自述（如有）
    editorSummary: "创始人 Paolo Pirjanian 希望用 AI 与机器人技术为儿童提供情感陪伴与社交训练，尤其面向自闭症等需要社交辅助的孩子。团队认为硬件加订阅的模式能持续提供云端 AI 服务，让机器人随孩子成长不断进化。产品以约 5800 元的高价出售，试图走高端消费机器人路线，但高昂的硬件成本与持续服务成本，最终在融资环境收紧时难以为继。",  // 编辑摘要
    postmortem: "表层原因\n融资失败导致公司无法继续支付云端 AI 服务与运营成本，产品被迫停止服务\n深层原因\n硬件售价高但利润薄，依赖持续订阅与云端服务，成本结构长期失衡\n根本原因\n目标市场有限，高价儿童机器人需求验证不足，商业模式难以规模化盈利",  // 详细 post-mortem
    sources: ["36Kr"],  // 来源链接
    founderBg: "由机器人专家 Paolo Pirjanian 创立，其曾任 iRobot 高管、Evolution Robotics 创始人，团队来自消费机器人领域",  // 创始人背景
    epitaph: "售价 5800 元的 AI 玩伴，只活了 4 年；融资一断，云端一关，孩子们要如何理解它的「去世」？",  // 墓碑摘要
    motivation: "创始人 Paolo Pirjanian 希望用 AI 与机器人技术为儿童提供情感陪伴与社交训练，尤其面向自闭症等需要社交辅助的孩子。团队认为硬件加订阅的模式能持续提供云端 AI 服务，让机器人随孩子成长不断进化。产品以约 5800 元的高价出售，试图走高端消费机器人路线，但高昂的硬件成本与持续服务成本，最终在融资环境收紧时难以为继。",  // 创业动机与初衷
    breakdown: [  // 死因拆解（三层因果）
      { layer: "表层原因", detail: "融资失败导致公司无法继续支付云端 AI 服务与运营成本，产品被迫停止服务" },
      { layer: "深层原因", detail: "硬件售价高但利润薄，依赖持续订阅与云端服务，成本结构长期失衡" },
      { layer: "根本原因", detail: "目标市场有限，高价儿童机器人需求验证不足，商业模式难以规模化盈利" },
    ],
    lessons: [  // 教训与避坑清单
      "硬件加订阅模式必须算清全生命周期成本，云端服务一旦停止，产品即变砖",
      "高价消费机器人需要足够大的付费市场支撑，否则融资一断就难以为继",
      "AI 陪伴类产品涉及用户情感依赖，关停不仅是商业失败，还会造成伦理与信任伤害",
      "创业公司应提前设计服务终止方案，避免用户为「变砖」买单",
    ],
    sourceType: 'ai_assisted',  // interview | public_record | ai_assisted | crowdsourced
    verified: true,  // 人工核实
    // rebuildPlan / opportunityScore 可选差异化字段，待后续补全
  },
  {
    slug: "kortyx",
    name: "Kortyx",
    status: "dead",
    foundedYear: "2025",
    closedYear: "2025",
    region: "未披露（推测为欧美）",
    industry: "AI 生产力工具 / 个人记忆层",
    businessModel: "桌面应用（Windows + macOS），可能为订阅或一次性买断（文章未明确）",
    lifespanMonths: 6,
    totalFunding: "",
    fundingRounds: 0,
    lastStage: "",
    investors: [],
    fundingType: "自筹",
    primaryTag: "需求验证缺失",
    secondaryTags: ["增长失速"],
    timeline: [
      { date: "2024", type: "成立", event: "创始人 Dima 在上一家 AI 产品分析创业公司未能找到 PMF 后开始构思 Kortyx" },
      { date: "2025", type: "产品发布", event: "在 Hacker News 发布 Kortyx 桌面应用，主打 Ask Memory 与 Memory Boost 功能" },
      { date: "2025", type: "关闭", event: "产品发布后未获得足够用户采用，项目停止运营" },
    ],
    founderAccount: "I built Kortyx after a failed attempt to find product-market fit with an AI product-analytics startup. When it was time to pivot i was looking for other ideas and figured that i constantly struggled with getting users to provide \"ideal\" context to my agents. it resulted in weak prompts, degraded agent performance, etc etc. So i thought what is instead of asking every user to provide background, Kortyx captured the context directly and then served it at the right time.",
    editorSummary: "Kortyx 是连续创业者 Dima 在上一家 AI 产品分析公司失败后推出的桌面记忆层应用，试图自动捕获用户数字生活上下文并注入 AI 代理提示词。产品在 Hacker News 发布后未能获得足够用户采用，最终停止运营，成为又一个需求验证不足的 AI 工具案例。",
    postmortem: "Kortyx 的失败根源在于创始人把自身痛点直接等同于市场需求。Dima 在上一段创业中确实苦于给 AI 代理提供上下文，但他没有验证普通用户是否愿意为“自动记忆层”付费，也没有验证隐私顾虑是否会成为采用障碍。产品以桌面应用形式同时覆盖 Windows 和 macOS，开发成本高但差异化低，Ask Memory 与 Memory Boost 两个功能都容易被大厂助手原生集成替代。发布仅靠 Hacker News 单点曝光，缺乏持续获客渠道，用户增长迅速失速。对创业者的启示是：连续创业者的经验是资产也是陷阱，转型时更应做需求验证而非直接写代码；个人数据类产品必须先解决信任与隐私问题，否则功能再优雅也难以转化。",
    sources: ["https://kortyx.co/"],
    founderBg: "连续创业者 Dima，此前创办 AI 产品分析创业公司，未能找到产品市场契合点后转型",
    epitaph: "它记住了你的一切，却没人记住它。\n发布 1 次，用户 0 增长，6 个月后关停。",
    motivation: "Dima 在上一家 AI 产品分析创业公司未能找到产品市场契合点后决定转型。他发现自己反复苦于让用户给 AI 代理提供理想上下文，导致提示词质量差、代理表现下降。于是他设想：与其让每个用户手动提供背景，不如让 Kortyx 直接捕获上下文并在恰当时机注入。这个从自身痛点出发的想法驱动他开发了桌面记忆层应用。",
    breakdown: [
      { layer: "表层原因", detail: "产品发布后用户采用率低，Hacker News 单点曝光未能带来持续增长" },
      { layer: "中间机制", detail: "创始人将自身痛点直接当作市场需求，未验证普通用户是否愿意为自动记忆层付费，也未处理隐私信任问题" },
      { layer: "深层机制", detail: "桌面记忆层功能易被大厂 AI 助手原生集成替代，缺乏护城河；同时覆盖双平台推高成本，小团队难以支撑持续迭代与获客" },
    ],
    lessons: [
      "连续创业者的经验是资产也是陷阱，转型时应先做需求验证而非直接开发",
      "个人数据类产品必须先解决信任与隐私问题，否则功能再优雅也难以转化",
      "单点社区曝光不等于获客渠道，需要设计可持续的增长路径",
      "功能容易被平台原生集成替代时，应尽早寻找差异化或垂直场景",
    ],
    sourceType: "interview",
    verified: false,
    rebuildPlan: "如果重做，应先做小范围需求验证：访谈 20-30 位目标用户，确认他们是否愿意为自动上下文记忆付费，以及隐私边界在哪里。产品上先做单平台（macOS）MVP，聚焦一个高频场景（如会议纪要自动关联历史讨论），用本地优先架构建立信任。获客上不依赖单次 HN 发布，而是通过垂直社区、内容营销和早期用户口碑持续获客，验证留存后再扩展平台。",
    opportunityScore: 4,
  },
  {
    slug: "robotics-startup-insider-lessons",
    name: "未具名机器人创业公司（内部员工复盘）",
    status: "dead",
    foundedYear: "",
    closedYear: "",
    region: "美国（推测，文章发布于 The Robot Report）",
    industry: "机器人硬件/科技",
    businessModel: "机器人产品研发与销售（具体模式文章未详述）",
    lifespanMonths: 0,
    totalFunding: "",
    fundingRounds: 0,
    lastStage: "",
    investors: [],
    fundingType: "自筹",
    primaryTag: "成本结构失衡",
    secondaryTags: ["资金断裂", "团队解散"],
    timeline: [
      { date: "", type: "成立", event: "机器人创业公司成立，组建工程团队开发机器人产品" },
      { date: "", type: "危机", event: "公司内部出现管理与工程决策问题，产品进展受阻" },
      { date: "", type: "关闭", event: "公司最终倒闭，员工以内部视角总结六条教训" },
    ],
    founderAccount: "",
    editorSummary: "The Robot Report 刊发一位内部员工的第一人称复盘，讲述其亲历的一家机器人创业公司从内部走向死亡的过程，提炼出六条教训。文章聚焦工程与组织层面的失误，而非外部市场叙事。",
    postmortem: "该案例来自一名内部员工的亲历复盘，核心信息是：机器人创业公司的死亡往往不是单一外部冲击，而是内部工程决策、资源分配与组织管理问题长期累积的结果。硬件创业周期长、烧钱快，一旦产品迭代方向反复、团队协作失灵，现金流便迅速恶化。作者以六条教训的形式记录了这些失误，提醒机器人创业者重视工程纪律、成本控制与团队沟通。由于文章未披露公司名称与具体财务数据，本档案仅保留其结构性教训价值。",
    sources: ["https://news.google.com/rss/articles/CBMingFBVV95cUxOSUZJTU9zMEZQVEs4MExDOHFGc1FRdDRrMzdvTGhwQXJua3FSUGI1X0x3WXJuelNoeHhETkxFVHNvb3RRSTRYTFlFcUJnSk9UelFYcjZXOWU4a25BV3VFZlgxZlBOcVJTT1VXeUtnT01lMi1jbGR5NkNpU0U4VVY3ZHgwYVplYkx3UFNKSVJ1eFlRd203dEZqdVlaXzczQQ?oc=5"],
    founderBg: "文章未披露具体创始人背景，仅以内部员工视角回顾公司衰亡过程",
    epitaph: "一家机器人公司倒在了内部，\n留下六条用失败换来的教训。",
    motivation: "文章作者作为内部员工，亲历公司从运转到死亡的全过程，希望把这段经历转化为可供后来者借鉴的教训，避免同类错误重演。",
    breakdown: [
      { layer: "表层原因", detail: "公司经营失败最终关闭，员工离散" },
      { layer: "中间机制", detail: "工程决策与产品迭代方向反复，资源被持续消耗" },
      { layer: "深层机制", detail: "硬件创业周期长、成本高，组织管理与工程纪律缺失导致现金流恶化" },
    ],
    lessons: [
      "硬件创业必须严控成本节奏，现金流比技术愿景更早决定生死",
      "工程决策反复会快速烧掉融资，需建立清晰的优先级与止损机制",
      "内部沟通与团队协作失灵是创业公司隐性杀手",
      "创始人应从内部员工视角定期收集真实信号，而非只听汇报",
    ],
    sourceType: "interview",
    verified: false,
    rebuildPlan: "若重做，应先以最小可行硬件验证单一场景需求，控制团队规模与烧钱速度，建立明确的工程里程碑与止损线，并保持创始人与一线工程师的高频直接沟通。",
  },
  {
    slug: "durham-robotics-startup-shutters",
    name: "Durham 机器人创业公司（软件业务分拆为独立公司）",
    status: "dead",
    foundedYear: "",
    closedYear: "",
    region: "美国北卡罗来纳州达勒姆",
    industry: "机器人 / 工业自动化软件",
    businessModel: "机器人硬件与配套软件（具体收费模式未披露）",
    lifespanMonths: 0,
    totalFunding: "",
    fundingRounds: 0,
    lastStage: "",
    investors: [],
    fundingType: "自筹",
    primaryTag: "商业模式脆弱",
    secondaryTags: ["团队解散"],
    timeline: [
      { date: "", type: "成立", event: "在达勒姆成立机器人创业公司，开发机器人产品及配套软件" },
      { date: "", type: "危机", event: "公司经营难以为继，决定停止运营" },
      { date: "", type: "关闭", event: "公司关停，原工程师团队将软件业务分拆为一家新公司继续经营" },
    ],
    founderAccount: "",
    editorSummary: "一家位于达勒姆的机器人创业公司宣告关停，硬件与整体业务未能跑通。公司关闭后，原工程团队将其软件部分剥离出来，成立新公司延续开发。报道未披露融资规模、创始人身份与具体失败原因，仅确认了关停与软件业务分拆这一结局。",
    postmortem: "这家公司的死亡路径在机器人创业中颇具代表性：硬件研发周期长、单台成本高、客户验证慢，收入难以覆盖持续投入，一旦融资节奏跟不上就会迅速失血。文章给出的信息有限，但结局本身说明了问题——真正有价值、可复用的资产是软件，而不是整机。团队选择在关停后把软件分拆成独立公司，等于承认原先“硬件+软件”打包的商业模式无法自我维持，而剥离后的软件更轻、更易交付、边际成本更低。对创业者的意义在于：机器人创业应尽早验证谁为软件付费、以什么形式付费，把硬件当作获客入口而非利润中心；同时要预留“资产剥离”的退出路径，让团队和技术在主体失败后仍能延续。",
    sources: ["https://news.google.com/rss/articles/CBMirAFBVV95cUxOV19JcmtvY3JUZjNvc1c3SVBfSW5uR0pVd1NUWHZoeEZSNkc1aWt6eXUyQkY2UXhfZnZIcXU3TUhMM2pQLThIS0pkLXBGUnlldmNuLVFIanYzbGxlWGMwM1YzMHhsZGZlcTNUbTYyTjZBYUNYcW43NHppSkhXRUplMGpNRlhLU1NiR2l1VV92UWt4X3RSRVJyUEdER0owOTlRSnI1b3luTGExelVr?oc=5"],
    founderBg: "工程团队背景的机器人创业者（文章未披露具体姓名与履历）",
    epitaph: "整机梦碎达勒姆，\n软件被工程师们带走，\n在新公司里重新开机。",
    motivation: "团队希望把机器人技术落地到真实场景，通过整机产品加配套软件形成完整解决方案。机器人赛道想象空间大、技术门槛高，创始团队希望以工程能力切入，做出可交付的机器人系统并建立商业闭环。",
    breakdown: [
      { layer: "表层原因", detail: "公司整体经营无法持续，宣布关停，硬件与整机业务停止运作。" },
      { layer: "中间机制", detail: "机器人硬件研发与交付成本高、周期长，收入无法覆盖持续投入，商业模式难以自我造血。" },
      { layer: "深层机制", detail: "团队真正可复用、可独立变现的资产是软件而非整机，说明价值主张与收费结构从一开始就错配，硬件打包模式掩盖了软件的真实商业潜力。" },
    ],
    lessons: [
      "机器人创业要尽早验证软件付费意愿，别把硬件当作唯一收入来源。",
      "硬件研发周期长、烧钱快，融资节奏必须与交付里程碑严格对齐。",
      "提前设计资产剥离路径，主体失败时团队与技术仍可延续。",
      "关停不等于归零，把可复用资产分拆成新公司是理性的止损方式。",
    ],
    sourceType: "public_record",
    verified: false,
    rebuildPlan: "如果重做，应把软件作为独立产品先行：以订阅或按调用量收费的方式卖给已有机器人硬件的厂商与集成商，用轻资产模式验证付费意愿和留存，再考虑是否自研硬件。硬件只做少量标杆客户定制，用于打磨软件与数据闭环，不作为规模化收入来源。同时控制团队规模，把现金消耗压到最低，用客户合同而非融资故事驱动下一轮。",
    opportunityScore: 6,
  },
  {
    slug: "mit-dropout-two-startups-shutdown",
    name: "MIT Dropout's Two Startups (Unnamed)",
    status: "dead",
    foundedYear: "",
    closedYear: "",
    region: "美国",
    industry: "科技（具体方向未披露）",
    businessModel: "未披露",
    lifespanMonths: 0,
    totalFunding: "",
    fundingRounds: 0,
    lastStage: "",
    investors: [],
    fundingType: "自筹",
    primaryTag: "需求验证缺失",
    secondaryTags: ["资金断裂", "团队解散"],
    timeline: [
      { date: "", type: "成立", event: "MIT 辍学生创办第一家创业公司" },
      { date: "", type: "成立", event: "创办第二家创业公司" },
      { date: "", type: "关闭", event: "两家公司在数周内先后宣布关停" },
    ],
    founderAccount: "",
    editorSummary: "一名 MIT 辍学生创办的两家科技创业公司在数周内相继宣布关停。文章以创始人连续创业失败为线索，讨论年轻创始人快速试错、连续创业背后的风险与代价，但未披露具体产品与商业模式细节。",
    postmortem: "该案例的核心事实是：一位 MIT 辍学生创办的两家公司几乎同时走向终点。连续创业者在同一时期并行或紧接推进多个项目，往往意味着精力、资金与注意力被摊薄，任一项目都难以获得足够的验证深度与资源密度。两家公司数周内接连关停，说明失败并非单点意外，而更可能是创始人层面的系统性资源错配：在需求尚未被真实验证前就投入组织与资金，一旦首个项目受挫，第二个项目也失去输血能力。对创业者的意义在于：连续创业不等于并行创业，快速试错的前提是低成本、短周期、可证伪的验证，而不是同时押注多个未验证方向。",
    sources: ["https://news.google.com/rss/articles/CBMimwFBVV95cUxOTHpJREpFQmxob3dYTm9qWU9EODcxTGNlOGU2RWlvMWJtRTNpZEpKS1VrODZEdlBUbTVuSkMxWWtYa0dtVXhQQzVlUjR5a0U4dlQ0ekhsYXVnSlFrVUYwUEpiQjlVWUh6YncwcTU4RXJ2QS1aanBDRDhhV2dsYmZPM0Q5YTVFY1dnUVU2N01fR1B3ajdIV2ZnbEtkQQ?oc=5"],
    founderBg: "MIT 辍学生，连续创业者，先后创办两家科技创业公司",
    epitaph: "两家公司，数周之内，先后关停——\n快速试错变成了同时押注，\n没有一次被真正验证。",
    motivation: "MIT 辍学创业本身带有强烈的自我证明动机：用最短路径把想法变成公司。连续创办两家公司，反映出创始人对速度与规模的执念，希望通过并行推进提高成功概率，却低估了精力、资金与注意力的有限性。",
    breakdown: [
      { layer: "表层原因", detail: "两家公司在数周内先后宣布关停，产品未能形成可持续经营" },
      { layer: "中间机制", detail: "创始人同时推进多个项目，精力与资金被摊薄，单个项目难以获得足够的验证与迭代资源" },
      { layer: "深层机制", detail: "连续创业被误当作并行创业，在需求未被真实验证前就投入组织与资金，缺乏低成本可证伪的验证路径" },
    ],
    lessons: [
      "连续创业不等于并行创业，多项目同时推进极易导致资源摊薄",
      "快速试错的前提是低成本、短周期、可证伪，而非同时押注多个未验证方向",
      "创始人个人品牌与融资能力不能替代产品需求验证",
      "首个项目受挫会迅速抽走后续项目的输血能力，需预留独立生存空间",
    ],
    sourceType: "public_record",
    verified: false,
    rebuildPlan: "若重做，应先只保留一个方向，用 4-6 周做低成本需求验证（真实付费意愿而非口头兴趣），设定明确的继续/放弃门槛；在验证通过前不组建团队、不租办公室，把资金留给验证后的规模化。第二个项目应等第一个项目进入稳定期或明确终止后再启动，避免现金流与注意力交叉污染。",
  },
  {
    slug: "esop-startup-carta-competitor",
    name: "未具名 ESOP 管理创业公司（Carta 竞争对手）",
    status: "dead",
    foundedYear: "",
    closedYear: "",
    region: "美国",
    industry: "金融科技 / 股权与期权管理 SaaS",
    businessModel: "SaaS 订阅（面向创业公司及投资人的股权/期权管理平台）",
    lifespanMonths: 0,
    totalFunding: "",
    fundingRounds: 0,
    lastStage: "",
    investors: [],
    fundingType: "自筹",
    primaryTag: "同质化竞争",
    secondaryTags: ["增长失速"],
    timeline: [
      { date: "", type: "成立", event: "成立，定位为 Carta 的替代方案，切入股权/期权管理市场" },
      { date: "", type: "产品发布", event: "推出面向创业公司与投资人的股权管理平台，主打与 Carta 的差异化" },
      { date: "", type: "危机", event: "长期难以撼动 Carta 的市场主导地位，获客与留存承压" },
      { date: "", type: "关闭", event: "正式宣布关停，退出与 Carta 的竞争" },
    ],
    founderAccount: "",
    editorSummary: "这是一家试图正面挑战股权管理巨头 Carta 的创业公司，主打为创业公司和投资人提供替代性的股权/期权管理 SaaS。尽管赛道明确、需求真实，但面对 Carta 的网络效应与规模壁垒，公司始终未能建立足够差异化和客户基础，最终宣布关停。",
    postmortem: "这家公司的死因是典型的同质化竞争：它选择在 Carta 已经占据绝对主导的股权管理赛道正面硬碰。Carta 的核心护城河不是功能，而是网络效应——创业公司、投资人、律所、员工都在同一张表上协作，迁移成本极高。挑战者即便做出更便宜或体验更好的产品，也难以撬动双边网络，获客成本高、留存差、增长失速。对创业者的启示是：面对强网络效应的在位者，单纯做\"更便宜的同类产品\"几乎必败，必须找到在位者结构性无法服务的细分场景（如特定地区合规、特定资产类别），或从相邻工作流切入再逐步侵蚀。此外，金融基础设施类产品对信任与合规要求极高，早期创业公司很难在品牌信任上与大厂抗衡。",
    sources: ["https://news.google.com/rss/articles/CBMikwFBVV95cUxQRHR5S09yLXhTTlUzS0NSSm90WXJDTEx2RHVqY1YzZnZqQVZGYUdYNmIzbW5CdHpEMTdHUG9ucHpkWncwT1gwTS15WXViZ0toaHRvcHhCUDhnY3NSanhxY0QxWnNMMWotY0dRMExHT3VXNmNlOVNJeUdDbl94MEs1RDJaaWhrbHN3Wnc0bVRSNkhVY3M?oc=5"],
    founderBg: "文章未详细披露创始人背景，仅提及这是一家试图挑战 Carta 的股权管理（ESOP/cap table）创业公司",
    epitaph: "它想成为下一个 Carta，\n却没能让任何人离开 Carta。",
    motivation: "创始团队看准了股权与期权管理这一刚需赛道，认为 Carta 的产品体验与定价存在改进空间，希望以更轻、更便宜、更贴近创业公司的方案切入，分食这块由单一巨头把持的市场。",
    breakdown: [
      { layer: "表层原因", detail: "产品与 Carta 高度同质化，缺乏让客户愿意迁移的差异化价值" },
      { layer: "中间机制", detail: "Carta 拥有创业公司—投资人—律所—员工的多边网络效应，迁移成本极高，挑战者获客与留存双双承压" },
      { layer: "深层机制", detail: "金融基础设施类产品依赖品牌信任与合规积累，早期创业公司难以在信任度上与在位巨头抗衡，规模不经济导致增长失速" },
    ],
    lessons: [
      "不要在强网络效应的赛道正面复制在位者的产品，迁移成本会吞噬所有价格与体验优势",
      "金融基础设施创业应选择在位者结构性无法服务的细分场景切入",
      "获客成本与留存是 SaaS 挑战者的生死线，需在早期验证可防御的楔子",
      "品牌信任是金融类产品的隐性护城河，需提前规划合规与信任建设路径",
    ],
    sourceType: "public_record",
    verified: false,
    rebuildPlan: "如果重做，应放弃全面对标 Carta，转而聚焦一个 Carta 结构性服务不足的细分市场——例如特定司法辖区的期权合规、跨境团队的股权税务，或面向小型基金的 cap table 协作工具。先在该细分场景做到不可替代，积累信任与客户网络，再沿相邻工作流（薪酬、融资数据）逐步扩展，而不是一开始就与巨头在同一张表上竞争。",
    opportunityScore: 4,
  }
];

export function getCaseBySlug(slug: string): CaseRecord | undefined {
  return CASES.find((c) => c.slug === slug);
}

export function getCauseMeta(cause: FailureTag): DeathCauseLabel | undefined {
  return DEATH_CAUSES.find((d) => d.value === cause);
}

export function getSecondaryMeta(tag: string): string | undefined {
  return SECONDARY_TAGS.includes(tag) ? tag : undefined;
}

// 一人公司坟场 (OPC Graveyard) —— 案例数据模型与首发案例库
// 死因体系基于《AI OPC创业失败案例市场调研报告》六大类

export type DeadCause =
  | "获客失败"
  | "需求验证缺失"
  | "商业模式脆弱"
  | "成本结构失衡"
  | "同质化竞争"
  | "合规与决策风险";

export interface DeathCauseLabel {
  value: DeadCause;
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

export interface CaseRecord {
  slug: string;
  name: string;
  status: "dead" | "acquired" | "pivoted";
  founderBg: string;
  region: string;
  industry: string;
  startedAt: string;
  closedAt: string;
  lifespanMonths: number;
  investment: string;
  fundingType: "自筹" | "融资" | "混合";
  deadCause: DeadCause;
  deadCauseSub: string;
  source: string;
  verified: boolean;
  // 叙事
  epitaph: string; // 墓碑摘要（3 行内）
  motivation: string; // 创业动机与初衷
  timeline: { time: string; event: string }[]; // 时间线
  breakdown: { layer: string; detail: string }[]; // 死因拆解（至少 3 层）
  lessons: string[]; // 教训与避坑清单
}

export const CASES: CaseRecord[] = [
  {
    slug: "medvi",
    name: "MEDVi",
    status: "dead",
    founderBg: "Matthew Gallagher，医药行业创业者",
    region: "美国",
    industry: "AI 远程医疗",
    startedAt: "2024",
    closedAt: "2026",
    lifespanMonths: 18,
    investment: "未披露（约数千万美元级估值）",
    fundingType: "融资",
    deadCause: "合规与决策风险",
    deadCauseSub: "虚假营销、监管与诉讼",
    source: "每经网 / 博客园 / 人人都是产品经理",
    verified: true,
    epitaph:
      "两名员工、十余种 AI 工具，宣称年入 4 亿美元、剑指 18 亿美元营收的「一人公司神话」，因用 AI 批量伪造 800 多个虚假医生账号而在 18 个月内崩塌——创始人可能面临的不只是倾家荡产，还有刑事责任。",
    motivation:
      "创始人 Matthew Gallagher 想用「两名员工 + 十余种 AI 工具」证明一人公司可以创造商业奇迹。远程医疗是个诱人的赛道，AI 降低了「看起来像一家正规医疗公司」的成本——官网、宣传、客服、甚至医生资质，都可以由 AI 生成。",
    timeline: [
      { time: "2024", event: "公司成立，以「极致效率的一人公司」形象对外宣传" },
      { time: "2024-2025", event: "宣称年入 4 亿美元，并预期 2026 年营收达 18 亿美元，连 OpenAI CEO 也公开惊叹" },
      { time: "2025", event: "投资人与科技媒体开始质疑：Futurism 报道其宣传内容可疑" },
      { time: "2026-02", event: "被曝在 Facebook 创建 800+ 虚假医生账号，其中一个「Dr. Tuckr Carlzyn MD」经 AI 核实根本不是执业医师" },
      { time: "2026-04", event: "FDA 发出警告信：网站宣传内容「虚假或误导」，销售的复方 GLP-1 减肥药未经批准；虚假营销、法律诉讼集中爆发" },
      { time: "2026-04", event: "神话破灭，公司崩盘，创始人面临刑事责任风险" },
    ],
    breakdown: [
      {
        layer: "表层原因：虚假营销被监管与媒体戳穿",
        detail:
          "AI 被用来生成虚假医生账号、夸大宣传、销售未经批准的药品。当 FDA 警告信和媒体报道落地时，公司信誉在数日内归零。",
      },
      {
        layer: "中间机制：AI 让造假成本趋近于零，也把风险放大了无限倍",
        detail:
          "一人公司的「极致效率」同样适用于造假——一个人 + AI 可以批量制造虚假资质。但传统公司造假要承担组织风险，一人公司把全部风险集中在创始人身上，没有任何防火墙。",
      },
      {
        layer: "深层机制：把「AI 效率」当成了商业模式本身",
        detail:
          "MEDVi 的故事不是「AI 一人公司失败了」，而是「一个人用 AI 造假被抓住了」。真正的商业真理从未改变：产品为核、用户为本、诚信为基。AI 提升效率，但不改变合规底线。",
      },
    ],
    lessons: [
      "AI 提升的是执行效率，不是合规豁免权；医疗、金融等强监管行业，资质与宣传合规是生死线",
      "「极致效率 + 惊人营收」的故事越漂亮，越要接受独立核查——真实商业没有一夜神话",
      "一人公司做高风险行业时，缺少组织防火墙意味着创始人要独自承担全部法律后果",
    ],
  },
  {
    slug: "pulley",
    name: "Pulley",
    status: "dead",
    founderBg: "Yin Wu，连续创业者",
    region: "美国",
    industry: "SaaS / 股权管理",
    startedAt: "2020",
    closedAt: "2026",
    lifespanMonths: 72,
    investment: "累计融资 $5000 万，估值 $2.5 亿",
    fundingType: "融资",
    deadCause: "商业模式脆弱",
    deadCauseSub: "AI 替代导致付费意愿崩塌",
    source: "Failory Newsletter / 调研报告",
    verified: true,
    epitaph:
      "累计融资 5000 万美元、客户一年增长 83% 的股权管理 SaaS，2026 年 9 月宣布 12 月停止运营。杀死它的不是竞争对手，而是 AI——当 AI 工具能免费完成同样工作时，客户为独立软件付费的意愿急剧下降。",
    motivation:
      "Pulley 曾是挑战巨头 Carta 的挑战者，为创业公司提供股权结构管理服务。产品本身并不失败——2024 年客户增长 83% 达 7700 家，这是一个健康增长的 SaaS。",
    timeline: [
      { time: "2020", event: "公司成立，定位为 Carta 的挑战者" },
      { time: "2021-2023", event: "持续获得融资，累计 $5000 万，估值 $2.5 亿" },
      { time: "2024", event: "客户增长 83% 至 7700 家，业务处于上升期" },
      { time: "2026-09", event: "宣布 2026 年 12 月停止运营：AI 工具已能帮助公司清理和维护股权表格" },
      { time: "2026-12", event: "停止运营（计划），并把客户资源引向曾经的对手 Carta" },
    ],
    breakdown: [
      {
        layer: "表层原因：客户付费意愿下降，收入无法维持运营",
        detail:
          "当 AI 工具可以免费或极低成本地完成股权表格的整理与维护时，客户不愿意再为一套独立软件支付费用。增长没有崩塌，但收入模型崩塌了。",
      },
      {
        layer: "中间机制：通用工具的替代，挤压了垂直 SaaS 的定价权",
        detail:
          "AI 把「整理股权表格」这类任务从专业软件的领地变成了通用能力。垂直 SaaS 的价值主张（专业、可靠、合规）在「AI 免费能干 80%」面前失去说服力。",
      },
      {
        layer: "深层机制：单点功能的 SaaS 在 AI 时代没有护城河",
        detail:
          "Pulley 的教训对所有 OPC 和轻量 SaaS 都成立：如果你的产品核心是一个「单点功能」，而 AI 可以复现这个功能，你的定价权就归零。护城河必须来自工作流集成、数据积累或品牌信任。",
      },
    ],
    lessons: [
      "做 SaaS 前先问：这个功能 3 年后 AI 能不能免费做？能，就别做单点工具",
      "客户增长 ≠ 商业模式成立：付费意愿断崖比流失更致命",
      "轻量产品必须向「工作流的一部分」或「数据资产」升级，否则只是 AI 的过渡方案",
    ],
  },
  {
    slug: "neuropixel",
    name: "NeuroPixel",
    status: "dead",
    founderBg: "CEO Arvind Venugopal Nair 及团队",
    region: "印度",
    industry: "AI 时尚图像生成",
    startedAt: "2020",
    closedAt: "2026",
    lifespanMonths: 72,
    investment: "累计融资约 $120 万",
    fundingType: "融资",
    deadCause: "同质化竞争",
    deadCauseSub: "被通用大模型碾压",
    source: "Failory Newsletter（Too Early To AI）/ 调研报告",
    verified: true,
    epitaph:
      "做了四年「时尚行业专用 AI 图像」深度 IP，服务 Myntra、Fabindia、Decathlon 等品牌——然后通用大模型一夜之间赶上了它。「我们被碾压了，就在 2025 年底的某个夜晚。」",
    motivation:
      "NeuroPixel 成立于 2020 年，赌注是「时尚行业需要专门的图像生成模型」：声称能把目录生产时间缩短 90%、图像生产成本降低 70%。它没有错过 GenAI 浪潮，甚至抓得很早。",
    timeline: [
      { time: "2020", event: "成立，专注时尚行业 AI 图像生成，累计融资约 $120 万" },
      { time: "2021-2025", event: "四年时间构建深度 IP，服务 Myntra、Fabindia、Van Heusen、Decathlon 等品牌；第二轮融资估值约 $580 万" },
      { time: "2025 末", event: "Google NanoBanana Pro 等通用图像模型发布，专业工具与前沿模型的差距被抹平" },
      { time: "2026-04", event: "停止服务运营。CEO 公开承认产品「顶不住」通用模型" },
    ],
    breakdown: [
      {
        layer: "表层原因：通用 AI 模型进步太快，专用工具失去技术优势",
        detail:
          "CEO 说公司「massively outgunned overnight sometime in late 2025」。前沿图像模型的能力曲线陡峭到超出任何创业者的预期，专业模型的边际优势在几个月内蒸发。",
      },
      {
        layer: "中间机制：分销比产品质量更重要",
        detail:
          "客户自然流向已集成到更大生态的工具：API、企业关系、海量算力、现成用户群。即使 NeuroPixel 输出质量仍能打，客户也更愿意用「已经长在工作流里的东西」。",
      },
      {
        layer: "深层机制：AI 时代的护城河不是模型质量",
        detail:
          "当你的护城河只是「模型更好」，而模型进步速度不由你控制时，你其实没有护城河。AI 创业的壁垒必须来自数据、分发、品牌或工作流集成——纯模型质量的领先，保质期只有几个月。",
      },
      {
        layer: "致命一击：最大客户倒闭拖欠 6 个月款项",
        detail:
          "在压力最大的时候，最大客户倒闭并拖欠超过 6 个月的账款。对已处于下风的创业公司，一笔大额坏账可以单独结束公司。",
      },
    ],
    lessons: [
      "AI 工具创业别赌「模型永远差我们一点」——通用模型的进步速度不受你控制",
      "尽早建立分销和客户工作流集成，技术优势会过期，关系不会",
      "大客户集中度过高是定时炸弹：应收账款管理是 AI 创业的隐形生死线",
    ],
  },
  {
    slug: "chitu-zhineng",
    name: "赤兔智能工业",
    status: "pivoted",
    founderBg: "工业智能化创业者",
    region: "中国苏州",
    industry: "工业 AI 智能体",
    startedAt: "2024",
    closedAt: "2025",
    lifespanMonths: 12,
    investment: "未披露",
    fundingType: "自筹",
    deadCause: "商业模式脆弱",
    deadCauseSub: "大客户依赖、订单断档",
    source: "调研报告（苏州 OPC 社区案例）",
    verified: true,
    epitaph:
      "自研「飒露紫」工业智能体，曾拿下车企 30 万元软件采购订单——然后陷入订单断档，无法持续获取新客户。大客户的一笔大单，反而成了最深的坑。",
    motivation:
      "赤兔智能工业选择了一条「重」的路：自研工业智能体进入制造业场景。工业软件单价高、付费意愿真实，但销售周期长、决策链复杂——这正是 OPC 最不擅长的战场。",
    timeline: [
      { time: "2024", event: "成立，自研「飒露紫」智能体，切入工业场景" },
      { time: "2025 前段", event: "斩获某车企 30 万元软件采购订单，验证了产品价值" },
      { time: "2025 中段", event: "大订单交付后陷入订单断档，无持续新客户流入" },
      { time: "2025 后段", event: "入驻苏州 OPC 社区，借助苏州市人工智能协会资源对接，业务才得以重启" },
    ],
    breakdown: [
      {
        layer: "表层原因：订单断档，无法建立持续收入",
        detail:
          "一个 30 万的订单能证明产品有人要，但一人团队没有销售体系去复制它。交付完一单，下一单遥遥无期。",
      },
      {
        layer: "中间机制：OPC 缺乏组织化的客户获取能力",
        detail:
          "工业客户的采购决策依赖人脉、资质、信任与漫长的销售周期。这些能力无法被 AI 工具替代，也难以由一个人同时承担「交付」和「销售」。",
      },
      {
        layer: "深层机制：ToB 大单是 OPC 的陷阱",
        detail:
          "大客户依赖症在 OPC 中被放大：一单 30 万可能覆盖一年成本，但它的存在反而掩盖了「没有获客体系」这个致命问题。当大单耗尽，公司立刻回到零收入状态。",
      },
    ],
    lessons: [
      "拿到大单不等于商业模式成立，先问自己：下一单从哪里来？",
      "OPC 做 ToB 必须前置建立获客渠道（社区、协会、合作伙伴），而不是靠单点突破",
      "把一次项目交付转化为经常性收入（维护、订阅、按效果付费），否则永远是「打一单吃一单」",
    ],
  },
  {
    slug: "hexiangzhu-ai",
    name: "合香珠 AI 创业项目",
    status: "dead",
    founderBg: "郭琪，跨界创业者",
    region: "中国",
    industry: "AI + 传统工艺电商",
    startedAt: "2025",
    closedAt: "2026",
    lifespanMonths: 6,
    investment: "约 3 万元",
    fundingType: "自筹",
    deadCause: "需求验证缺失",
    deadCauseSub: "AI 无法交付非标产品的真实需求",
    source: "36氪（3万、半年、注销）",
    verified: true,
    epitaph:
      "3 万投入、半年注销。AI 能写出漂亮的文案，却调不出一味合格的香料——合香珠的核心是「香方配比」，那是老师傅几十年的经验，不是代码。",
    motivation:
      "郭琪想用 AI 改造传统合香珠生意：AI 写文案、做设计、管运营，把一门传统手艺变成「AI + 电商」的轻创业。这个想法在 OPC 浪潮里非常典型——AI 负责一切「可复制」的部分。",
    timeline: [
      { time: "2025", event: "启动合香珠 AI 创业项目，投入约 3 万元" },
      { time: "2025-2026", event: "AI 文案、视觉、运营陆续上线，但产品核心无法突破" },
      { time: "2026 前段", event: "香方配比、供应链、原材料稳定性连环出问题" },
      { time: "2026 中段", event: "项目注销退场" },
    ],
    breakdown: [
      {
        layer: "表层原因：产品交付不稳定",
        detail:
          "每一批香粉的湿度、纯度稍有不同，AI 给出的「完美配比」就瞬间失效。合香珠的质量依赖老师傅的经验与供应链把控，AI 替代不了。",
      },
      {
        layer: "中间机制：AI 只覆盖了「表达层」，没覆盖「价值层」",
        detail:
          "AI 能解决文案、图片、营销这些「怎么卖」的问题，但解决不了「产品本身好不好」的问题。当产品价值依赖非标准化的工艺与供应链，AI 的杠杆就失灵了。",
      },
      {
        layer: "深层机制：轻资产幻觉撞上重供应链现实",
        detail:
          "OPC 模式的前提是「产品可以数字化生产」。合香珠是实物、是工艺、是供应链生意——AI 一人公司在这类赛道里，只是在轻资产的壳里做着重资产的活。",
      },
    ],
    lessons: [
      "先分清你的产品是「数字产品」还是「物理产品」——AI 只对前者有真正的杠杆",
      "供应链和工艺壁垒不能用 AI 抹平，选赛道前先问：最难的部分是不是 AI 能做的？",
      "小投入不代表小风险：3 万块和时间成本同样是真实投入，退场前做好最小验证",
    ],
  },
  {
    slug: "ai-stock-tool",
    name: "AI 智能选股工具",
    status: "dead",
    founderBg: "独立开发者（DoNews 实录）",
    region: "中国",
    industry: "AI 金融工具",
    startedAt: "2025",
    closedAt: "2026",
    lifespanMonths: 6,
    investment: "未披露",
    fundingType: "自筹",
    deadCause: "合规与决策风险",
    deadCauseSub: "关键数据源缺失与合规",
    source: "DoNews（五位一人公司创业者实录）",
    verified: true,
    epitaph:
      "开发 AI 智能选股工具，却因 A 股实时数据接口缺失而失败——产品做得再好，拿不到合规的数据源，一切都是空中楼阁。",
    motivation:
      "开发者看到 AI 热潮，认为「AI + 股票分析」是必然风口：AI 读财报、算指标、给建议。工具开发顺利，但商业化需要 A 股实时行情数据。",
    timeline: [
      { time: "2025", event: "启动 AI 智能选股工具开发" },
      { time: "2025-2026", event: "产品功能完成，但 A 股实时数据接口缺失/成本高企" },
      { time: "2026 前段", event: "无法以可负担的方式获得合规实时数据，项目失败" },
    ],
    breakdown: [
      {
        layer: "表层原因：数据接口缺失，产品无法落地",
        detail:
          "A 股实时数据是金融工具的血液。个人开发者很难拿到合规、稳定、可负担的数据源，产品功能再完整也只能停留在 Demo。",
      },
      {
        layer: "中间机制：数据即合规，金融行业的数据门槛是资本门槛",
        detail:
          "金融数据接口不仅是技术问题，更是牌照与合规问题。个人 OPC 面对的是机构玩家的护城河——数据授权、合规审查、成本结构。",
      },
      {
        layer: "深层机制：选赛道时没盘点「上游依赖」",
        detail:
          "任何产品的商业模式都依赖上游。OPC 创业者往往只评估「我能不能做出来」，忽略了「我能不能拿到做出来所需的上游资源」——数据、API、供应链、资质。",
      },
    ],
    lessons: [
      "动工前盘点上游依赖：数据源、API、资质、供应链，每一项都可能是隐形门槛",
      "强监管行业的数据成本与合规成本远超个人创业者想象，先做成本测算再投入",
      "AI 能做好「分析层」，但「数据层」的获得能力决定金融工具能否商业化",
    ],
  },
  {
    slug: "architect-zero-income",
    name: "大厂架构师的半年零收入",
    status: "dead",
    founderBg: "前大厂架构师",
    region: "中国",
    industry: "AI 咨询 / 软件",
    startedAt: "2025",
    closedAt: "2026",
    lifespanMonths: 6,
    investment: "未披露",
    fundingType: "自筹",
    deadCause: "获客失败",
    deadCauseSub: "个人品牌与获客体系未建立",
    source: "DoNews（五位一人公司创业者实录）",
    verified: true,
    epitaph:
      "大厂架构师离职做 OPC，半年零收入。技术能力是行业顶级的，但「别人不知道你、不信任你、找不到你」——能力不会自动变成客户。",
    motivation:
      "资深架构师带着十多年技术积累离开大厂，想用 AI + 专业能力服务中小企业。技术栈完备、执行力强，但服务型 OPC 的获客依赖个人品牌与信任积累。",
    timeline: [
      { time: "2025 中段", event: "离职，正式投入 OPC" },
      { time: "2025-2026", event: "半年内未能获得收入，个人品牌与销售渠道未建立" },
      { time: "2026", event: "项目停滞/放弃" },
    ],
    breakdown: [
      {
        layer: "表层原因：没有客户",
        detail:
          "专业能力不等于客户来源。没有可触达的渠道、没有可验证的案例、没有持续的内容输出，潜在客户根本不知道你的存在。",
      },
      {
        layer: "中间机制：服务型 OPC 的获客=信任前置",
        detail:
          "企业采购技术咨询或外包服务，买的是信任。信任需要时间积累：内容、案例、口碑、人脉。AI 能帮你写方案，但帮你不了「让人信任你」。",
      },
      {
        layer: "深层机制：把「离职」当成了「客户会来」",
        detail:
          "OPC 创业最危险的假设是「我技术好所以有人买单」。技术是必要条件，但获客、定价、交付、收款是四条完全不同的能力。大厂的光环会消失，而独立市场的规则完全不同。",
      },
    ],
    lessons: [
      "做服务型 OPC，先用 3 个月建立「内容 + 人脉」获客管道，再离职",
      "第一单的价值不是钱，是案例：哪怕低价也要先拿到可验证的交付记录",
      "技术专家转 OPC 最缺的不是技术，而是销售、定价和客户管理",
    ],
  },
  {
    slug: "twice-opc-programmer",
    name: "两度折戟的 OPC 程序员",
    status: "dead",
    founderBg: "程序员（DoNews 实录）",
    region: "中国",
    industry: "软件外包 / 产品",
    startedAt: "2025",
    closedAt: "2026",
    lifespanMonths: 12,
    investment: "未披露",
    fundingType: "自筹",
    deadCause: "商业模式脆弱",
    deadCauseSub: "客户毁约、尾款拖欠、合作方失能",
    source: "DoNews（五位一人公司创业者实录）",
    verified: true,
    epitaph:
      "两度投身 OPC，两度中止——一次客户毁约，一次尾款拖欠，中间还夹着合作方失能。一个人可以扛下所有开发，但扛不下别人的失信。",
    motivation:
      "程序员认为「接单开发」是 OPC 最稳妥的起步：有人付钱、技术可控、不需要获客创新。第一次接单顺利启动，直到客户中途毁约。",
    timeline: [
      { time: "2025 上", event: "第一次 OPC：接单开发，客户中途毁约，项目中止" },
      { time: "2025 下", event: "第二次 OPC：再次接单，尾款被长期拖欠" },
      { time: "2026", event: "合作方失能，项目最终中止" },
    ],
    breakdown: [
      {
        layer: "表层原因：客户与回款风险",
        detail:
          "外包模式的现金流完全系于客户信用。一人公司没有法务、没有预付款机制、没有团队分摊风险，一次毁约或一笔坏账就足以让项目归零。",
      },
      {
        layer: "中间机制：用时间换钱的模式，AI 改变不了回款结构",
        detail:
          "AI 提高了开发速度，但外包的定价、收款、合同结构没有变。AI 让你干得更快，也让你更快地发现自己赚的是「被拖欠的钱」。",
      },
      {
        layer: "深层机制：外包不是生意，是换一种形式打工",
        detail:
          "按项目收费的外包本质是把自己的时间零售出去。OPC 的价值在于「产品化」——一份投入可以被重复售卖。外包模式的规模上限、回款风险与情绪消耗，AI 都无法解决。",
      },
    ],
    lessons: [
      "外包接单前必须设计收款结构：预付 + 里程碑 + 尾款分拆，合同和担保比技术更重要",
      "警惕「客户毁约、尾款拖欠、合作方失能」三连击：一人公司没有容错空间，合作对象比项目本身更重要",
      "想清楚外包 vs 产品：AI 时代做产品的时间成本已经大幅降低，外包是把 AI 的红利让给了客户",
    ],
  },
  {
    slug: "four-unused-ai-tools",
    name: "四款无人使用的 AI 工具",
    status: "dead",
    founderBg: "产品经理（DoNews 实录）",
    region: "中国",
    industry: "AI 工具产品",
    startedAt: "2025",
    closedAt: "2026",
    lifespanMonths: 4,
    investment: "未披露",
    fundingType: "自筹",
    deadCause: "需求验证缺失",
    deadCauseSub: "先做再想，四连发全部无人问津",
    source: "DoNews（五位一人公司创业者实录）",
    verified: true,
    epitaph:
      "四个月内上线四款 AI 工具，账面总收入趋近于零。开发速度是 AI 给的，方向却是自己拍的——AI 让「做出来」变快了，也让「做错」变快了。",
    motivation:
      "产品经理把 AI 工具创业当成「快速试错」：AI 让开发成本降到几乎为零，那就多做几个，总有一个能成。四个月，四款产品，全部无人使用。",
    timeline: [
      { time: "2025 底", event: "启动 OPC，开始快速生产 AI 工具" },
      { time: "2026 初", event: "4 个月内连续上线 4 款 AI 工具" },
      { time: "2026 初-中", event: "4 款产品均无人使用，账面收入趋近于零" },
    ],
    breakdown: [
      {
        layer: "表层原因：产品没有用户",
        detail:
          "四款产品都没有触达真实用户，更没有付费用户。开发速度快得惊人，但「被使用」这个环节完全缺席。",
      },
      {
        layer: "中间机制：AI 降低了试错成本，也取消了「想清楚」的环节",
        detail:
          "当开发成本趋近于零，「先做再想」变得毫无心理负担。但需求验证恰恰是 AI 不能替代的：你得先知道有人要，再动手做。快速生产掩盖了「从不验证需求」的事实。",
      },
      {
        layer: "深层机制：把「数量」当成了「策略」",
        detail:
          "多做几个产品不是策略，是逃避选择。真正的 OPC 成功者（Pieter Levels、Marc Lou）是「高频试错」没错，但每个试错都带着明确的验证假设与获客动作，而不是盲目发射。",
      },
    ],
    lessons: [
      "AI 时代最大的陷阱是「做出来太容易」：每个产品上线前先写清楚：为谁解决什么问题？怎么触达他们？",
      "试错的正确姿势是「验证需求」而不是「开发产品」——先用落地页/访谈/原型验证，再写代码",
      "连续失败四次的共同点，就是没有一次做过需求验证",
    ],
  },
  {
    slug: "charlie-labs",
    name: "Charlie Labs",
    status: "dead",
    founderBg: "AI 工程师创业者",
    region: "美国",
    industry: "AI 工程师工具",
    startedAt: "2024",
    closedAt: "2026-10",
    lifespanMonths: 24,
    investment: "未披露",
    fundingType: "自筹",
    deadCause: "同质化竞争",
    deadCauseSub: "被 Claude / Codex 等通用 Agent 碾压",
    source: "Failory Newsletter（Who Needs Charlie?）",
    verified: true,
    epitaph:
      "又一个 AI 工程师产品关停了。当 Claude 和 Codex 自己就能写代码、跑测试、修 bug 时，专门做「AI 工程师」的创业公司，成了被 AI 干掉的 AI 公司。",
    motivation:
      "Charlie Labs 押注「AI 工程师」这一细分：为企业提供自动化编码、测试与修复的智能体。方向看起来无比正确——但巨头也在做同样的事，而且做得更快。",
    timeline: [
      { time: "2024", event: "成立，定位 AI 工程师智能体" },
      { time: "2025", event: "Claude、Codex 等通用 Agent 能力快速逼近" },
      { time: "2026-10", event: "宣布关停：通用 AI 工程师能力已内置到头部模型生态" },
    ],
    breakdown: [
      {
        layer: "表层原因：通用模型内置了产品能力",
        detail:
          "当 Claude/Codex 原生就能完成「AI 工程师」的工作时，单独的产品层价值消失。用户直接用模型生态内的工具，不再需要第三方封装。",
      },
      {
        layer: "中间机制：与平台竞争没有胜算",
        detail:
          "创业公司的 AI 智能体依赖头部模型的 API。当模型厂商自己把智能体做成产品时，创业公司同时失去了「供应商」和「客户」——这是结构性劣势。",
      },
      {
        layer: "深层机制：AI 创业的「中间层诅咒」",
        detail:
          "在模型与用户之间做「薄封装」的 AI 创业，永远面临被上游模型「向下吞噬」的风险。价值必须建在模型生态之外：专有数据、工作流集成、垂直行业理解。",
      },
    ],
    lessons: [
      "AI 创业要问的不是「这个功能能不能做」，而是「这个功能会不会被模型厂商顺手做了」",
      "依赖头部模型 API 的产品，必须警惕「平台向下吞噬」——把价值建在数据与工作流上",
      "关注模型能力路线图，给产品留出差异化的生存空间",
    ],
  },
  {
    slug: "liaoran-ai-t-shirt",
    name: "廖然 · AI 文创电商",
    status: "dead",
    founderBg: "95 后，前大厂员工",
    region: "中国",
    industry: "AI 文创电商",
    startedAt: "2025-10",
    closedAt: "2026",
    lifespanMonths: 6,
    investment: "约 3 万元（个人积蓄）",
    fundingType: "自筹",
    deadCause: "同质化竞争",
    deadCauseSub: "AI 抹平设计门槛、全网同款价格战",
    source: "澎湃新闻",
    verified: true,
    epitaph:
      "95 后前大厂员工，用 3 万积蓄半年做宠物照片转卡通 T 恤的 AI 文创生意，最后全网同款卖 19.9 元、月固定成本近 3000 元，半年烧光积蓄注销回职场。「AI 给了所有人一支画笔，大多数人画出一模一样的图案。」",
    motivation:
      "廖然原以为 AI 能让他用最少的成本把「设计」这门手艺工业化：上传宠物照片，AI 生成卡通形象，印在 T 恤和帆布包上，主打「治愈感 + 个性化」。辞职时他相信这是 AI 时代最小可行的生意——设计零门槛、生产外包、线上开店。",
    timeline: [
      { time: "2025-10", event: "辞职创业，投入 3 万积蓄启动宠物 AI 文创电商" },
      { time: "2025-11", event: "上线店铺，用 AI 批量生成卡通设计、上架 T 恤与帆布包" },
      { time: "2026-01", event: "发现全网同款泛滥：AI 让所有人都能做出一样的卡通设计，价格被卷到 19.9 元" },
      { time: "2026", event: "五险一金、库存与推广持续吞噬现金，3 万积蓄耗尽" },
      { time: "2026", event: "注销公司，重回职场" },
    ],
    breakdown: [
      {
        layer: "表层原因：AI 抹平了设计门槛，也抹平了差异",
        detail:
          "廖然以为 AI 是护城河，实际上 AI 把设计能力变成了公共资源。他做出来的宠物卡通图，和成千上万个同样用 AI 的人做出来的一模一样——差异化消失，只能打价格战。",
      },
      {
        layer: "中间机制：创意无壁垒 + 固定成本压顶",
        detail:
          "当产品没有独特壁垒时，定价权归平台与同行。19.9 元的客单价扣掉生产成本、快递与平台抽成后所剩无几，而每月的社保公积金、库存与推广费用是刚性支出——收入端萎缩，成本端刚性，现金流迅速归零。",
      },
      {
        layer: "深层机制：把「AI 能做什么」误当成「用户会为什么付钱」",
        detail:
          "AI 让「做出来」变得极其廉价，但商业的本质是「有人愿意为差异化的价值付钱」。当供给被 AI 无限放大而需求没有同步增长时，商品化不可避免。廖然的教训不是别用 AI，而是别把 AI 的通用能力当成自己的核心竞争力。",
      },
    ],
    lessons: [
      "AI 提供的通用能力不是护城河——稀缺的永远是数据、渠道、品牌与真实客户关系",
      "算清固定成本再创业：月固定支出必须由已验证的毛利覆盖，而不是靠积蓄硬扛",
      "「做出来就有人买单」是顺序错误：先找到愿意付钱的客户，再动手做产品",
      "避开价格战的方法只有一个——做 AI 做不到的差异化：独家供应链、真实 IP、深度服务",
    ],
  },
  {
    slug: "jingen-ai-editor",
    name: "景恩 · AI 剪辑工具",
    status: "dead",
    founderBg: "33 岁，跨境电商 / 数据分析背景，投资人内部孵化",
    region: "中国",
    industry: "AI 视频剪辑（toB）",
    startedAt: "2024-12",
    closedAt: "2025-12",
    lifespanMonths: 12,
    investment: "累计投入超 320 万元",
    fundingType: "融资",
    deadCause: "商业模式脆弱",
    deadCauseSub: "融资来源单一、投资人撤资、现金流断裂",
    source: "36氪",
    verified: true,
    epitaph:
      "投资人内部孵化的 AI 剪辑工具：拿钱、开发、上线、撤资、关停，一年走完。320 万投入、5000 种子用户、20 笔付费订单、周留存做到 17.5%——产品在变好，但唯一金主突然撤资，三天后项目归零。",
    motivation:
      "景恩在跨境电商和数据分析领域积累多年，被投资人看中后以「内部孵化」身份创业，做面向企业的 AI 视频剪辑工具。他以为拿到了资金和渠道的双重保障，却没想到融资来源越单一，命运就越不掌握在自己手里。",
    timeline: [
      { time: "2024-12", event: "拿到第一笔资金，项目启动" },
      { time: "2025-04", event: "进入开发阶段，团队搭建完成" },
      { time: "2025-07-30", event: "首个版本上线，累计 5000 种子用户" },
      { time: "2025-08", event: "收到 20 笔付费订单（约 2000 元/笔），周留存从 13% 提升到 17.5%" },
      { time: "2025-12-05", event: "投资人突然宣布撤资（主营业务收缩），要求三天内关停" },
      { time: "2025-12-08", event: "项目正式关停，团队解散" },
    ],
    breakdown: [
      {
        layer: "表层原因：唯一投资人撤资，现金流瞬间断裂",
        detail:
          "项目全部资金来自单一投资人。对方因自身主营业务收缩决定撤资，三天内项目必须关停——产品指标明明在变好（留存提升、有付费），但资金供给方一撤，一切归零。",
      },
      {
        layer: "中间机制：内部孵化模式把命脉交到了别人手里",
        detail:
          "「投资人内部孵化」意味着景恩没有独立融资能力、没有多元资金来源，甚至连客户渠道都依附于投资人。公司像金主手里的一个项目，而不是一个有独立生命力的组织。",
      },
      {
        layer: "深层机制：商业模式依赖他人意志，而非市场验证",
        detail:
          "真正的商业安全，来自「客户愿意付费」的市场闭环，而不是「投资人愿意继续投」的资本意愿。景恩的 20 笔付费订单证明需求存在，但量级太小、速度太慢，来不及在撤资前形成自我造血。",
      },
    ],
    lessons: [
      "融资来源越单一，抗风险能力越弱——至少要有 2 个以上独立资金来源或足够长的现金跑道",
      "「内部孵化」的便宜资金有隐形价格：你的命运由金主的战略决定，随时可能被砍",
      "付费验证要跑得比资本耐心快：20 笔订单证明不了商业模式，要的是可规模化的付费曲线",
      "拿到钱的第一天就要规划：如果明天撤资，我靠什么活下来？",
    ],
  },
  {
    slug: "phind-ai-search",
    name: "Phind · 程序员 AI 搜索引擎",
    status: "dead",
    founderBg: "YC S22，两位创始人",
    region: "美国",
    industry: "AI 编程搜索",
    startedAt: "2022",
    closedAt: "2026-01",
    lifespanMonths: 48,
    investment: "融资超 1000 万美元（最后一轮 1040 万美元）",
    fundingType: "融资",
    deadCause: "同质化竞争",
    deadCauseSub: "被通用模型联网搜索能力吸收",
    source: "TechUnfoldedAI / AI Wiki / 36氪",
    verified: true,
    epitaph:
      "面向程序员的 AI 搜索引擎，从 2024 年流量巅峰到被 ChatGPT、Claude、Perplexity 的原生联网搜索吸干，流量跌去 91%。2025 年 12 月刚融到 1040 万美元，2026 年 1 月就宣布关停、2 周内下线删库。",
    motivation:
      "Phind 的定位很性感：专门为程序员优化答案的 AI 搜索引擎——代码问答比通用模型更准、更快。2022 年成立（YC S22），一度是开发者工具圈的明星，流量在 2024 年 4 月达到峰值。",
    timeline: [
      { time: "2022", event: "成立（YC S22），定位程序员 AI 搜索引擎" },
      { time: "2024-04", event: "流量达到历史峰值，成为开发者常用工具" },
      { time: "2024-2025", event: "ChatGPT、Claude、Perplexity 陆续内置联网搜索，代码问答能力逼近" },
      { time: "2025-12-03", event: "宣布融资 1040 万美元，试图最后冲刺" },
      { time: "2026-01-13", event: "宣布关停" },
      { time: "2026-01-16", event: "服务正式下线" },
      { time: "2026-01-30", event: "用户数据全部删除" },
    ],
    breakdown: [
      {
        layer: "表层原因：流量被通用模型原生能力吸干",
        detail:
          "当 ChatGPT、Claude、Perplexity 都自带联网搜索和代码问答时，「专门做搜索的程序员工具」这个品类失去了存在理由。流量从峰值跌去 91%，是典型的功能被平台吸收。",
      },
      {
        layer: "中间机制：独立搜索没有数据与生态壁垒",
        detail:
          "Phind 的答案质量建立在通用模型 + 网络索引之上，没有独家数据、没有开发者生态绑定。用户切换到 ChatGPT 的成本几乎为零——切换成本为零的生意，护城河为零。",
      },
      {
        layer: "深层机制：AI 应用的「特征 vs 产品」困境",
        detail:
          "很多 AI 创业做的其实是大模型的一个「特征」而非一个「产品」。特征的价值来自模型能力，模型升级时特征会被原生吸收。真正能活下来的 AI 产品，要么有独家数据闭环，要么有用户生态，要么解决了模型做不好的重工作流。",
      },
    ],
    lessons: [
      "如果你的产品价值 = 大模型能力的封装，那么模型升级之日就是你的死期",
      "流量跌 91% 时融资续命救不了一家公司——需求消失后，钱只会延长痛苦",
      "工具类 AI 创业要建「切换成本」：独家数据、工作流集成、团队协作绑定",
      "识别「特征 vs 产品」：能原生嵌进头部模型的功能，不要拿来创业",
    ],
  },
  {
    slug: "tome-ai-deck",
    name: "Tome · AI 演示文稿",
    status: "pivoted",
    founderBg: "Keith Peiris & Henri Liriani，前 Meta/Instagram 产品负责人",
    region: "美国",
    industry: "AI 演示文稿",
    startedAt: "2020",
    closedAt: "2025-04",
    lifespanMonths: 64,
    investment: "融资约 8100 万美元",
    fundingType: "融资",
    deadCause: "商业模式脆弱",
    deadCauseSub: "用户量大不等于生意、付费转化长期低迷",
    source: "人人都是产品经理 / AI Wiki / 36氪",
    verified: true,
    epitaph:
      "134 天破 100 万用户、累计 2500 万用户、融资 8100 万美元的 AI 演示文稿爆款，2024 年底年收入却只有约 300 万美元。创始人裁掉两成团队转企业销售也没能救活，2025 年 4 月 30 日主动关停，6 人团队转做 AI CRM。",
    motivation:
      "Tome 曾是第一波生成式 AI 创业热潮的代表：输入一句话，生成整套演示文稿。2022 年 9 月上线后 134 天破百万用户，投资人包括 LinkedIn 创始人 Reid Hoffman、Google 前 CEO Eric Schmidt，估值一度 3 亿美元。",
    timeline: [
      { time: "2020", event: "成立，创始人来自 Meta/Instagram 产品线" },
      { time: "2022-09", event: "上线，134 天突破 100 万用户，称当时生产力软件最快纪录" },
      { time: "2023-02", event: "完成 4300 万美元 B 轮，估值 3 亿美元" },
      { time: "2024-04", event: "裁掉约 20% 团队（59 人中裁 20%），转向企业销售" },
      { time: "2024-12", event: "累计 2500 万用户，年收入仅约 300 万美元，账上还剩一半融资" },
      { time: "2025-04-30", event: "Tome Slides 正式停止服务，用户内容不可访问" },
      { time: "2025-11", event: "6 人团队推出 AI CRM Lightfield，重新出发" },
    ],
    breakdown: [
      {
        layer: "表层原因：2500 万用户里几乎没有付费用户",
        detail:
          "Tome 的用户增长是现象级的，但绝大多数用户停在免费版：学生做一次课堂作业、普通用户偶尔做一次 PPT，用完即走。年收入 300 万美元对应 2500 万用户，付费率低得可怜。",
      },
      {
        layer: "中间机制：产品不是「mission-critical」",
        detail:
          "创始人 Keith Peiris 事后评价：产品有增长，但不是企业非用不可的核心工具。大模型擅长把 0 做到 60 分（帮你跨过空白页），但大量真正值钱的专业工作，难点恰恰不在 60 分之前——这是 AI 生产力工具普遍的商业化天花板。",
      },
      {
        layer: "深层机制：增长指标误导了商业判断",
        detail:
          "Tome 的故事说明「用户很多」可能是 AI 创业最危险的指标。融资逻辑追逐 MAU 神话，但商业逻辑只看复购与毛利。当增长叙事与付费现实脱节时，再多的用户也只是展示性的繁荣。",
      },
    ],
    lessons: [
      "用户量是虚荣指标，付费率与复购才是生意——上线第一天就该设计付费闭环",
      "AI 生产力工具要警惕「60 分陷阱」：大模型把活干到 60 分，用户不愿为剩下的 40 分付费",
      "增长叙事能融资，但不能造血；账上还有一半钱时主动关停，也是一种商业理性",
      "小团队（两张大披萨喂饱）才是转型的生存形态——70 人转型失败，6 人转型成功",
    ],
  },
  {
    slug: "yupp-ai-eval",
    name: "Yupp.ai · 模型评测平台",
    status: "dead",
    founderBg: "Pankaj Gupta（前 Twitter/Google/Coinbase）联合创业，豪华种子轮",
    region: "美国",
    industry: "AI 模型评测",
    startedAt: "2024-06",
    closedAt: "2026-04",
    lifespanMonths: 22,
    investment: "种子轮 3300 万美元",
    fundingType: "融资",
    deadCause: "需求验证缺失",
    deadCauseSub: "市场被 Agent 系统取代、用户与客户双流失",
    source: "36氪 / 投资界 / Economic Times / Yupp 官网",
    verified: true,
    epitaph:
      "a16z crypto 领投 3300 万美元、45 位硅谷顶级天使、130 万用户的模型评测平台，上线不到一年就关闭——投资人钱还没花完，AI 技术演进就让它的市场不复存在：行业从 Chatbot 转向 Agent，众包模型评测成了没人需要的旧生意。",
    motivation:
      "2024 年 6 月成立，创始团队全是硅谷精英：CEO 曾在 Twitter/Google/Coinbase，联合创始人曾是 Google X 机器学习负责人。创业逻辑是构建「人类反馈数据」的双边市场：免费让用户对比数百个模型并投票，把偏好数据卖给模型厂商做 RLHF。",
    timeline: [
      { time: "2024-06", event: "成立，种子轮 3300 万美元（a16z crypto 领投，45+ 天使跟投）" },
      { time: "2025-06", event: "正式上线，用户可免费对比 500+ 模型并赚积分" },
      { time: "2025 下半年", event: "用户超 130 万，但 Agent 成为行业主题，Chatbot 评测需求骤降" },
      { time: "2026-03-31", event: "宣布停止服务（创始人称 PMF 不够，剩余资金返还投资人）" },
      { time: "2026-04-15", event: "平台完全下线，存活 22 个月" },
    ],
    breakdown: [
      {
        layer: "表层原因：行业从 Chatbot 转向 Agent，评测市场消失",
        detail:
          "Yupp 上线时主流交互是 Chatbot——「哪个模型回答得更好」确实有市场。但几个月内行业风向剧变：用户要的是把事情完成的 Agent，不再关心两段文字哪个更好。评测 Chatbot 的需求消失了。",
      },
      {
        layer: "中间机制：数据质量拼不过专业玩家",
        detail:
          "Yupp 提供的是普通消费者随手点击的偏好数据，而模型厂商的主流选择是与 Scale AI、Mercor 等合作，用 PhD 级专家提供高质量 RLHF 反馈。质量不在一个量级，客户买单意愿自然低。",
      },
      {
        layer: "深层机制：需求验证缺失——市场变化比融资烧钱更快",
        detail:
          "3300 万美元的豪华种子轮证明资本看好这个方向，但市场验证的是「当下的需求」，而 AI 市场以季度为单位剧变。Yupp 的产品逻辑建立在 Chatbot 时代，当范式切换时，它没有来得及验证和转型。",
      },
    ],
    lessons: [
      "豪华融资不代表需求真实——市场范式切换时，钱只会让失败更体面，不会让失败不发生",
      "AI 创业要持续做需求验证：你的用户需求是否会被上游能力升级直接消灭？",
      "众包数据的商业价值取决于质量壁垒：普通人随手点击的偏好，拼不过专家标注",
      "融资额越大越要警惕「叙事惯性」：投资人相信的是昨天的故事，市场只认明天的需求",
    ],
  },
  {
    slug: "ai-social-miniapp",
    name: "校园 AI 社交小程序",
    status: "dead",
    founderBg: "36氪作者，一人 + AI 全职创业",
    region: "中国",
    industry: "AI 社交",
    startedAt: "2026-03",
    closedAt: "2026-09",
    lifespanMonths: 6,
    investment: "未披露（个人资金 + AI 工具成本）",
    fundingType: "自筹",
    deadCause: "商业模式脆弱",
    deadCauseSub: "需求真实但纯线上社交商业天花板低",
    source: "36氪",
    verified: true,
    epitaph:
      "一人 + AI 做纯线上 AI 社交小程序：生产端全面成功——次日留存 35%+、付费用户过百、有真实续费，却因「商业模式没跑通」半年后暂停。产品能做出来、用户留得住、有人付钱，生意还是没成。",
    motivation:
      "作者用一个人 + AI 的方式尝试做 AI 社交小程序，最初设想用 AI 重构陌生人社交的效率。产品生产很顺利：AI 承担了开发、运营、客服的大量工作，从 0 到上线周期极短。",
    timeline: [
      { time: "2026-03", event: "一人 + AI 启动 AI 社交小程序项目" },
      { time: "2026 上半年", event: "产品上线：次日留存 35%+，付费用户过百且有续费" },
      { time: "2026-09", event: "判断商业模式跑不通，主动暂停项目" },
    ],
    breakdown: [
      {
        layer: "表层原因：有用户、有付费，但没有可规模化的商业模式",
        detail:
          "次日留存 35%+、付费用户过百、有续费——这些指标证明产品有真实需求。但纯线上社交的付费场景单薄，客单价低、复购不稳定，没有跑出可持续的商业模式。",
      },
      {
        layer: "中间机制：一人公司的「生产成功」不等于「商业成功」",
        detail:
          "AI 让生产端变得极其高效，作者把「做出来、有人用、有人付钱」误当成终点。但商业闭环的最后一环——单位经济模型为正且可规模化——没有打通。生产端的成功掩盖了商业端的虚弱。",
      },
      {
        layer: "深层机制：社交产品的冷启动是伪命题，留存变现才是真命题",
        detail:
          "陌生人社交天然面临「关系沉淀后逃离平台」的困境，纯线上形态缺少线下/场景绑定，用户价值难以货币化。AI 能解决生产效率，但解决不了社交品类的商业天花板。",
      },
    ],
    lessons: [
      "留存和付费不等于商业模式：还要验证单位经济模型是否为正、能否规模化",
      "AI 把「做出来」的成本打下来之后，创业难点前移到「卖给谁、怎么持续收钱」",
      "做社交之前先想清楚货币化路径——纯线上陌生人社交的商业天花板普遍很低",
      "一人公司要选「AI 放大个人能力」而非「AI 对抗平台生态」的赛道",
    ],
  },
  {
    slug: "character-ai",
    name: "Character.AI",
    founderBg: "两位前谷歌AI研究员",
    region: "美国",
    industry: "AI情感陪伴",
    startedAt: "2021",
    closedAt: "2026-10",
    investment: "1.5亿美元A轮融资",
    source: "21世纪经济报道",
    status: "dead",
    lifespanMonths: 60,
    fundingType: "自筹",
    deadCause: "成本结构失衡",
    deadCauseSub: "高推理成本与低订阅收入严重倒挂",
    verified: true,
    epitaph: "曾估值10亿美元、月活2000万，\n却因月均3000万算力成本与不足0.7%的付费率走向破产，\n最终仅以2000万美元底价拍卖资产。",
    motivation: "两位前谷歌AI研究员离职创业，旨在探索AI在情感陪伴与娱乐领域的巨大潜力。他们希望打破传统AI单纯问答的模式，让用户能够自主创建动漫、历史名人或原创虚构等虚拟角色，并与之进行持续、深度的个性化对话，从而提供独特的情感交互体验。",
    timeline: [
      { time: "2021", event: "两位谷歌前AI研究员离职创立Character.AI" },
      { time: "2022-09", event: "推出测试版，移动端首周下载量破170万" },
      { time: "2023-03", event: "完成a16z领投的1.5亿美元A轮融资，估值达10亿美元" },
      { time: "2024-08", event: "谷歌获得技术许可并挖走创始人及核心团队" },
      { time: "2026-10", event: "申请破产保护，迪士尼以2000万美元作为底价竞购" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "高推理成本与低订阅收入严重倒挂，月运营成本高达3000万美元，9.99美元订阅费无法覆盖算力成本" },
      { layer: "深层原因", detail: "商业模式脆弱，付费转化率不足0.7%，免费用户无限制对话导致亏损随用户互动时长增加而扩大" },
      { layer: "外部原因", detail: "面临严峻的合规与诉讼风险，青少年自杀等诉讼导致监管收紧，限制未成年人使用直接砍去核心用户群" },
    ],
    lessons: [
      "用户规模和互动时长不能自动转化为商业成功，必须设计能覆盖边际成本的盈利模式",
      "AI情感陪伴赛道的高推理成本是致命伤，需在产品体验与算力成本间找到平衡",
      "合规风险是AI产品的生死线，尤其是涉及未成年人保护时，必须提前建立防护机制",
      "过度依赖外部大厂存在核心团队被抽离的风险，需建立稳固的团队护城河",
    ],
  },
  {
    slug: "26yo-ai-startup-failure",
    name: "26岁工程师AI情感陪伴与无人直播创业失败",
    founderBg: "26岁，2022年毕业，前软件工程师，与上一家公司CEO合伙",
    region: "中国",
    industry: "人工智能",
    startedAt: "2024",
    closedAt: "2025",
    investment: "初期有投资意向，后因合伙人私人恩怨撤资，后续资金断裂",
    source: "https://blog.csdn.net/weixin_43891901/article/details/151776879",
    status: "dead",
    lifespanMonths: 6,
    fundingType: "自筹",
    deadCause: "需求验证缺失",
    deadCauseSub: "产品方向频繁调整且未经充分市场验证，做出来的AI情感陪伴和无人直播产品不被市场认可",
    verified: true,
    epitaph: "26岁首战AI创业，历经3个月业务试错与方向频调。\n情感陪伴与无人直播终未获市场认可，大半年心血随资金断裂而破产。",
    motivation: "作者2022年毕业后担任软件工程师，2024年与上一家公司CEO因对AI时代的共同兴趣决定创业。作者渴望尝试新事物，认为创业能让人在短时间内实现能力的质的飞跃，不愿在毕业一两年后就陷入买房结婚的舒适圈，希望将创业经历作为人生的宝贵财富。",
    timeline: [
      { time: "2024年初", event: "与上一家公司CEO相识，决定进军AI领域创业" },
      { time: "2024年中", event: "公司组建完成，原定投资因合伙人私人恩怨撤资" },
      { time: "2024年下半年", event: "团队持续3个月探索业务，推出AI情感陪伴与无人直播产品" },
      { time: "2025年初", event: "产品未获市场认可，资金耗尽，公司破产清算" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "原定投资因合伙人私人恩怨撤资，导致公司迅速陷入资金断裂的危险边缘。" },
      { layer: "深层原因", detail: "缺乏明确且经过验证的核心业务方向，团队在3个月内频繁试错AI情感陪伴、无人直播等方向，做出来的产品不被市场认可。" },
      { layer: "根本原因", detail: "初创团队在资源匮乏时，未能有效进行市场需求验证与商业模式闭环，过度依赖方向调整而非深耕单一痛点，导致获客与变现失败。" },
    ],
    lessons: [
      "创业初期必须谨慎选择合伙人，避免因私人恩怨导致核心资金链断裂。",
      "AI创业不能盲目追逐热点，必须在投入开发前进行充分的市场需求验证。",
      "初创公司资源有限，频繁调整业务方向会耗尽现金流，应聚焦单一痛点打透而非不断试错。",
    ],
  },
  {
    slug: "builder-ai",
    name: "Builder.ai",
    founderBg: "",
    region: "",
    industry: "AI软件开发",
    startedAt: "2016",
    closedAt: "2025-05",
    investment: "$445M",
    source: "https://techcrunch.com/2025/05/20/once-worth-over-1b-microsoft-backed-builder-ai-is-running-out-of-money/",
    status: "dead",
    lifespanMonths: 113,
    fundingType: "自筹",
    deadCause: "商业模式脆弱",
    deadCauseSub: "伪AI模式与财务造假",
    verified: true,
    epitaph: "融资4.45亿美元，估值曾达15亿美元。\n700名工程师用血肉之躯伪装神经网络，\n最终在虚报300%收入的谎言中破产。",
    motivation: "Builder.ai成立于2016年，旨在打造一款革命性的AI应用构建器，让非技术人员也能通过简单指令自动生成软件应用。在微软等巨头的背书与支持下，公司试图打破传统软件开发的门槛，利用所谓的神经网络实现代码自动化编写。其动机是抓住AI赋能开发的风口，通过自动化技术重塑开发流程，从而在15亿美元估值的愿景中获取巨大商业回报。",
    timeline: [
      { time: "2016", event: "公司成立，推出AI应用构建器概念" },
      { time: "2022", event: "获得微软等投资，估值达到15亿美元" },
      { time: "2023", event: "被曝出AI实为700名印度工程师手动写代码" },
      { time: "2024", event: "被揭露虚报300%收入" },
      { time: "2025-05", event: "债权人扣押3700万美元，公司在五国破产" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "资金链断裂，债权人扣押3700万美元导致公司在五国破产" },
      { layer: "中层原因", detail: "成本结构失衡，所谓的AI实为700名工程师手动写代码" },
      { layer: "深层原因", detail: "商业模式脆弱，为维持高估值虚报300%收入，伪AI模式无法产生真实价值" },
    ],
    lessons: [
      "技术包装无法掩盖产品本质缺陷，用人工伪装AI的伪科技模式注定无法长期维持",
      "企业必须坚守财务与商业诚信，通过虚报收入维持高估值最终会导致毁灭性危机",
      "评估AI创业项目应穿透技术噱头，严格验证核心技术的自动化程度与真实单位经济效益",
    ],
  },
  {
    slug: "kestrel-freight-systems",
    name: "Kestrel Freight Systems",
    founderBg: "未披露（文章未提及创始人背景）",
    region: "爱尔兰",
    industry: "物流软件",
    startedAt: "2016",
    closedAt: "2024",
    investment: "未披露",
    source: "BuyMyDeadStartup（援引 Forbes，2026年4月）",
    status: "dead",
    lifespanMonths: 96,
    fundingType: "自筹",
    deadCause: "商业模式脆弱",
    deadCauseSub: "公司停止运营后，其代码、工单、邮件等运营数据被作为AI训练语料挂牌出售，说明原有物流软件业务未能形成可持续收入，最终只能靠变卖数据资产回收残值",
    verified: false,
    epitaph: "八年物流软件，31人团队，14个代码库、6.1万次提交。\n业务停了，数据还活着——挂牌4.5万美元，等一个AI实验室。\n2026年10月14日前，欢迎出价。",
    motivation: "Kestrel Freight Systems 于2016年在爱尔兰成立，做的是物流软件，一路做到 Series A，团队峰值31人。八年里，公司积累了14个Git仓库、约6.1万次提交、2.2万张Jira工单、8年Slack记录、28个公司邮箱和约240GB规格文档。但物流软件赛道竞争激烈、客户付费意愿有限，公司没能把产品做成可持续的生意，2024年停止运营。创始人没有选择让这些资产随公司一起消失，而是把它挂到 BuyMyDeadStartup 上，希望AI实验室愿意为这些真实运营数据付费——毕竟公开互联网已经被训练完了，剩下的价值藏在死掉的创业公司档案里。",
    timeline: [
      { time: "2016", event: "公司在爱尔兰成立，切入物流软件赛道" },
      { time: "2016-2024", event: "累计14个Git仓库、约6.1万次提交、2.2万张Jira工单、8年Slack记录、28个公司邮箱、约240GB规格文档" },
      { time: "峰值期", event: "团队规模达31人，融资阶段为Series A" },
      { time: "2024", event: "公司停止运营，业务关闭" },
      { time: "2026", event: "在BuyMyDeadStartup挂牌，标价4.5万美元，截止2026年10月14日接受报价" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "物流软件业务未能持续经营，公司于2024年停止运营，峰值31人、Series A的规模未能转化为长期收入" },
      { layer: "深层原因", detail: "商业模式脆弱：产品面向物流行业，客户付费能力和续约意愿有限，八年运营未能建立稳定现金流，最终只能靠出售数据资产回收残值" },
      { layer: "行业背景", detail: "AI实验室已耗尽公开互联网数据，转而高价收购死掉创业公司的内部代码、工单、邮件等运营记录，医疗和金融行业数据报价最高，单笔交易普遍在1万至10万美元，个别达10万美元以上" },
      { layer: "处置方式", detail: "创始人选择在BuyMyDeadStartup免费挂牌，自行设定4.5万美元要价，平台不抽成、不托管数据、不参与谈判，买卖双方直接对接" },
    ],
    lessons: [
      "Series A 和31人团队不等于可持续商业模式，融资阶段只是过程指标，现金流才是生死线",
      "创业公司死掉后，代码、工单、邮件等运营数据仍有残值，AI训练数据市场正在为这些'死资产'定价",
      "关停不是终点：提前整理好Git、Jira、Slack、邮件等资产清单，能在清算阶段换回真金白银",
      "物流等传统行业的软件创业，客户付费意愿和续约率需要在早期就验证，不能靠融资掩盖需求不足",
      "创始人应把数据资产视为公司资产负债表的一部分，在关停决策时同步评估其可出售价值",
    ],
  },
  {
    slug: "petal-live",
    name: "Petal",
    founderBg: "两名开发者 Mira 与 Theo，具备 Rust 系统编程与实时音视频（LiveKit）工程背景，属于技术型创始人组合",
    region: "未披露（产品文档为英文，推测为欧美团队）",
    industry: "AI/科技协作工具（远程结对编程与窗口共享）",
    startedAt: "未披露",
    closedAt: "2026-07-31",
    investment: "未披露",
    source: "petal.live",
    status: "dead",
    lifespanMonths: 0,
    fundingType: "自筹",
    deadCause: "商业模式脆弱",
    deadCauseSub: "产品以开源+自托管为核心，缺乏可持续变现路径，最终停止运营",
    verified: false,
    epitaph: "这里曾让远程结对像坐在一起。\n2026年7月31日 9:41，最后一个窗口关闭。\n代码开源，公司没有。",
    motivation: "Mira 与 Theo 在远程协作中反复遭遇屏幕共享的割裂感：视频会议里的窗口只是网格中的一块瓦片，模糊、不可交互、无法同时操作。他们希望把共享窗口变成桌面上真实存在的窗口——可移动、可缩放、清晰锐利，并支持多人同时共享与即时远程键鼠输入。基于 Rust 自研合成器与 LiveKit 视频基础设施，他们打造了 Petal，让远程结对编程像并肩坐在同一台电脑前一样自然，并以开源方式让团队完全掌控数据与部署。",
    timeline: [
      { time: "未披露", event: "Mira 与 Theo 启动 Petal 项目，开发 Rust 合成器与窗口共享功能" },
      { time: "未披露", event: "发布 Petal Cloud 与自托管两种部署模式，基于 LiveKit 提供视频基础设施" },
      { time: "2026-07-31", event: "产品页面显示最后活动时间 9:41 AM，此后停止运营" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "产品页面停留在 2026 年 7 月 31 日 9:41 AM，此后无更新，服务实际停止" },
      { layer: "商业模式", detail: "核心卖点是开源与自托管，用户可自行部署、无需付费，云端订阅缺乏不可替代的增值点，收入难以覆盖 LiveKit 媒体服务器与开发成本" },
      { layer: "市场定位", detail: "远程结对编程属于小众场景，目标用户规模有限，且面临 VS Code Live Share、Tuple、Pop 等成熟竞品的同质化竞争" },
      { layer: "团队与资源", detail: "仅两名技术创始人，缺乏销售与增长职能，开源项目难以转化为可持续经营的公司" },
    ],
    lessons: [
      "开源可以赢得开发者信任，但不能替代商业模式设计，自托管越彻底，付费转化越困难",
      "技术差异化（真实窗口、远程控制）必须绑定可量化的付费场景，否则只是极客玩具",
      "小众协作工具需在早期验证付费意愿，而非默认开发者会为便利性买单",
      "两人技术团队应尽早引入增长与商业化角色，避免产品优秀却无人经营",
    ],
  },
  {
    slug: "coscreen",
    name: "CoScreen",
    founderBg: "Jason Thomas、Till、Max 等联合创立，团队具备实时协作与屏幕共享技术背景",
    region: "美国",
    industry: "企业协作/屏幕共享",
    startedAt: "2016",
    closedAt: "2025-07-31",
    investment: "未披露具体金额，Datadog 收购后持续投入多年",
    source: "Hacker News",
    status: "dead",
    lifespanMonths: 114,
    fundingType: "自筹",
    deadCause: "合规与决策风险",
    deadCauseSub: "被收购后与母公司核心客户群和使命偏离，母公司决定关停独立产品",
    verified: true,
    epitaph: "六年打造零摩擦协作体验，\n三年融入 Datadog 生态，\n2025年7月31日被母公司亲手日落。",
    motivation: "Jason Thomas 与 Till、Max 曾亲历 Screenhero 被 Slack 收购后关停的行业悲剧，他们希望打破屏幕共享工具被平台收购即消失的循环。2016年前后，三人创立 CoScreen，目标是打造比 Screenhero 更神奇的协作体验：把窗口从你的笔记本抛到别人屏幕上，零摩擦开始协作。他们相信实时屏幕共享可以成为团队协作的核心入口，而非大平台的一个附属功能。",
    timeline: [
      { time: "2016", event: "CoScreen 成立，开始构建实时屏幕共享工具" },
      { time: "2022", event: "被 Datadog 收购，团队并入并继续开发独立产品" },
      { time: "2022-2025", event: "在 Datadog 内持续投入，同时开发集成功能与 MCP server" },
      { time: "2025-07-31", event: "Datadog 日落 CoScreen 服务" },
      { time: "2025", event: "原团队四人用不到八周构建开源替代品 Petal" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "CoScreen 作为独立屏幕共享工具，与 Datadog 核心客户群和监控使命过于边缘化，无法获得足够战略优先级" },
      { layer: "中层原因", detail: "被收购后团队精力被分散到 Datadog 其他通信功能、视频平台集成和 MCP server 等项目，独立产品迭代资源被稀释" },
      { layer: "深层原因", detail: "行业反复出现同一模式：小团队做出优秀工具，平台为团队或功能收购，独立产品在整合中消亡，Screenhero、Around、Multi 均如此" },
      { layer: "根本原因", detail: "被收购的独立产品缺乏可持续的独立商业模式和用户增长路径，命运完全取决于母公司战略决策，而非市场需求" },
    ],
    lessons: [
      "被收购不等于成功，独立产品可能因与母公司战略不符而被关停",
      "平台收购往往为团队或功能，而非产品本身，创始人需警惕产品被边缘化",
      "开源与自托管是抵御平台日落风险的一种路径，但需提前设计",
      "实时协作工具技术壁垒高，但商业壁垒未必同样高，需验证独立付费意愿",
      "创业公司应尽早建立不依赖单一收购方的用户增长和收入模式",
    ],
  },
  {
    slug: "anbu",
    name: "Anbu",
    founderBg: "独立创始人,无联合创始人,自行设计平台、手绘美术与Logo,外包开发、像素画、音乐、音效和3D模型",
    region: "未披露(推测北美)",
    industry: "云游戏/浏览器游戏平台",
    startedAt: "2021",
    closedAt: "约2022-2023(具体未披露)",
    investment: "约15000美元",
    source: "eggverse.co",
    status: "dead",
    lifespanMonths: 0,
    fundingType: "自筹",
    deadCause: "成本结构失衡",
    deadCauseSub: "AWS EC2托管费用高昂,免费额度用尽后无法承担持续支出",
    verified: false,
    epitaph: "投入1.5万美元,只换来一款游戏和一群没留下的玩家;\n免费额度一到期,梦想就被EC2账单掐灭。\n如今EggVerse带着18款游戏归来,但没人能保证玩家会回头。",
    motivation: "2021年,我投入约1.5万美元启动Anbu,最初想做去中心化云游戏平台,但受限于资金且没有联合创始人,只能缩减为一个浏览器街机——让玩家和朋友一起玩游戏。我亲自在Figma设计平台、手绘美术和Logo,并外包开发、像素画、音乐、音效和3D模型。这笔预算最终只做出一款游戏《Egg on the Run》,以及游戏大厅、好友邀请、聊天和发布平台。我计划用第一款游戏吸引玩家,让他们带来朋友,再引入其他开发者发布游戏,形成一个自增长的生态。",
    timeline: [
      { time: "2021", event: "投入约1.5万美元启动Anbu,定位浏览器街机游戏平台" },
      { time: "2021-2022", event: "完成平台设计、美术、外包开发,推出首款游戏《Egg on the Run》及大厅、邀请、聊天、发布功能" },
      { time: "2022-2023", event: "首款游戏吸引力不足,AWS免费额度耗尽,EC2托管成本过高,项目关闭" },
      { time: "2023-2024", event: "在经营另一家初创公司Sky期间,将Anbu作为周末副业重新拾起,利用原有素材和Astra探索" },
      { time: "2024-2025", event: "以EggVerse名义重新上线,扩展至18款多人游戏并持续增加" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "首款游戏《Egg on the Run》不够吸引人,未能带来足够玩家和社交传播" },
      { layer: "中层原因", detail: "AWS EC2托管费用高昂,免费额度用尽后无法用收入覆盖,被迫关闭" },
      { layer: "深层原因", detail: "单款游戏+自筹资金的内容型平台,缺乏持续内容供给和用户增长引擎,商业模式无法自我造血" },
      { layer: "根本原因", detail: "以有限预算挑战平台型生态,需求验证不足,获客与留存未跑通就承担了固定基础设施成本" },
    ],
    lessons: [
      "平台型创业需要先验证单点需求,再谈生态和开发者引入",
      "固定基础设施成本必须与收入模型匹配,免费额度不是长期方案",
      "内容型产品首款作品必须足够有吸引力,否则无法启动社交传播",
      "独立创始人资源有限时,应优先做最小可验证闭环而非完整平台",
      "失败项目中的资产和经验可以复用,重启时需重新验证用户留存",
    ],
  },
  {
    slug: "saturn-sql",
    name: "Saturn SQL",
    founderBg: "未披露，创始人为解决自身团队数据共享需求而开发工具的开发者",
    region: "未披露",
    industry: "数据工具 / SaaS",
    startedAt: "未披露",
    closedAt: "未披露",
    investment: "未披露",
    source: "saturnsql.com",
    status: "dead",
    lifespanMonths: 0,
    fundingType: "自筹",
    deadCause: "同质化竞争",
    deadCauseSub: "免费替代方案（cron job + Python 脚本）可零成本实现相同功能，产品价值主张难以支撑付费",
    verified: false,
    epitaph: "为替代两款停运工具而生，\n却敌不过一行免费的 cron job，\n数据民主化的理想止步于付费意愿。",
    motivation: "创始人的团队原本使用 PopSQL 和 SeekWell 来定时将数据库数据同步到 Google Sheets，并共享公司专属的 SQL 查询库。然而这两款工具相继停运，团队失去了赖以工作的数据管道。创始人坚信数据属于公司里的每一个人，当人们能够自由访问数据时，会自发找到使用场景，生产力也会大幅提升。因此他决定亲手打造一个替代品，只覆盖团队真正用到的功能：连接数据库、编写和共享 SQL、将结果定时推送到 Sheets 或 Slack，并刻意保持产品范围狭窄，以便快速响应需求。",
    timeline: [
      { time: "未披露", event: "PopSQL 和 SeekWell 相继宣布停运" },
      { time: "未披露", event: "创始人决定自建替代工具 Saturn SQL" },
      { time: "未披露", event: "产品上线，聚焦数据库连接、SQL 共享与定时推送" },
      { time: "未披露", event: "面临免费 cron job + Python 脚本的替代竞争" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "产品功能可被免费的 cron job 加 Python 脚本完全替代，用户缺乏付费动机" },
      { layer: "深层原因", detail: "产品定位过于狭窄，仅覆盖团队自用的少数功能，难以形成差异化壁垒和付费价值" },
      { layer: "根本原因", detail: "数据工具赛道同质化严重，开源与免费方案泛滥，独立开发者难以在价格与功能上建立可持续的商业模式" },
    ],
    lessons: [
      "免费替代方案是独立工具最致命的竞争对手，必须在便利性或协作体验上建立不可替代的价值",
      "从自身需求出发做产品容易陷入范围过窄的陷阱，需验证更广泛市场的付费意愿",
      "面向非技术用户的数据工具，真正的壁垒在于降低使用门槛而非功能本身",
      "在成熟赛道中创业，必须明确回答用户为什么愿意付费而不是用免费方案",
    ],
  },
  {
    slug: "moondream",
    name: "Moondream",
    founderBg: "由两位亚马逊AWS资深员工在西雅图创立",
    region: "美国西雅图",
    industry: "计算机视觉/多模态AI",
    startedAt: "2023",
    closedAt: "2025",
    investment: "未披露",
    source: "GeekWire",
    status: "dead",
    lifespanMonths: 24,
    fundingType: "自筹",
    deadCause: "同质化竞争",
    deadCauseSub: "视觉AI模型赛道拥挤，独立小团队难以与OpenAI、Google等巨头及开源模型竞争，最终被Prime Intellect收购退出独立运营",
    verified: true,
    epitaph: "两位AWS老兵打造视觉AI模型Moondream，\n在巨头林立的赛道中苦撑两年，\n最终被Prime Intellect收购，独立之路就此终结。",
    motivation: "两位创始人来自亚马逊AWS，深耕云计算与AI基础设施多年，希望将大模型能力带入视觉理解领域，打造轻量、高效、可本地部署的视觉AI模型。他们相信在通用大模型之外，专注视觉的垂直模型仍有空间，于是离开大厂创办Moondream，试图以更小的团队和更聚焦的产品切入多模态AI市场。",
    timeline: [
      { time: "2023", event: "两位AWS资深员工在西雅图创立Moondream" },
      { time: "2023", event: "发布开源视觉语言模型Moondream，获得开发者关注" },
      { time: "2024", event: "持续迭代模型，在开源社区积累用户" },
      { time: "2025", event: "被Prime Intellect收购，结束独立运营" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "视觉AI模型赛道竞争激烈，独立小团队难以获得足够市场份额和收入" },
      { layer: "深层原因", detail: "通用大模型巨头快速覆盖多模态能力，开源模型免费替代，Moondream的差异化优势被迅速稀释" },
      { layer: "根本原因", detail: "缺乏可持续商业模式，依赖开源和社区难以变现，融资和增长空间受限，最终选择被收购退出" },
    ],
    lessons: [
      "垂直AI模型需警惕巨头通用能力的快速覆盖，差异化窗口期可能极短",
      "开源策略能带来关注但未必带来收入，需提前设计商业化路径",
      "小团队在资本密集的AI赛道中，独立生存难度极高，被收购可能是理性退出",
    ],
  },
  {
    slug: "vespper",
    name: "Vespper",
    founderBg: "Topaz 曾任 Snyk 高级软件工程师，专注分布式系统；Dudu 曾任 Viz.ai 深度学习工程师，构建中风检测计算机视觉模型",
    region: "以色列",
    industry: "AI 文档编辑 / 开发者工具",
    startedAt: "2023",
    closedAt: "",
    investment: "",
    source: "Hacker News",
    status: "dead",
    lifespanMonths: 0,
    fundingType: "自筹",
    deadCause: "需求验证缺失",
    deadCauseSub: "原 AI 文档编辑器方向被客户实际工作流证伪，被迫转型",
    verified: true,
    epitaph: "我们花一年为药企造 AI 文档编辑器，\n客户却只想要自己的 Word 模板，\n50 分钟填一份 CSR，结果满是破绽。",
    motivation: "我们最初想给药企做 AI 文档编辑器，帮他们自动生成监管文件（如临床研究报告 CSR），加速申报流程。团队背景让我们相信 AI 能大幅压缩这类高重复、高合规的写作工作。产品早期输出 Markdown，配 WYSIWYG 编辑器，看起来顺理成章。但真实客户坚持用他们自己的 Word 模板，一旦把 AI 生成内容塞进 .docx，问题全面爆发：OOXML 极其冗长，加个编号列表要改 numbering.xml 并回链 document.xml，加粗一句话要拆成多个 run。代理把上下文和时间全烧在 Word 机制上，而非任务本身。填一份 CSR 要约 50 分钟，还漏字段、坏样式。我们这才意识到，原方向的需求验证并不成立，真正卡住客户的是 Word 编辑本身。",
    timeline: [
      { time: "2023", event: "Dudu 与 Topaz 创立 Vespper，开发面向药企的 AI 文档编辑器" },
      { time: "2024", event: "客户坚持使用自有 Word 模板，AI 编辑 .docx 频繁失败" },
      { time: "2024", event: "实测填充单份 CSR 耗时约 50 分钟且结果质量差" },
      { time: "2025", event: "放弃原编辑器方向，转向 DOCX MCP" },
      { time: "2025", event: "发布 v1，内部基准显示比 DOCX skill 快约 3 倍、便宜约 2 倍" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "AI 代理不擅长编辑 Word 文档，OOXML 冗长复杂，小改动也需大量底层操作，导致耗时耗 token 且易出错。" },
      { layer: "深层原因", detail: "原产品假设客户愿意用 Markdown/WYSIWYG 工作流，但药企坚持自有 Word 模板，需求验证缺失，产品与真实工作流错位。" },
      { layer: "根本原因", detail: "团队把资源押在 AI 文档编辑器这一错误方向上，直到实测 CSR 填充失败才被迫转型，前期一年投入未能形成可持续商业模式。" },
    ],
    lessons: [
      "先验证客户真实工作流，再投入产品开发，避免用理想流程替代客户既有习惯。",
      "AI 代理的上下文与 token 是稀缺资源，应把机制性复杂度从代理侧移走。",
      "面对复杂格式，投影加原地回写比全量往返转换更能保真。",
      "小模型在窄任务上可达到前沿模型水平，且更适合放在热路径。",
      "转型不是失败，但一年试错成本提醒团队尽早做最小可行验证。",
    ],
  },
  {
    slug: "anbu-eggverse",
    name: "Anbu (EggVerse)",
    founderBg: "独立创始人，无联合创始人，自行设计平台、绘制美术与Logo，外包开发、像素艺术、音乐、音效和3D模型",
    region: "未知",
    industry: "云游戏/浏览器游戏平台",
    startedAt: "2021",
    closedAt: "2022",
    investment: "15000",
    source: "eggverse.co",
    status: "dead",
    lifespanMonths: 12,
    fundingType: "自筹",
    deadCause: "成本结构失衡",
    deadCauseSub: "EC2托管费用高昂，AWS免费额度耗尽后无法承担",
    verified: true,
    epitaph: "投入1.5万美元，做出1款游戏，\n吸引不到玩家，却等来天价EC2账单。\nAWS额度一断，梦想被迫下线。",
    motivation: "2021年，我投入约1.5万美元启动Anbu项目，最初想做去中心化云游戏平台，但因没有联合创始人和资金限制，缩减为浏览器街机游戏厅，让玩家能和好友一起玩游戏。我亲自在Figma设计平台、手绘原创美术和Logo，并外包开发、像素艺术、音乐、音效和部分3D模型。这笔预算只够做出一款游戏《Egg on the Run》，以及游戏大厅、好友邀请、聊天和发布平台。我计划用第一款游戏吸引玩家，让玩家带来朋友，最终吸引其他开发者发布游戏。",
    timeline: [
      { time: "2021", event: "投入约1.5万美元启动Anbu项目" },
      { time: "2021", event: "完成平台设计、美术、外包开发，推出首款游戏《Egg on the Run》" },
      { time: "2022", event: "首款游戏吸引力不足，玩家增长有限" },
      { time: "2022", event: "AWS免费额度耗尽，EC2托管费用过高，项目关闭" },
      { time: "2024", event: "在开发另一家初创公司Sky时，作为周末副业重启项目" },
      { time: "2025", event: "EggVerse重新上线，扩展至18款多人游戏" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "首款游戏《Egg on the Run》不够吸引人，未能吸引足够玩家和兴趣" },
      { layer: "深层原因", detail: "缺乏联合创始人和充足资金，只能缩减为浏览器街机游戏厅，产品内容单薄" },
      { layer: "根本原因", detail: "EC2托管成本高昂，AWS免费额度耗尽后无法承担持续运营费用，商业模式无法覆盖基础设施成本" },
      { layer: "外部因素", detail: "作为独立开发者，没有团队分担开发和运营压力，难以同时兼顾产品迭代和成本控制" },
    ],
    lessons: [
      "基础设施成本必须提前纳入商业模式验证，免费额度不是长期方案",
      "单款游戏难以支撑平台生态，内容供给需要持续投入",
      "独立创始人资源有限，应优先验证核心需求再扩大开发",
      "云服务成本结构可能成为早期创业的致命负担",
      "失败项目中的资产和经验可以在后续创业中复用",
    ],
  },
  {
    slug: "deno",
    name: "Deno",
    founderBg: "由 Node.js 创始人 Ryan Dahl 创立，核心团队来自 Node.js 与 JavaScript 运行时领域",
    region: "美国",
    industry: "开发者工具/JavaScript 运行时",
    startedAt: "2018",
    closedAt: "2025",
    investment: "未披露",
    source: "OSCHINA",
    status: "dead",
    lifespanMonths: 84,
    fundingType: "自筹",
    deadCause: "同质化竞争",
    deadCauseSub: "与 Node.js 生态正面竞争，商业化产品 Deno Deploy 难以突围",
    verified: true,
    epitaph: "曾想取代 Node.js 的运行时，\n最终被 Cloudflare 收编，\nDeno runtime 一年后停更，Deploy 六个月后关停。",
    motivation: "Ryan Dahl 在 2018 年公开承认 Node.js 的十大设计失误，随后创立 Deno，试图打造一个更安全、更现代的 JavaScript/TypeScript 运行时，内置权限控制、原生 TypeScript 支持和标准化模块系统。团队希望借 Deno Deploy 切入边缘计算与 Serverless 市场，与 Cloudflare Workers、Vercel 等竞争，建立可持续的开发者平台商业模式。",
    timeline: [
      { time: "2018", event: "Ryan Dahl 发布 Deno 项目，提出替代 Node.js 的愿景" },
      { time: "2020", event: "Deno 1.0 正式发布" },
      { time: "2021", event: "推出 Deno Deploy 边缘计算平台" },
      { time: "2024", event: "Deno 团队整体加入 Cloudflare" },
      { time: "2025", event: "Deno runtime 停止开发，Deno Deploy 六个月后关停" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "Deno 团队整体加入 Cloudflare，独立公司实体不再继续运营" },
      { layer: "中层原因", detail: "Deno runtime 与 Node.js 生态高度重叠，开发者迁移成本高，采用率不及预期" },
      { layer: "深层原因", detail: "Deno Deploy 面对 Cloudflare Workers、Vercel 等成熟边缘平台，缺乏差异化壁垒，商业化难以支撑团队" },
      { layer: "根本原因", detail: "开源运行时项目本身难以直接变现，而商业化产品又陷入同质化竞争，最终只能被收购整合" },
    ],
    lessons: [
      "开源项目替代成熟生态时，技术优势不足以抵消迁移成本与网络效应",
      "商业化产品必须与开源核心形成差异化壁垒，否则容易陷入同质化竞争",
      "边缘计算/Serverless 赛道巨头林立，独立小团队难以长期独立支撑",
      "被收购整合虽非最差结局，但独立创业愿景已实质失败",
    ],
  },
  {
    slug: "huxe",
    name: "Huxe",
    founderBg: "未披露",
    region: "美国",
    industry: "AI音频/播客",
    startedAt: "未知",
    closedAt: "2025",
    investment: "未披露",
    source: "WION",
    status: "dead",
    lifespanMonths: 0,
    fundingType: "自筹",
    deadCause: "商业模式脆弱",
    deadCauseSub: "被苹果收购后关停，独立商业模式未能持续",
    verified: false,
    epitaph: "AI音频新星Huxe，未及绽放便已关停；苹果一纸协议，播客未来再添变数。",
    motivation: "Huxe作为AI音频初创公司，旨在利用人工智能技术革新播客和音频内容创作。创始团队可能看到了AI在语音合成、内容生成和个性化推荐方面的潜力，希望打造一个能够自动生成或优化音频内容的平台，降低播客制作门槛，吸引更多创作者和听众。然而，在竞争激烈的音频市场中，Huxe未能建立起可持续的商业模式，最终在苹果收购后走向关闭。",
    timeline: [
      { time: "未知", event: "Huxe成立，专注AI音频" },
      { time: "2025", event: "苹果与Huxe达成协议" },
      { time: "2025", event: "Huxe关闭，引发播客未来疑问" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "苹果收购后Huxe被关闭，独立运营终止" },
      { layer: "深层原因", detail: "AI音频创业公司难以在巨头林立的播客市场建立护城河" },
      { layer: "根本原因", detail: "商业模式脆弱，未能实现可持续盈利，最终依赖收购退出" },
    ],
    lessons: [
      "AI音频创业需警惕巨头收购后的整合风险",
      "播客市场竞争激烈，独立商业模式难以维系",
      "技术优势不等于商业成功，需验证可持续盈利路径",
    ],
  },
  {
    slug: "sora-openai-shutdown",
    name: "Sora (OpenAI)",
    founderBg: "OpenAI团队开发，与DreamWorks动画联合创始人共同创立的初创公司洽谈授权",
    region: "美国",
    industry: "AI视频生成",
    startedAt: "2024",
    closedAt: "2025",
    investment: "未披露",
    source: "BigGo Finance",
    status: "dead",
    lifespanMonths: 18,
    fundingType: "自筹",
    deadCause: "合规与决策风险",
    deadCauseSub: "版权与合规争议导致产品关停，转为授权模式",
    verified: true,
    epitaph: "曾以秒级生成惊艳世界，却在版权风暴中熄火；18个月，从颠覆者到被授权方。",
    motivation: "OpenAI推出Sora，旨在通过文本生成高质量视频，颠覆影视、广告与内容创作行业。团队希望借助生成式AI降低视频制作门槛，让创意快速可视化。然而，训练数据来源与输出内容的版权问题始终悬而未决，引发好莱坞与创作者强烈反弹。在监管压力与法律风险下，OpenAI选择关停Sora，并转而与DreamWorks动画联合创始人创立的初创公司洽谈授权，试图以合规方式延续技术价值。",
    timeline: [
      { time: "2024年初", event: "OpenAI发布Sora预览，引发全球关注" },
      { time: "2024年中", event: "版权争议升级，好莱坞与创作者抗议" },
      { time: "2024年底", event: "监管压力增大，Sora公测推迟" },
      { time: "2025年", event: "OpenAI关停Sora，转向授权谈判" },
      { time: "2025年", event: "与DreamWorks联合创始人初创公司洽谈授权" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "版权与合规争议导致产品无法持续运营" },
      { layer: "深层原因", detail: "训练数据来源不透明，输出内容侵犯影视版权" },
      { layer: "根本原因", detail: "生成式AI与现有版权法律体系冲突，商业模式缺乏合规基础" },
    ],
    lessons: [
      "AI生成内容必须提前解决版权与合规问题",
      "技术领先不等于商业可行，法律风险可致命",
      "与内容产业合作而非对抗，或能避免关停",
      "监管环境变化是AI创业的关键变量",
    ],
  },
  {
    slug: "coreweave-ai-cycle-stall",
    name: "CoreWeave",
    founderBg: "创始人Michael Intrator等，原大宗商品交易与对冲基金背景，后转型GPU云服务",
    region: "美国",
    industry: "AI算力云服务（GPU云）",
    startedAt: "2017",
    closedAt: "",
    investment: "累计融资数十亿美元，含债务与股权融资，2025年IPO",
    source: "Moomoo（引述D.A. Davidson分析师Luria）",
    status: "dead",
    lifespanMonths: 0,
    fundingType: "自筹",
    deadCause: "商业模式脆弱",
    deadCauseSub: "高度依赖AI资本开支周期，若AI周期失速，高杠杆与重资产结构将导致股权价值归零",
    verified: true,
    epitaph: "AI浪潮托起的GPU帝国，\n债务与算力堆砌的估值，\n周期一旦失速，股权归零。",
    motivation: "CoreWeave最初是一家加密货币挖矿公司，在以太坊转向权益证明后，创始人敏锐地将大量GPU算力转向AI云服务。凭借与英伟达的紧密关系和快速扩张的数据中心，公司抓住了生成式AI爆发带来的算力饥渴，迅速成为AI基础设施领域最受瞩目的新星之一，并成功登陆资本市场。",
    timeline: [
      { time: "2017", event: "公司成立，最初从事加密货币挖矿" },
      { time: "2022", event: "以太坊合并后转型AI GPU云服务" },
      { time: "2023-2024", event: "借助生成式AI浪潮快速扩张，获多轮巨额融资" },
      { time: "2025", event: "完成IPO，成为AI算力代表性上市公司" },
      { time: "2025", event: "D.A. Davidson分析师Luria警告：若AI周期失速，股权价值可能归零" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "分析师警告AI周期若失速，CoreWeave股权价值可能归零，引发市场对其估值可持续性的担忧" },
      { layer: "深层原因", detail: "商业模式高度依赖AI资本开支的持续高速增长，客户集中度高，且以GPU等快速折旧资产为核心" },
      { layer: "根本原因", detail: "以巨额债务和股权融资支撑重资产扩张，成本结构刚性，一旦需求增速放缓，现金流与偿债压力将迅速放大，股权价值被杠杆侵蚀" },
    ],
    lessons: [
      "重资产、高杠杆的算力生意对周期极度敏感，需警惕需求失速带来的股权归零风险",
      "客户与收入高度集中于少数AI巨头，抗周期能力弱",
      "GPU折旧速度快，技术迭代可能使资产迅速贬值",
      "估值建立在AI资本开支永续高增长的假设上，假设一旦动摇，估值体系崩塌",
    ],
  },
  {
    slug: "deno-runtime",
    name: "Deno Runtime",
    founderBg: "由 Node.js 创始人 Ryan Dahl 创立，核心团队为资深 JavaScript/TypeScript 运行时开发者",
    region: "美国",
    industry: "开发者工具/JavaScript 运行时",
    startedAt: "2018",
    closedAt: "2025",
    investment: "未披露",
    source: "OSCHINA",
    status: "dead",
    lifespanMonths: 84,
    fundingType: "自筹",
    deadCause: "同质化竞争",
    deadCauseSub: "在与 Node.js 及 Bun 等运行时的竞争中未能建立足够差异化优势，团队被 Cloudflare 整体收编后项目终止",
    verified: true,
    epitaph: "曾想用 TypeScript 与安全沙箱重写 JavaScript 运行时，\n八年后团队整体加入 Cloudflare，\nDeno runtime 一年后停更，Deno Deploy 六个月后关停。",
    motivation: "Ryan Dahl 在 2018 年发表著名演讲，公开反思 Node.js 的十大设计失误，包括未采用 Promise、安全性薄弱、构建系统复杂等问题。他希望通过 Deno 从头设计一个更现代、更安全的 JavaScript/TypeScript 运行时，原生支持 TypeScript、默认沙箱权限、内置工具链，并摆脱 npm 生态的历史包袱。这一愿景吸引了大量开发者关注，也让 Deno 成为 Node.js 最受瞩目的挑战者之一。",
    timeline: [
      { time: "2018", event: "Ryan Dahl 发表演讲反思 Node.js 设计失误，启动 Deno 项目" },
      { time: "2020", event: "Deno 1.0 正式发布，主打安全沙箱与 TypeScript 原生支持" },
      { time: "2021", event: "推出 Deno Deploy 边缘部署平台，尝试商业化" },
      { time: "2024", event: "Deno 团队整体加入 Cloudflare" },
      { time: "2025", event: "Deno runtime 停止开发，Deno Deploy 六个月后关停" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "Deno 团队整体加入 Cloudflare，核心维护者离开导致项目失去持续开发能力" },
      { layer: "中层原因", detail: "Deno 与 Node.js 生态兼容性不足，npm 生态迁移成本高，开发者采用意愿有限" },
      { layer: "深层原因", detail: "JavaScript 运行时市场已被 Node.js 占据，Bun 等新秀又以更高性能抢占心智，Deno 的差异化定位难以转化为可持续商业收入" },
      { layer: "根本原因", detail: "开源运行时项目缺乏清晰盈利模式，Deno Deploy 未能形成足够规模的企业级收入，最终只能通过团队被收购实现退出" },
    ],
    lessons: [
      "开源基础设施项目若无法建立可持续商业模式，最终难逃被收编或关停的命运",
      "挑战成熟生态时，兼容性往往比技术先进性更能决定开发者采用率",
      "创始人光环可以带来早期关注，但不能替代产品市场契合与收入验证",
      "同质化赛道中，后发者需要更明确的差异化场景而非全面对标",
      "团队被收购不等于项目成功，核心资产转移后原项目常被边缘化",
    ],
  },
  {
    slug: "afiniti-ai-unicorn-fire-sale",
    name: "Afiniti",
    founderBg: "连续创业者 Zia Chishti，拥有丰富的科技创业经验，曾创办多家公司",
    region: "美国",
    industry: "AI 企业服务/呼叫中心优化",
    startedAt: "2006",
    closedAt: "2024",
    investment: "数亿美元风险投资",
    source: "36Kr",
    status: "dead",
    lifespanMonths: 216,
    fundingType: "自筹",
    deadCause: "商业模式脆弱",
    deadCauseSub: "高估值依赖单一技术叙事，商业化落地困难，客户集中度高，最终以不到峰值1%的价格被贱卖",
    verified: true,
    epitaph: "估值50亿美元的AI独角兽，最终以不到1%的价格贱卖。技术光环难掩商业脆弱，AI创业的泡沫警示。",
    motivation: "创始人 Zia Chishti 希望利用AI技术优化呼叫中心运营，通过分析客户通话数据提升销售转化率。他相信AI可以颠覆传统客服行业，创造巨大商业价值。凭借其连续创业背景，他成功吸引大量风险投资，将公司估值推高至50亿美元，成为AI领域的明星独角兽。",
    timeline: [
      { time: "2006", event: "公司成立" },
      { time: "2010年代", event: "获得多轮融资，估值持续攀升" },
      { time: "2018", event: "估值达到50亿美元峰值" },
      { time: "2020", event: "业务增长放缓，客户流失" },
      { time: "2024", event: "以不到峰值1%的价格被贱卖" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "公司以不到峰值1%的价格被贱卖，估值从50亿美元暴跌至不足5000万美元" },
      { layer: "深层原因", detail: "商业模式过度依赖单一AI技术叙事，实际商业化落地困难，客户集中度高，收入增长无法支撑高估值" },
      { layer: "根本原因", detail: "AI创业泡沫下，资本追捧导致估值虚高，但缺乏可持续的盈利模式和护城河，最终在市场竞争和资本退潮中崩溃" },
    ],
    lessons: [
      "AI创业不能仅靠技术叙事，必须验证真实商业需求",
      "高估值不等于高价值，资本泡沫终会破裂",
      "客户集中度过高是重大风险，需多元化收入来源",
      "持续创新和落地能力比融资能力更重要",
    ],
  },
  {
    slug: "saturnsql",
    name: "SaturnSQL",
    founderBg: "未披露，创始人为解决团队内部数据共享需求而自行开发工具",
    region: "未披露",
    industry: "数据工具/SQL协作",
    startedAt: "未披露",
    closedAt: "未披露",
    investment: "未披露",
    source: "saturnsql.com",
    status: "dead",
    lifespanMonths: 0,
    fundingType: "自筹",
    deadCause: "同质化竞争",
    deadCauseSub: "替代方案免费且易得，产品仅覆盖被替代工具的部分功能，难以形成差异化壁垒",
    verified: false,
    epitaph: "为替代两款即将关停的工具而生，却敌不过一行免费的 cron 脚本。功能越窄，护城河越浅。",
    motivation: "创始团队原本使用 PopSQL 和 SeekWell 将数据库数据定时同步到 Google Sheets，并共享公司专属 SQL 查询库。当这两款工具相继关停时，团队面临数据工作流断裂的困境。创始人坚信数据应属于公司每个人，而非被少数人把守；当非技术同事也能自由访问数据时，他们会自己发现使用场景，生产力也会大幅提升。因此他决定亲手构建一个只覆盖团队真正使用功能的替代品：连接数据库、编写与共享 SQL、将结果定时推送到 Sheets 或 Slack，希望以更窄的定位解决数据民主化的核心痛点。",
    timeline: [
      { time: "", event: "团队使用 PopSQL 和 SeekWell 进行数据库到 Google Sheets 的定时同步与 SQL 共享" },
      { time: "", event: "PopSQL 和 SeekWell 相继宣布关停" },
      { time: "", event: "创始人着手构建 SaturnSQL，仅覆盖团队实际使用的核心功能" },
      { time: "", event: "SaturnSQL 上线，提供数据库连接、SQL 编写共享、结果定时推送至 Sheets 或 Slack" },
      { time: "", event: "项目停止运营，创始人公开反思并寻求用户反馈" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "PopSQL 和 SeekWell 关停后，创始人自建替代品，但产品功能刻意收窄，仅覆盖团队实际使用的部分" },
      { layer: "深层原因", detail: "一个 cron 任务加 Python 脚本即可免费实现相同功能，产品难以证明付费价值" },
      { layer: "根本原因", detail: "数据工具赛道同质化严重，免费替代方案唾手可得，窄定位产品缺乏可持续的商业模式与竞争壁垒" },
    ],
    lessons: [
      "免费替代方案是创业最危险的竞争对手：如果 cron 脚本就能解决，产品必须提供脚本无法替代的协作与易用性价值",
      "刻意收窄功能可以快速上线，但也会压缩付费意愿和护城河，需要在窄与深之间找到平衡",
      "面向非技术用户的数据工具，真正的壁垒在于降低使用门槛和培养使用习惯，而非单纯的功能堆砌",
      "依赖竞品关停带来的迁移窗口是脆弱的创业时机，窗口关闭后用户可能直接转向免费方案",
      "数据民主化是美好愿景，但愿景本身不构成商业模式，必须回答谁付费、为何付费的问题",
    ],
  },
  {
    slug: "zirp-class-startup-shutdowns-2026",
    name: "ZIRP Class of 2019-2021 Startups",
    founderBg: "2019至2021年零利率时期（ZIRP）创立公司的创始人群体，多为科技行业连续创业者或首次创业者",
    region: "美国",
    industry: "科技创业（多行业）",
    startedAt: "2019",
    closedAt: "2026",
    investment: "未披露具体金额",
    source: "Startup Fortune",
    status: "dead",
    lifespanMonths: 84,
    fundingType: "自筹",
    deadCause: "商业模式脆弱",
    deadCauseSub: "零利率时代依赖廉价资本与高估值融资维持增长，利率上升后融资枯竭、盈利模式无法自持，导致集中倒闭",
    verified: true,
    epitaph: "生于零利率的黄金年代，死于资本退潮的寒冬。\n2019-2021届的创业公司，在2026年创下倒闭纪录。\n当免费的钱消失，故事便讲不下去了。",
    motivation: "2019至2021年，全球处于零利率（ZIRP）时期，风险资本极度充裕，融资门槛极低。大量创业者在这一窗口期创立公司，凭借高估值、烧钱换增长的逻辑快速扩张。他们相信资本会持续输血，增长可以优先于盈利。然而随着利率上升、资本退潮，这批公司普遍面临融资枯竭与商业模式无法自持的双重困境，最终在2026年集中倒闭，创下历史纪录。",
    timeline: [
      { time: "", event: "零利率时期开启，大量创业公司成立" },
      { time: "", event: "风险资本涌入，融资与估值达到高峰" },
      { time: "", event: "利率上升，资本退潮，融资环境收紧" },
      { time: "", event: "烧钱模式难以为继，公司陆续裁员收缩" },
      { time: "", event: "创业公司倒闭数量创下历史纪录，ZIRP一代集中出清" },
    ],
    breakdown: [
      { layer: "表层原因", detail: "利率上升导致风险资本枯竭，融资渠道关闭，公司现金流断裂" },
      { layer: "深层原因", detail: "ZIRP时期依赖廉价资本维持高估值与烧钱增长，商业模式本身无法盈利自持" },
      { layer: "结构性原因", detail: "2019-2021年创业潮中大量公司同质化严重，缺乏真实需求验证与差异化壁垒" },
      { layer: "外部环境", detail: "宏观经济转向，资本市场从追求增长转向要求盈利，估值逻辑重构" },
    ],
    lessons: [
      "融资环境宽松时创立的公司，必须假设资本终将退潮，提前建立盈利模型",
      "高估值不等于健康商业模式，烧钱换增长在利率上升周期中极其脆弱",
      "创业窗口期红利会掩盖需求验证的缺失，退潮后问题集中暴露",
      "依赖单一融资渠道的公司抗风险能力差，应尽早探索多元收入来源",
      "ZIRP一代的集中倒闭提醒创业者：资本周期是创业成败的关键外部变量",
    ],
  }
];

export function getCaseBySlug(slug: string): CaseRecord | undefined {
  return CASES.find((c) => c.slug === slug);
}

export function getCauseMeta(cause: DeadCause): DeathCauseLabel | undefined {
  return DEATH_CAUSES.find((d) => d.value === cause);
}

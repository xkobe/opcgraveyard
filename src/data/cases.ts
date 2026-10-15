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
  }
];

export function getCaseBySlug(slug: string): CaseRecord | undefined {
  return CASES.find((c) => c.slug === slug);
}

export function getCauseMeta(cause: DeadCause): DeathCauseLabel | undefined {
  return DEATH_CAUSES.find((d) => d.value === cause);
}

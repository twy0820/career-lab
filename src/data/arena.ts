// EXPORTS: IArena, SIM_ARENA, ARENA_BY_ID, ARENA_STYLE_META
import type { IArena } from './types';

export const SIM_ARENA: IArena[] = [
  {
    id: 'a1',
    title: '算法挑战赛 · 线段树与动态规划',
    host: '虚拟赛区 · ACM 风格',
    style: '算法',
    difficulty: 4,
    duration: '模拟时长：120 分钟',
    problem: {
      background:
        '这是一道经典「区间操作」题：给定长度为 n 的整数序列，你需要支持两种操作——对区间 [l, r] 每个数加上 v，以及查询区间 [l, r] 的和。在此基础上，进阶题要求你解决一个带依赖的动态规划版本。',
      task: '完成题目并提交你的解题思路：写出核心算法（线段树懒标记 / DP 状态设计）、复杂度分析，以及关键代码片段或代码仓库链接。',
      format: '输入：第一行 n m（n 个元素，m 次操作）；随后 n 个整数；随后 m 行，每行为 "1 l r v"（区间加）或 "2 l r"（区间求和）。输出：每次查询输出一行答案。',
      sample: '输入：5 3 / 1 2 3 4 5 / 1 1 3 2 / 2 2 4 → 输出：13',
      constraints: 'n, m ≤ 1e5，答案可能超过 32 位整数。',
      scoring: [
        { item: '算法正确性与样例通过', detail: '核心思路正确，能通过标准样例与边界', weight: 40 },
        { item: '时间复杂度达标', detail: 'O(log n) 级别，避免 O(n) 暴力', weight: 20 },
        { item: '代码规范与注释', detail: '命名清晰、有注释、可读性好', weight: 15 },
        { item: '进阶 DP 解法', detail: '正确给出进阶题的 DP 状态与转移', weight: 25 },
      ],
    },
    skills: ['cpp', 'algo', 'python'],
  },
  {
    id: 'a2',
    title: '数据挖掘赛 · 用户流失预测',
    host: '虚拟赛区 · 数据科学风格',
    style: '数据',
    difficulty: 3,
    duration: '模拟时长：1 周',
    problem: {
      background:
        '某电信运营商提供 20 万条用户数据（字段包括：在网时长、套餐类型、月消费、投诉次数、流量使用等），希望预测用户未来 30 天是否流失，用于精准挽留。',
      task: '完成一版完整的建模流程：数据探索 → 特征工程 → 模型训练与评估 → 提交报告。评估指标为 AUC。请按真实竞赛的交付物要求提交：思路、关键代码/仓库、结果与报告。',
      format: '提交物：方案说明 + 代码仓库链接 + 报告（含 AUC 结果）。',
      sample: '报告模板建议：数据概览 → 特征说明 → 模型对比（LR/GBDT 等）→ 评估与结论 → 可改进项。',
      constraints: '训练/验证需合理划分，避免数据泄露；报告需可复现。',
      scoring: [
        { item: '数据探索与特征工程', detail: 'EDA 充分，特征构造有依据', weight: 25 },
        { item: '模型与调参', detail: '至少对比 2 种模型并说明调参', weight: 30 },
        { item: 'AUC 结果', detail: '验证集 AUC ≥ 0.80 为良好', weight: 25 },
        { item: '报告与可复现性', detail: '报告完整，脚本可复现', weight: 20 },
      ],
    },
    skills: ['python', 'ds', 'ml', 'dl', 'sql'],
  },
  {
    id: 'a3',
    title: 'LLM 黑客松 · 智能客服 RAG',
    host: '虚拟赛区 · AI 应用风格',
    style: 'AI 应用',
    difficulty: 3,
    duration: '模拟时长：48 小时',
    problem: {
      background:
        '某电商平台有大量客服 FAQ 与售后规则文档，希望搭建一个智能客服助手：用户提问时，助手基于知识库回答并标注引用来源；知识库未覆盖的问题要明确拒答而非编造。',
      task: '48 小时内完成一个可演示的 RAG 智能客服：方案设计、数据准备、链路实现、评测与优化、演示文档。评委关注方案合理性、工程完成度与演示效果。',
      format: '交付物：方案 PPT/文档 + 可运行 Demo（或演示视频）+ 评测数据。',
      sample: 'Demo 演示脚本建议：3 个覆盖类问题 + 2 个拒答类问题 + 1 个追问场景。',
      constraints: '回答必须带引用来源；禁止在未检索到资料时编造答案。',
      scoring: [
        { item: '方案设计', detail: '技术选型与链路设计合理', weight: 25 },
        { item: 'RAG 实现', detail: '检索质量、引用溯源、拒答策略', weight: 30 },
        { item: '评测与迭代', detail: '有评测集、有优化对比', weight: 25 },
        { item: '演示与文档', detail: '演示流畅、文档清晰', weight: 20 },
      ],
    },
    skills: ['python', 'llm', 'vector', 'fastapi', 'deploy'],
  },
  {
    id: 'a4',
    title: '系统设计挑战 · 高并发秒杀',
    host: '虚拟赛区 · 后端风格',
    style: '系统设计',
    difficulty: 5,
    duration: '模拟时长：3 小时',
    problem: {
      background:
        '某平台要上线一款限量商品的秒杀活动，预计峰值 10 万 QPS。要求：不超卖、防刷单、系统可用性高、可水平扩展。',
      task: '输出一份完整的系统设计方案：整体架构、库存与订单一致性方案、限流与防刷策略、缓存与队列的使用、压测与监控方案。以文档形式提交。',
      format: '交付物：系统设计文档（含架构图描述）+ 关键接口设计。',
      sample: '评审关注点：库存扣减的原子性、幂等、缓存与数据库的一致性、热点隔离、降级预案。',
      constraints: '方案需自洽，能说明每个组件承担的角色与故障时的行为。',
      scoring: [
        { item: '架构设计', detail: '分层清晰，组件职责明确', weight: 30 },
        { item: '数据与一致性', detail: '库存/订单一致性方案严谨', weight: 25 },
        { item: '高并发细节', detail: '限流、防刷、热点、降级覆盖', weight: 25 },
        { item: '文档表达', detail: '结构完整、可读性强', weight: 20 },
      ],
    },
    skills: ['java', 'go', 'dist', 'redis', 'docker'],
  },
  {
    id: 'a5',
    title: 'Agent 挑战赛 · 多工具协作自动化',
    host: '虚拟赛区 · AI 应用风格',
    style: 'AI 应用',
    difficulty: 4,
    duration: '模拟时长：36 小时',
    problem: {
      background:
        '给定一组工具（查天气、查订单、搜知识库、发邮件），要求让大模型自主规划、选择并调用工具，完成一个跨工具任务：用户说“帮我看下明天长沙天气，要是下雨就提醒我带伞并发邮件给同事改会议室”。',
      task: '实现一个最小可用的 Agent：工具描述、Function Calling 解析、多步执行与错误重试。提交可运行 Demo 或演示视频，附决策轨迹（每步为什么选这个工具）。',
      format: '交付物：Demo/视频 + 决策轨迹日志 + 工具清单。',
      sample: '期望轨迹：天气工具→判断下雨→邮件工具；任何一步工具失败要有重试或降级。',
      constraints: '不得把答案写死；必须由模型根据用户输入自主选择工具。',
      scoring: [
        { item: '工具调用正确性', detail: '能正确解析参数并调用对应工具', weight: 30 },
        { item: '多步规划', detail: '能串联多个工具完成复合任务', weight: 25 },
        { item: '容错与重试', detail: '工具失败/参数缺失时有合理处理', weight: 25 },
        { item: '轨迹可解释', detail: '决策过程清晰可读', weight: 20 },
      ],
    },
    skills: ['llm', 'fastapi', 'python', 'deploy'],
  },
  {
    id: 'a6',
    title: '系统设计 · 短链服务与 Feed 流',
    host: '虚拟赛区 · 后端风格',
    style: '系统设计',
    difficulty: 4,
    duration: '模拟时长：2.5 小时',
    problem: {
      background:
        '设计两个高频基础服务：① 短链接系统，长链转短链、支持自定义短码、防重复；② 内容 Feed 流，支持关注流与时间线拉取，读多写少。',
      task: '输出设计文档：存储选型、短码生成与冲突处理、Feed 流推/拉模式权衡、缓存与热点处理、容量估算。',
      format: '交付物：系统设计文档（含容量估算）。',
      sample: '评审点：短码唯一性、62 进制长度选择、Feed 推模式写扩散/拉模式读扩散的取舍。',
      constraints: '需给出 QPS/存储量级估算依据。',
      scoring: [
        { item: '存储与数据模型', detail: '表结构、短码方案合理', weight: 30 },
        { item: 'Feed 模式权衡', detail: '推/拉/混合讲得清', weight: 30 },
        { item: '容量估算', detail: '量级估算有据', weight: 20 },
        { item: '文档表达', detail: '结构清晰', weight: 20 },
      ],
    },
    skills: ['java', 'redis', 'mysql', 'dist'],
  },
  {
    id: 'a7',
    title: '实时数仓赛 · 日志指标实时看板',
    host: '虚拟赛区 · 数据风格',
    style: '数据',
    difficulty: 4,
    duration: '模拟时长：3 天',
    problem: {
      background:
        '某业务每秒产生上万条访问日志，要求搭建实时管道：日志采集 → 清洗 → 按分钟聚合 PV/UV/错误率 → 写入存储 → 看板展示。',
      task: '完成端到端方案：技术选型（Kafka/Flink 类）、清洗逻辑、聚合口径、存储与看板。提交架构图 + 口径说明 + Demo 截图。',
      format: '交付物：架构图 + 指标口径文档 + 演示。',
      sample: '评审点：口径一致（UV 去重）、乱流/迟到数据处理、Exactly-once 取舍。',
      constraints: '需说明 PV/UV 的实时去重方案。',
      scoring: [
        { item: '链路完整性', detail: '采集到展示闭环', weight: 30 },
        { item: '口径正确', detail: 'PV/UV/错误率定义清楚', weight: 30 },
        { item: '实时性处理', detail: '乱序、迟到、窗口设计', weight: 20 },
        { item: '展示与文档', detail: '看板清晰、文档可复现', weight: 20 },
      ],
    },
    skills: ['sql', 'ds', 'redis', 'deploy'],
  },
  {
    id: 'a8',
    title: '算法挑战赛 · 图论与最短路',
    host: '虚拟赛区 · ACM 风格',
    style: '算法',
    difficulty: 3,
    duration: '模拟时长：100 分钟',
    problem: {
      background:
        '城市之间有若干条道路（带权），求从起点到终点的最短时间；进阶：道路限时开放，需在时间约束下求可达最短路。',
      task: '写出核心算法（Dijkstra / 状态扩展 DP）、复杂度分析与关键代码，提交仓库链接。',
      format: '输入 n m s t；随后 m 条边 u v w；输出最短路长度。',
      sample: '样例：4 4 1 4 / 1-2 2 / 2-4 3 / 1-3 5 / 3-4 1 → 6',
      constraints: 'n ≤ 1e5，边权非负。',
      scoring: [
        { item: '算法正确性', detail: 'Dijkstra 正确，样例通过', weight: 40 },
        { item: '复杂度', detail: 'O((n+m)log n)', weight: 25 },
        { item: '进阶时间约束', detail: '正确处理限时开放边', weight: 20 },
        { item: '代码规范', detail: '可读、边界处理', weight: 15 },
      ],
    },
    skills: ['cpp', 'algo', 'python'],
  },
  {
    id: 'a9',
    title: 'A/B 实验分析 · 转化率提升',
    host: '虚拟赛区 · 数据科学风格',
    style: '数据',
    difficulty: 2,
    duration: '模拟时长：2 天',
    problem: {
      background: '某 App 首页做了新版改版，给出实验组/对照组的曝光与转化数据，要求判断改版是否显著提升转化、样本量是否够、能否全量。',
      task: '完成分析：口径对齐、显著性检验、结论与是否全量的建议。提交分析报告。',
      format: '交付物：分析报告（含检验方法与结论）。',
      sample: '评审点：转化率口径、置信区间/p 值、辛普森悖论排查。',
      constraints: '不得只看均值大小就下结论。',
      scoring: [
        { item: '口径与抽样', detail: '转化定义、样本对齐', weight: 30 },
        { item: '显著性检验', detail: '方法正确、结果解释', weight: 35 },
        { item: '结论建议', detail: '是否全量有据', weight: 35 },
      ],
    },
    skills: ['sql', 'ds', 'python'],
  },
  {
    id: 'a10',
    title: '算法挑战赛 · 单调栈与滑动窗口',
    host: '虚拟赛区 · ACM 风格',
    style: '算法',
    difficulty: 2,
    duration: '模拟时长：90 分钟',
    problem: {
      background: '给定数组，求每个元素右侧第一个更大的元素（单调栈）；进阶：求长度为 k 的子数组最大和（滑动窗口）。',
      task: '写出核心算法、复杂度与关键代码。',
      format: '提交思路 + 代码链接。',
      sample: '样例：[2,1,2,4,3] 右侧更大 -> [4,2,4,-1]',
      constraints: 'n ≤ 2e5，要求 O(n)。',
      scoring: [
        { item: '正确性', detail: '样例与边界通过', weight: 45 },
        { item: '复杂度', detail: 'O(n)', weight: 30 },
        { item: '进阶滑动窗口', detail: '正确实现', weight: 25 },
      ],
    },
    skills: ['cpp', 'algo', 'python'],
  },
  {
    id: 'a11',
    title: '系统设计 · 分布式定时任务调度',
    host: '虚拟赛区 · 后端风格',
    style: '系统设计',
    difficulty: 4,
    duration: '模拟时长：2.5 小时',
    problem: {
      background: '需要一个分布式定时调度平台：任务按 cron 触发、集群中只执行一次、失败重试、可观测。',
      task: '输出设计文档：调度选主、任务分片、幂等与重试、监控告警。',
      format: '交付物：系统设计文档。',
      sample: '评审点：避免重复执行、选主一致性、失败重试策略。',
      constraints: '方案需说明宕机恢复。',
      scoring: [
        { item: '选主与一致性', detail: '集群只跑一次', weight: 30 },
        { item: '重试与幂等', detail: '失败不丢不重', weight: 30 },
        { item: '可观测', detail: '监控与告警', weight: 20 },
        { item: '文档表达', detail: '清晰', weight: 20 },
      ],
    },
    skills: ['java', 'dist', 'redis', 'go'],
  },
  {
    id: 'a12',
    title: 'AI 黑客松 · 多模态内容理解',
    host: '虚拟赛区 · AI 应用风格',
    style: 'AI 应用',
    difficulty: 4,
    duration: '模拟时长：48 小时',
    problem: {
      background: '给定图文混合内容，要求做一个自动打标签 + 摘要的小助手，能区分图和文并输出结构化标签。',
      task: '实现一个可演示 Demo：输入图文 → 输出标签与摘要，说明如何处理图片理解与错误兜底。',
      format: '交付物：Demo/视频 + 方案 + 评测样例。',
      sample: '评审点：图文路由、结构化输出、兜底策略。',
      constraints: '输出需为可解析结构。',
      scoring: [
        { item: '多模态处理', detail: '图文都能覆盖', weight: 35 },
        { item: '结构化输出', detail: '标签/摘要稳定', weight: 30 },
        { item: '兜底与评测', detail: '异常处理与样例', weight: 35 },
      ],
    },
    skills: ['llm', 'python', 'fastapi'],
  }
,
  {
    id: 'a13',
    title: '算法挑战赛 · 链表与二叉树',
    host: '虚拟赛区 · ACM 风格',
    style: '算法',
    difficulty: 1,
    duration: '模拟时长：60 分钟',
    problem: {
      background: '反转单链表；进阶：判断一棵树是否对称。',
      task: '写核心思路、复杂度与代码。',
      format: '提交思路 + 代码链接。',
      sample: '样例：1->2->3 反转成 3->2->1',
      constraints: '要求 O(n) 时间 O(1)/O(h) 空间。',
      scoring: [
        { item: '正确性', detail: '样例通过', weight: 50 },
        { item: '进阶对称树', detail: '正确判断', weight: 30 },
        { item: '复杂度', detail: '分析清楚', weight: 20 },
      ],
    },
    skills: ['cpp', 'algo', 'python'],
  },
  {
    id: 'a14',
    title: '数据挖掘赛 · 特征工程专项',
    host: '虚拟赛区 · 数据科学风格',
    style: '数据',
    difficulty: 3,
    duration: '模拟时长：3 天',
    problem: {
      background: '给定一份表格数据（含类别/数值/时间/缺失），重点考察特征构造与编码，预测二分类标签。',
      task: '提交特征方案：类别编码、缺失处理、时间特征、交叉特征，并对比有无特征的 AUC。',
      format: '交付物：特征说明 + 代码 + AUC 对比。',
      sample: '评审点：为什么这样编码、交叉特征是否合理、AUC 提升多少。',
      constraints: '说明每个特征的理由。',
      scoring: [
        { item: '特征多样性', detail: '覆盖各类特征', weight: 35 },
        { item: '编码合理', detail: '类别/数值处理正确', weight: 25 },
        { item: '对比验证', detail: '有消融对比', weight: 20 },
        { item: '可复现', detail: '代码可跑', weight: 20 },
      ],
    },
    skills: ['python', 'ml', 'ds', 'sql'],
  },
  {
    id: 'a15',
    title: '系统设计 · 万人 IM 聊天',
    host: '虚拟赛区 · 后端风格',
    style: '系统设计',
    difficulty: 5,
    duration: '模拟时长：3 小时',
    problem: {
      background: '设计一个支持万级同时在线的即时聊天：单聊、群聊、消息不丢不重、离线消息拉取。',
      task: '输出设计：长连接网关、消息存储、推送与离线同步、群消息扩散。',
      format: '交付物：系统设计文档。',
      sample: '评审点：在线状态、消息顺序、群写扩散/读扩散、离线拉取。',
      constraints: '说明扩缩容与故障恢复。',
      scoring: [
        { item: '长连接与网关', detail: '连接管理合理', weight: 25 },
        { item: '消息可靠', detail: '不丢不重有序', weight: 30 },
        { item: '群与离线', detail: '扩散策略清晰', weight: 25 },
        { item: '文档', detail: '完整可读', weight: 20 },
      ],
    },
    skills: ['go', 'dist', 'redis', 'mysql'],
  },
  {
    id: 'a16',
    title: 'AI 黑客松 · 自然语言查数据库',
    host: '虚拟赛区 · AI 应用风格',
    style: 'AI 应用',
    difficulty: 3,
    duration: '模拟时长：36 小时',
    problem: {
      background: '给定一个样例业务库，让用户用中文提问，系统自动生成 SQL 并返回结果表格。',
      task: '实现 NL2SQL Demo：表结构描述、生成 SQL、执行、错误重试与防注入。',
      format: '交付物：Demo/视频 + 方案 + 失败样例处理。',
      sample: '评审点：Schema 怎么喂、SQL 校验、防注入、生成失败重试。',
      constraints: '禁止执行危险写操作。',
      scoring: [
        { item: 'SQL 生成', detail: '准确率', weight: 35 },
        { item: '安全校验', detail: '防注入/只读', weight: 25 },
        { item: '错误恢复', detail: '生成失败能修', weight: 20 },
        { item: '演示', detail: '流畅', weight: 20 },
      ],
    },
    skills: ['llm', 'sql', 'fastapi', 'python'],
  },

  {
    id: 'a17', title: 'LRU 缓存设计', host: '极客算法营', style: '算法', difficulty: 2, duration: '3 天',
    problem: {
      background: '实现一个固定容量的 LRU 缓存，get/put 都要 O(1)。', task: '完成 LRUCache，支持 get(key)/put(key,value)。',
      constraints: '容量 1~1000，操作 1e5。',
      scoring: [
        { item: '正确性', detail: '过期淘汰正确', weight: 50 },
        { item: '复杂度', detail: 'O(1) 实现', weight: 30 },
        { item: '代码质量', detail: '可读、边界处理', weight: 20 } ],
    },
    skills: ['java', 'sql', 'review'],
  },
  {
    id: 'a18', title: 'TOP K 高频词', host: '极客算法营', style: '算法', difficulty: 2, duration: '3 天',
    problem: {
      background: '从一大段文本中找出现频率最高的 K 个词。', task: '输入词表，输出 TopK。',
      constraints: '内存有限，流式也行。',
      scoring: [
        { item: '正确性', detail: '排序正确', weight: 50 },
        { item: '堆/计数', detail: '小顶堆优化', weight: 30 },
        { item: '边界', detail: '空/平局', weight: 20 } ],
    },
    skills: ['python', 'review'],
  },
  {
    id: 'a19', title: '蓄水池抽样', host: '极客算法营', style: '算法', difficulty: 3, duration: '4 天',
    problem: {
      background: '长度未知的流，等概率抽 K 个。', task: '实现 reservoir sampling。',
      constraints: '一次遍历。',
      scoring: [
        { item: '正确性', detail: '概率均匀', weight: 60 },
        { item: '证明', detail: '写简单证明', weight: 40 } ],
    },
    skills: ['python', 'ml'],
  },
  {
    id: 'a20', title: '并查集 · 朋友圈', host: '极客算法营', style: '算法', difficulty: 2, duration: '2 天',
    problem: { background: 'M*M 关系矩阵，求朋友圈数量。', task: '用并查集求连通分量。', scoring: [
      { item: '正确性', detail: '并查集合对', weight: 60 }, { item: '优化', detail: '路径压缩', weight: 40 } ],
    }, skills: ['java', 'review'] },
  {
    id: 'a21', title: '数据清洗 · 脏数据治理', host: '数智竞赛', style: '数据', difficulty: 2, duration: '1 周',
    problem: {
      background: '给一份用户表，有缺失、重复、格式不一致。', task: '清洗后输出干净数据集并写报告。',
      format: '提交清洗脚本+清洗后样例+报告。',
      scoring: [
        { item: '清洗完整', detail: '缺失/重复/异常', weight: 40 },
        { item: '口径说明', detail: '怎么处理的', weight: 30 },
        { item: '代码可读', detail: '可复现', weight: 30 } ],
    },
    skills: ['python', 'ds', 'sql'],
  },
  {
    id: 'a22', title: '用户流失预测', host: '数智竞赛', style: '数据', difficulty: 4, duration: '2 周',
    problem: {
      background: '用行为数据预测下月流失用户。', task: '建模并输出名单+AUC。',
      scoring: [
        { item: '特征工程', detail: '有效特征', weight: 30 },
        { item: '模型效果', detail: 'AUC', weight: 40 },
        { item: '解释', detail: '为什么流失', weight: 30 } ],
    },
    skills: ['python', 'ml', 'ds'],
  },
  {
    id: 'a23', title: 'SQL 优化 · 慢查询治理', host: '数智竞赛', style: '数据', difficulty: 3, duration: '4 天',
    problem: { background: '给 5 条慢 SQL，要求改到秒级。', task: '每条给出改写与索引。', scoring: [
      { item: '改写正确', detail: '结果一致', weight: 50 }, { item: '索引合理', detail: 'explain 验证', weight: 50 } ],
    }, skills: ['sql', 'ds'] },
  {
    id: 'a24', title: '数据可视化 · 一屏看懂业务', host: '数智竞赛', style: '数据', difficulty: 2, duration: '1 周',
    problem: { background: '给一份月度销售数据。', task: '做一个看板讲清趋势。', scoring: [
      { item: '图表选择', detail: '图配数据', weight: 40 }, { item: '洞察', detail: '说出结论', weight: 40 }, { item: '美观', detail: '易读', weight: 20 } ],
    }, skills: ['ds', 'web', 'react'] },
  {
    id: 'a25', title: 'RAG 检索准确率挑战', host: 'AI 黑客松', style: 'AI 应用', difficulty: 4, duration: '1.5 周',
    problem: {
      background: '给定一份企业文档和 50 个问题。', task: '搭 RAG 并最大化命中率。',
      scoring: [
        { item: '命中率', detail: '回答正确率', weight: 50 },
        { item: '引用', detail: '答案带来源', weight: 20 },
        { item: '拒答', detail: '不会瞎编', weight: 30 } ],
    },
    skills: ['llm', 'vector', 'python'],
  },
  {
    id: 'a26', title: 'Prompt 工程 · 客服机器人', host: 'AI 黑客松', style: 'AI 应用', difficulty: 2, duration: '3 天',
    problem: { background: '写 prompt 让大模型扮演客服。', task: '在 20 个测试对话上表现稳定。', scoring: [
      { item: '稳定', detail: '不跑题', weight: 50 }, { item: '安全', detail: '不泄露', weight: 30 }, { item: '简洁', detail: '不啰嗦', weight: 20 } ],
    }, skills: ['llm', 'python'] },
  {
    id: 'a27', title: 'Agent 工具调用挑战赛', host: 'AI 黑客松', style: 'AI 应用', difficulty: 5, duration: '2 周',
    problem: { background: '任务需要查天气+算数+查资料。', task: '做一个能自动调工具的 agent。', scoring: [
      { item: '成功率', detail: '任务完成率', weight: 50 }, { item: '步数', detail: '少绕路', weight: 30 }, { item: '失败恢复', detail: '会重试', weight: 20 } ],
    }, skills: ['llm', 'fastapi', 'python'] },
  {
    id: 'a28', title: '短链接系统设计', host: '架构师训练营', style: '系统设计', difficulty: 3, duration: '1 周',
    problem: { background: '设计百亿级短链接。', task: '出架构图+关键取舍。', scoring: [
      { item: '容量估算', detail: 'QPS/存储', weight: 30 }, { item: '取舍', detail: '一致性/可用性', weight: 40 }, { item: '容错', detail: '降级', weight: 30 } ],
    }, skills: ['dist', 'go', 'redis'] },
  {
    id: 'a29', title: 'Feed 流设计', host: '架构师训练营', style: '系统设计', difficulty: 4, duration: '1.5 周',
    problem: { background: '设计微博 Feed。', task: '推/拉模式权衡。', scoring: [
      { item: '模式选择', detail: '推/拉/混合', weight: 40 }, { item: '存储', detail: '时间线', weight: 30 }, { item: '扩展', detail: '热点账号', weight: 30 } ],
    }, skills: ['dist', 'redis', 'mysql'] },
  {
    id: 'a30', title: '秒杀系统设计', host: '架构师训练营', style: '系统设计', difficulty: 5, duration: '2 周',
    problem: { background: '设计每秒十万请求的秒杀。', task: '全链路保护方案。', scoring: [
      { item: '分层限流', detail: '前端/网关/服务', weight: 30 }, { item: '库存不超卖', detail: '预减/兜底', weight: 40 }, { item: '对账', detail: '最终一致', weight: 30 } ],
    }, skills: ['dist', 'redis', 'mq', 'java'] },
];

export const ARENA_BY_ID: Record<string, IArena> = Object.fromEntries(
  SIM_ARENA.map((a) => [a.id, a])
);

export const ARENA_STYLE_META: Record<IArena['style'], { color: string; label: string }> = {
  算法: { color: 'text-info', label: '算法' },
  数据: { color: 'text-success', label: '数据' },
  'AI 应用': { color: 'text-primary', label: 'AI 应用' },
  系统设计: { color: 'text-warning', label: '系统设计' },
};

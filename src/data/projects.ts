import type { IProject } from './types';

export const SIM_PROJECTS: IProject[] = [
  {
    id: 'p1',
    title: '星链商城 · 订单系统重构',
    company: '星辰科技（模拟）',
    role: '后端开发实习生',
    stack: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
    summary: '订单模块在促销高峰出现超时与慢查询，完成接口重构、缓存引入与质量保障。',
    background: '大促时订单接口超时严重，老 SQL 全表扫描。你负责把订单查询改成带缓存的高效实现。',
    duration: '模拟周期：2 周',
    difficulty: 3,
    category: '后端',
    skills: ['java', 'spring', 'sql', 'redis'],
    phases: [
      {
        id: 'p1-ph1', name: '阶段一 · 环境准备与需求对齐', goal: '跑通本地工程，理清订单接口现状。',
        prep: ['装 JDK 17', '装 MySQL', '拉取仓库'], knowledge: ['java-0', 'spring-0'],
        deliverables: [{ id: 'p1-d1', name: '现状接口清单', kind: '文档', prompt: '列出现有订单接口：', template: '# 现状\nGET /order/{id}' }],
        tickets: [
          { id: 'p1-t1', title: '跑通本地服务', kind: '开发', priority: 'P0', context: '启动工程。', acceptance: ['接口可访问'], xp: 20 },
          { id: 'p1-t2', title: '梳理慢查询', kind: '开发', priority: 'P0', context: '找出最慢 SQL。', acceptance: ['定位到 SQL'], xp: 25 },
        ],
      },
      {
        id: 'p1-ph2', name: '阶段二 · 数据库设计', goal: '为订单表加合适索引。',
        prep: ['表结构已熟悉'], knowledge: ['sql-2'],
        deliverables: [{ id: 'p1-d2', name: '索引方案', kind: '文档', prompt: '写索引：', template: '# 索引\nidx_user_status' }],
        tickets: [{ id: 'p1-t3', title: '加索引', kind: '开发', priority: 'P0', context: '覆盖高频查询。', acceptance: ['查询变快'], xp: 30 }],
      },
      {
        id: 'p1-ph3', name: '阶段三 · 缓存与重构', goal: '热点订单加 Redis 缓存。',
        prep: ['索引就绪'], knowledge: ['redis-0', 'redis-1'],
        deliverables: [{ id: 'p1-d3', name: '缓存方案', kind: '文档', prompt: '写策略：', template: '# 缓存\n读穿透/过期' }],
        tickets: [
          { id: 'p1-t4', title: '引入 Redis 缓存', kind: '开发', priority: 'P0', context: '查不到再回源。', acceptance: ['缓存命中'], xp: 35 },
          { id: 'p1-t5', title: '接口重构', kind: '开发', priority: 'P1', context: '统一返回结构。', acceptance: ['返回规范'], xp: 25 },
        ],
      },
      {
        id: 'p1-ph4', name: '阶段四 · 测试与复盘', goal: '补关键测试，写复盘。',
        prep: ['功能完成'], knowledge: ['review-1'],
        deliverables: [{ id: 'p1-d4', name: '复盘 PPT 大纲', kind: 'PPT 大纲', prompt: '写复盘：', template: '# 复盘\n问题/方案/结果' }],
        tickets: [{ id: 'p1-t6', title: '补单测', kind: '测试', priority: 'P1', context: '核心路径覆盖。', acceptance: ['测试通过'], xp: 15 }],
      },
    ],
  },
  {
    id: 'p2',
    title: '增长实验室 · 用户行为分析平台',
    company: '增长科技（模拟）',
    role: '数据分析实习生',
    stack: ['Python', 'Pandas', 'SQL', 'ECharts'],
    summary: '从埋点日志出发，完成清洗、漏斗与留存分析，输出可执行的增长建议。',
    background: '产品想知道新用户在哪一步流失。你从埋点表算漏斗与留存。',
    duration: '模拟周期：1.5 周',
    difficulty: 2,
    category: '数据',
    skills: ['python', 'sql', 'ds'],
    phases: [
      {
        id: 'p2-ph1', name: '阶段一 · 环境与数据口径', goal: '连到数据，明确口径。',
        prep: ['装 Anaconda'], knowledge: ['ds-0', 'sql-1'],
        deliverables: [{ id: 'p2-d1', name: '数据口径文档', kind: '文档', prompt: '写口径：', template: '# 口径\nDAU=去重用户' }],
        tickets: [
          { id: 'p2-t1', title: '取数清洗', kind: '开发', priority: 'P0', context: '读入埋点表。', acceptance: ['数据可读'], xp: 25 },
          { id: 'p2-t2', title: '定义漏斗步骤', kind: '开发', priority: 'P0', context: '按事件排序。', acceptance: ['漏斗完整'], xp: 25 },
        ],
      },
      {
        id: 'p2-ph2', name: '阶段二 · 漏斗与留存', goal: '算转化率与次留。',
        prep: ['清洗完成'], knowledge: ['ds-1', 'ds-2'],
        deliverables: [{ id: 'p2-d2', name: '分析过程说明', kind: '文档', prompt: '写每步在算什么：', template: '# 过程\n第一步去重' }],
        tickets: [
          { id: 'p2-t3', title: '漏斗转化率', kind: '开发', priority: 'P0', context: '各步转化率。', acceptance: ['数算对'], xp: 30 },
          { id: 'p2-t4', title: '次留曲线', kind: '开发', priority: 'P1', context: '按天留存。', acceptance: ['曲线合理'], xp: 20 },
        ],
      },
      {
        id: 'p2-ph3', name: '阶段三 · 可视化与报告', goal: '出图写增长建议。',
        prep: ['指标算完'], knowledge: ['ds-3'],
        deliverables: [{ id: 'p2-d3', name: '增长建议报告', kind: '文档', prompt: '写建议：', template: '# 建议\n某步流失高，建议优化' }],
        tickets: [{ id: 'p2-t5', title: '画漏斗图', kind: '开发', priority: 'P1', context: '漏斗图。', acceptance: ['图可读'], xp: 15 }],
      },
    ],
  },
  {
    id: 'p3',
    title: '智答 · 企业知识库 RAG 助手',
    company: '智问科技（模拟）',
    role: 'AI 应用开发实习生',
    stack: ['Python', 'FastAPI', '向量库', '大模型 API'],
    summary: '客户需要把散落在多个文档库的资料变成可问答的助手。你负责 RAG 全链路。',
    background: '客服查资料慢。你实现文档解析、向量化、检索增强生成与 API 封装。',
    duration: '模拟周期：3 周',
    difficulty: 4,
    category: 'AI',
    skills: ['llm', 'python', 'fastapi', 'vector'],
    phases: [
      {
        id: 'p3-ph1', name: '阶段一 · 场景定义与评测集', goal: '定义问答场景，准备评测问题。',
        prep: ['装 Python/FastAPI'], knowledge: ['llm-0', 'fastapi-0'],
        deliverables: [{ id: 'p3-d1', name: '评测集与评分规则', kind: '文档', prompt: '列评测问题：', template: '# 评测\n问题+期望答案' }],
        tickets: [{ id: 'p3-t1', title: '写评测问题', kind: '文档', priority: 'P0', context: '20 个问题。', acceptance: ['问题合理'], xp: 20 }],
      },
      {
        id: 'p3-ph2', name: '阶段二 · 文档解析与向量化', goal: '文档切块并入库。',
        prep: ['样例文档'], knowledge: ['llm-1', 'vector-0'],
        deliverables: [{ id: 'p3-d2', name: '切分策略说明', kind: '文档', prompt: '写切块：', template: '# 切分\n按段落 500 字' }],
        tickets: [
          { id: 'p3-t2', title: '文档切块', kind: '开发', priority: 'P0', context: '清洗+切块。', acceptance: ['切块合理'], xp: 30 },
          { id: 'p3-t3', title: '向量化入库', kind: '开发', priority: 'P0', context: '写入向量库。', acceptance: ['可检索'], xp: 35 },
        ],
      },
      {
        id: 'p3-ph3', name: '阶段三 · RAG 链路与优化', goal: '检索→生成，带引用。',
        prep: ['库已就绪'], knowledge: ['llm-2'],
        deliverables: [{ id: 'p3-d3', name: '技术方案与对比', kind: '文档', prompt: '写方案：', template: '# 链路\n检索->增强->生成' }],
        tickets: [
          { id: 'p3-t4', title: '实现问答链路', kind: '开发', priority: 'P0', context: '答案带来源。', acceptance: ['可问答'], xp: 35 },
          { id: 'p3-t5', title: '加拒答', kind: '开发', priority: 'P1', context: '检索不到就说不知道。', acceptance: ['可拒答'], xp: 20 },
        ],
      },
      {
        id: 'p3-ph4', name: '阶段四 · API 封装与交付', goal: '封装接口并写演示。',
        prep: ['链路稳定'], knowledge: ['fastapi-1'],
        deliverables: [{ id: 'p3-d4', name: '交付演示 PPT 大纲', kind: 'PPT 大纲', prompt: '写演示：', template: '# 演示\n架构/效果/评测' }],
        tickets: [{ id: 'p3-t6', title: '封装 /ask 接口', kind: '开发', priority: 'P1', context: '接收问题返回答案。', acceptance: ['接口可调'], xp: 25 }],
      },
    ],
  },
  {
    id: 'p4',
    title: '极客汇 · 竞赛报名系统',
    company: '极客汇科技（模拟）',
    role: '后端开发实习生',
    stack: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
    summary: '活动报名瞬时高并发，要求限流、幂等与防超卖。',
    background: '热门活动报名瞬间打挂。你负责报名接口与高并发保护。',
    duration: '模拟周期：2 周',
    difficulty: 4,
    category: '后端',
    skills: ['java', 'dist', 'redis', 'sql'],
    phases: [
      {
        id: 'p4-ph1', name: '阶段一 · 系统设计', goal: '设计报名流程与表。',
        prep: ['装 JDK/MySQL'], knowledge: ['dist-0', 'sql-2'],
        deliverables: [{ id: 'p4-d1', name: '架构设计文档', kind: '文档', prompt: '写流程：', template: '# 流程\n校验->扣名额->落库' }],
        tickets: [{ id: 'p4-t1', title: '设计表结构', kind: '开发', priority: 'P0', context: '活动/报名。', acceptance: ['建表完成'], xp: 25 }],
      },
      {
        id: 'p4-ph2', name: '阶段二 · 核心报名接口', goal: '实现限流幂等。',
        prep: ['表就绪'], knowledge: ['redis-1', 'dist-1'],
        deliverables: [{ id: 'p4-d2', name: '接口设计说明', kind: '文档', prompt: '写限流：', template: '# 限流\n令牌桶' }],
        tickets: [
          { id: 'p4-t2', title: '幂等报名', kind: '开发', priority: 'P0', context: '一人一次。', acceptance: ['重复被拦'], xp: 35 },
          { id: 'p4-t3', title: '名额预减', kind: '开发', priority: 'P0', context: 'Redis 预减。', acceptance: ['不超卖'], xp: 35 },
        ],
      },
      {
        id: 'p4-ph3', name: '阶段三 · 高并发优化与压测', goal: '压测并调优。',
        prep: ['接口完成'], knowledge: ['dist-2', 'deploy-1'],
        deliverables: [{ id: 'p4-d3', name: '压测报告', kind: '文档', prompt: '写结果：', template: '# 压测\nQPS/错误率' }],
        tickets: [{ id: 'p4-t4', title: '跑压测', kind: '测试', priority: 'P1', context: '逐步加压。', acceptance: ['有数据'], xp: 20 }],
      },
    ],
  },
  {
    id: 'p5',
    title: '数据大屏 · 经营指标可视化',
    company: '数视科技（模拟）',
    role: '前端开发实习生',
    stack: ['React', 'ECharts', '数据接口'],
    summary: '把经营指标做成一个大屏：总览、趋势、排行。',
    background: '管理层要一屏看全局。你负责大屏布局与图表。',
    duration: '模拟周期：1.5 周',
    difficulty: 2,
    category: '前端',
    skills: ['react', 'web'],
    phases: [
      {
        id: 'p5-ph1', name: '阶段一 · 需求与原型', goal: '定大屏区块。',
        prep: ['装 Node'], knowledge: ['web-0', 'react-0'],
        deliverables: [{ id: 'p5-d1', name: '页面结构', kind: '文档', prompt: '画区块：', template: '# 区块\n总览/图/排行' }],
        tickets: [{ id: 'p5-t1', title: '搭大屏骨架', kind: '开发', priority: 'P0', context: '栅格布局。', acceptance: ['布局完成'], xp: 25 }],
      },
      {
        id: 'p5-ph2', name: '阶段二 · 组件与图表', goal: '完成折线/排行卡片。',
        prep: ['骨架完成'], knowledge: ['react-1'],
        deliverables: [{ id: 'p5-d2', name: '组件设计说明', kind: '文档', prompt: '写组件：', template: '# 组件\nTrendCard' }],
        tickets: [
          { id: 'p5-t2', title: '趋势折线图', kind: '开发', priority: 'P0', context: 'ECharts。', acceptance: ['图出来'], xp: 30 },
          { id: 'p5-t3', title: '排行列表', kind: '开发', priority: 'P1', context: 'Top10。', acceptance: ['排序正确'], xp: 20 },
        ],
      },
      {
        id: 'p5-ph3', name: '阶段三 · 优化与交付', goal: '适配与交付。',
        prep: ['图表完成'], knowledge: ['web-2'],
        deliverables: [{ id: 'p5-d3', name: '交付 PPT 大纲', kind: 'PPT 大纲', prompt: '写演示：', template: '# 演示\n效果/技术' }],
        tickets: [{ id: 'p5-t4', title: '大屏适配', kind: '开发', priority: 'P2', context: '不同分辨率。', acceptance: ['不溢出'], xp: 10 }],
      },
    ],
  },
  {
    id: 'p6',
    title: '内容社区 · 全栈实战',
    company: '笔友科技（模拟）',
    role: '全栈开发实习生',
    stack: ['React', 'FastAPI', 'MySQL', 'Docker'],
    summary: '做一个文章社区：发帖、评论、点赞。',
    background: '小团队要一个内容社区 MVP。你前后端都做。',
    duration: '模拟周期：2 周',
    difficulty: 3,
    category: '全栈',
    skills: ['react', 'fastapi', 'sql', 'docker'],
    phases: [
      {
        id: 'p6-ph1', name: '阶段一 · 接口与数据模型', goal: '设计文章/评论表与接口。',
        prep: ['装 Node/Python'], knowledge: ['fastapi-0', 'sql-0'],
        deliverables: [{ id: 'p6-d1', name: 'API 设计文档', kind: '文档', prompt: '列接口：', template: '# API\nGET /posts' }],
        tickets: [{ id: 'p6-t1', title: '建表与 CRUD', kind: '开发', priority: 'P0', context: '文章增删改查。', acceptance: ['接口可调'], xp: 30 }],
      },
      {
        id: 'p6-ph2', name: '阶段二 · 前端联调与部署', goal: '页面联调，一键启动。',
        prep: ['接口完成'], knowledge: ['react-1', 'docker-0'],
        deliverables: [{ id: 'p6-d2', name: '部署说明', kind: '文档', prompt: '写启动：', template: '# 启动\ndocker compose up' }],
        tickets: [
          { id: 'p6-t2', title: '文章列表与详情', kind: '开发', priority: 'P0', context: '调接口。', acceptance: ['页面可用'], xp: 30 },
          { id: 'p6-t3', title: '评论点赞', kind: '开发', priority: 'P1', context: '评论+点赞。', acceptance: ['可交互'], xp: 25 },
        ],
      },
    ],
  },
  {
    id: 'p7',
    title: '报表自动化 · 定时周报',
    company: '数捷科技（模拟）',
    role: '数据分析实习生',
    stack: ['Python', 'SQL', '消息通知'],
    summary: '把手工周报变成自动跑、异常自动提示。',
    background: '运营每周手工拉数做表。你做成自动任务。',
    duration: '模拟周期：1 周',
    difficulty: 2,
    category: '数据',
    skills: ['python', 'sql', 'ds'],
    phases: [
      {
        id: 'p7-ph1', name: '阶段一 · 取数与清洗', goal: '把周报指标写成 SQL。',
        prep: ['有周报样例'], knowledge: ['sql-1', 'ds-1'],
        deliverables: [{ id: 'p7-d1', name: '指标口径说明', kind: '文档', prompt: '写指标：', template: '# 口径\nDAU/留存' }],
        tickets: [{ id: 'p7-t1', title: '写指标 SQL', kind: '开发', priority: 'P0', context: '每周指标。', acceptance: ['数对'], xp: 25 }],
      },
      {
        id: 'p7-ph2', name: '阶段二 · 自动报表与异常提示', goal: '定时跑，异常标红。',
        prep: ['SQL 完成'], knowledge: ['ds-2'],
        deliverables: [{ id: 'p7-d2', name: '周报模板', kind: '文档', prompt: '写模板：', template: '# 周报\n大盘/留存/异常' }],
        tickets: [
          { id: 'p7-t2', title: '生成报表', kind: '开发', priority: 'P0', context: '跑成表。', acceptance: ['可出表'], xp: 25 },
          { id: 'p7-t3', title: '异常提示', kind: '开发', priority: 'P1', context: '环比大跌提示。', acceptance: ['可告警'], xp: 15 },
        ],
      },
    ],
  },
  {
    id: 'p8',
    title: '微服务网关 · Go 高并发入口',
    company: '云枢科技（模拟）',
    role: 'Go 后端实习生',
    stack: ['Go', 'gRPC', 'Redis', 'Docker'],
    summary: '实现微服务网关：路由转发、限流鉴权、熔断降级。',
    background: '多服务需统一入口，要求高并发下稳定转发并做基础防护。',
    duration: '模拟周期：1.5 周',
    difficulty: 3,
    category: '后端',
    skills: ['go', 'dist', 'redis', 'docker'],
    phases: [
      { id: 'p8-ph1', name: '阶段一 · 路由与转发', goal: '按路径转发到下游。', prep: ['装 Go 1.22'], knowledge: ['go-0', 'dist-0'],
        deliverables: [{ id: 'p8-d1', name: '路由规则表', kind: '文档', prompt: '写路由：', template: '# 路由\n/api/a->A' }],
        tickets: [
          { id: 'p8-t1', title: '反向转发', kind: '开发', priority: 'P0', context: '透传 header。', acceptance: ['转发正确'], xp: 30 },
          { id: 'p8-t2', title: 'IP 限流', kind: '开发', priority: 'P1', context: '超限 429。', acceptance: ['限流生效'], xp: 25 },
        ] },
      { id: 'p8-ph2', name: '阶段二 · 鉴权与熔断', goal: '校验 token，失败快速失败。', prep: ['转发跑通'], knowledge: ['dist-1', 'redis-1'],
        deliverables: [{ id: 'p8-d2', name: '降级说明', kind: '文档', prompt: '写降级：', template: '# 降级\n超时->兜底' }],
        tickets: [
          { id: 'p8-t3', title: 'JWT 鉴权', kind: '开发', priority: 'P0', context: '校验 token。', acceptance: ['非法拒绝'], xp: 30 },
          { id: 'p8-t4', title: '熔断降级', kind: '开发', priority: 'P1', context: '连续失败熔断。', acceptance: ['熔断生效'], xp: 25 },
        ] },
    ],
  },
  {
    id: 'p9',
    title: '组件库 · 高复用 UI 组件',
    company: '织云前端（模拟）',
    role: '前端开发实习生',
    stack: ['React', 'TypeScript', 'Vite'],
    summary: '从零写 Button/Modal/Table 三个通用组件并配文档。',
    background: '团队需要风格统一的基础组件。',
    duration: '模拟周期：1 周',
    difficulty: 2,
    category: '前端',
    skills: ['react', 'web', 'review'],
    phases: [
      { id: 'p9-ph1', name: '阶段一 · Button 与 Modal', goal: '完成可复用组件。', prep: ['初始化 Vite 库工程'], knowledge: ['react-0', 'react-1'],
        deliverables: [{ id: 'p9-d1', name: 'API 文档', kind: '文档', prompt: '写 props：', template: '# Button\nvariant/size' }],
        tickets: [
          { id: 'p9-t1', title: 'Button 组件', kind: '开发', priority: 'P0', context: '多 variant。', acceptance: ['样式齐全'], xp: 25 },
          { id: 'p9-t2', title: 'Modal 组件', kind: '开发', priority: 'P0', context: '受控开关。', acceptance: ['可受控'], xp: 30 },
        ] },
      { id: 'p9-ph2', name: '阶段二 · Table 与示例', goal: '可排序 Table。', prep: ['前两组件完成'], knowledge: ['react-1'],
        deliverables: [{ id: 'p9-d2', name: '示例页面', kind: '文档', prompt: '写示例：', template: '# 示例\n<Table/>' }],
        tickets: [
          { id: 'p9-t3', title: 'Table 排序', kind: '开发', priority: 'P1', context: '点列头排序。', acceptance: ['排序正确'], xp: 30 },
          { id: 'p9-t4', title: '写单测', kind: '测试', priority: 'P2', context: 'Button 测试。', acceptance: ['通过'], xp: 15 },
        ] },
    ],
  },
  {
    id: 'p10',
    title: '图像分类 · PyTorch 实战',
    company: '视览科技（模拟）',
    role: '算法实习生',
    stack: ['Python', 'PyTorch', 'CNN'],
    summary: '训练图片分类模型并保存推理。',
    background: '需要轻量图像分类 baseline。',
    duration: '模拟周期：1.5 周',
    difficulty: 4,
    category: 'AI',
    skills: ['dl', 'python', 'ml'],
    phases: [
      { id: 'p10-ph1', name: '阶段一 · 数据与模型', goal: '加载数据定义 CNN。', prep: ['装 PyTorch'], knowledge: ['dl-0', 'ds-0'],
        deliverables: [{ id: 'p10-d1', name: '实验记录', kind: '文档', prompt: '记录配置：', template: '# 配置\nbatch=32' }],
        tickets: [
          { id: 'p10-t1', title: 'DataLoader', kind: '开发', priority: 'P0', context: '归一化。', acceptance: ['可迭代'], xp: 30 },
          { id: 'p10-t2', title: '定义 CNN', kind: '开发', priority: 'P0', context: '几层卷积。', acceptance: ['前向可跑'], xp: 30 },
        ] },
      { id: 'p10-ph2', name: '阶段二 · 训练与保存', goal: '跑训练存权重。', prep: ['模型可前向'], knowledge: ['dl-1', 'dl-2'],
        deliverables: [{ id: 'p10-d2', name: '结果报告', kind: '文档', prompt: '写准确率：', template: '# 结果\nepoch5 85%' }],
        tickets: [
          { id: 'p10-t3', title: '训练循环', kind: '开发', priority: 'P0', context: '五步循环。', acceptance: ['loss下降'], xp: 35 },
          { id: 'p10-t4', title: '保存与推理', kind: '开发', priority: 'P1', context: 'load+eval。', acceptance: ['可预测'], xp: 20 },
        ] },
    ],
  },
  {
    id: 'p11',
    title: '支付对账 · 一致性保障',
    company: '金合科技（模拟）',
    role: '后端开发实习生',
    stack: ['Java', 'MySQL', 'RocketMQ', 'Redis'],
    summary: '实现支付对账与幂等，保证不重不漏。',
    background: '支付与账务两边偶尔不一致。',
    duration: '模拟周期：2 周',
    difficulty: 4,
    category: '后端',
    skills: ['java', 'sql', 'dist', 'redis'],
    phases: [
      { id: 'p11-ph1', name: '阶段一 · 幂等与状态机', goal: '设计状态机与幂等键。', prep: ['装 JDK/MySQL'], knowledge: ['java-1', 'sql-2'],
        deliverables: [{ id: 'p11-d1', name: '状态机文档', kind: '文档', prompt: '画状态：', template: '# 状态\n待支付->已支付' }],
        tickets: [
          { id: 'p11-t1', title: '幂等表', kind: '开发', priority: 'P0', context: '唯一键去重。', acceptance: ['不重复入账'], xp: 35 },
          { id: 'p11-t2', title: '状态机流转', kind: '开发', priority: 'P0', context: '只前进。', acceptance: ['非法拒绝'], xp: 30 },
        ] },
      { id: 'p11-ph2', name: '阶段二 · 对账任务', goal: '每日对账输出差异。', prep: ['支付跑通'], knowledge: ['dist-1', 'review-1'],
        deliverables: [{ id: 'p11-d2', name: '对账报告', kind: '文档', prompt: '写报告：', template: '# 对账\n差异笔数' }],
        tickets: [
          { id: 'p11-t3', title: '对账批处理', kind: '开发', priority: 'P1', context: '比对流水。', acceptance: ['差异标出'], xp: 35 },
          { id: 'p11-t4', title: '补单测', kind: '测试', priority: 'P2', context: '边界覆盖。', acceptance: ['通过'], xp: 15 },
        ] },
    ],
  },
  {
    id: 'p12',
    title: '实时推荐 · 召回与排序',
    company: '星推科技（模拟）',
    role: '算法工程师实习生',
    stack: ['Python', 'SQL', 'Redis', '排序模型'],
    summary: '搭简化推荐流：召回 + 粗排。',
    background: '首页按用户行为给候选物品。',
    duration: '模拟周期：2 周',
    difficulty: 5,
    category: '数据',
    skills: ['sql', 'ml', 'redis', 'python'],
    phases: [
      { id: 'p12-ph1', name: '阶段一 · 召回', goal: '热门+相似召回。', prep: ['样例行为数据'], knowledge: ['ml-0', 'sql-1'],
        deliverables: [{ id: 'p12-d1', name: '召回方案', kind: '文档', prompt: '写策略：', template: '# 召回\n热门+相似' }],
        tickets: [
          { id: 'p12-t1', title: '热门召回', kind: '开发', priority: 'P0', context: '近7天热榜。', acceptance: ['可输出'], xp: 30 },
          { id: 'p12-t2', title: '共现召回', kind: '开发', priority: 'P1', context: '共现矩阵。', acceptance: ['相关合理'], xp: 35 },
        ] },
      { id: 'p12-ph2', name: '阶段二 · 粗排', goal: '打分排序。', prep: ['候选已产'], knowledge: ['ml-1', 'ml-2'],
        deliverables: [{ id: 'p12-d2', name: '排序说明', kind: '文档', prompt: '写特征：', template: '# 排序\nctr+新鲜度' }],
        tickets: [
          { id: 'p12-t3', title: '特征打分', kind: '开发', priority: 'P0', context: 'TopN。', acceptance: ['合理'], xp: 35 },
          { id: 'p12-t4', title: '离线评估', kind: '测试', priority: 'P1', context: '抽样看质量。', acceptance: ['有记录'], xp: 20 },
        ] },
    ],
  },
  {
    id: 'p13',
    title: 'CI/CD · 自动化流水线',
    company: '云捷科技（模拟）',
    role: 'DevOps 实习生',
    stack: ['Git', 'Docker', 'CI', '监控'],
    summary: '搭提交即测试、合并即部署的流水线。',
    background: '手工部署易出错。',
    duration: '模拟周期：1 周',
    difficulty: 3,
    category: '工程效能',
    skills: ['git', 'docker', 'deploy'],
    phases: [
      { id: 'p13-ph1', name: '阶段一 · 自动测试', goal: 'push 自动跑 lint/测试。', prep: ['仓库有测试'], knowledge: ['git-1', 'review-1'],
        deliverables: [{ id: 'p13-d1', name: '流水线说明', kind: '文档', prompt: '写步骤：', template: '# CI\nlint->test' }],
        tickets: [
          { id: 'p13-t1', title: 'CI 步骤', kind: '开发', priority: 'P0', context: '失败拦截。', acceptance: ['可拦截'], xp: 30 },
          { id: 'p13-t2', title: '构建镜像', kind: '开发', priority: 'P1', context: '打 Docker 镜像。', acceptance: ['可起'], xp: 25 },
        ] },
      { id: 'p13-ph2', name: '阶段二 · 部署与监控', goal: '合并后自动部署。', prep: ['镜像可构建'], knowledge: ['docker-0', 'deploy-2'],
        deliverables: [{ id: 'p13-d2', name: '回滚预案', kind: '文档', prompt: '写回滚：', template: '# 回滚\n上版回退' }],
        tickets: [
          { id: 'p13-t3', title: '自动部署', kind: '开发', priority: 'P1', context: 'main 合并部署。', acceptance: ['可上线'], xp: 30 },
          { id: 'p13-t4', title: '健康检查', kind: '开发', priority: 'P2', context: '/health。', acceptance: ['正常'], xp: 15 },
        ] },
    ],
  },
  {
    id: 'p14',
    title: '校园二手 · 小程序商城',
    company: '青桔校园（模拟）',
    role: '全栈开发实习生',
    stack: ['小程序', 'Node', 'MySQL'],
    summary: '校园二手交易小程序：发布、浏览、留言。',
    background: '学生想校内二手交易。',
    duration: '模拟周期：1.5 周',
    difficulty: 2,
    category: '全栈',
    skills: ['web', 'sql', 'fastapi', 'review'],
    phases: [
      { id: 'p14-ph1', name: '阶段一 · 发布与列表', goal: '发布并分类浏览。', prep: ['注册小程序'], knowledge: ['web-0', 'sql-0'],
        deliverables: [{ id: 'p14-d1', name: '页面原型', kind: '文档', prompt: '写页面流：', template: '# 页面\n列表->详情->发布' }],
        tickets: [
          { id: 'p14-t1', title: '物品发布', kind: '开发', priority: 'P0', context: '表单上传。', acceptance: ['可发布'], xp: 25 },
          { id: 'p14-t2', title: '列表分页', kind: '开发', priority: 'P0', context: '分页筛选。', acceptance: ['可浏览'], xp: 25 },
        ] },
      { id: 'p14-ph2', name: '阶段二 · 留言与校验', goal: '留言联系+输入校验。', prep: ['列表跑通'], knowledge: ['web-2', 'review-1'],
        deliverables: [{ id: 'p14-d2', name: '验收用例', kind: '文档', prompt: '写用例：', template: '# 用例\n空标题不可提交' }],
        tickets: [
          { id: 'p14-t3', title: '留言联系', kind: '开发', priority: 'P1', context: '买卖双方留言。', acceptance: ['可留言'], xp: 25 },
          { id: 'p14-t4', title: '输入校验', kind: '测试', priority: 'P2', context: '长度限制。', acceptance: ['校验生效'], xp: 15 },
        ] },
    ],
  },
  {
    id: 'p15',
    title: '自动化测试 · 接口回归平台',
    company: '质行科技（模拟）',
    role: '测试开发实习生',
    stack: ['Python', 'pytest', 'CI'],
    summary: '把核心接口写成可回归自动化测试。',
    background: '改接口靠手点易漏。',
    duration: '模拟周期：1 周',
    difficulty: 3,
    category: '工程效能',
    skills: ['python', 'review', 'git'],
    phases: [
      { id: 'p15-ph1', name: '阶段一 · 用例设计', goal: '5 个核心接口用例。', prep: ['接口文档'], knowledge: ['review-1', 'python-0'],
        deliverables: [{ id: 'p15-d1', name: '用例清单', kind: '文档', prompt: '列用例：', template: '# 用例\n正常/边界/异常' }],
        tickets: [
          { id: 'p15-t1', title: 'pytest 用例', kind: '测试', priority: 'P0', context: '三类输入。', acceptance: ['可跑'], xp: 30 },
          { id: 'p15-t2', title: '断言报告', kind: '测试', priority: 'P1', context: '失败清晰。', acceptance: ['可读'], xp: 20 },
        ] },
      { id: 'p15-ph2', name: '阶段二 · 接入 CI', goal: '提交自动跑回归。', prep: ['用例稳定'], knowledge: ['git-1', 'deploy-0'],
        deliverables: [{ id: 'p15-d2', name: 'CI 说明', kind: '文档', prompt: '写触发：', template: '# CI\npush 跑回归' }],
        tickets: [
          { id: 'p15-t3', title: 'CI 跑测试', kind: '开发', priority: 'P1', context: '失败拦截。', acceptance: ['可拦'], xp: 25 },
          { id: 'p15-t4', title: '测试规范', kind: '文档', priority: 'P2', context: '沉淀规范。', acceptance: ['完成'], xp: 10 },
        ] },
    ],
  },
  {
    id: 'p16',
    title: '登录鉴权 · 安全加固',
    company: '安域科技（模拟）',
    role: '后端安全实习生',
    stack: ['Java', 'Spring Security', 'Redis', 'JWT'],
    summary: '实现安全登录、防刷、越权校验。',
    background: '老接口裸奔、登录可被刷。',
    duration: '模拟周期：1.5 周',
    difficulty: 4,
    category: '后端',
    skills: ['java', 'spring', 'redis', 'sql'],
    phases: [
      { id: 'p16-ph1', name: '阶段一 · 登录与 token', goal: '密码加密发 JWT。', prep: ['装 JDK/MySQL'], knowledge: ['spring-1', 'sql-2'],
        deliverables: [{ id: 'p16-d1', name: '安全清单', kind: '文档', prompt: '列控制：', template: '# 安全\nbcrypt/JWT过期' }],
        tickets: [
          { id: 'p16-t1', title: '密码加密', kind: '开发', priority: 'P0', context: 'bcrypt。', acceptance: ['不明文'], xp: 30 },
          { id: 'p16-t2', title: 'JWT 校验', kind: '开发', priority: 'P0', context: '拦截器校验。', acceptance: ['过期拒绝'], xp: 35 },
        ] },
      { id: 'p16-ph2', name: '阶段二 · 防刷与越权', goal: '限流+数据归属校验。', prep: ['登录跑通'], knowledge: ['redis-1', 'dist-1'],
        deliverables: [{ id: 'p16-d2', name: '越权用例', kind: '文档', prompt: '列攻击面：', template: '# 越权\n改id看别人数据' }],
        tickets: [
          { id: 'p16-t3', title: '失败限流', kind: '开发', priority: 'P1', context: '5次锁定。', acceptance: ['可防刷'], xp: 25 },
          { id: 'p16-t4', title: '越权校验', kind: '测试', priority: 'P1', context: '只看自己。', acceptance: ['越权被拦'], xp: 20 },
        ] },
    ],
  },
  {
    id: 'p17',
    title: '离线数仓 · 分层建模',
    company: '数桥科技（模拟）',
    role: '数据开发实习生',
    stack: ['SQL', '数仓', '调度', '可视化'],
    summary: '按 ODS/DWD/DWS 分层，出主题报表。',
    background: '表直接混查又慢又乱。',
    duration: '模拟周期：2 周',
    difficulty: 4,
    category: '数据',
    skills: ['sql', 'ds', 'docs'],
    phases: [
      { id: 'p17-ph1', name: '阶段一 · ODS/DWD', goal: '贴源与明细清洗。', prep: ['业务样例'], knowledge: ['sql-1', 'ds-1'],
        deliverables: [{ id: 'p17-d1', name: '分层说明', kind: '文档', prompt: '写分层：', template: '# 分层\nODS/DWD/DWS' }],
        tickets: [
          { id: 'p17-t1', title: 'ODS 建表', kind: '开发', priority: 'P0', context: '贴源。', acceptance: ['贴源完成'], xp: 25 },
          { id: 'p17-t2', title: 'DWD 清洗', kind: '开发', priority: 'P0', context: '去重去脏。', acceptance: ['明细干净'], xp: 35 },
        ] },
      { id: 'p17-ph2', name: '阶段二 · DWS 与报表', goal: '主题汇总报表。', prep: ['明细就绪'], knowledge: ['ds-2', 'ds-3'],
        deliverables: [{ id: 'p17-d2', name: '报表口径', kind: '文档', prompt: '写口径：', template: '# 口径\n按天汇总' }],
        tickets: [
          { id: 'p17-t3', title: 'DWS 汇总', kind: '开发', priority: 'P1', context: '按天/用户。', acceptance: ['正确'], xp: 30 },
          { id: 'p17-t4', title: '主题报表', kind: '文档', priority: 'P2', context: '结论图表。', acceptance: ['可读'], xp: 15 },
        ] },
    ],
  },
  {
    id: 'p18',
    title: '监控告警 · 指标大盘',
    company: '云捷科技（模拟）',
    role: '运维开发实习生',
    stack: ['Shell', 'Prometheus 风格', 'Grafana 风格'],
    summary: '给服务加指标采集与告警规则。',
    background: '服务挂了才知道。',
    duration: '模拟周期：1 周',
    difficulty: 2,
    category: '工程效能',
    skills: ['linux', 'deploy', 'docs'],
    phases: [
      { id: 'p18-ph1', name: '阶段一 · 采集指标', goal: 'CPU/错误率采集。', prep: ['样例服务'], knowledge: ['linux-1', 'deploy-2'],
        deliverables: [{ id: 'p18-d1', name: '指标清单', kind: '文档', prompt: '列指标：', template: '# 指标\ncpu/错误率' }],
        tickets: [
          { id: 'p18-t1', title: '暴露 /metrics', kind: '开发', priority: 'P0', context: '服务暴露。', acceptance: ['可采集'], xp: 25 },
          { id: 'p18-t2', title: '画大盘', kind: '开发', priority: 'P1', context: '四个核心图。', acceptance: ['可见'], xp: 20 },
        ] },
      { id: 'p18-ph2', name: '阶段二 · 告警规则', goal: '超阈值告警。', prep: ['有数据'], knowledge: ['deploy-2'],
        deliverables: [{ id: 'p18-d2', name: '应急预案', kind: '文档', prompt: '写处理：', template: '# 告警\n错误率>5% 处理' }],
        tickets: [
          { id: 'p18-t3', title: '告警规则', kind: '开发', priority: 'P1', context: '阈值通知。', acceptance: ['可触发'], xp: 25 },
          { id: 'p18-t4', title: '应急预案', kind: '文档', priority: 'P2', context: '故障处理。', acceptance: ['完成'], xp: 10 },
        ] },
    ],
  },
  {
    id: 'p19',
    title: '个人作品集网站 · 0 基础首战',
    company: '个人项目（模拟）',
    role: '前端新手',
    stack: ['HTML', 'CSS', 'JavaScript'],
    summary: '不引框架，手写个人主页。',
    background: '第一个项目，把基础用起来。',
    duration: '模拟周期：3 天',
    difficulty: 1,
    category: '前端',
    skills: ['web', 'git', 'docs'],
    phases: [
      { id: 'p19-ph1', name: '阶段一 · 页面骨架', goal: '导航/关于/作品三段。', prep: ['装 VS Code'], knowledge: ['web-0', 'git-0'],
        deliverables: [{ id: 'p19-d1', name: '结构说明', kind: '文档', prompt: '列区块：', template: '# 区块\n导航/作品/联系' }],
        tickets: [
          { id: 'p19-t1', title: 'HTML 骨架', kind: '开发', priority: 'P0', context: '语义标签。', acceptance: ['完整'], xp: 15 },
          { id: 'p19-t2', title: '加样式', kind: '开发', priority: 'P0', context: 'Flex 布局。', acceptance: ['美观'], xp: 15 },
        ] },
      { id: 'p19-ph2', name: '阶段二 · 交互与部署', goal: '加交互推 Git。', prep: ['页面成型'], knowledge: ['web-2', 'git-1'],
        deliverables: [{ id: 'p19-d2', name: 'README', kind: '文档', prompt: '写介绍：', template: '# 主页\n技术栈' }],
        tickets: [
          { id: 'p19-t3', title: '加交互', kind: '开发', priority: 'P1', context: '点击展开。', acceptance: ['可交互'], xp: 15 },
          { id: 'p19-t4', title: '提交 Git', kind: '开发', priority: 'P1', context: 'commit+push。', acceptance: ['可见'], xp: 10 },
        ] },
    ],
  },
  { id: 'p20', title: '秒杀系统 · 高并发抢购', company: '秒抢科技（模拟）', role: '后端开发实习生', stack: ['Java', 'Redis', 'MQ', 'MySQL'], summary: '热点秒杀：前端限流、Redis 预减、异步下单。', background: '整点秒杀瞬间打挂数据库。', duration: '2 周', difficulty: 5, category: '后端', skills: ['redis', 'dist', 'java'],
    phases: [
      { id: 'p20-ph1', name: '阶段一 · 下单链路', goal: '库存预热 + 预减。', prep: ['装 Redis'], knowledge: ['redis-1', 'dist-1'], deliverables: [{ id: 'p20-d1', name: '链路图', kind: '文档', prompt: '画链路', template: '# 链路\n限流->预减->异步' }], tickets: [
        { id: 'p20-t1', title: '库存预热', kind: '开发', priority: 'P0', context: '库存入 Redis。', acceptance: ['预热成功'], xp: 30 },
        { id: 'p20-t2', title: '预减库存', kind: '开发', priority: 'P0', context: 'Lua 原子扣。', acceptance: ['不超卖'], xp: 40 } ] },
      { id: 'p20-ph2', name: '阶段二 · 异步下单与兜底', goal: 'MQ 异步落库，失败回补。', prep: ['预减跑通'], knowledge: ['dist-2'], deliverables: [{ id: 'p20-d2', name: '压测报告', kind: '文档', prompt: '写 QPS', template: '# 压测\nQPS/错误率' }], tickets: [
        { id: 'p20-t3', title: '异步下单', kind: '开发', priority: 'P1', context: '消息落库。', acceptance: ['下单成功'], xp: 30 },
        { id: 'p20-t4', title: '跑压测', kind: '测试', priority: 'P1', context: '逐步加压。', acceptance: ['有报告'], xp: 15 } ] } ] },
  { id: 'p21', title: '短链接服务 · 高可用', company: '链云科技（模拟）', role: '后端实习生', stack: ['Go', 'Redis', 'MySQL'], summary: '生成短链 302 跳转，缓存热点。', background: '运营需要短链分发。', duration: '1 周', difficulty: 3, category: '后端', skills: ['go', 'redis', 'dist'],
    phases: [
      { id: 'p21-ph1', name: '阶段一 · 生成与跳转', goal: '发号 + Base62 + 302。', prep: ['装 Go'], knowledge: ['go-0', 'sql-0'], deliverables: [{ id: 'p21-d1', name: '接口设计', kind: '文档', prompt: '列接口', template: '# API\nPOST /create GET /:code' }], tickets: [
        { id: 'p21-t1', title: '发号器', kind: '开发', priority: 'P0', context: '自增 id。', acceptance: ['唯一'], xp: 25 },
        { id: 'p21-t2', title: '302 跳转', kind: '开发', priority: 'P0', context: '命中即跳。', acceptance: ['跳转正确'], xp: 25 } ] },
      { id: 'p21-ph2', name: '阶段二 · 缓存与统计', goal: '热点缓存 + 点击统计。', prep: ['跳转跑通'], knowledge: ['redis-1'], deliverables: [{ id: 'p21-d2', name: '统计说明', kind: '文档', prompt: '写统计', template: '# 统计\nPV/UV' }], tickets: [
        { id: 'p21-t3', title: '热点缓存', kind: '开发', priority: 'P1', context: 'Redis 缓存。', acceptance: ['命中'], xp: 20 },
        { id: 'p21-t4', title: '点击统计', kind: '开发', priority: 'P1', context: '异步计数。', acceptance: ['可查'], xp: 15 } ] } ] },
  { id: 'p22', title: 'IM 聊天 · WebSocket 长连接', company: '云聊科技（模拟）', role: '后端实习生', stack: ['Netty', 'Redis', 'MySQL'], summary: '登录、单聊、离线消息。', background: '需要一个最小可用 IM。', duration: '2 周', difficulty: 4, category: '后端', skills: ['dist', 'redis', 'java'],
    phases: [
      { id: 'p22-ph1', name: '阶段一 · 长连接与登录', goal: '连接管理 + 登录态。', prep: ['装 JDK'], knowledge: ['java-0', 'dist-0'], deliverables: [{ id: 'p22-d1', name: '协议设计', kind: '文档', prompt: '写消息格式', template: '# 协议\njson{type,from,to,msg}' }], tickets: [
        { id: 'p22-t1', title: '连接管理', kind: '开发', priority: 'P0', context: '在线映射。', acceptance: ['在线可见'], xp: 35 },
        { id: 'p22-t2', title: '消息收发', kind: '开发', priority: 'P0', context: '点对点。', acceptance: ['可达'], xp: 35 } ] },
      { id: 'p22-ph2', name: '阶段二 · 离线与可靠性', goal: '离线消息补拉、ACK。', prep: ['收发跑通'], knowledge: ['dist-1'], deliverables: [{ id: 'p22-d2', name: '可靠性说明', kind: '文档', prompt: '写 ACK', template: '# ACK\n未读列表' }], tickets: [
        { id: 'p22-t3', title: '离线消息', kind: '开发', priority: 'P1', context: '上线补拉。', acceptance: ['不丢'], xp: 25 },
        { id: 'p22-t4', title: '消息已读', kind: '开发', priority: 'P2', context: '已读回执。', acceptance: ['可见'], xp: 15 } ] } ] },
  { id: 'p23', title: 'BFF 网关 · 前端聚合层', company: '聚云科技（模拟）', role: 'BFF 实习生', stack: ['Node', 'GraphQL', 'Redis'], summary: '聚合多个下游接口，减少前端请求数。', background: '页面要调十几个接口。', duration: '1.5 周', difficulty: 3, category: '后端', skills: ['node', 'redis', 'dist'],
    phases: [
      { id: 'p23-ph1', name: '阶段一 · 接口聚合', goal: '一个接口拼首页数据。', prep: ['装 Node'], knowledge: ['go-0', 'sql-0'], deliverables: [{ id: 'p23-d1', name: '聚合说明', kind: '文档', prompt: '写聚合', template: '# 聚合\n首页=用户+订单+推荐' }], tickets: [
        { id: 'p23-t1', title: '并发调用下游', kind: '开发', priority: 'P0', context: 'Promise.all。', acceptance: ['快'], xp: 30 },
        { id: 'p23-t2', title: '统一错误', kind: '开发', priority: 'P1', context: '下游失败兜底。', acceptance: ['不白屏'], xp: 20 } ] } ] },
  { id: 'p24', title: 'React 后台管理 · 权限菜单', company: '灵后台（模拟）', role: '前端实习生', stack: ['React', '路由', '权限'], summary: '登录后按角色渲染菜单与路由。', background: '管理后台要做权限。', duration: '1.5 周', difficulty: 3, category: '前端', skills: ['react', 'web', 'review'],
    phases: [
      { id: 'p24-ph1', name: '阶段一 · 布局与路由', goal: '侧边菜单 + 主区域。', prep: ['装 Node'], knowledge: ['react-0', 'react-1'], deliverables: [{ id: 'p24-d1', name: '路由表', kind: '文档', prompt: '列路由', template: '# 路由\n/dashboard /user' }], tickets: [
        { id: 'p24-t1', title: '布局组件', kind: '开发', priority: 'P0', context: '可折叠菜单。', acceptance: ['可用'], xp: 25 },
        { id: 'p24-t2', title: '路由守卫', kind: '开发', priority: 'P0', context: '未登录跳登录。', acceptance: ['拦截'], xp: 25 } ] },
      { id: 'p24-ph2', name: '阶段二 · 权限控制', goal: '按钮级权限。', prep: ['路由跑通'], knowledge: ['review-1'], deliverables: [{ id: 'p24-d2', name: '权限说明', kind: '文档', prompt: '写角色', template: '# 角色\nadmin/editor' }], tickets: [
        { id: 'p24-t3', title: '按钮权限', kind: '开发', priority: 'P1', context: '无权限隐藏。', acceptance: ['生效'], xp: 20 } ] } ] },
  { id: 'p25', title: '移动端 H5 · 活动落地页', company: '闪促科技（模拟）', role: '前端实习生', stack: ['H5', 'CSS 动画', '性能'], summary: '营销活动页：动效、加载快、可分享。', background: '大促要 H5 落地页。', duration: '1 周', difficulty: 2, category: '前端', skills: ['web', 'react'],
    phases: [
      { id: 'p25-ph1', name: '阶段一 · 首屏与动效', goal: '首屏快，入场动画。', prep: ['设计稿'], knowledge: ['web-0', 'web-2'], deliverables: [{ id: 'p25-d1', name: '动效说明', kind: '文档', prompt: '写动画', template: '# 动效\n渐入/视差' }], tickets: [
        { id: 'p25-t1', title: '首屏骨架', kind: '开发', priority: 'P0', context: '语义化。', acceptance: ['快'], xp: 20 },
        { id: 'p25-t2', title: '入场动效', kind: '开发', priority: 'P1', context: 'CSS animation。', acceptance: ['流畅'], xp: 20 } ] } ] },
  { id: 'p26', title: 'Node SSR · 首屏直出', company: '速览科技（模拟）', role: '前端实习生', stack: ['React', 'Node', 'SSR'], summary: '把 React 页面做成服务端直出，SEO 更好。', background: '商品页要被搜索引擎收录。', duration: '1.5 周', difficulty: 4, category: '前端', skills: ['react', 'node', 'web'],
    phases: [
      { id: 'p26-ph1', name: '阶段一 · 服务端渲染', goal: 'renderToString + 水合。', prep: ['装 Node'], knowledge: ['react-1'], deliverables: [{ id: 'p26-d1', name: '渲染流程', kind: '文档', prompt: '写流程', template: '# SSR\n服务端->HTML->水合' }], tickets: [
        { id: 'p26-t1', title: '服务端渲染', kind: '开发', priority: 'P0', context: '输出首屏 HTML。', acceptance: ['有内容'], xp: 35 },
        { id: 'p26-t2', title: '数据预取', kind: '开发', priority: 'P1', context: '服务端取数。', acceptance: ['不闪空'], xp: 25 } ] } ] },
  { id: 'p27', title: '可视化编辑器 · 拖拽画布', company: '画布科技（模拟）', role: '前端实习生', stack: ['React', '拖拽', 'SVG'], summary: '拖组件上画布、改属性、导出 JSON。', background: '运营要低门槛搭页。', duration: '2 周', difficulty: 4, category: '前端', skills: ['react', 'web', 'review'],
    phases: [
      { id: 'p27-ph1', name: '阶段一 · 画布与拖拽', goal: '左侧组件拖到画布。', prep: ['装 Node'], knowledge: ['react-1'], deliverables: [{ id: 'p27-d1', name: '数据结构', kind: '文档', prompt: '写 schema', template: '# schema\n{id,type,x,y,props}' }], tickets: [
        { id: 'p27-t1', title: '拖拽落位', kind: '开发', priority: 'P0', context: '生成节点。', acceptance: ['可拖入'], xp: 35 },
        { id: 'p27-t2', title: '选中属性', kind: '开发', priority: 'P1', context: '右侧改样式。', acceptance: ['可改'], xp: 25 } ] },
      { id: 'p27-ph2', name: '阶段二 · 导出与撤销', goal: '导出 JSON，支持 undo。', prep: ['画布可用'], knowledge: ['review-1'], deliverables: [{ id: 'p27-d2', name: '导出说明', kind: '文档', prompt: '写导出', template: '# 导出\nJSON schema' }], tickets: [
        { id: 'p27-t3', title: '导出 JSON', kind: '开发', priority: 'P1', context: '一键复制。', acceptance: ['可导出'], xp: 20 },
        { id: 'p27-t4', title: '撤销重做', kind: '开发', priority: 'P2', context: '历史栈。', acceptance: ['可回退'], xp: 20 } ] } ] },
  { id: 'p28', title: 'AB 实验平台 · 分流与分析', company: '实验科技（模拟）', role: '数据分析师', stack: ['Python', 'SQL', '统计'], summary: '把流量分桶，算指标差异显著性。', background: '改版要先做 A/B。', duration: '1.5 周', difficulty: 4, category: '数据', skills: ['sql', 'ds', 'python'],
    phases: [
      { id: 'p28-ph1', name: '阶段一 · 分流设计', goal: '按用户稳定分桶。', prep: ['样例数据'], knowledge: ['sql-1', 'ds-1'], deliverables: [{ id: 'p28-d1', name: '分流规则', kind: '文档', prompt: '写分桶', template: '# 分桶\nhash(uid)%100' }], tickets: [
        { id: 'p28-t1', title: '分桶 SQL', kind: '开发', priority: 'P0', context: '稳定分组。', acceptance: ['均衡'], xp: 30 },
        { id: 'p28-t2', title: '指标取数', kind: '开发', priority: 'P0', context: '两组转化率。', acceptance: ['数对'], xp: 25 } ] },
      { id: 'p28-ph2', name: '阶段二 · 显著性判断', goal: '算 p 值给结论。', prep: ['数据就绪'], knowledge: ['ds-2', 'ds-3'], deliverables: [{ id: 'p28-d2', name: '实验报告', kind: '文档', prompt: '写结论', template: '# 结论\n显著/不显著' }], tickets: [
        { id: 'p28-t3', title: '显著性检验', kind: '开发', priority: 'P1', context: '双比例检验。', acceptance: ['有 p 值'], xp: 25 } ] } ] },
  { id: 'p29', title: '用户画像 · 标签体系', company: '画像科技（模拟）', role: '数据开发实习生', stack: ['SQL', 'Python', '特征'], summary: '给用户打性别/活跃/偏好标签。', background: '运营需要圈人。', duration: '2 周', difficulty: 3, category: '数据', skills: ['sql', 'ds', 'python'],
    phases: [
      { id: 'p29-ph1', name: '阶段一 · 标签设计', goal: '设计标签字典。', prep: ['用户表'], knowledge: ['ds-0', 'sql-1'], deliverables: [{ id: 'p29-d1', name: '标签字典', kind: '文档', prompt: '列标签', template: '# 标签\n活跃/沉默/高价值' }], tickets: [
        { id: 'p29-t1', title: '活跃标签', kind: '开发', priority: 'P0', context: '近7天登录。', acceptance: ['可打'], xp: 25 },
        { id: 'p29-t2', title: '消费标签', kind: '开发', priority: 'P1', context: '累计金额分档。', acceptance: ['可圈'], xp: 25 } ] } ] },
  { id: 'p30', title: '实时数仓 · 秒级监控', company: '秒数科技（模拟）', role: '数据开发实习生', stack: ['Flink 风格', 'Kafka 风格', 'SQL'], summary: '流处理算实时大盘指标。', background: 'T+1 报表太晚。', duration: '2 周', difficulty: 5, category: '数据', skills: ['sql', 'ds', 'dist'],
    phases: [
      { id: 'p30-ph1', name: '阶段一 · 流接入', goal: '消费日志流。', prep: ['样例流'], knowledge: ['ds-1', 'dist-0'], deliverables: [{ id: 'p30-d1', name: '拓扑说明', kind: '文档', prompt: '写拓扑', template: '# 拓扑\nsource->window->sink' }], tickets: [
        { id: 'p30-t1', title: '窗口聚合', kind: '开发', priority: 'P0', context: '1 分钟窗口。', acceptance: ['实时'], xp: 40 },
        { id: 'p30-t2', title: '落大盘', kind: '开发', priority: 'P1', context: '写结果表。', acceptance: ['可见'], xp: 25 } ] } ] },
  { id: 'p31', title: '特征平台 · 样本拼接', company: '智算科技（模拟）', role: '算法实习生', stack: ['SQL', 'Python', '特征'], summary: '把行为表拼成训练样本宽表。', background: '建模前要做样本。', duration: '1.5 周', difficulty: 4, category: '数据', skills: ['sql', 'ml', 'python'],
    phases: [
      { id: 'p31-ph1', name: '阶段一 · 宽表生成', goal: '一个用户一行特征。', prep: ['多张行为表'], knowledge: ['sql-1', 'ml-0'], deliverables: [{ id: 'p31-d1', name: '特征清单', kind: '文档', prompt: '列特征', template: '# 特征\n近7天点击数等' }], tickets: [
        { id: 'p31-t1', title: '特征聚合 SQL', kind: '开发', priority: 'P0', context: '按用户聚合。', acceptance: ['宽表完整'], xp: 35 },
        { id: 'p31-t2', title: '缺失处理', kind: '开发', priority: 'P1', context: '缺失值填充。', acceptance: ['可入模'], xp: 20 } ] } ] },
  { id: 'p32', title: 'LLM 评测 · 自动打分', company: '评智科技（模拟）', role: 'AI 应用实习生', stack: ['Python', '大模型 API', '评测'], summary: '搭一个小评测集自动跑分。', background: '每次改 prompt 都要人看。', duration: '1 周', difficulty: 3, category: 'AI', skills: ['llm', 'python', 'fastapi'],
    phases: [
      { id: 'p32-ph1', name: '阶段一 · 评测集与跑批', goal: '跑题、打分、出报告。', prep: ['装 Python'], knowledge: ['llm-0', 'llm-2'], deliverables: [{ id: 'p32-d1', name: '评测报告', kind: '文档', prompt: '写对比', template: '# 对比\nA/B 两版得分' }], tickets: [
        { id: 'p32-t1', title: '跑批脚本', kind: '开发', priority: 'P0', context: '批量调用。', acceptance: ['可跑'], xp: 30 },
        { id: 'p32-t2', title: '自动打分', kind: '开发', priority: 'P1', context: 'LLM-as-judge。', acceptance: ['有分数'], xp: 25 } ] } ] },
  { id: 'p33', title: 'Agent · 工具调用助手', company: '智工科技（模拟）', role: 'AI 应用实习生', stack: ['Python', 'Function Calling', '检索'], summary: '让模型决定何时查库、何时算数。', background: '问答要会调工具。', duration: '2 周', difficulty: 5, category: 'AI', skills: ['llm', 'fastapi', 'python'],
    phases: [
      { id: 'p33-ph1', name: '阶段一 · 工具定义与循环', goal: '模型选工具→执行→再答。', prep: ['装 Python'], knowledge: ['llm-2', 'fastapi-0'], deliverables: [{ id: 'p33-d1', name: '工具清单', kind: '文档', prompt: '列工具', template: '# 工具\nsearch/calc' }], tickets: [
        { id: 'p33-t1', title: '注册工具', kind: '开发', priority: 'P0', context: 'schema 描述。', acceptance: ['可调用'], xp: 35 },
        { id: 'p33-t2', title: 'ReAct 循环', kind: '开发', priority: 'P0', context: '最多 5 步。', acceptance: ['能闭环'], xp: 40 } ] },
      { id: 'p33-ph2', name: '阶段二 · 失败兜底', goal: '工具失败优雅回退。', prep: ['循环跑通'], knowledge: ['llm-2'], deliverables: [{ id: 'p33-d2', name: '失败用例', kind: '文档', prompt: '列失败', template: '# 失败\n超时/无结果' }], tickets: [
        { id: 'p33-t3', title: '超时重试', kind: '开发', priority: 'P1', context: '重试 1 次。', acceptance: ['稳定'], xp: 20 } ] } ] },
  { id: 'p34', title: '多模态 · 图文理解', company: '视言科技（模拟）', role: '算法实习生', stack: ['Python', '多模态模型', 'API'], summary: '上传图+问，输出结构化描述。', background: '要自动给商品图打标。', duration: '1.5 周', difficulty: 4, category: 'AI', skills: ['llm', 'dl', 'python'],
    phases: [
      { id: 'p34-ph1', name: '阶段一 · 识别与结构化', goal: '图→JSON 标签。', prep: ['样例图'], knowledge: ['llm-2', 'dl-0'], deliverables: [{ id: 'p34-d1', name: 'Schema', kind: '文档', prompt: '定字段', template: '# Schema\n{颜色,品类,场景}' }], tickets: [
        { id: 'p34-t1', title: '图转描述', kind: '开发', priority: 'P0', context: '调用多模态。', acceptance: ['有描述'], xp: 30 },
        { id: 'p34-t2', title: '结构化输出', kind: '开发', priority: 'P1', context: '强制 JSON。', acceptance: ['可解析'], xp: 25 } ] } ] },
  { id: 'p35', title: '大模型微调 · LoRA', company: '微调科技（模拟）', role: '算法实习生', stack: ['Python', 'LoRA', '数据集'], summary: '把小模型按客服语料微调。', background: '通用模型不懂自家客服。', duration: '2 周', difficulty: 5, category: 'AI', skills: ['dl', 'llm', 'python'],
    phases: [
      { id: 'p35-ph1', name: '阶段一 · 数据准备', goal: '整理指令对。', prep: ['客服历史'], knowledge: ['dl-0', 'llm-0'], deliverables: [{ id: 'p35-d1', name: '数据样例', kind: '文档', prompt: '列样本', template: '# 样本\ninstruction/input/output' }], tickets: [
        { id: 'p35-t1', title: '清洗数据', kind: '开发', priority: 'P0', context: '去重去敏。', acceptance: ['干净'], xp: 30 },
        { id: 'p35-t2', title: '跑微调', kind: '开发', priority: 'P0', context: 'LoRA 训练。', acceptance: ['出权重'], xp: 40 } ] } ] },
  { id: 'p36', title: '向量检索 · 语义搜索', company: '搜云科技（模拟）', role: 'AI 应用实习生', stack: ['Python', 'Embedding', '向量库'], summary: '把文档转向量，按语义找相似。', background: '关键词搜索不够准。', duration: '1.5 周', difficulty: 3, category: 'AI', skills: ['llm', 'vector', 'python'],
    phases: [
      { id: 'p36-ph1', name: '阶段一 · 索引与召回', goal: '问句→TopK 相似段。', prep: ['文档集'], knowledge: ['llm-1', 'vector-0'], deliverables: [{ id: 'p36-d1', name: '索引说明', kind: '文档', prompt: '写索引', template: '# 索引\nembedding 入库' }], tickets: [
        { id: 'p36-t1', title: '建向量索引', kind: '开发', priority: 'P0', context: '批量 embedding。', acceptance: ['可查'], xp: 30 },
        { id: 'p36-t2', title: '语义召回', kind: '开发', priority: 'P0', context: '余弦相似。', acceptance: ['相关'], xp: 25 } ] } ] },
  { id: 'p37', title: '低代码表单 · 配置即页面', company: '表单科技（模拟）', role: '全栈实习生', stack: ['React', 'Node', 'JSON Schema'], summary: '用 JSON 配置生成表单并收数据。', background: '每个活动都要表单。', duration: '2 周', difficulty: 4, category: '全栈', skills: ['react', 'fastapi', 'sql'],
    phases: [
      { id: 'p37-ph1', name: '阶段一 · Schema 渲染', goal: 'JSON→表单组件。', prep: ['装 Node/Python'], knowledge: ['react-1', 'fastapi-0'], deliverables: [{ id: 'p37-d1', name: 'Schema 规范', kind: '文档', prompt: '写字段', template: '# Schema\n{type,label,required}' }], tickets: [
        { id: 'p37-t1', title: '渲染引擎', kind: '开发', priority: 'P0', context: '支持输入/下拉。', acceptance: ['可渲染'], xp: 35 },
        { id: 'p37-t2', title: '校验提交', kind: '开发', priority: 'P0', context: '前端+后端校验。', acceptance: ['可提交'], xp: 25 } ] } ] },
  { id: 'p38', title: 'ERP 小系统 · 进销存', company: '企业云（模拟）', role: '全栈实习生', stack: ['React', 'Node', 'MySQL'], summary: '商品入库、出库、库存预警。', background: '小作坊要管库存。', duration: '2.5 周', difficulty: 4, category: '全栈', skills: ['react', 'sql', 'fastapi'],
    phases: [
      { id: 'p38-ph1', name: '阶段一 · 入库出库', goal: '单据驱动库存。', prep: ['装 Node/Python'], knowledge: ['sql-0', 'sql-2'], deliverables: [{ id: 'p38-d1', name: '表结构', kind: '文档', prompt: '写表', template: '# 表\ngoods/stock/bill' }], tickets: [
        { id: 'p38-t1', title: '商品与库存表', kind: '开发', priority: 'P0', context: '建表。', acceptance: ['可建'], xp: 25 },
        { id: 'p38-t2', title: '出入库单', kind: '开发', priority: 'P0', context: '单据改库存。', acceptance: ['库存准'], xp: 35 } ] },
      { id: 'p38-ph2', name: '阶段二 · 报表与预警', goal: '库存报表、低库存提醒。', prep: ['单据跑通'], knowledge: ['ds-1'], deliverables: [{ id: 'p38-d2', name: '报表说明', kind: '文档', prompt: '写报表', template: '# 报表\n库存/流水' }], tickets: [
        { id: 'p38-t3', title: '库存报表', kind: '开发', priority: 'P1', context: '按商品汇总。', acceptance: ['可查'], xp: 20 },
        { id: 'p38-t4', title: '低库存提醒', kind: '开发', priority: 'P2', context: '阈值提示。', acceptance: ['可提醒'], xp: 15 } ] } ] },
  { id: 'p39', title: '客服工单 · 流转系统', company: '服云科技（模拟）', role: '全栈实习生', stack: ['React', 'FastAPI', 'MySQL'], summary: '工单建单、指派、流转、关闭。', background: '客服问题要留痕。', duration: '2 周', difficulty: 3, category: '全栈', skills: ['react', 'fastapi', 'sql'],
    phases: [
      { id: 'p39-ph1', name: '阶段一 · 工单生命周期', goal: '建单到关闭全流程。', prep: ['装 Node/Python'], knowledge: ['fastapi-0', 'sql-0'], deliverables: [{ id: 'p39-d1', name: '状态机', kind: '文档', prompt: '写状态', template: '# 状态\n待处理->处理中->已关' }], tickets: [
        { id: 'p39-t1', title: '建单接口', kind: '开发', priority: 'P0', context: '提交工单。', acceptance: ['可建'], xp: 25 },
        { id: 'p39-t2', title: '指派流转', kind: '开发', priority: 'P0', context: '改处理人。', acceptance: ['可流转'], xp: 25 } ] } ] },
  { id: 'p40', title: '在线协作文档 · 富文本', company: '协作文档（模拟）', role: '全栈实习生', stack: ['React', 'Node', 'CRDT 风格'], summary: '多人实时编辑富文本。', background: '做个简化版 Notion。', duration: '3 周', difficulty: 5, category: '全栈', skills: ['react', 'node', 'dist'],
    phases: [
      { id: 'p40-ph1', name: '阶段一 · 富文本与保存', goal: '可编辑可自动存。', prep: ['装 Node'], knowledge: ['react-1'], deliverables: [{ id: 'p40-d1', name: '数据模型', kind: '文档', prompt: '写模型', template: '# 模型\ndoc{content}' }], tickets: [
        { id: 'p40-t1', title: '富文本编辑器', kind: '开发', priority: 'P0', context: '加粗列表。', acceptance: ['可编辑'], xp: 35 },
        { id: 'p40-t2', title: '自动保存', kind: '开发', priority: 'P1', context: '防抖落库。', acceptance: ['不丢'], xp: 25 } ] },
      { id: 'p40-ph2', name: '阶段二 · 多人光标', goal: '看到对方光标。', prep: ['单人可存'], knowledge: ['dist-1'], deliverables: [{ id: 'p40-d2', name: '同步说明', kind: '文档', prompt: '写同步', template: '# 同步\n广播 delta' }], tickets: [
        { id: 'p40-t3', title: '光标同步', kind: '开发', priority: 'P1', context: 'WebRTC/WebSocket。', acceptance: ['可见'], xp: 35 } ] } ] },
  { id: 'p41', title: '成本治理 · 资源盘点', company: '云效科技（模拟）', role: '工程效能实习生', stack: ['Shell', 'Python', '报表'], summary: '盘点云上资源，出浪费清单。', background: '账单太高。', duration: '1 周', difficulty: 2, category: '工程效能', skills: ['linux', 'python', 'ds'],
    phases: [
      { id: 'p41-ph1', name: '阶段一 · 资源采集', goal: '列出闲置实例。', prep: ['样例清单'], knowledge: ['linux-1', 'ds-1'], deliverables: [{ id: 'p41-d1', name: '盘点表', kind: '文档', prompt: '列闲置', template: '# 闲置\n7天无流量' }], tickets: [
        { id: 'p41-t1', title: '采集脚本', kind: '开发', priority: 'P0', context: '扫描实例。', acceptance: ['有清单'], xp: 25 },
        { id: 'p41-t2', title: '出报表', kind: '开发', priority: 'P1', context: '按团队汇总。', acceptance: ['可读'], xp: 15 } ] } ] },
  { id: 'p42', title: '日志平台 · 采集与检索', company: '日志云（模拟）', role: '工程效能实习生', stack: ['Filebeat 风格', '检索', '可视化'], summary: '服务日志集中收集，可按关键字查。', background: '线上排障要登机器。', duration: '1.5 周', difficulty: 3, category: '工程效能', skills: ['linux', 'deploy', 'docs'],
    phases: [
      { id: 'p42-ph1', name: '阶段一 · 日志接入', goal: '文件日志→平台。', prep: ['样例服务'], knowledge: ['linux-1', 'deploy-2'], deliverables: [{ id: 'p42-d1', name: '接入清单', kind: '文档', prompt: '写接入', template: '# 接入\n/var/log/app' }], tickets: [
        { id: 'p42-t1', title: '采集配置', kind: '开发', priority: 'P0', context: 'tail 日志。', acceptance: ['可见'], xp: 30 },
        { id: 'p42-t2', title: '关键字检索', kind: '开发', priority: 'P1', context: '按 traceId 查。', acceptance: ['可查'], xp: 20 } ] } ] },
  { id: 'p43', title: '灰度发布 · 流量切分', company: '发布云（模拟）', role: '工程效能实习生', stack: ['Nginx 风格', '路由', '监控'], summary: '10% 流量到新版本，异常秒回滚。', background: '全量发布风险大。', duration: '1.5 周', difficulty: 4, category: '工程效能', skills: ['deploy', 'dist', 'linux'],
    phases: [
      { id: 'p43-ph1', name: '阶段一 · 灰度规则', goal: '按用户尾号分流。', prep: ['两版本'], knowledge: ['deploy-1', 'dist-0'], deliverables: [{ id: 'p43-d1', name: '灰度规则', kind: '文档', prompt: '写规则', template: '# 灰度\n尾号<10 走新版' }], tickets: [
        { id: 'p43-t1', title: '分流配置', kind: '开发', priority: 'P0', context: '按规则转发。', acceptance: ['准确'], xp: 30 },
        { id: 'p43-t2', title: '一键回滚', kind: '开发', priority: 'P1', context: '切回老版本。', acceptance: ['秒回'], xp: 25 } ] } ] },
  { id: 'p44', title: '代码质量 · 静态扫描接入', company: '质效云（模拟）', role: '工程效能实习生', stack: ['ESLint 风格', 'CI', '报告'], summary: '提交即扫代码坏味道，卡合并。', background: '老代码无人管。', duration: '1 周', difficulty: 2, category: '工程效能', skills: ['git', 'review', 'deploy'],
    phases: [
      { id: 'p44-ph1', name: '阶段一 · 规则与门禁', goal: '关键问题不允许合。', prep: ['仓库有代码'], knowledge: ['review-1', 'git-1'], deliverables: [{ id: 'p44-d1', name: '规则清单', kind: '文档', prompt: '列规则', template: '# 规则\n未用变量/复杂度' }], tickets: [
        { id: 'p44-t1', title: '接扫描', kind: '开发', priority: 'P0', context: '跑全量。', acceptance: ['出报告'], xp: 25 },
        { id: 'p44-t2', title: 'MR 门禁', kind: '开发', priority: 'P1', context: '高危拦截。', acceptance: ['可拦'], xp: 20 } ] } ] },
  { id: 'p45', title: '综合 · 校园开放平台 · 全栈毕业战', company: '校云科技（模拟）', role: '全栈主力', stack: ['React', 'Node', 'MySQL', 'AI'], summary: '把技能串起来：用户中心+内容+推荐+AI 问答。', background: '毕业大作业：一个完整可用的小平台。', duration: '3 周', difficulty: 5, category: '综合', skills: ['react', 'node', 'sql', 'llm'],
    phases: [
      { id: 'p45-ph1', name: '阶段一 · 用户与内容', goal: '注册登录 + 发帖。', prep: ['装全套'], knowledge: ['fastapi-0', 'react-0'], deliverables: [{ id: 'p45-d1', name: '架构设计', kind: '文档', prompt: '画架构', template: '# 架构\n前端->BFF->DB' }], tickets: [
        { id: 'p45-t1', title: '用户体系', kind: '开发', priority: 'P0', context: '注册登录。', acceptance: ['可登录'], xp: 35 },
        { id: 'p45-t2', title: '发帖列表', kind: '开发', priority: 'P0', context: 'CRUD。', acceptance: ['可用'], xp: 30 } ] },
      { id: 'p45-ph2', name: '阶段二 · 推荐与 AI', goal: '首页推荐 + 问答助手。', prep: ['内容跑通'], knowledge: ['llm-2', 'ml-0'], deliverables: [{ id: 'p45-d2', name: '答辩 PPT 大纲', kind: 'PPT 大纲', prompt: '写答辩', template: '# 答辩\n架构/亮点/演示' }], tickets: [
        { id: 'p45-t3', title: '简单推荐', kind: '开发', priority: 'P1', context: '热门+时间。', acceptance: ['有内容'], xp: 25 },
        { id: 'p45-t4', title: 'AI 问答', kind: '开发', priority: 'P1', context: '接 RAG。', acceptance: ['可问答'], xp: 30 },
        { id: 'p45-t5', title: '写 README', kind: '文档', priority: 'P2', context: '部署说明。', acceptance: ['完整'], xp: 10 } ] } ] },
  { id: 'p46', title: '综合 · 黑客松 48 小时 · 从想法到 Demo', company: '极客松（模拟）', role: '参赛选手', stack: ['任意栈', '快速原型', '展示'], summary: '限时选题、组队、出 Demo 路演。', background: '模拟黑客松：从 0 到可演示。', duration: '48 小时', difficulty: 3, category: '综合', skills: ['web', 'review', 'docs'],
    phases: [
      { id: 'p46-ph1', name: '阶段一 · 选题与原型', goal: '确定问题 + 画原型。', prep: ['白板'], knowledge: ['web-0', 'docs-0'], deliverables: [{ id: 'p46-d1', name: 'Onepager', kind: '文档', prompt: '写一页纸', template: '# Onepager\n痛点/方案/亮点' }], tickets: [
        { id: 'p46-t1', title: '选题与用户', kind: '需求', priority: 'P0', context: '一句话讲清。', acceptance: ['清晰'], xp: 20 },
        { id: 'p46-t2', title: '可点原型', kind: '开发', priority: 'P0', context: '主流程走通。', acceptance: ['可演示'], xp: 30 } ] },
      { id: 'p46-ph2', name: '阶段二 · Demo 与路演', goal: '录演示 + 3 分钟 pitch。', prep: ['原型可用'], knowledge: ['review-1'], deliverables: [{ id: 'p46-d2', name: '路演稿', kind: 'PPT 大纲', prompt: '写 pitch', template: '# pitch\n问题/方案/演示/愿景' }], tickets: [
        { id: 'p46-t3', title: '录 Demo', kind: '开发', priority: 'P1', context: '3 分钟。', acceptance: ['有视频'], xp: 15 },
        { id: 'p46-t4', title: '写路演稿', kind: '文档', priority: 'P1', context: '讲亮点。', acceptance: ['流畅'], xp: 10 } ] } ] },
  { id: 'p47', title: '综合 · 技术调研 · 选型报告', company: '选型云（模拟）', role: '技术分析师', stack: ['调研', '对比', '写作'], summary: '给一个技术问题，调研后给选型建议。', background: '团队要选前端框架。', duration: '1 周', difficulty: 2, category: '综合', skills: ['docs', 'review', 'web'],
    phases: [
      { id: 'p47-ph1', name: '阶段一 · 调研与对比', goal: '列 3 个候选做对比表。', prep: ['问题定义'], knowledge: ['docs-0', 'review-1'], deliverables: [{ id: 'p47-d1', name: '选型报告', kind: '文档', prompt: '写报告', template: '# 报告\n候选/维度/结论' }], tickets: [
        { id: 'p47-t1', title: '列候选与维度', kind: '文档', priority: 'P0', context: '社区/性能/成本。', acceptance: ['完整'], xp: 20 },
        { id: 'p47-t2', title: '出结论', kind: '文档', priority: 'P1', context: '给推荐。', acceptance: ['有理有据'], xp: 15 } ] } ] },
  { id: 'p48', title: '综合 · 面试备战 · 项目复盘', company: '职场猫（模拟）', role: '求职者', stack: ['复盘', '表达', '简历'], summary: '把做过的项目讲成 STAR 故事。', background: '面试常被问项目。', duration: '3 天', difficulty: 1, category: '综合', skills: ['docs', 'review'],
    phases: [
      { id: 'p48-ph1', name: '阶段一 · STAR 梳理', goal: '每个项目写 3 句话。', prep: ['有项目经历'], knowledge: ['docs-0'], deliverables: [{ id: 'p48-d1', name: '项目故事稿', kind: '文档', prompt: '写 STAR', template: '# STAR\n情境/任务/行动/结果' }], tickets: [
        { id: 'p48-t1', title: '写 STAR', kind: '文档', priority: 'P0', context: '量化结果。', acceptance: ['具体'], xp: 15 },
        { id: 'p48-t2', title: '预想追问', kind: '文档', priority: 'P1', context: '技术追问。', acceptance: ['有答案'], xp: 10 } ] } ] },
  { id: 'p49', title: '综合 · 开源贡献 · 提首个 PR', company: '开源社区（模拟）', role: '开源贡献者', stack: ['Git', '文档', '小修'], summary: '给开源项目修 typo 或补文档。', background: '第一次参与开源。', duration: '1 周', difficulty: 2, category: '综合', skills: ['git', 'docs', 'review'],
    phases: [
      { id: 'p49-ph1', name: '阶段一 · 找 issue 与提 PR', goal: '修文档/小 bug。', prep: ['GitHub 账号'], knowledge: ['git-0', 'git-1'], deliverables: [{ id: 'p49-d1', name: 'PR 说明', kind: '文档', prompt: '写改动', template: '# PR\n改了什么/为什么' }], tickets: [
        { id: 'p49-t1', title: 'fork 与分支', kind: '开发', priority: 'P0', context: '建 feature 分支。', acceptance: ['规范'], xp: 15 },
        { id: 'p49-t2', title: '提 PR', kind: '开发', priority: 'P0', context: '写清改动。', acceptance: ['发出'], xp: 15 } ] } ] },
  { id: 'p50', title: '综合 · 技术分享 · 内部分享', company: '职场猫（模拟）', role: '分享人', stack: ['PPT', '演示', '表达'], summary: '把学过的东西讲给同学听。', background: '输出倒逼输入。', duration: '3 天', difficulty: 1, category: '综合', skills: ['docs', 'review'],
    phases: [
      { id: 'p50-ph1', name: '阶段一 · 选题与讲稿', goal: '15 分钟讲清一个技术点。', prep: ['选题'], knowledge: ['docs-0', 'review-1'], deliverables: [{ id: 'p50-d1', name: '分享 PPT 大纲', kind: 'PPT 大纲', prompt: '写大纲', template: '# 大纲\n问题/原理/例子/总结' }], tickets: [
        { id: 'p50-t1', title: '写大纲', kind: '文档', priority: 'P0', context: '分层递进。', acceptance: ['清晰'], xp: 10 },
        { id: 'p50-t2', title: '录试讲', kind: '复盘', priority: 'P1', context: '计时一遍。', acceptance: ['不超时'], xp: 10 } ] } ] },
];

export const PROJECT_BY_ID: Record<string, IProject> = Object.fromEntries(
  SIM_PROJECTS.map((p) => [p.id, p])
);

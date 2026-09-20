# 实战工场（CareerLab）项目文档

> 一个面向 0 基础大学生的「就业实战训练平台」：把企业岗位技能、模拟项目、模拟竞赛、段位成长、简历包装做成一个一体化产品。
> 本文档既是产品说明书，也是后续迭代（后端 / AI 智能体 / 上线）的路线图，可直接作为简历项目素材。

---

## 一、项目一句话介绍

**实战工场** 是一个「游戏化就业训练平台」：0 基础同学进来后，像打怪升级一样，从宝宝级原子讲解学起，逐步完成模拟企业项目与模拟竞赛，自动累积经验、解锁猫境段位，最终把训练成果沉淀成可导出的简历。

**目标用户**：计算机 / 大数据 / 软件等相关专业低年级、想找实习但没项目经历的学生。

**差异化**：
- 不讲书本知识，只讲「企业真在用」的技能与实战；
- 每个知识点都有「宝宝级原子深讲」（从 1 是什么、+ 是什么，到怎么组合用）；
- 项目 / 竞赛按真实前沿方向做了 50 + 30 个模拟题，难度与段位绑定，由浅入深；
- 内置「喵喵向导」像游戏 NPC 一样全程带路，0 基础也知道下一步干什么。

---

## 二、当前已实现功能（V1 纯前端版）

### 1. 技术栈
- 前端：React 19 + Vite + TypeScript + Tailwind CSS + shadcn/ui（Radix）
- 路由：react-router-dom v7
- 状态：React Context + useReducer，持久化用 localStorage（命名空间 `career-lab`）
- 可视化：ECharts / Recharts；动效：framer-motion / GSAP
- 代码规范：ESLint + TypeScript strict，提交前 `npx tsc` 与 `npx eslint` 双 0
- 部署形态：Vite dev server（本地 23456），可静态构建

### 2. 功能模块

| 模块 | 路由 | 说明 |
|---|---|---|
| 首页 | `/` | 成长概览、下一步推荐、段位横幅 |
| 技能图谱 | `/skills` | 按分类展示岗位热门技能，含 0 基础学习路径 |
| 宝宝级深讲 | 知识点弹窗 | 每个知识点都有正式定义 / 固定搭配 / 可变参数 / 递进示例 / 新手坑 / 实战配合 |
| 模拟项目 | `/projects` `/projects/:id` | **50 个**分方向、分难度的模拟企业项目，阶段化任务单 |
| 模拟竞赛 | `/arena` `/arena/:id` | **30 道**算法 / 数据 / AI 应用 / 系统设计题 |
| 真实竞赛雷达 | `/contests` | 汇总公开可报名的学科竞赛 / 黑客松（JSON 数据源） |
| 段位与称号 | 全站 / `/portfolio` | 八境猫段位 + 10 个称号，按经验自动解锁，可切换 |
| 作品集 / 履历 | `/portfolio` | 成就、完成项目、导出简历素材 |
| 简历生成器 | `/resume` | 填基本信息 → 与训练成果合并 → 导出 HTML / 打印 PDF |
| 喵喵向导 | 右下角悬浮 | 双 Tab：下一步推荐 + 任务清单（聚所有未完成 ticket） |
| 侧栏 | 全站 | 昵称可改、段位称号常驻、XP 进度条 |

### 3. 项目方向覆盖（50 个）
- 后端：订单重构、高并发秒杀、短链接、IM、BFF、支付对账、微服务网关、登录鉴权
- 前端：数据大屏、组件库、权限后台、H5、Node SSR、可视化拖拽编辑器
- 数据：行为分析、报表自动化、AB 实验、用户画像、实时数仓、特征平台、离线数仓
- AI：RAG 助手、PyTorch 图像分类、LLM 评测、Agent 工具调用、多模态、LoRA 微调、向量检索
- 全栈：内容社区、校园二手、低代码表单、ERP、客服工单、协作文档
- 工程效能：CI/CD、自动化测试、监控告警、日志平台、灰度发布、成本治理、代码质量门禁
- 综合：校园全栈毕业战、黑客松 48h、技术选型调研、STAR 面试复盘、首个开源 PR、内部分享

### 4. 段位 / 成长机制
- 八境：踩奶 → 立耳 → 扑蝶 → 哈气 → 巡山 → 夜行 → 御座 → 耄耋
- 经验：学完一课 +10，标记掌握 +60，完成项目 +120，参赛 60+难度×20
- 难度锁：难度 d 的项目要求等级 `(d-1)*3+1`，形成自然梯度

---

## 三、当前边界（必须如实写进简历 / 对用户说明）

1. **纯前端**：所有数据（项目、竞赛、讲解）目前写在前端 TS 数据文件里，进度存浏览器 localStorage，**换浏览器不共享**。
2. **无真实 AI**：讲解内容是预写的，不是在线大模型实时生成。
3. **竞赛数据**：`public/data/competitions.json` 是静态快照，还没做定时爬取 / 实时更新。
4. **无后端、无登录、无多人**：单机版。

---

## 四、下一步路线图（V2 → V4）

### V2 · 后端化（简历含金量最大的一步）
目标：从「静态壳」变成「真全栈项目」。
- **后端**：FastAPI（Python）或 NestJS（Node），REST + 少量 WebSocket
- **数据库**：PostgreSQL（业务）+ Redis（会话 / 排行榜缓存）
- **账号体系**：邮箱 / GitHub OAuth 登录，JWT；进度真正落库，多端同步
- **数据迁移**：把现在 TS 里的 50 项目 / 30 竞赛 / 80+ 课程搬到 DB，提供 CRUD API
- **部署**：Docker Compose（前端 Nginx + 后端 + Postgres + Redis），上云（学生可用免费额度）
- **可写进简历的点**：
  - 设计并实现了 RBAC / 接口鉴权 / 限流
  - 用 Redis 做排行榜缓存与热点项目预加载
  - 写了 OpenAPI 文档与集成测试

### V3 · AI 智能体导师
目标：把「预写讲解」升级成「真 AI 陪练」。
- **RAG 导师**：把课程 / 项目文档切成向量库，用户卡住时自然语言问答，带来源引用
- **代码评审 Agent**：用户贴代码，Agent 按真实项目规范点评、给改进建议
- **Resume Agent**：根据做过的项目自动写 STAR 简历段落
- **实施要点**：接大模型 API，做 prompt 工程 + 评测集 + 拒答，防止幻觉
- **简历点**：RAG 全链路、Function Calling、prompt 评测、成本控制

### V4 · 实时化与社区
- **竞赛雷达真实化**：定时爬虫（Python requests + 定时任务）抓公开竞赛，去重入库，前端按时间倒序；做一个简单的管理后台审核
- **代码在线运行**：接 Judge0 或前端 WASM（Pyodide）做「宝宝级练习」真跑代码、看输出
- **排行榜 / 学习小组**：公开段位榜、好友 / 组队、打卡 streak
- **分享**：生成可分享的履历页链接

---

## 五、工程目录速览

```
career-lab/
├── src/
│   ├── app.tsx                  # 路由
│   ├── components/              # Layout / CoachWidget / RankCard / LessonDialog ...
│   ├── data/                    # 业务数据：projects(50) / arena(30) / lessons / ranks ...
│   ├── state/                   # ProgressProvider（XP/段位/昵称）
│   ├── pages/                   # 各页面
│   └── lib/store.ts             # localStorage 封装
├── public/
│   ├── mascot.jpg               # 喵喵向导形象
│   └── data/competitions.json  # 竞赛静态数据
└── package.json
```

---

## 六、可直接写进简历的版本（草稿）

> **实战工场 CareerLab —— 大学生就业实战训练平台（个人项目，全栈方向）**
> 技术栈：React 19 / TypeScript / Vite / Tailwind / shadcn-ui；规划中：FastAPI + PostgreSQL + Redis + LLM RAG。
> - 独立设计并实现游戏化学习平台：50 个模拟企业项目、30 道模拟竞赛、80+ 原子级知识点深讲、八境段位成长体系
> - 设计经验与难度解锁模型（难度 d 需等级 `(d-1)*3+1`），形成由浅入深的训练路径
> - 实现简历自动生成：训练成果（项目 / 竞赛 / 段位）与个人信息合并，导出 HTML / PDF
> - 工程化：TypeScript strict + ESLint 双零错误；localStorage 持久化；模块化数据驱动，易扩展到后端
> - 规划：接入 FastAPI 后端、Postgres + Redis 持久化、RAG AI 导师、竞赛实时爬虫

---

## 七、下一步立刻可以做的事（待办）

- [x] 跑一次 `npm run build` 确认生产包能出
- [x] **V2 后端起步**：已加 `server/main.py`（FastAPI + SQLite），接口：`/api/health`、`POST /api/auth/login`、`GET/PUT /api/progress`、`POST /api/ai/explain`（占位）
- [x] 前端代理：`vite.config.ts` 把 `/api` 代理到 `localhost:8000`；`src/lib/api.ts` 是前端 API 客户端
- [ ] 把当前 git 初始化并推 GitHub（开源即简历）——需要你给仓库地址
- [x] 在 ProgressProvider 里接入 `api.login/putProgress`，做真·多端进度同步：启动自动登录、首次拉取服务端进度（服务端为准）、后续变更 800ms 防抖自动 PUT
- [x] 接真实 LLM：接口骨架 `/api/ai/explain` 已就绪（stub 模式，配 Key 即可启用）
- [ ] 竞赛爬虫：先从 2 个公开源起步，定时入库

### 本地同时跑前后端
```
# 终端 1：后端（已在 8000 运行）
python -m uvicorn server.main:app --port 8000 --reload
# 终端 2：前端
npm run dev   # 23456，/api 自动代理到 8000
```

---

*文档版本：v1.0（对应当前纯前端版，50 项目 / 30 竞赛 / 八境段位）*

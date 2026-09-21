# 实战工场 CareerLab

> 面向 0 基础计算机/数据类专业学生的"就业训练模拟平台"：把企业真实开发流程、竞赛赛制、技术成长路径搬进网页，让新手在本地就能模拟项目实战和竞赛训练，攒出简历上能写的经历。

## 在线演示

**GitHub Pages 地址**：https://twy0820.github.io/career-lab/

## 一句话简历版

独立设计并实现一个 React 全栈训练平台，含 8 段位游戏化成长体系、双层门槛+智能推荐算法、宝宝级教学字典、GitHub Actions 每日抓竞赛+每周 LLM 自动生成模拟项目。

## 功能亮点

- **技能图谱**：Python / C++ / Java / Go / 算法 / SQL / 分布式 / 云原生 / LLM 等 20+ 方向，每条知识点内嵌"宝宝级"字典讲解（含义/语法/搭配/示例/常见错误/实战场景六维）
- **企业项目模拟**：50+ 个分阶段项目，每阶段有准备清单、前置知识、产出物、Jira 风格任务卡
- **竞赛练兵**：30+ 道算法/数据/AI/系统设计模拟赛题，按难度解锁
- **八境猫段位系统**：踩奶→立耳→扑蝶→哈气→巡山→夜行→御座→耄耋，XP 驱动升级
- **双层门槛+智能推荐**：段位（可报名）+ 知识前置（做得动）双门槛，四档分级（极力推荐/适合入门/差点知识/未解锁）
- **简历生成器**：填写基本信息，自动结合学习成就导出简历
- **真实竞赛雷达**：每日自动抓取 Kaggle/LeetCode 公开竞赛
- **AI 每周更新**：每周一自动调 LLM 生成 3 个新模拟项目 + 2 个模拟竞赛

## 技术栈

| 层 | 技术 |
|---|---|
| 前端框架 | React 18 + TypeScript + Vite |
| 样式 | Tailwind CSS + shadcn/ui |
| 路由 | react-router v6 |
| 状态 | React Context + useReducer + localStorage |
| 自动化 | GitHub Actions + Python 标准库 + 火山方舟 LLM API |
| 部署 | GitHub Pages |

## 本地启动

```bash
npm install
npm run dev      # http://localhost:23456
npm run build    # 生产构建
```

## CI/CD 自动化

- `.github/workflows/cron.yml`：每天 UTC 01:00 抓 Kaggle/LeetCode 真实竞赛
- `.github/workflows/weekly.yml`：每周一 UTC 01:00 调火山方舟 LLM 生成新模拟项目/竞赛
- 密钥通过 GitHub Secrets 注入（LLM_API_KEY / LLM_BASE_URL / LLM_MODEL）

## 目录结构

```
src/
├── components/   通用 UI
├── pages/        8 个页面
├── hooks/         自定义 Hook
├── lib/           推荐算法 / 教学字典
├── state/         全局状态
└── data/          静态数据
cron/
├── fetch_contests.py
└── generate_mocks.py
.github/workflows/
├── cron.yml
└── weekly.yml
```

## 项目地址

GitHub：https://github.com/twy0820/career-lab

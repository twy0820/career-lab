// 各课程所需工具的「官方下载直达」清单。点名字直接跳官网，不用自己搜。
export interface IToolLink {
  name: string;
  purpose: string;
  url: string;
}

// 通用起步三件套（几乎每门课都要）
export const COMMON_TOOLS: IToolLink[] = [
  { name: 'VS Code（代码编辑器）', purpose: '写代码、看文件的主力工具，免费', url: 'https://code.visualstudio.com/' },
  { name: 'Chrome 浏览器', purpose: '调接口、看前端页面都用它', url: 'https://www.google.com/chrome/' },
];

// 按 skillId 给出这门课还需要额外装的工具
export const SKILL_TOOLS: Record<string, IToolLink[]> = {
  python: [
    { name: 'Python 官方安装包', purpose: '运行 .py 代码；Windows 安装时务必勾选 Add to PATH', url: 'https://www.python.org/downloads/' },
  ],
  java: [
    { name: 'JDK（Java 运行环境）', purpose: '编译运行 Java 的基础，选 LTS 版本', url: 'https://adoptium.net/' },
    { name: 'IntelliJ IDEA（社区版免费）', purpose: '写 Java 的主力 IDE', url: 'https://www.jetbrains.com/idea/download/' },
  ],
  cpp: [
    { name: 'MSYS2（含 g++ 编译器）', purpose: 'Windows 上装 C++ 编译器 g++ 的官方方式', url: 'https://www.msys2.org/' },
  ],
  go: [
    { name: 'Go 官方安装包', purpose: '运行 go 命令、跑 Go 程序', url: 'https://go.dev/dl/' },
  ],
  sql: [
    { name: 'MySQL Installer', purpose: '本地数据库；安装时记住 root 密码', url: 'https://dev.mysql.com/downloads/installer/' },
    { name: 'DBeaver（免费可视化客户端）', purpose: '图形化连数据库、写 SQL，不用敲命令', url: 'https://dbeaver.io/download/' },
  ],
  redis: [
    { name: 'Redis（Windows 版）', purpose: '本地起 Redis 服务', url: 'https://github.com/tporadowski/redis/releases' },
  ],
  vector: [
    { name: 'Docker Desktop', purpose: '用一条命令拉起向量库（Qdrant/Milvus）', url: 'https://www.docker.com/products/docker-desktop/' },
  ],
  linux: [
    { name: 'WSL（Windows 子系统 Linux）', purpose: 'Windows 里直接跑 Linux 命令，管理员 PowerShell 执行 wsl --install', url: 'https://learn.microsoft.com/windows/wsl/install' },
    { name: 'Git for Windows（自带 Git Bash）', purpose: '不想装 WSL 时，Git Bash 也能练常见命令', url: 'https://git-scm.com/downloads' },
  ],
  git: [
    { name: 'Git 官方安装包', purpose: '版本控制，提交代码、推到 GitHub', url: 'https://git-scm.com/downloads' },
  ],
  spring: [
    { name: 'JDK（Java 运行环境）', purpose: 'Spring Boot 跑在 JVM 上', url: 'https://adoptium.net/' },
    { name: 'IntelliJ IDEA（社区版免费）', purpose: '写 Spring Boot 的主力 IDE', url: 'https://www.jetbrains.com/idea/download/' },
  ],
  fastapi: [
    { name: 'Python 官方安装包', purpose: 'FastAPI 是 Python Web 框架', url: 'https://www.python.org/downloads/' },
  ],
  docker: [
    { name: 'Docker Desktop', purpose: 'build 镜像、起容器，本地练容器化', url: 'https://www.docker.com/products/docker-desktop/' },
  ],
  dist: [
    { name: 'Docker Desktop', purpose: '用容器起 Redis/MQ 做分布式练习', url: 'https://www.docker.com/products/docker-desktop/' },
  ],
  ds: [
    { name: 'Anaconda（Python 数据科学发行版）', purpose: '自带 pandas/numpy/Jupyter，省得自己装', url: 'https://www.anaconda.com/download' },
  ],
  ml: [
    { name: 'Anaconda', purpose: '自带 sklearn、pandas 等机器学习环境', url: 'https://www.anaconda.com/download' },
  ],
  dl: [
    { name: 'Anaconda', purpose: '管 Python 环境和包', url: 'https://www.anaconda.com/download' },
    { name: 'PyTorch 官网（按指引选版本）', purpose: '官网首页会自动生成适合你电脑的安装命令，复制到终端跑', url: 'https://pytorch.org/get-started/locally/' },
  ],
  llm: [
    { name: 'Python 官方安装包', purpose: 'RAG/Agent 都用 Python 写', url: 'https://www.python.org/downloads/' },
  ],
  deploy: [
    { name: 'Docker Desktop', purpose: '把模型服务打成镜像部署', url: 'https://www.docker.com/products/docker-desktop/' },
  ],
  web: [
    { name: 'Node.js（LTS 版）', purpose: '跑 npm、装前端工具链', url: 'https://nodejs.org/' },
  ],
  vue: [
    { name: 'Node.js（LTS 版）', purpose: 'npm 装 Vue 依赖、跑 dev server', url: 'https://nodejs.org/' },
  ],
  react: [
    { name: 'Node.js（LTS 版）', purpose: 'npm 装 React 依赖、跑 Vite', url: 'https://nodejs.org/' },
  ],
};

// 按课程 id 取需要的工具（通用三件套 + 本课程专属）
export function toolsForSkill(skillId: string): IToolLink[] {
  return [...COMMON_TOOLS, ...(SKILL_TOOLS[skillId] ?? [])];
}

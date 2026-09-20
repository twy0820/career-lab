// EXPORTS: ISkillStatus, ISkillCategory, ISkill, ISkillStep, ILessonBlock, ILesson,
//          IProject, IProjectTicket, IPhase, IDeliverable, IArena, IArenaScoring, IArenaSubmission,
//          IAchievement, IProgressSnapshot, IProgressState, IContest, IContestStatus, ITicketKind

export type ISkillStatus = 'todo' | 'learning' | 'mastered';

export interface ISkillStep {
  title: string;
  detail: string;
}

export interface ILessonBlock {
  type: 'p' | 'code' | 'note';
  text: string;
}

// 宝宝级专项深讲：某个具体知识点没懂时点开，从 0 讲到实战（宝典式）
export interface IDeepExample {
  code: string;
  output: string; // 运行结果
  note?: string; // 这段在说什么 / 为什么
}

export interface ILessonDeepDive {
  id: string;
  point: string; // 知识点标题
  formalDef: string; // 正式定义
  fixed: string; // 固定搭配 / 语法骨架
  variable: string; // 哪些部分可变、能填什么
  examples: IDeepExample[]; // 从小到大递进示例（带运行结果）
  rookie: string; // 新手最常踩的坑
  realWorld: string; // 实际工作里怎么和别的知识配合
}

export interface ILesson {
  id: string; // `${skillId}-${stepIndex}`
  goal: string;
  teach: ILessonBlock[];
  practice: string;
  practiceAnswer?: string; // 练习参考答案 / 示范
  practiceVariants?: { name: string; note: string }[]; // 举一反三：换个皮再练
  checklist: string[];
  minutes: number;
  deepDives?: ILessonDeepDive[];
}

export interface ISkillCategory {
  id: string;
  name: string;
  blurb: string;
}

export interface ISkill {
  id: string;
  categoryId: string;
  name: string;
  demand: number; // 企业岗位需求热度 1-5
  blurb: string;
  steps: ISkillStep[];
  linkedProjects: string[];
  linkedArena: string[];
}

export type ITicketKind = '需求' | '开发' | '测试' | '文档' | '复盘';

export interface IProjectTicket {
  id: string;
  title: string;
  kind: ITicketKind;
  priority: 'P0' | 'P1' | 'P2';
  context: string;
  acceptance: string[];
  xp: number;
}

export interface IDeliverable {
  id: string;
  name: string;
  kind: '文档' | 'PPT 大纲' | '设计稿';
  template: string;
  prompt: string;
}

export interface IPhase {
  id: string;
  name: string;
  goal: string;
  prep: string[]; // 软件/资料准备清单
  knowledge: string[]; // 建议先学的 lesson id
  deliverables: IDeliverable[];
  tickets: IProjectTicket[];
}

export interface IProject {
  id: string;
  title: string;
  company: string;
  role: string;
  stack: string[];
  summary: string;
  background: string;
  duration: string;
  difficulty?: 1 | 2 | 3 | 4 | 5; // 默认 2
  category?: string; // 方向分类
  phases: IPhase[];
  skills: string[];
  prereqSkills?: string[]; // 报名前置：至少掌握/学习其中 1~2 个技能
}

export interface IArenaScoring {
  item: string;
  detail: string;
  weight: number; // 权重（合计 100）
}

export interface IArena {
  id: string;
  title: string;
  host: string;
  style: '算法' | '数据' | 'AI 应用' | '系统设计';
  difficulty: 1 | 2 | 3 | 4 | 5;
  duration: string;
  problem: {
    background: string;
    task: string;
    format?: string;
    sample?: string;
    constraints?: string;
    scoring: IArenaScoring[];
  };
  skills: string[];
  prereqSkills?: string[];
}

export interface IArenaSubmission {
  arenaId: string;
  solution: string;
  repoLink: string;
  selfScore: number; // 1-5
  submittedAt: string;
}

export interface IProgressSnapshot {
  xp: number;
  masteredSkills: string[];
  learningSkills: string[];
  projectsJoined: string[];
  projectsCompleted: string[];
  tasksDone: number;
  submissions: IArenaSubmission[];
  favorites: string[];
}

export interface IAchievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  check: (s: IProgressSnapshot) => boolean;
}

export interface IProgressState {
  skillStatus: Record<string, ISkillStatus>;
  doneLessons: string[];
  joinedProjects: string[];
  doneTasks: string[];
  submissions: IArenaSubmission[];
  favorites: string[];
  portfolioNotes: Record<string, string>;
  deliverableNotes: Record<string, string>;
  coachMode: boolean;
  onboardingDone: boolean;
  selectedRankId?: string;
  selectedTitleId?: string;
  nickname?: string;
}

export type IContestStatus = 'open' | 'upcoming' | 'running' | 'closed' | 'recurring';

export interface IContest {
  id: string;
  name: string;
  host: string;
  category: string;
  level: string;
  regStart: string;
  regEnd: string;
  contestStart: string;
  contestEnd: string;
  tags: string[];
  summary: string;
  registrationUrl: string;
  officialUrl: string;
  note: string;
  recurring?: boolean;
}

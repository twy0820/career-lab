// EXPORTS: IRank, RANKS, rankForLevel, TITLES, requiredLevelForDifficulty
export interface IRank {
  id: string;
  name: string;
  minLevel: number;
  minStars: number; // 进入该段位所需星星下限
  maxStars: number; // 该段位星星上限
  tagline: string;
  gradient: string;
  glow: string;
  emoji: string;
  ring: string;
}

export const RANKS: IRank[] = [
  {
    id: 'caina',
    name: '踩奶境',
    minLevel: 1,
    minStars: 0,
    maxStars: 5,
    tagline: '刚踩到键盘的小奶猫，萌力满满',
    gradient: 'from-pink-300 via-rose-300 to-fuchsia-300',
    glow: 'shadow-[0_0_30px_rgba(244,114,182,0.55)]',
    emoji: '🐾',
    ring: 'ring-pink-300/60',
  },
  {
    id: 'lier',
    name: '立耳境',
    minLevel: 4,
    minStars: 5,
    maxStars: 15,
    tagline: '耳朵竖起来，对一切都好奇',
    gradient: 'from-amber-200 via-yellow-300 to-lime-300',
    glow: 'shadow-[0_0_30px_rgba(253,224,71,0.5)]',
    emoji: '🐱',
    ring: 'ring-amber-300/60',
  },
  {
    id: 'pudie',
    name: '扑蝶境',
    minLevel: 7,
    minStars: 15,
    maxStars: 30,
    tagline: '开始扑向真实任务，活力十足',
    gradient: 'from-emerald-300 via-teal-300 to-cyan-300',
    glow: 'shadow-[0_0_30px_rgba(52,211,153,0.5)]',
    emoji: '🦋',
    ring: 'ring-emerald-300/60',
  },
  {
    id: 'haqi',
    name: '哈气境',
    minLevel: 10,
    minStars: 30,
    maxStars: 50,
    tagline: '面对难题会哈气，但绝不后退',
    gradient: 'from-orange-400 via-red-400 to-rose-500',
    glow: 'shadow-[0_0_34px_rgba(248,113,113,0.6)]',
    emoji: '😾',
    ring: 'ring-orange-400/60',
  },
  {
    id: 'xunshan',
    name: '巡山境',
    minLevel: 13,
    minStars: 50,
    maxStars: 70,
    tagline: '能独当一面的巡山猫',
    gradient: 'from-sky-400 via-blue-500 to-indigo-500',
    glow: 'shadow-[0_0_34px_rgba(59,130,246,0.6)]',
    emoji: '🐈',
    ring: 'ring-sky-400/60',
  },
  {
    id: 'yexing',
    name: '夜行境',
    minLevel: 16,
    minStars: 70,
    maxStars: 85,
    tagline: '深夜也能 debug 的神秘猎手',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-600',
    glow: 'shadow-[0_0_38px_rgba(168,85,247,0.65)]',
    emoji: '🌌',
    ring: 'ring-violet-500/60',
  },
  {
    id: 'yuzuo',
    name: '御座境',
    minLevel: 19,
    minStars: 85,
    maxStars: 95,
    tagline: '端坐在技术王座上的猫',
    gradient: 'from-yellow-400 via-amber-400 to-orange-500',
    glow: 'shadow-[0_0_42px_rgba(251,191,36,0.7)]',
    emoji: '👑',
    ring: 'ring-amber-400/70',
  },
  {
    id: 'maodie',
    name: '耄耋境',
    minLevel: 22,
    minStars: 95,
    maxStars: 100,
    tagline: '传说中的最高境界，CG 级流光',
    gradient: 'from-fuchsia-500 via-amber-300 to-emerald-300',
    glow: 'shadow-[0_0_50px_rgba(232,121,249,0.8)]',
    emoji: '🐈‍⬛',
    ring: 'ring-fuchsia-400/70',
  },
];

export function rankForLevel(level: number): IRank {
  let cur = RANKS[0];
  for (const r of RANKS) if (level >= r.minLevel) cur = r;
  return cur;
}

export function rankForStars(stars: number): IRank {
  let cur = RANKS[0];
  for (const r of RANKS) if (stars >= r.minStars) cur = r;
  return cur;
}

export function unlockedRanks(level: number): IRank[] {
  return RANKS.filter((r) => level >= r.minLevel);
}

// 难度 1-5 → 解锁所需最低等级
export function requiredLevelForDifficulty(d: number): number {
  return (Math.max(1, Math.min(5, d)) - 1) * 3 + 1;
}

export interface ITitle {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

export const TITLES: ITitle[] = [
  { id: 't-newbie', name: '初出猫庐', desc: '完成第一节课', icon: '🌱' },
  { id: 't-keysmash', name: '键盘学徒', desc: '完成 5 节课', icon: '⌨️' },
  { id: 't-codekitten', name: '代码小猫', desc: '掌握 3 门技能', icon: '🐾' },
  { id: 't-proj', name: '项目达人', desc: '完成 3 个企业模拟项目', icon: '📦' },
  { id: 't-arena', name: '竞赛常客', desc: '提交 3 次模拟竞赛', icon: '🏁' },
  { id: 't-fullstack', name: '全栈新兵', desc: '完成一个全栈项目', icon: '🧩' },
  { id: 't-data', name: '数据捕手', desc: '完成一个数据方向项目', icon: '📊' },
  { id: 't-rag', name: 'RAG 猎人', desc: '提交一次 AI 应用竞赛', icon: '🔍' },
  { id: 't-master8', name: '猫博士', desc: '掌握 8 门技能', icon: '🎓' },
  { id: 't-legend', name: '耄耋老猫', desc: '达到耄耋境', icon: '🏆' },
];

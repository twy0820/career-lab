// EXPORTS: IAchievement, ACHIEVEMENTS
import type { IAchievement } from './types';

export const ACHIEVEMENTS: IAchievement[] = [
  {
    id: 'first_join',
    title: '迈出第一步',
    desc: '加入第一个企业模拟项目',
    icon: 'Rocket',
    check: (s) => s.projectsJoined.length >= 1,
  },
  {
    id: 'first_done',
    title: '首个交付',
    desc: '完成第一个模拟项目的全部任务',
    icon: 'PackageCheck',
    check: (s) => s.projectsCompleted.length >= 1,
  },
  {
    id: 'all_projects',
    title: '全栈攻坚',
    desc: '完成全部 5 个模拟项目',
    icon: 'Layers',
    check: (s) => s.projectsCompleted.length >= 5,
  },
  {
    id: 'skill_3',
    title: '初露锋芒',
    desc: '掌握 3 门技能',
    icon: 'Sparkles',
    check: (s) => s.masteredSkills.length >= 3,
  },
  {
    id: 'skill_10',
    title: '技术纵深',
    desc: '掌握 10 门技能',
    icon: 'Award',
    check: (s) => s.masteredSkills.length >= 10,
  },
  {
    id: 'first_submit',
    title: '首战告捷',
    desc: '完成第一次竞赛模拟提交',
    icon: 'Target',
    check: (s) => s.submissions.length >= 1,
  },
  {
    id: 'arena_3',
    title: '赛场老手',
    desc: '完成 3 次竞赛模拟',
    icon: 'Medal',
    check: (s) => s.submissions.length >= 3,
  },
  {
    id: 'fav_5',
    title: '情报大师',
    desc: '收藏 5 个真实竞赛',
    icon: 'BellRing',
    check: (s) => s.favorites.length >= 5,
  },
  {
    id: 'task_20',
    title: '工蜂精神',
    desc: '累计完成 20 个模拟任务',
    icon: 'Hammer',
    check: (s) => s.tasksDone >= 20,
  },
  {
    id: 'xp_1000',
    title: '千点历练',
    desc: '累计获得 1000 XP',
    icon: 'Zap',
    check: (s) => s.xp >= 1000,
  },
  {
    id: 'xp_3000',
    title: '三千锤炼',
    desc: '累计获得 3000 XP',
    icon: 'Flame',
    check: (s) => s.xp >= 3000,
  },
];

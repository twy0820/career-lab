// EXPORTS: ProgressProvider（default）
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ProgressContext } from './progress-context';
import type {
  IArenaSubmission,
  IProgressSnapshot,
  IProgressState,
  ISkillStatus,
} from '@/data/types';
import { ACHIEVEMENTS } from '@/data/achievements';
import { PROJECT_BY_ID, SIM_PROJECTS } from '@/data/projects';
import { ARENA_BY_ID } from '@/data/arena';
import { TITLES } from '@/data/ranks';
import { store } from '@/lib/store';
import { api, getToken, setToken } from '@/lib/api';
import { supabase } from '@/lib/supabase';

const XP_PER_LEVEL = 200;
const XP_MASTERED = 60;
const XP_LEARNING = 15;
const XP_LESSON = 10;
const XP_PROJECT_DONE = 120; // 完整做完一个项目的额外奖励
// 竞赛经验随难度：60 + 难度*20
const arenaXp = (arenaId: string) => {
  const a = ARENA_BY_ID[arenaId];
  return 60 + (a?.difficulty ?? 1) * 20;
};

const DEFAULT_STATE: IProgressState = {
  skillStatus: {},
  doneLessons: [],
  joinedProjects: [],
  doneTasks: [],
  submissions: [],
  favorites: [],
  portfolioNotes: {},
  deliverableNotes: {},
  coachMode: true,
  nickname: '猫同学',
  onboardingDone: false,
  stars: 0,
  coins: 0,
  seasonStart: new Date().toISOString(),
  claimedRewards: [],
  historicalRanks: [],
};

const TICKET_XP: Record<string, number> = {};
SIM_PROJECTS.forEach((p) => {
  p.phases.forEach((ph) => {
    ph.tickets.forEach((t) => {
      TICKET_XP[t.id] = t.xp;
    });
  });
});

export default function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<IProgressState>(() => {
    const stored = store.get<Partial<IProgressState>>('progress:v1', {});
    return { ...DEFAULT_STATE, ...stored };
  });
  const hydrated = useRef(false);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 启动：登录后拉服务端进度；服务端有数据则以服务端为准，否则把本地进度种子到服务端。
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { hydrated.current = true; return; }
        const remote = await api.getProgress();
        if (cancelled) return;
        if (remote?.data && typeof remote.data === 'object') {
          const merged = { ...DEFAULT_STATE, ...(remote.data as Partial<IProgressState>) };
          setState(merged);
          store.set('progress:v1', merged);
        } else {
          await api.putProgress(state as unknown as Record<string, unknown>);
        }
        hydrated.current = true;
      } catch {
        hydrated.current = true;
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = (next: IProgressState) => {
    setState(next);
    store.set('progress:v1', next);
    if (!hydrated.current) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      await api.putProgress(next as unknown as Record<string, unknown>);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('user_meta').upsert({
          id: user.id,
          nickname: next.nickname || '猫同学',
          level: Math.floor((Object.values(next.skillStatus).length * 10 + next.doneLessons.length * 5 + next.submissions.length * 30) / 200) + 1,
          stars: next.stars ?? 0,
          coins: next.coins ?? 0,
        });
      }
    }, 800);
  };

  // 派生数据：经验、等级、完成项目、成就（全部由 state 确定性计算）
  const taskXp = state.doneTasks.reduce((sum, id) => sum + (TICKET_XP[id] ?? 0), 0);
  const mastered = Object.entries(state.skillStatus)
    .filter(([, v]) => v === 'mastered')
    .map(([k]) => k);
  const learning = Object.entries(state.skillStatus)
    .filter(([, v]) => v === 'learning')
    .map(([k]) => k);

  const projectsCompleted = state.joinedProjects.filter((pid) => {
    const pr = PROJECT_BY_ID[pid];
    if (!pr) return false;
    return pr.phases.every((ph) => ph.tickets.every((tk) => state.doneTasks.includes(tk.id)));
  });

  const xp =
    taskXp +
    mastered.length * XP_MASTERED +
    learning.length * XP_LEARNING +
    state.submissions.reduce((s, sub) => s + arenaXp(sub.arenaId), 0) +
    state.doneLessons.length * XP_LESSON +
    projectsCompleted.length * XP_PROJECT_DONE;
  const MAX_LEVEL = 100;
  const rawLevel = Math.floor(xp / XP_PER_LEVEL) + 1;
  const level = Math.min(rawLevel, MAX_LEVEL);
  const isMaxLevel = rawLevel >= MAX_LEVEL;
  const levelProgress = isMaxLevel ? 1 : (xp % XP_PER_LEVEL) / XP_PER_LEVEL;
  const nextLevelXp = isMaxLevel ? (MAX_LEVEL - 1) * XP_PER_LEVEL : level * XP_PER_LEVEL;


  const snapshot: IProgressSnapshot = {
    xp,
    masteredSkills: mastered,
    learningSkills: learning,
    projectsJoined: state.joinedProjects,
    projectsCompleted,
    tasksDone: state.doneTasks.length,
    submissions: state.submissions,
    favorites: state.favorites,
  };
  const achievements = ACHIEVEMENTS.filter((a) => a.check(snapshot));

  const hasProjectOf = (cat: string) =>
    projectsCompleted.some((pid) => ((PROJECT_BY_ID[pid]?.category) ?? '').includes(cat));
  const titles = TITLES.filter((title) => {
    switch (title.id) {
      case 't-newbie': return state.doneLessons.length >= 1;
      case 't-keysmash': return state.doneLessons.length >= 5;
      case 't-codekitten': return mastered.length >= 3;
      case 't-proj': return projectsCompleted.length >= 3;
      case 't-arena': return state.submissions.length >= 3;
      case 't-fullstack': return hasProjectOf('全栈');
      case 't-data': return hasProjectOf('数据');
      case 't-rag': return state.submissions.some((s) => ARENA_BY_ID[s.arenaId]?.style === 'AI 应用');
      case 't-master8': return mastered.length >= 8;
      case 't-legend': return level >= 22;
      default: return false;
    }
  });

  const setSkillStatus = (skillId: string, status: ISkillStatus) => {
    persist({ ...state, skillStatus: { ...state.skillStatus, [skillId]: status } });
  };

  const markLessonDone = (lessonId: string) => {
    if (state.doneLessons.includes(lessonId)) return;
    persist({ ...state, doneLessons: [...state.doneLessons, lessonId] });
  };

  const joinProject = (projectId: string) => {
    if (state.joinedProjects.includes(projectId)) return;
    persist({ ...state, joinedProjects: [...state.joinedProjects, projectId] });
  };

  const leaveProject = (projectId: string) => {
    persist({
      ...state,
      joinedProjects: state.joinedProjects.filter((id) => id !== projectId),
    });
  };

  const leaveArena = (arenaId: string) => {
    persist({
      ...state,
      submissions: state.submissions.filter((s) => s.arenaId !== arenaId),
    });
  };

  const toggleTask = (ticketId: string, done: boolean) => {
    const doneTasks = done
      ? [...state.doneTasks, ticketId]
      : state.doneTasks.filter((id) => id !== ticketId);
    persist({ ...state, doneTasks });
  };

  const submitArena = (submission: IArenaSubmission) => {
    const isFirst = !state.submissions.some((s) => s.arenaId === submission.arenaId);
    const arena = ARENA_BY_ID[submission.arenaId];
    const diff = arena?.difficulty ?? 1;
    const rewardStars = isFirst ? diff : 0;
    const rewardCoins = isFirst ? diff * 20 : Math.max(5, diff * 5);
    const submissions = [
      ...state.submissions.filter((s) => s.arenaId !== submission.arenaId),
      submission,
    ];
    persist({
      ...state,
      submissions,
      stars: Math.min(100, (state.stars ?? 0) + rewardStars),
      coins: (state.coins ?? 0) + rewardCoins,
    });
  };

  const toggleFavorite = (contestId: string) => {
    const favorites = state.favorites.includes(contestId)
      ? state.favorites.filter((f) => f !== contestId)
      : [...state.favorites, contestId];
    persist({ ...state, favorites });
  };

  const setPortfolioNote = (projectId: string, note: string) => {
    persist({ ...state, portfolioNotes: { ...state.portfolioNotes, [projectId]: note } });
  };

  const setDeliverableNote = (deliverableId: string, note: string) => {
    persist({ ...state, deliverableNotes: { ...state.deliverableNotes, [deliverableId]: note } });
  };

  const setCoachMode = (on: boolean) => {
    persist({ ...state, coachMode: on });
  };

  const setOnboardingDone = () => {
    persist({ ...state, onboardingDone: true });
  };

  const selectRank = (rankId: string) => {
    persist({ ...state, selectedRankId: rankId });
  };

  const selectTitle = (titleId: string) => {
    persist({ ...state, selectedTitleId: titleId });
  };

  const setNickname = (name: string) => {
    persist({ ...state, nickname: name });
  };

  const resetAll = () => {
    persist({ ...DEFAULT_STATE });
  };

  return (
    <ProgressContext.Provider
      value={{
        state,
        xp,
        level,
        levelProgress,
        nextLevelXp,
        achievements,
        projectsCompleted,
        setSkillStatus,
        markLessonDone,
        joinProject,
        isMaxLevel,
        maxLevel: MAX_LEVEL,
        leaveProject,
        leaveArena,
        toggleTask,
        submitArena,
        toggleFavorite,
        setPortfolioNote,
        setDeliverableNote,
        setCoachMode,
        setOnboardingDone,
        selectRank,
        selectTitle,
        nickname: state.nickname || '猫同学',
        setNickname,
        titles,
        resetAll,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}


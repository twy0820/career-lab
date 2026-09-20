// EXPORTS: IProgressContextValue, ProgressContext, useProgress
import { createContext, useContext } from 'react';
import type { IArenaSubmission, IAchievement, IProgressState, ISkillStatus } from '@/data/types';
import type { ITitle } from '@/data/ranks';

export interface IProgressContextValue {
  state: IProgressState;
  xp: number;
  level: number;
  levelProgress: number; // 0-1，当前等级内进度
  nextLevelXp: number;
  achievements: IAchievement[];
  projectsCompleted: string[];
  setSkillStatus: (skillId: string, status: ISkillStatus) => void;
  markLessonDone: (lessonId: string) => void;
  joinProject: (projectId: string) => void;
  leaveProject: (projectId: string) => void;
  leaveArena: (arenaId: string) => void;
  toggleTask: (ticketId: string, done: boolean) => void;
  submitArena: (submission: IArenaSubmission) => void;
  toggleFavorite: (contestId: string) => void;
  setPortfolioNote: (projectId: string, note: string) => void;
  setDeliverableNote: (deliverableId: string, note: string) => void;
  setCoachMode: (on: boolean) => void;
  setOnboardingDone: () => void;
  selectRank: (rankId: string) => void;
  selectTitle: (titleId: string) => void;
  nickname: string;
  setNickname: (name: string) => void;
  titles: ITitle[];
  resetAll: () => void;
}

export const ProgressContext = createContext<IProgressContextValue | null>(null);

export function useProgress(): IProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress 必须在 ProgressProvider 内使用');
  }
  return ctx;
}

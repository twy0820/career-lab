// 加载 weekly 自动生成的 mock-library.json，合并到静态数据
import { useEffect, useState } from 'react';
import type { IContest, IProject } from '@/data/types';

const BASE_PATH =
  ((import.meta.env.MIAODA_CLIENT_BASE_PATH as string | undefined) || '').replace(/\/$/, '') + '/';

export interface MockLibrary {
  generatedAt: string | null;
  projects: IProject[];
  contests: IContest[];
}

let cache: MockLibrary | null = null;

async function load(): Promise<MockLibrary> {
  if (cache) return cache;
  try {
    const r = await fetch(`${BASE_PATH}data/mock-library.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!r.ok) throw new Error(String(r.status));
    const raw = await r.json();
    // 规范化：把 LLM 生成的简略字段补成 IProject 形状
    const projects = (raw.projects ?? []).map((p: any) => ({
      ...p,
      phases: (p.phases ?? []).map((ph: any, pi: number) => ({
        id: ph.id ?? `${p.id}-ph${pi + 1}`,
        name: ph.name ?? `阶段${pi + 1}`,
        goal: ph.goal ?? '',
        prep: ph.prep ?? [],
        knowledge: ph.knowledge ?? [],
        deliverables: ph.deliverables ?? [],
        tickets: (ph.tickets ?? []).map((t: any, ti: number) => ({
          id: t.id ?? `${p.id}-t${ti + 1}`,
          title: t.title ?? t.name ?? `任务${ti + 1}`,
          kind: t.kind ?? '开发',
          priority: t.priority ?? 'P0',
          context: t.context ?? '',
          acceptance: t.acceptance ?? ['完成即可'],
          xp: t.xp ?? 30,
        })),
      })),
    }));
    cache = { generatedAt: raw.generatedAt ?? null, projects, contests: raw.contests ?? [] };
  } catch {
    cache = { generatedAt: null, projects: [], contests: [] };
  }
  return cache!;
}

export function useMocks() {
  const [data, setData] = useState<MockLibrary>({ generatedAt: null, projects: [], contests: [] });
  useEffect(() => {
    let cancelled = false;
    load().then((d) => { if (!cancelled) setData(d); });
    return () => { cancelled = true; };
  }, []);
  const mockProjectIds = new Set(data.projects.map((p) => p.id));
  const mockContestIds = new Set(data.contests.map((c) => c.id));
  const freshProjectIds = new Set(data.projects.filter((p) => (p as { fresh?: boolean }).fresh).map((p) => p.id));
  const freshContestIds = new Set(data.contests.filter((c) => (c as { fresh?: boolean }).fresh).map((c) => c.id));
  return { ...data, mockProjectIds, mockContestIds, freshProjectIds, freshContestIds };
}

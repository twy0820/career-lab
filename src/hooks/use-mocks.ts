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
    cache = await r.json();
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
  return data;
}

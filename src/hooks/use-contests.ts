// EXPORTS: useContests, CONTEST_STATUS_META, contestStatus, CONTEST_CATEGORIES, BASE_PATH
import { useEffect, useState } from 'react';
import type { IContest, IContestStatus } from '@/data/types';

export const BASE_PATH =
  ((import.meta.env.MIAODA_CLIENT_BASE_PATH as string | undefined) || '').replace(/\/$/, '') +
  '/';

let cache: IContest[] | null = null;
let inflight: Promise<IContest[]> | null = null;

// 这份竞赛清单的精选整理日期；外部官网报名时间由各条数据里的 regEnd 实时倒计时计算。
export const CONTEST_DATA_UPDATED_AT = '2026-09-19';

async function loadContests(force = false): Promise<IContest[]> {
  if (cache && !force) return cache;
  if (!inflight) {
    inflight = fetch(`${BASE_PATH}data/competitions.json?t=${Date.now()}`, { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error(`加载失败（HTTP ${r.status}）`);
        return r.json() as Promise<IContest[]>;
      })
      .then((data) => {
        cache = data;
        return data;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function useContests() {
  const [contests, setContests] = useState<IContest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadContests()
      .then((data) => {
        if (!cancelled) setContests(data);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = () => {
    setRefreshing(true);
    return loadContests(true)
      .then((data) => setContests(data))
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setRefreshing(false));
  };

  return { contests, loading, error, refreshing, refresh, updatedAt: CONTEST_DATA_UPDATED_AT };
}

const dayDiff = (dateStr: string, now: Date): number => {
  const d = new Date(`${dateStr}T00:00:00`);
  return Math.floor((d.getTime() - now.getTime()) / 86400000);
};

export function contestStatus(c: IContest, now = new Date()): IContestStatus {
  if (c.recurring) return 'recurring';
  const regStart = dayDiff(c.regStart, now);
  const regEnd = dayDiff(c.regEnd, now);
  const contestStart = dayDiff(c.contestStart, now);
  const contestEnd = dayDiff(c.contestEnd, now);
  if (regStart > 0) return 'upcoming';
  if (regEnd >= 0) return 'open';
  if (contestEnd >= 0) return 'running';
  if (contestStart >= 0) return 'closed';
  return 'closed';
}

export const CONTEST_STATUS_META: Record<IContestStatus, { label: string; cls: string }> = {
  open: { label: '报名中', cls: 'bg-success/15 text-success border-success/30' },
  upcoming: { label: '即将开始', cls: 'bg-info/15 text-info border-info/30' },
  running: { label: '进行中', cls: 'bg-warning/15 text-warning border-warning/30' },
  closed: { label: '已截止', cls: 'bg-muted text-muted-foreground border-border' },
  recurring: { label: '常驻平台', cls: 'bg-accent text-accent-foreground border-border' },
};

export const CONTEST_CATEGORIES = ['编程竞赛', '数据AI', '数学建模', '创新创业', '训练营'];

export function formatDate(dateStr: string): string {
  return `${dateStr.slice(0, 4)}.${dateStr.slice(5, 7)}.${dateStr.slice(8, 10)}`;
}

export function daysText(dateStr: string, now = new Date()): string {
  const diff = dayDiff(dateStr, now);
  if (diff > 0) return `剩 ${diff} 天`;
  if (diff === 0) return '今天截止';
  return `已过 ${-diff} 天`;
}

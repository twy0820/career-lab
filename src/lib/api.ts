// 后端 API 客户端（V2）。所有调用 best-effort：后端没起就静默失败，不影响纯前端模式。
// 进度同步是可选增强——断网 / 后端未启动时仍以 localStorage 为准。

const TOKEN_KEY = 'career-lab:token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}

async function req<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(path, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        ...(init?.headers ?? {}),
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const api = {
  health: () => req<{ ok: boolean }>('/api/health'),
  login: (nickname: string) =>
    req<{ token: string; nickname: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ nickname }),
    }),
  getProgress: () =>
    req<{ data: Record<string, unknown> | null; updated_at: number }>('/api/progress'),
  putProgress: (data: Record<string, unknown>) =>
    req<{ ok: boolean; updated_at: number }>('/api/progress', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  aiExplain: (topic: string, question: string) =>
    req<{ mode: string; answer: string }>('/api/ai/explain', {
      method: 'POST',
      body: JSON.stringify({ topic, question }),
    }),
};

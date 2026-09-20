// localStorage 读写封装：带项目命名空间，避免多应用互相覆盖
const NS = 'career-lab';

export const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(`${NS}:${key}`);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(`${NS}:${key}`, JSON.stringify(value));
    } catch {
      // 隐私模式 / 禁用站点数据时静默降级
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(`${NS}:${key}`);
    } catch {
      // 忽略
    }
  },
};

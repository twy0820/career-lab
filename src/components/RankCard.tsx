// 猫境段位卡：展示当前段位（带光效），已解锁段位可切换；称号可选择展示
import { Sparkles } from 'lucide-react';
import { useProgress } from '@/state/progress-context';
import { RANKS, rankForLevel, unlockedRanks } from '@/data/ranks';
import { cn } from '@/lib/utils';

export default function RankCard() {
  const { level, state, selectRank, selectTitle, titles } = useProgress();
  const cur = rankForLevel(level);
  const unlocked = unlockedRanks(level);
  const active = RANKS.find((r) => r.id === state.selectedRankId) ?? cur;
  const activeTitle = titles.find((t) => t.id === state.selectedTitleId);

  return (
    <div className="space-y-4">
      {/* 段位横幅 */}
      <div
        className={cn(
          'relative overflow-hidden rounded-xl bg-gradient-to-r p-5 text-foreground transition-all',
          active.gradient,
          active.glow
        )}
      >
        <div className="relative z-10 flex items-center gap-4">
          <span className="text-4xl drop-shadow">{active.emoji}</span>
          <div>
            <p className="text-xs opacity-80">当前猫境 · Lv.{level}</p>
            <p className="text-2xl font-black tracking-wide">{active.name}</p>
            <p className="mt-0.5 text-xs opacity-90">{active.tagline}</p>
            {activeTitle && (
              <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-black/20 px-2 py-0.5 text-xs font-medium">
                {activeTitle.icon} {activeTitle.name}
              </p>
            )}
          </div>
        </div>
        <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
      </div>

      {/* 已解锁段位切换 */}
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> 已解锁段位（点选展示）
        </p>
        <div className="flex flex-wrap gap-1.5">
          {unlocked.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => selectRank(r.id)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs transition',
                active.id === r.id
                  ? `bg-gradient-to-r ${r.gradient} text-foreground ring-2 ${r.ring}`
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40'
              )}
            >
              {r.emoji} {r.name}
            </button>
          ))}
          {RANKS.filter((r) => level < r.minLevel).map((r) => (
            <span
              key={r.id}
              className="rounded-full border border-dashed px-2.5 py-1 text-xs text-muted-foreground/50"
              title={`Lv.${r.minLevel} 解锁`}
            >
              🔒 {r.name}
            </span>
          ))}
        </div>
      </div>

      {/* 称号 */}
      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">
          我的称号（{titles.length}）——点选一个挂在段位上
        </p>
        {titles.length === 0 ? (
          <p className="text-xs text-muted-foreground">完成学习/项目/竞赛即可获得称号。</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {titles.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTitle(t.id)}
                title={t.desc}
                className={cn(
                  'rounded-md border px-2 py-1 text-xs transition',
                  activeTitle?.id === t.id
                    ? 'border-primary/60 bg-primary/15 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                )}
              >
                {t.icon} {t.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

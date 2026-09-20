// 竞赛练兵：分类筛选 + 难度解锁 + 模拟竞赛列表
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TerminalPanel from '@/components/TerminalPanel';
import { useProgress } from '@/state/progress-context';
import { SIM_ARENA, ARENA_STYLE_META } from '@/data/arena';
import { requiredLevelForDifficulty, rankForLevel } from '@/data/ranks';
import { useMocks } from '@/hooks/use-mocks';

const STYLES = ['全部', '算法', '数据', 'AI 应用', '系统设计'];

export default function ArenaPage() {
  const { state, level } = useProgress();
  const mocks = useMocks();
  const [style, setStyle] = useState('全部');

  const list = useMemo(
    () => SIM_ARENA.filter((a) => (style === '全部' ? true : a.style === style)),
    [style]
  );

  return (
    <div className="space-y-6">
      <TerminalPanel title="~/arena" status={`${SIM_ARENA.length} 道赛题`}>
        <div>
          <h2 className="text-lg font-bold">竞赛练兵</h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            按真实竞赛赛制设计：算法、数据挖掘、LLM 黑客松、系统设计。按难度解锁，
            高难度题目需要对应猫境——先易后难，用最小成本练「如何打一场比赛」。
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {STYLES.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={style === s ? 'default' : 'outline'}
                className="h-7 px-3 text-xs"
                onClick={() => setStyle(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      </TerminalPanel>

      {/* 本周 AI 模拟竞赛 */}
      {mocks.contests.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-fuchsia-300">✨ 本周 AI 模拟竞赛（{mocks.contests.length}）</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {mocks.contests.map((c) => (
              <TerminalPanel key={c.id} title={`~/arena/${c.id}`} status="simulated"
                action={<Badge className="bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/40">AI 本周新增</Badge>}>
                <h3 className="font-semibold">{c.name}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{c.host} · {c.category} · {c.level}</p>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{c.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.tags.map((t) => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
                </div>
              </TerminalPanel>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {list.map((a) => {
          const sub = state.submissions.find((s) => s.arenaId === a.id);
          const meta = ARENA_STYLE_META[a.style];
          const reqLv = requiredLevelForDifficulty(a.difficulty);
          const locked = level < reqLv;
          const reqRank = rankForLevel(reqLv);
          return (
            <TerminalPanel
              key={a.id}
              title={`~/arena/${a.id}`}
              status={locked ? 'locked' : sub ? 'submitted' : 'open'}
              action={
                <Badge variant={locked ? 'outline' : sub ? 'outline' : 'secondary'}>
                  {locked ? `需 ${reqRank.name}` : sub ? '已提交' : '可参赛'}
                </Badge>
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.host}</p>
                </div>
                <span className={`shrink-0 font-mono text-xs ${meta.color}`}>{meta.label}</span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span title="难度">
                  难度{' '}
                  <span className="text-primary">
                    {'◆'.repeat(a.difficulty)}
                    <span className="text-muted-foreground/40">
                      {'◆'.repeat(5 - a.difficulty)}
                    </span>
                  </span>
                </span>
                <span className="text-muted-foreground/40">|</span>
                <span>需 Lv.{reqLv}</span>
                <span className="text-muted-foreground/40">|</span>
                <span>{a.duration}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {a.skills.map((sid) => (
                  <Badge key={sid} variant="secondary" className="border border-border">
                    {sid === 'python' ? 'Python' : sid === 'cpp' ? 'C/C++' : sid === 'java' ? 'Java' : sid === 'go' ? 'Go' : sid}
                  </Badge>
                ))}
              </div>

              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{a.problem.task}</p>

              <div className="mt-4">
                {locked ? (
                  <div className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 py-2 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    达到「{reqRank.name}」(Lv.{reqLv}) 解锁
                  </div>
                ) : (
                  <Button asChild variant={sub ? 'outline' : 'default'} className="w-full">
                    <Link to={`/arena/${a.id}`}>
                      {sub ? '查看提交与评审' : '进入赛题'}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </TerminalPanel>
          );
        })}
      </div>
    </div>
  );
}

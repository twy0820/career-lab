// 项目实战：分类筛选 + 难度等级解锁 + 知识前置 + 智能推荐
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Lock, Sparkles, Footprints, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import TerminalPanel from '@/components/TerminalPanel';
import { useProgress } from '@/state/progress-context';
import { SIM_PROJECTS } from '@/data/projects';
import type { IProject } from '@/data/types';
import { requiredLevelForDifficulty, rankForLevel } from '@/data/ranks';
import { gateProjectWithLevel, sortByTier, type GateResult } from '@/lib/recommend';
import { useMocks } from '@/hooks/use-mocks';

function categoryOf(p: IProject): string {
  if (p.category) return p.category;
  const s = p.stack.join(' ');
  if (/React|Vue|前端/i.test(s)) return '前端';
  if (/Python|Pandas|PyTorch|数据/i.test(p.title + s)) return '数据';
  if (/Java|Spring|Go|MySQL|Redis|微服务/i.test(s)) return '后端';
  return '综合';
}

const CATS = ['全部', '后端', '前端', '数据', 'AI', '全栈', '工程效能', '综合'];
const DIFF_LABEL = ['', '入门', '简单', '进阶', '困难', '挑战'];

const TIER_META: Record<GateResult['tier'], { label: string; cls: string; icon: typeof Sparkles }> = {
  recommended: { label: '极力推荐', cls: 'bg-amber-400/20 text-amber-300 border-amber-400/50', icon: Sparkles },
  starter: { label: '适合刚入门', cls: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/40', icon: Footprints },
  gap: { label: '还差点知识', cls: 'bg-orange-400/15 text-orange-300 border-orange-400/40', icon: AlertTriangle },
  locked: { label: '段位未到', cls: 'bg-muted/30 text-muted-foreground border-border', icon: Lock },
};

export default function ProjectsPage() {
  const { state, level } = useProgress();
  const mocks = useMocks();
  const [cat, setCat] = useState('全部');

  const rows = useMemo(() => {
    const all = [...mocks.projects, ...SIM_PROJECTS];
    const filtered = all.filter((p) =>
      cat === '全部' ? true : categoryOf(p) === cat
    );
    const withGates = filtered.map((p) => ({ p, gate: gateProjectWithLevel(p, state, level) }));
    return sortByTier(withGates);
  }, [cat, state, level, mocks.projects]);

  return (
    <div className="space-y-6">
      <TerminalPanel title="~/projects" status={`${SIM_PROJECTS.length} 个项目`}>
        <div>
          <h2 className="text-lg font-bold">企业实战模拟</h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            双层门槛：<b>段位（等级）</b>决定你能不能报名；<b>知识前置</b>决定你做得动不动。
            按你已学/在学的技能，自动给你打「极力推荐 / 适合刚入门 / 还差点知识」标签。
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {CATS.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={cat === c ? 'default' : 'outline'}
                className="h-7 px-3 text-xs"
                onClick={() => setCat(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>
      </TerminalPanel>

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map(({ p: p, gate }) => {
          const diff = p.difficulty ?? 2;
          const reqLv = requiredLevelForDifficulty(diff);
          const locked = !gate.levelOk;
          const joined = state.joinedProjects.includes(p.id);
          const allT = p.phases.flatMap((ph) => ph.tickets);
          const doneCount = allT.filter((t) => state.doneTasks.includes(t.id)).length;
          const allDone = joined && doneCount === allT.length;
          const reqRank = rankForLevel(reqLv);
          const meta = TIER_META[gate.tier];
          const TierIcon = meta.icon;
          return (
            <TerminalPanel
              key={p.id}
              title={`~/projects/${p.id}`}
              status={locked ? 'locked' : allDone ? 'done' : joined ? 'in-progress' : 'open'}
              action={
                <Badge
                  variant="outline"
                  className={`${meta.cls} border`}
                >
                  <TierIcon className="mr-1 h-3 w-3" />
                  {meta.label}
                </Badge>
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    {p.company} · {p.role}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-[10px] text-muted-foreground">
                    {p.duration}
                  </span>
                  <p className="mt-1 font-mono text-[10px] text-primary">
                    {DIFF_LABEL[diff]} · 需 Lv.{reqLv}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">{p.summary}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{gate.reason}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="secondary">{categoryOf(p)}</Badge>
                {p.stack.map((s) => (
                  <Badge key={s} variant="outline" className="border border-border">
                    {s}
                  </Badge>
                ))}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    阶段进度：{joined ? `${doneCount}/${allT.length}` : `${p.phases.length} 阶段 ${allT.length} 任务`}
                  </span>
                  <span className="font-mono text-primary">+{allT.reduce((s, t) => s + t.xp, 0)} XP</span>
                </div>
                <Progress value={joined ? (doneCount / allT.length) * 100 : 0} className="mt-1.5 h-1.5" />
              </div>

              <div className="mt-4">
                {locked ? (
                  <div className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 py-2 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    达到「{reqRank.name}」(Lv.{reqLv}) 解锁 · 先去练基础
                  </div>
                ) : (
                  <Button asChild variant={allDone ? 'outline' : 'default'} className="w-full">
                    <Link to={`/projects/${p.id}`}>
                      {allDone ? '查看复盘与履历' : joined ? '继续推进任务' : '查看并加入项目'}
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

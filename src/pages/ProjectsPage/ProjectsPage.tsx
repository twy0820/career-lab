// 椤圭洰瀹炴垬锛氬垎绫荤瓫閫?+ 闅惧害绛夌骇瑙ｉ攣 + 鐭ヨ瘑鍓嶇疆 + 鏅鸿兘鎺ㄨ崘
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
  if (/React|Vue|鍓嶇/i.test(s)) return '鍓嶇';
  if (/Python|Pandas|PyTorch|鏁版嵁/i.test(p.title + s)) return '鏁版嵁';
  if (/Java|Spring|Go|MySQL|Redis|寰湇鍔?i.test(s)) return '鍚庣';
  return '缁煎悎';
}

const CATS = ['鍏ㄩ儴', '鍚庣', '鍓嶇', '鏁版嵁', 'AI', '鍏ㄦ爤', '宸ョ▼鏁堣兘', '缁煎悎'];
const DIFF_LABEL = ['', '鍏ラ棬', '绠€鍗?, '杩涢樁', '鍥伴毦', '鎸戞垬'];

const TIER_META: Record<GateResult['tier'], { label: string; cls: string; icon: typeof Sparkles }> = {
  recommended: { label: '鏋佸姏鎺ㄨ崘', cls: 'bg-amber-400/20 text-amber-300 border-amber-400/50', icon: Sparkles },
  starter: { label: '閫傚悎鍒氬叆闂?, cls: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/40', icon: Footprints },
  gap: { label: '杩樺樊鐐圭煡璇?, cls: 'bg-orange-400/15 text-orange-300 border-orange-400/40', icon: AlertTriangle },
  locked: { label: '娈典綅鏈埌', cls: 'bg-muted/30 text-muted-foreground border-border', icon: Lock },
};

export default function ProjectsPage() {
  const { state, level } = useProgress();
  const mocks = useMocks();
  const [cat, setCat] = useState('鍏ㄩ儴');

  const rows = useMemo(() => {
    const all = [...mocks.projects, ...SIM_PROJECTS];
    const filtered = all.filter((p) =>
      cat === '鍏ㄩ儴' ? true : categoryOf(p) === cat
    );
    const withGates = filtered.map((p) => ({ p, gate: gateProjectWithLevel(p, state, level) }));
    const sorted = sortByTier(withGates);
    sorted.sort((a, b) => {
      const af = mocks.freshProjectIds.has(a.p.id) ? 0 : 1;
      const bf = mocks.freshProjectIds.has(b.p.id) ? 0 : 1;
      return af - bf;
    });
    return sorted;
  }, [cat, state, level, mocks]);

  return (
    <div className="space-y-6">
      <TerminalPanel title="~/projects" status={`${SIM_PROJECTS.length + mocks.projects.length} 涓」鐩甡}>
        <div>
          <h2 className="text-lg font-bold">浼佷笟瀹炴垬妯℃嫙</h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            鍙屽眰闂ㄦ锛?b>娈典綅锛堢瓑绾э級</b>鍐冲畾浣犺兘涓嶈兘鎶ュ悕锛?b>鐭ヨ瘑鍓嶇疆</b>鍐冲畾浣犲仛寰楀姩涓嶅姩銆?            鎸変綘宸插/鍦ㄥ鐨勬妧鑳斤紝鑷姩缁欎綘鎵撱€屾瀬鍔涙帹鑽?/ 閫傚悎鍒氬叆闂?/ 杩樺樊鐐圭煡璇嗐€嶆爣绛俱€?          </p>
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
          const allT = (p.phases ?? []).flatMap((ph) => ph.tickets);
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
                  <h3 className="font-semibold flex items-center gap-2">
                    {p.title}
                    {mocks.freshProjectIds.has(p.id) && (
                      <span className="rounded bg-gradient-to-r from-fuchsia-500/20 to-violet-500/20 px-1.5 py-0.5 text-[10px] font-normal text-fuchsia-300 border border-fuchsia-500/40">
                        鉁?AI 鏈懆鏂板
                      </span>
                    )}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    {p.company} 路 {p.role}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-[10px] text-muted-foreground">
                    {p.duration}
                  </span>
                  <p className="mt-1 font-mono text-[10px] text-primary">
                    {DIFF_LABEL[diff]} 路 闇€ Lv.{reqLv}
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
                    闃舵杩涘害锛歿joined ? `${doneCount}/${allT.length}` : `${(p.phases ?? []).length} 闃舵 ${allT.length} 浠诲姟`}
                  </span>
                  <span className="font-mono text-primary">+{allT.reduce((s, t) => s + t.xp, 0)} XP</span>
                </div>
                <Progress value={joined ? (doneCount / allT.length) * 100 : 0} className="mt-1.5 h-1.5" />
              </div>

              <div className="mt-4">
                {locked ? (
                  <div className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 py-2 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    杈惧埌銆寋reqRank.name}銆?Lv.{reqLv}) 瑙ｉ攣 路 鍏堝幓缁冨熀纭€
                  </div>
                ) : (
                  <Button asChild variant={allDone ? 'outline' : 'default'} className="w-full">
                    <Link to={`/projects/${p.id}`}>
                      {allDone ? '鏌ョ湅澶嶇洏涓庡饱鍘? : joined ? '缁х画鎺ㄨ繘浠诲姟' : '鏌ョ湅骞跺姞鍏ラ」鐩?}
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


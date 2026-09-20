// 项目详情：分阶段实战（准备/需求/设计/开发/测试/复盘），含产出物编辑器
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  Circle,
  ClipboardList,
  Package,
  Play,
  Wrench,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import TerminalPanel from '@/components/TerminalPanel';
import { useProgress } from '@/state/progress-context';
import { PROJECT_BY_ID } from '@/data/projects';
import { SKILL_BY_ID } from '@/data/skills';
import { LESSON_BY_ID } from '@/data/lessons';
import type { IDeliverable, IPhase, ITicketKind } from '@/data/types';
import { gateProjectWithLevel } from '@/lib/recommend';
import { useMocks } from '@/hooks/use-mocks';

const KIND_META: Record<ITicketKind, string> = {
  需求: 'bg-info/15 text-info border-info/30',
  开发: 'bg-primary/15 text-primary border-primary/30',
  测试: 'bg-warning/15 text-warning border-warning/30',
  文档: 'bg-accent text-accent-foreground border-border',
  复盘: 'bg-success/15 text-success border-success/30',
};

function DeliverableEditor({
  d,
  value,
  onChange,
}: {
  d: IDeliverable;
  value: string;
  onChange: (v: string) => void;
}) {
  const filled = value.trim().length > 0;
  return (
    <div
      className={`rounded-md border p-3.5 ${
        filled ? 'border-success/40 bg-success/5' : 'border-border bg-card'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-medium">
          <ClipboardList className="h-4 w-4 text-primary" />
          {d.name}
          <Badge variant="outline" className="h-5 border px-1.5 text-[10px]">
            {d.kind}
          </Badge>
        </p>
        {filled ? (
          <Badge className="bg-success/15 text-success">已完成</Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">待写</Badge>
        )}
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{d.prompt}</p>
      <Collapsible className="mt-2">
        <CollapsibleTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className="h-6 px-1 text-xs text-info">
            查看模板
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded-md border border-border bg-muted/60 p-2.5 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {d.template}
          </pre>
        </CollapsibleContent>
      </Collapsible>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="在这里写你的产出物内容……"
        rows={6}
        className="mt-2 font-mono text-xs"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => onChange(d.template)}
      >
        用模板填充
      </Button>
    </div>
  );
}

function PhaseSection({
  ph,
  index,
  total,
  joined,
}: {
  ph: IPhase;
  index: number;
  total: number;
  joined: boolean;
}) {
  const { state, toggleTask, setDeliverableNote } = useProgress();
  const doneTickets = ph.tickets.filter((t) => state.doneTasks.includes(t.id)).length;
  const phaseDone = ph.tickets.every((t) => state.doneTasks.includes(t.id));

  return (
    <div className="relative pl-6">
      {/* 时间线竖线 */}
      <span className="absolute left-2 top-2 h-full w-px bg-border" />
      <span
        className={`absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
          phaseDone ? 'border-success bg-success text-success-foreground' : 'border-primary bg-card'
        }`}
      >
        {phaseDone ? <CheckCircle2 className="h-3 w-3" /> : null}
      </span>

      <div className="space-y-3 pb-6">
        <div>
          <p className="font-mono text-[10px] text-muted-foreground">
            阶段 {index + 1} / {total}
          </p>
          <h4 className="text-base font-semibold">{ph.name}</h4>
          <p className="mt-0.5 text-sm text-muted-foreground">目标：{ph.goal}</p>
          <div className="mt-1.5 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(doneTickets / ph.tickets.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 准备清单 */}
        <div className="rounded-md border border-border bg-card p-3.5">
          <p className="flex items-center gap-2 text-xs font-semibold text-warning">
            <Wrench className="h-3.5 w-3.5" /> 开工前准备
          </p>
          <ul className="mt-2 space-y-1.5">
            {(ph.prep ?? []).map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <Circle className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/40" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* 先修课程 */}
        {(ph.knowledge ?? []).length > 0 && (
          <div className="rounded-md border border-border bg-card p-3.5">
            <p className="flex items-center gap-2 text-xs font-semibold text-info">
              <BookOpenCheck className="h-3.5 w-3.5" /> 建议先学这些课（点标签去学）
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(ph.knowledge ?? []).map((kid) => {
                const lesson = LESSON_BY_ID[kid];
                const skillId = kid.split('-')[0];
                const done = state.doneLessons.includes(kid);
                return (
                  <Link key={kid} to="/skills">
                    <Badge
                      variant="outline"
                      className={
                        done
                          ? 'border-success/40 bg-success/10 text-success'
                          : 'hover:border-primary/50'
                      }
                    >
                      {done && <CheckCircle2 className="mr-1 h-3 w-3" />}
                      {SKILL_BY_ID[skillId]?.name} · {lesson ? lesson.goal.slice(0, 10) + '…' : kid}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 产出物 */}
        {(ph.deliverables ?? []).map((d) => (
          <DeliverableEditor
            key={d.id}
            d={d}
            value={state.deliverableNotes[d.id] ?? ''}
            onChange={(v) => setDeliverableNote(d.id, v)}
          />
        ))}

        {/* 任务 */}
        <div className="space-y-2">
          {ph.tickets.map((t) => {
            const done = state.doneTasks.includes(t.id);
            return (
              <div
                key={t.id}
                className={`rounded-md border border-border bg-card p-3.5 ${done ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={t.id}
                    checked={done}
                    disabled={!joined}
                    onCheckedChange={(v) => {
                      toggleTask(t.id, v === true);
                      if (v === true) toast.success(`任务「${t.title}」完成，+${t.xp} XP`);
                    }}
                    className="mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`text-sm font-medium ${done ? 'line-through' : ''}`}>
                        {t.title}
                      </p>
                      <Badge variant="outline" className={`h-5 border px-1.5 text-[10px] ${KIND_META[t.kind]}`}>
                        {t.kind}
                      </Badge>
                      <Badge variant="outline" className="h-5 border px-1.5 text-[10px]">
                        {t.priority}
                      </Badge>
                      <span className="ml-auto font-mono text-xs text-primary">+{t.xp} XP</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{t.context}</p>
                    <Collapsible className="mt-2">
                      <CollapsibleTrigger asChild>
                        <Button type="button" variant="ghost" size="sm" className="h-6 px-1 text-xs text-info">
                          查看验收标准
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <ul className="mt-1 space-y-1 border-l-2 border-border pl-3">
                          {t.acceptance.map((a) => (
                            <li key={a} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                              {done ? (
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                              ) : (
                                <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                              )}
                              {a}
                            </li>
                          ))}
                        </ul>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, level, joinProject, leaveProject } = useProgress();
  const mocks = useMocks();
  const project = id ? (PROJECT_BY_ID[id] ?? mocks.projects.find((p) => p.id === id)) : undefined;

  if (!project) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">未找到该项目，可能已被移除。</p>
        <Button variant="outline" onClick={() => navigate('/projects')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> 返回项目列表
        </Button>
      </div>
    );
  }

  const joined = state.joinedProjects.includes(project.id);
  const allTickets = (project.phases ?? []).flatMap((ph) => ph.tickets);
  const doneCount = allTickets.filter((t) => state.doneTasks.includes(t.id)).length;
  const allDone = joined && doneCount === allTickets.length;
  const gate = gateProjectWithLevel(project, state, level);
  const canJoin = gate.levelOk && gate.knowOk;

  const handleJoin = () => {
    if (!canJoin) { toast.error(gate.reason); return; }
    joinProject(project.id);
    toast.success(`已加入「${project.title}」。先从阶段一的准备清单开始！`);
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/projects">
          <ArrowLeft className="mr-1 h-4 w-4" /> 返回项目列表
        </Link>
      </Button>

      <TerminalPanel
        title={`~/projects/${project.id}/overview`}
        status={allDone ? 'done' : joined ? 'in-progress' : 'open'}
        action={
          !joined ? (
            canJoin ? (
              <Button size="sm" onClick={handleJoin}>
                <Play className="mr-1 h-3.5 w-3.5" /> 加入项目
              </Button>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">未达门槛：{gate.reason}</Badge>
            )
          ) : allDone ? (
            <div className="flex gap-2">
              <Badge className="bg-success/15 text-success">项目已完成</Badge>
              <Button size="sm" variant="outline" onClick={() => { if (confirm('确定退出该项目？任务进度保留，可再次加入。')) { leaveProject(project.id); toast.success('已退出项目'); } }}>退出项目</Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Badge className="bg-info/15 text-info">进行中</Badge>
              <Button size="sm" variant="outline" onClick={() => { if (confirm('确定退出该项目？任务进度保留，可再次加入。')) { leaveProject(project.id); toast.success('已退出项目'); } }}>退出项目</Button>
            </div>
          )
        }
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold">{project.title}</h2>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              {project.company} · {project.role} · {project.duration}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <Badge key={s} variant="secondary" className="border border-border">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
          <div className="min-w-44">
            <div className="flex items-baseline justify-between text-xs text-muted-foreground">
              <span>任务进度</span>
              <span className="font-mono">
                {doneCount}/{allTickets.length}
              </span>
            </div>
            <Progress value={(doneCount / allTickets.length) * 100} className="mt-1.5 h-2" />
            <p className="mt-1 flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
              <Package className="h-3 w-3" />
              共 {(project.phases ?? []).length} 个阶段 · 预计 +
              {allTickets.reduce((s, t) => s + t.xp, 0)} XP
            </p>
          </div>
        </div>
      </TerminalPanel>

      <TerminalPanel title={`~/projects/${project.id}/background`}>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Building2 className="h-4 w-4 text-primary" /> 项目背景（甲方需求）
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.background}</p>
      </TerminalPanel>

      <TerminalPanel
        title={`~/projects/${project.id}/phases`}
        status={joined ? `${(project.phases ?? []).length} 阶段` : '加入后开始'}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">分阶段实战路线</h3>
          {!joined && (
            <p className="text-xs text-muted-foreground">加入项目后即可开始勾选任务、写产出物</p>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          按企业真实节奏推进：每个阶段先做准备 → 写产出物（文档/PPT 大纲）→ 完成任务。完成的产出物和任务都会记到你的履历里。
        </p>
        <div className="mt-4">
          {(project.phases ?? []).map((ph, i) => (
            <PhaseSection
              key={ph.id}
              ph={ph}
              index={i}
              total={(project.phases ?? []).length}
              joined={joined}
            />
          ))}
        </div>
        {allDone && (
          <div className="mt-4 rounded-md border border-success/40 bg-success/10 p-3 text-sm text-success">
            恭喜，全部阶段完成！去「成就履历」把项目经历导出成简历素材。
          </div>
        )}
      </TerminalPanel>

      <TerminalPanel title={`~/projects/${project.id}/skills`}>
        <h3 className="text-sm font-semibold">关联技能</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {project.skills.map((sid) => {
            const skill = SKILL_BY_ID[sid];
            const st = state.skillStatus[sid] ?? 'todo';
            return (
              <Link key={sid} to="/skills">
                <Badge
                  variant="outline"
                  className={
                    st === 'mastered'
                      ? 'border-success/40 bg-success/10 text-success'
                      : st === 'learning'
                        ? 'border-info/40 bg-info/10 text-info'
                        : 'hover:border-primary/50'
                  }
                >
                  {skill?.name ?? sid}
                </Badge>
              </Link>
            );
          })}
        </div>
      </TerminalPanel>
    </div>
  );
}

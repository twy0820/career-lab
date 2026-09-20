// 工作台：成长总览 + 今日任务 + 技能进度 + 竞赛提醒
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  GraduationCap,
  Radar,
  Swords,
  Terminal,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import TerminalPanel from '@/components/TerminalPanel';
import { useProgress } from '@/state/progress-context';
import { PROJECT_BY_ID, SIM_PROJECTS } from '@/data/projects';
import { SKILLS, SKILL_CATEGORIES, TOP_DEMAND_SKILLS } from '@/data/skills';
import { useContests, contestStatus, daysText } from '@/hooks/use-contests';
import { gateProjectWithLevel } from '@/lib/recommend';

export default function HomePage() {
  const { state, xp, level, levelProgress, nextLevelXp, achievements } = useProgress();
  const { contests } = useContests();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const masteredCount = Object.values(state.skillStatus).filter((v) => v === 'mastered').length;
  const pendingTasks = state.joinedProjects
    .map((pid) => {
      const p = PROJECT_BY_ID[pid];
      if (!p) return null;
      return p.phases
        .flatMap((ph) => ph.tickets)
        .filter((t) => !state.doneTasks.includes(t.id))
        .map((t) => ({ pid, p, t }));
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .flat()
    .slice(0, 5);

  const openContests = contests
    .filter((c) => contestStatus(c, now) === 'open')
    .sort((a, b) => a.regEnd.localeCompare(b.regEnd))
    .slice(0, 3);

  const stats = [
    { label: '已掌握技能', value: masteredCount, icon: GraduationCap, to: '/skills' },
    { label: '参与项目', value: state.joinedProjects.length, icon: Briefcase, to: '/projects' },
    { label: '竞赛模拟', value: state.submissions.length, icon: Swords, to: '/arena' },
    { label: '收藏竞赛', value: state.favorites.length, icon: Radar, to: '/contests' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/15 via-card to-card p-6">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-xs text-primary">~/techforge/workspace</p>
            <h2 className="mt-1 text-2xl font-bold">欢迎回来，实战工程师</h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              用「模拟企业项目 + 竞赛练兵」的方式，把课堂知识变成可写进简历的真实履历。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/projects">
                  进入项目实战 <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/contests">查看竞赛雷达</Link>
              </Button>
            </div>
          </div>
          <div className="min-w-56 rounded-lg border border-border bg-card/80 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-primary">Lv.{level}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {xp} / {nextLevelXp} XP
              </span>
            </div>
            <Progress value={levelProgress * 100} className="mt-3 h-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              再获得 {Math.max(0, nextLevelXp - xp)} XP 升至下一级
            </p>
          </div>
        </div>
      </section>

      {/* 统计卡 */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/50">
              <CardContent className="flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-2xl font-bold leading-none">{s.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 今日作战任务 */}
        <div className="lg:col-span-2">
          <TerminalPanel title="~/tasks/pending" status="running">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Clock className="h-4 w-4 text-primary" /> 待办任务
              </h3>
              {state.joinedProjects.length === 0 && (
                <Button size="sm" variant="outline" asChild>
                  <Link to="/projects">先加入一个项目</Link>
                </Button>
              )}
            </div>
            <div className="mt-3 space-y-2">
              {pendingTasks.length === 0 ? (
                <div className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                  {state.joinedProjects.length === 0
                    ? '还没有任务。加入一个企业模拟项目，开始你的第一份「工作」。'
                    : '太棒了，当前项目的任务已全部完成！去项目页继续下一个目标。'}
                </div>
              ) : (
                pendingTasks.map(({ pid, p, t }) => (
                  <Link
                    key={t.id}
                    to={`/projects/${pid}`}
                    className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5 transition-colors hover:border-primary/50"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{t.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {p.title} · {t.kind}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-primary">+{t.xp} XP</span>
                  </Link>
                ))
              )}
            </div>
          </TerminalPanel>

          {/* 技能进度 */}
          <TerminalPanel title="~/skills/progress" className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp className="h-4 w-4 text-primary" /> 技能进度
              </h3>
              <Button size="sm" variant="outline" asChild>
                <Link to="/skills">
                  去学习 <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            <div className="mt-4 space-y-4">
              {SKILL_CATEGORIES.map((cat) => {
                const catSkills = SKILLS.filter((s) => s.categoryId === cat.id);
                const done = catSkills.filter(
                  (s) => state.skillStatus[s.id] === 'mastered'
                ).length;
                const learning = catSkills.filter(
                  (s) => state.skillStatus[s.id] === 'learning'
                ).length;
                return (
                  <div key={cat.id}>
                    <div className="mb-1 flex items-baseline justify-between text-xs">
                      <span className="font-medium">{cat.name}</span>
                      <span className="font-mono text-muted-foreground">
                        {done}/{catSkills.length} 掌握
                        {learning > 0 ? ` · ${learning} 学习中` : ''}
                      </span>
                    </div>
                    <Progress value={(done / catSkills.length) * 100} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          </TerminalPanel>
        </div>

        {/* 右侧栏 */}
        <div className="space-y-6">
          <TerminalPanel title="~/contests/reminder">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Radar className="h-4 w-4 text-primary" /> 报名提醒
            </h3>
            {openContests.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                暂无进行中的报名窗口，去竞赛雷达关注即将开始的赛事。
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {openContests.map((c) => (
                  <div key={c.id} className="rounded-md border border-border bg-card px-3 py-2.5">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{c.host}</span>
                      <span className="font-mono text-success">{daysText(c.regEnd, now)}</span>
                    </div>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <Link to="/contests">查看全部竞赛</Link>
                </Button>
              </div>
            )}
          </TerminalPanel>

          <TerminalPanel title="~/achievements/recent">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Terminal className="h-4 w-4 text-primary" /> 最近成就
            </h3>
            {achievements.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                完成第一个任务或掌握第一门技能，即可解锁成就。
              </p>
            ) : (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {achievements.slice(-6).map((a) => (
                  <div
                    key={a.id}
                    className="flex flex-col items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-3 text-center"
                  >
                    <span className="text-lg text-primary">◆</span>
                    <p className="text-[11px] font-medium leading-tight">{a.title}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3">
              <Button size="sm" variant="outline" className="w-full" asChild>
                <Link to="/portfolio">查看成就与履历</Link>
              </Button>
            </div>
          </TerminalPanel>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">企业需求 Top 技能</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {TOP_DEMAND_SKILLS.map((s) => (
                  <Badge key={s.id} variant="secondary" className="border border-border">
                    {s.name}
                    <span className="ml-1 text-primary">{'★'.repeat(s.demand)}</span>
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                依据 2026 年 9 月公开校招 JD 整理，热度不代表绝对优先级，按岗位方向选择。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 项目总览 */}
      <TerminalPanel title="~/projects/overview">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Briefcase className="h-4 w-4 text-primary" /> 模拟项目
          </h3>
          <Button size="sm" variant="outline" asChild>
            <Link to="/projects">
              全部项目 <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SIM_PROJECTS.map((p) => {
            const allT = p.phases.flatMap((ph) => ph.tickets);
            const done = state.joinedProjects.includes(p.id)
              ? allT.filter((t) => state.doneTasks.includes(t.id)).length
              : 0;
            const total = allT.length;
            const joined = state.joinedProjects.includes(p.id);
            const gate = gateProjectWithLevel(p, state, level);
            return (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className="rounded-md border border-border bg-card p-4 transition-colors hover:border-primary/50"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{p.title}</p>
                  {joined && total === done && (
                    <Badge className="shrink-0 bg-success/15 text-success">已完成</Badge>
                  )}
                  {joined && total !== done && (
                    <Badge className="shrink-0 bg-info/15 text-info">进行中</Badge>
                  )}
                  {!joined && (gate.tier === 'locked' ? <Badge variant="outline" className="text-muted-foreground">🔒 {gate.reason}</Badge> : gate.tier === 'gap' ? <Badge variant="outline" className="text-orange-300 border-orange-400/40">缺知识</Badge> : gate.tier === 'starter' ? <Badge className="bg-emerald-400/15 text-emerald-300">适合入门</Badge> : <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/50">极力推荐</Badge>)}
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {p.company} · {p.role}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Progress value={joined ? (done / total) * 100 : 0} className="h-1.5 flex-1" />
                  <span className="font-mono shrink-0">
                    {joined ? `${done}/${total}` : `${total} 任务`}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </TerminalPanel>
    </div>
  );
}

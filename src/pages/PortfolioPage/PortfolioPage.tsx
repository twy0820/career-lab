// 成就履历：成就墙 + 项目/竞赛经历沉淀 + 简历素材导出
import { useMemo } from 'react';
import {
  Award,
  BellRing,
  Download,
  ExternalLink,
  Flame,
  Hammer,
  Layers,
  Lock,
  Medal,
  PackageCheck,
  Rocket,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import TerminalPanel from '@/components/TerminalPanel';
import RankCard from '@/components/RankCard';
import { useProgress } from '@/state/progress-context';
import { ACHIEVEMENTS } from '@/data/achievements';
import { PROJECT_BY_ID } from '@/data/projects';
import { ARENA_BY_ID } from '@/data/arena';
import { SKILLS } from '@/data/skills';
import { useContests } from '@/hooks/use-contests';

const ICONS: Record<string, typeof Rocket> = {
  Rocket,
  PackageCheck,
  Layers,
  Sparkles,
  Award,
  Target,
  Medal,
  BellRing,
  Hammer,
  Zap,
  Flame,
};

const ticketsOf = (p: { phases: { tickets: { id: string; xp: number }[] }[] }) =>
  p.phases.flatMap((ph) => ph.tickets);

export default function PortfolioPage() {
  const { state, xp, level, achievements, projectsCompleted, setPortfolioNote } = useProgress();
  const { contests } = useContests();

  const masteredSkills = useMemo(
    () => SKILLS.filter((s) => state.skillStatus[s.id] === 'mastered'),
    [state.skillStatus]
  );

  const completedProjects = projectsCompleted
    .map((pid) => PROJECT_BY_ID[pid])
    .filter((p) => p !== undefined);

  const subs = state.submissions.map((s) => ({ s, a: ARENA_BY_ID[s.arenaId] }));

  const buildMarkdown = () => {
    const lines: string[] = [];
    lines.push('# 我的姓名（占位）');
    lines.push('');
    lines.push(`> 成长标签：实战等级 Lv.${level} · 累计 ${xp} XP`);
    lines.push('');
    lines.push('## 技能');
    if (masteredSkills.length === 0) {
      lines.push('- （暂无已掌握技能，去「技能图谱」开始学习）');
    } else {
      masteredSkills.forEach((s) => lines.push(`- ${s.name}：${s.blurb}`));
    }
    lines.push('');
    lines.push('## 项目经历（企业模拟实战）');
    if (completedProjects.length === 0) {
      lines.push('- （暂无已完成项目，去「项目实战」领取任务）');
    } else {
      completedProjects.forEach((p) => {
        const allT = ticketsOf(p);
        const done = allT.filter((t) => state.doneTasks.includes(t.id)).length;
        const xpSum = allT.reduce((s, t) => s + t.xp, 0);
        const note = state.portfolioNotes[p.id] ?? '';
        lines.push(`### ${p.title}`);
        lines.push(`- 角色：${p.role}（${p.company}）`);
        lines.push(`- 技术栈：${p.stack.join(' / ')}`);
        lines.push(
          `- 完成情况：按企业级验收标准交付 ${done}/${allT.length} 项任务（需求、开发、测试、复盘全流程），累计 +${xpSum} XP（模拟实战）`
        );
        if (note) lines.push(`- 我的备注：${note}`);
        lines.push('');
      });
    }
    lines.push('## 竞赛经历（模拟 + 收藏）');
    if (subs.length === 0 && state.favorites.length === 0) {
      lines.push('- （暂无，去「竞赛练兵」或「竞赛雷达」开始）');
    } else {
      subs.forEach(({ s, a }) => {
        if (a) {
          lines.push(`- ${a.title}（竞赛模拟）：自评 ${s.selfScore}/5，提交于 ${s.submittedAt.slice(0, 10)}`);
        }
      });
      state.favorites.forEach((fid) => {
        const c = contests.find((x) => x.id === fid);
        if (c) lines.push(`- ${c.name}（已收藏，主办：${c.host}）：${c.registrationUrl}`);
      });
    }
    lines.push('');
    lines.push('## 成就');
    if (achievements.length === 0) {
      lines.push('- （暂无成就）');
    } else {
      achievements.forEach((a) => lines.push(`- ${a.title}：${a.desc}`));
    }
    return lines.join('\n');
  };

  const handleExport = () => {
    const md = buildMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '我的简历素材.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success('简历素材已导出（Markdown 文件）');
  };

  return (
    <div className="space-y-6">
      <TerminalPanel
        title="~/portfolio"
        status={`Lv.${level}`}
        action={
          <Button size="sm" onClick={handleExport}>
            <Download className="mr-1.5 h-4 w-4" /> 导出简历素材
          </Button>
        }
      >
        <div>
          <h2 className="text-lg font-bold">成就与履历</h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            你在「实战工场」完成的一切都会沉淀到这里：已掌握的技能、做过的模拟项目、竞赛经历与
            成就徽章，一键导出成简历素材。
          </p>
        </div>
      </TerminalPanel>

      {/* 猫境段位与称号 */}
      <RankCard />

      {/* 成就墙 */}
      <TerminalPanel title="~/achievements/all">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Trophy className="h-4 w-4 text-primary" /> 成就墙
          <span className="font-mono text-xs text-muted-foreground">
            {achievements.length}/{ACHIEVEMENTS.length}
          </span>
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = achievements.some((x) => x.id === a.id);
            const Icon = ICONS[a.icon] ?? Award;
            return (
              <div
                key={a.id}
                className={`flex items-center gap-3 rounded-md border p-3 ${
                  unlocked
                    ? 'border-primary/40 bg-primary/10'
                    : 'border-border bg-card opacity-55'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                    unlocked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {unlocked ? <Icon className="h-4.5 w-4.5" /> : <Lock className="h-4 w-4" />}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">{a.title}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{a.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </TerminalPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 项目经历 */}
        <TerminalPanel title="~/portfolio/projects">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Rocket className="h-4 w-4 text-primary" /> 项目经历
          </h3>
          {completedProjects.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              还没有完成的项目。去「项目实战」加入一个项目，完成后会自动生成简历条目。
            </p>
          ) : (
            <div className="mt-3 space-y-4">
              {completedProjects.map((p) => {
                const allT = ticketsOf(p);
                const done = allT.length;
                const xpSum = allT.reduce((s, t) => s + t.xp, 0);
                const note = state.portfolioNotes[p.id] ?? '';
                return (
                  <div key={p.id} className="rounded-md border border-border bg-card p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{p.title}</p>
                      <Badge className="shrink-0 bg-success/15 text-success">已完成</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {p.role} · {p.stack.join(' / ')}
                    </p>
                    <p className="mt-2 rounded-md bg-muted/50 p-2.5 text-xs leading-relaxed text-muted-foreground">
                      作为{p.role}完成「{p.title}」，按企业级验收标准交付 {done} 项任务（需求评审、
                      开发、测试、复盘全流程），涉及 {p.stack.join('、')}，累计 +{xpSum} XP。
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        value={note}
                        onChange={(e) => setPortfolioNote(p.id, e.target.value)}
                        placeholder="补充你的角色贡献（可选，会写进简历）"
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TerminalPanel>

        {/* 竞赛与技能 */}
        <div className="space-y-6">
          <TerminalPanel title="~/portfolio/competitions">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Medal className="h-4 w-4 text-primary" /> 竞赛经历
            </h3>
            {subs.length === 0 && state.favorites.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                还没有竞赛经历。先在「竞赛练兵」完成模拟赛题，再到「竞赛雷达」报名真实赛事。
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {subs.map(({ s, a }) => (
                  <div key={s.arenaId} className="rounded-md border border-border bg-card px-3 py-2.5">
                    <p className="text-sm font-medium">{a?.title ?? s.arenaId}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                      竞赛模拟 · 自评 {s.selfScore}/5 · {s.submittedAt.slice(0, 10)}
                    </p>
                  </div>
                ))}
                {state.favorites.map((fid) => {
                  const c = contests.find((x) => x.id === fid);
                  if (!c) return null;
                  return (
                    <div key={fid} className="rounded-md border border-border bg-card px-3 py-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">{c.name}</p>
                        <a
                          href={c.registrationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex shrink-0 items-center gap-1 text-xs text-info hover:underline"
                        >
                          报名 <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        已收藏 · {c.host} · 报名截止 {c.regEnd}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </TerminalPanel>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" /> 已掌握技能（{masteredSkills.length}）
              </CardTitle>
            </CardHeader>
            <CardContent>
              {masteredSkills.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  暂无已掌握技能，去「技能图谱」把技能状态标为「已掌握」。
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {masteredSkills.map((s) => (
                    <Badge
                      key={s.id}
                      variant="outline"
                      className="border-success/40 bg-success/10 text-success"
                    >
                      {s.name}
                    </Badge>
                  ))}
                </div>
              )}
              {state.favorites.length > 0 && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Star className="h-3.5 w-3.5 text-primary" />
                  已收藏 {state.favorites.length} 个真实竞赛，工作台会持续提醒报名窗口。
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

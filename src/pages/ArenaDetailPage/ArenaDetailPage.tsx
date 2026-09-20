// 竞赛练兵：赛题详情 + 提交 + 模拟评审
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, FileCheck2, Send, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TerminalPanel from '@/components/TerminalPanel';
import { useProgress } from '@/state/progress-context';
import { ARENA_BY_ID, ARENA_STYLE_META } from '@/data/arena';
import { SKILL_BY_ID } from '@/data/skills';
import type { IArena, IArenaSubmission } from '@/data/types';

function simulateReview(sub: IArenaSubmission, arena: IArena) {
  const len = sub.solution.trim().length;
  const covered = arena.problem.scoring.map((sc, i) => {
    if (i === 0) return len >= 30;
    if (i === 1) return sub.repoLink.trim().length > 0;
    if (i === 2) return sub.selfScore >= 3;
    if (i === 3) return len >= 80;
    return false;
  });
  const simScore = arena.problem.scoring.reduce(
    (sum, sc, i) => sum + (covered[i] ? sc.weight : 0),
    0
  );
  const rankPct = Math.min(99, Math.max(5, Math.round(simScore * 0.95 + (sub.selfScore - 1) * 3)));
  return { covered, simScore, rankPct };
}

export default function ArenaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, submitArena } = useProgress();
  const arena = id ? ARENA_BY_ID[id] : undefined;

  const [solution, setSolution] = useState('');
  const [repoLink, setRepoLink] = useState('');
  const [selfScore, setSelfScore] = useState('3');

  if (!arena) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">未找到该赛题，可能已被移除。</p>
        <Button variant="outline" onClick={() => navigate('/arena')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> 返回竞赛练兵
        </Button>
      </div>
    );
  }

  const sub = state.submissions.find((s) => s.arenaId === arena.id);
  const meta = ARENA_STYLE_META[arena.style];
  const review = sub ? simulateReview(sub, arena) : null;

  const handleSubmit = () => {
    if (solution.trim().length < 10) {
      toast.error('请先填写你的方案与思路（至少 10 个字）');
      return;
    }
    submitArena({
      arenaId: arena.id,
      solution: solution.trim(),
      repoLink: repoLink.trim(),
      selfScore: Number(selfScore),
      submittedAt: new Date().toISOString(),
    });
    toast.success('提交成功，模拟评审已生成');
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/arena">
          <ArrowLeft className="mr-1 h-4 w-4" /> 返回竞赛练兵
        </Link>
      </Button>

      <TerminalPanel
        title={`~/arena/${arena.id}/problem`}
        status={sub ? 'submitted' : 'open'}
        action={
          <Badge variant={sub ? 'outline' : 'secondary'}>{sub ? '已提交' : '待提交'}</Badge>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold">{arena.title}</h2>
          <span className={`font-mono text-xs ${meta.color}`}>{meta.label}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {arena.host} · 难度{' '}
          <span className="text-primary">
            {'◆'.repeat(arena.difficulty)}
            <span className="text-muted-foreground/40">{'◆'.repeat(5 - arena.difficulty)}</span>
          </span>{' '}
          · {arena.duration}
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-primary">赛题背景</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {arena.problem.background}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary">任务要求</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{arena.problem.task}</p>
          </div>
          {arena.problem.format && (
            <div>
              <h3 className="text-sm font-semibold text-primary">输入 / 输出格式</h3>
              <pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded-md border border-border bg-muted/60 p-3 font-mono text-xs text-muted-foreground">
                {arena.problem.format}
              </pre>
            </div>
          )}
          {arena.problem.sample && (
            <div>
              <h3 className="text-sm font-semibold text-primary">样例</h3>
              <pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded-md border border-border bg-muted/60 p-3 font-mono text-xs text-muted-foreground">
                {arena.problem.sample}
              </pre>
            </div>
          )}
          {arena.problem.constraints && (
            <div>
              <h3 className="text-sm font-semibold text-primary">约束与注意</h3>
              <p className="mt-1 text-sm text-muted-foreground">{arena.problem.constraints}</p>
            </div>
          )}
        </div>
      </TerminalPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 评分标准 */}
        <TerminalPanel title={`~/arena/${arena.id}/scoring`}>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <FileCheck2 className="h-4 w-4 text-primary" /> 评分标准
          </h3>
          <div className="mt-3 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">评审维度</TableHead>
                  <TableHead className="whitespace-nowrap">说明</TableHead>
                  <TableHead className="w-16 whitespace-nowrap">权重</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {arena.problem.scoring.map((sc) => (
                  <TableRow key={sc.item}>
                    <TableCell className="whitespace-nowrap text-xs font-medium">
                      {sc.item}
                    </TableCell>
                    <TableCell className="max-w-[220px] text-xs text-muted-foreground">
                      <span className="block truncate" title={sc.detail}>
                        {sc.detail}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono">{sc.weight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {arena.skills.map((sid) => (
              <Badge key={sid} variant="secondary" className="border border-border">
                {SKILL_BY_ID[sid]?.name ?? sid}
              </Badge>
            ))}
          </div>
        </TerminalPanel>

        {/* 提交 / 评审 */}
        <TerminalPanel title={`~/arena/${arena.id}/submit`} status={sub ? 'done' : 'open'}>
          {!sub ? (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">我的提交</h3>
              <div className="space-y-2">
                <Label htmlFor="solution">方案与思路（必填）</Label>
                <Textarea
                  id="solution"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="写下你的解题思路、技术方案、关键步骤……"
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repo">代码仓库 / 作品链接（建议填）</Label>
                <Input
                  id="repo"
                  value={repoLink}
                  onChange={(e) => setRepoLink(e.target.value)}
                  placeholder="https://github.com/yourname/project"
                />
              </div>
              <div className="space-y-2">
                <Label>完成度自评（1-5）</Label>
                <Select value={selfScore} onValueChange={(v) => setSelfScore(v)}>
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} 分
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSubmit} className="w-full">
                <Send className="mr-2 h-4 w-4" /> 提交并生成模拟评审
              </Button>
              <p className="text-xs text-muted-foreground">
                模拟评审按「交付完整度规则」自动生成，仅用于自我对照，不等同于真实赛事评审。
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 p-3">
                <div>
                  <p className="text-xs text-muted-foreground">模拟评审得分</p>
                  <p className="font-mono text-3xl font-bold text-primary">{review?.simScore}/100</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">预估超越</p>
                  <p className="font-mono text-3xl font-bold text-success">
                    {review?.rankPct}%
                  </p>
                  <p className="text-[10px] text-muted-foreground">的模拟参赛者</p>
                </div>
              </div>

              <ul className="space-y-2">
                {arena.problem.scoring.map((sc, i) => (
                  <li
                    key={sc.item}
                    className="flex items-start gap-2 rounded-md border border-border px-3 py-2"
                  >
                    {review?.covered[i] ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive/70" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium">
                        {sc.item} <span className="font-mono text-muted-foreground">({sc.weight} 分)</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {review?.covered[i]
                          ? '该项覆盖充分，继续加强实现质量。'
                          : i === 0
                            ? '建议补充：把思路写清楚（≥30 字），评委首先看方案。'
                            : i === 1
                              ? '建议补充：附上代码仓库或作品链接，证明可复现。'
                              : i === 2
                                ? '建议补充：完成度自评 ≥3 并展示结果/评测数据。'
                                : '建议补充：完善文档与演示，把完整交付物补齐。'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="rounded-md border border-border bg-card p-3">
                <p className="text-xs font-medium text-muted-foreground">我的提交</p>
                <p className="mt-1 text-xs leading-relaxed">{sub.solution}</p>
                {sub.repoLink && (
                  <a
                    href={sub.repoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block truncate text-xs text-info hover:underline"
                  >
                    {sub.repoLink}
                  </a>
                )}
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  自评 {sub.selfScore}/5 · 提交于 {sub.submittedAt.slice(0, 10)}
                </p>
              </div>
            </div>
          )}
        </TerminalPanel>
      </div>

      {sub && (
        <div className="flex items-start gap-2 rounded-md border border-info/30 bg-info/10 p-3 text-xs text-info">
          <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          已提交过该赛题。你可以到「成就履历」查看这份经历沉淀；真实赛事请前往「竞赛雷达」报名。
        </div>
      )}
    </div>
  );
}

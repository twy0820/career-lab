// 课程学习弹窗：带讲解、动手练习、自检清单，看完一键标记完成
import { useState } from 'react';
import {
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Download,
  Lightbulb,
  MessageCircleQuestion,
  Wrench,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useProgress } from '@/state/progress-context';
import { LESSON_BY_ID } from '@/data/lessons';
import { SKILL_BY_ID } from '@/data/skills';
import { LESSON_DEEP_DIVES } from '@/data/lessonDeepDives';
import { ATOMIC_DIVES } from '@/data/atomicDives';
import { LESSON_PRACTICE } from '@/data/lessonPractice';
import { toolsForSkill } from '@/data/toolLinks';

interface LessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonId: string;
  stepTitle: string;
  stepDetail: string;
  stepIndex: number;
  totalSteps: number;
}

export default function LessonDialog({
  open,
  onOpenChange,
  lessonId,
  stepTitle,
  stepDetail,
  stepIndex,
  totalSteps,
}: LessonDialogProps) {
  const { state, markLessonDone } = useProgress();
  const lesson = LESSON_BY_ID[lessonId];
  const skillId = lessonId.split('-')[0];
  const skill = SKILL_BY_ID[skillId];
  const done = state.doneLessons.includes(lessonId);
  // 原子级深讲优先，再合并基础版，按 id 去重
  const baseDives = LESSON_DEEP_DIVES[lessonId] ?? [];
  const atomicList = ATOMIC_DIVES[lessonId] ?? [];
  const seen = new Set(atomicList.map((d) => d.id));
  const dives = [...atomicList, ...baseDives.filter((d) => !seen.has(d.id))];
  const practiceRef = LESSON_PRACTICE[lessonId];
  const practiceAnswer = lesson.practiceAnswer ?? practiceRef?.answer;
  const practiceVariants = lesson.practiceVariants ?? practiceRef?.variants;
  const tools = toolsForSkill(skillId);
  const [openDive, setOpenDive] = useState<string | null>(null);

  const handleDone = () => {
    markLessonDone(lessonId);
    toast.success('已完成本节课，经验 +10');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[92vh] w-[min(1100px,96vw)] max-w-none flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="border border-border">
              {skill?.name ?? skillId}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">
              第 {stepIndex + 1} / {totalSteps} 课
            </span>
          </div>
          <DialogTitle className="mt-2 text-xl">{stepTitle}</DialogTitle>
          <DialogDescription>{stepDetail}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
        {lesson ? (
          <div className="space-y-5">
            {/* 学习目标 */}
            <div className="rounded-md border border-primary/30 bg-primary/10 p-3.5">
              <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Lightbulb className="h-4 w-4" /> 学完你将能
              </p>
              <p className="mt-1.5 text-sm leading-relaxed">{lesson.goal}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                建议用时约 {lesson.minutes} 分钟
              </p>
            </div>

            {/* 本课程需要的工具：直达官网下载，不用自己搜 */}
            <div className="rounded-md border border-info/30 bg-info/5 p-3.5">
              <p className="flex items-center gap-2 text-sm font-semibold text-info">
                <Download className="h-4 w-4" /> 先装好这些工具（点名字直达官网下载）
              </p>
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {tools.map((t) => (
                  <li key={t.url} className="text-xs leading-relaxed">
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-info underline-offset-2 hover:underline"
                    >
                      {t.name}
                    </a>
                    <span className="text-muted-foreground"> — {t.purpose}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 讲解 */}
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <BookOpen className="h-4 w-4 text-primary" /> 讲解
              </p>
              {lesson.teach.map((b, i) =>
                b.type === 'code' ? (
                  <pre
                    key={i}
                    className="overflow-x-auto rounded-md border border-border bg-muted/60 p-3 font-mono text-xs leading-relaxed"
                  >
                    {b.text}
                  </pre>
                ) : b.type === 'note' ? (
                  <div
                    key={i}
                    className="rounded-md border border-info/30 bg-info/10 p-3 text-xs leading-relaxed text-info"
                  >
                    小贴士：{b.text}
                  </div>
                ) : (
                  <p key={i} className="text-sm leading-relaxed">
                    {b.text}
                  </p>
                )
              )}
            </div>

            {/* 宝典式专项深讲：哪个点没懂就点开，从正式定义一路讲到带运行结果的示例 */}
            {dives.length > 0 && (
              <div className="rounded-md border border-warning/40 bg-warning/5 p-3.5">
                <p className="flex items-center gap-2 text-sm font-semibold text-warning">
                  <MessageCircleQuestion className="h-4 w-4" />
                  宝宝级宝典：哪个点没看懂？点它，从 0 讲到能上手
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  不只讲“它是什么”，更讲“哪些是固定语法、哪些部分你能改、改完跑出来是什么结果”。
                </p>
                <div className="mt-3 space-y-2.5">
                  {dives.map((d) => {
                    const open = openDive === d.id;
                    return (
                      <div key={d.id} className="rounded-md border border-border bg-card">
                        <button
                          type="button"
                          onClick={() => setOpenDive(open ? null : d.id)}
                          className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium hover:bg-muted/40"
                        >
                          <span className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-warning/15 text-xs text-warning">
                              ?
                            </span>
                            {d.point}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {open && (
                          <div className="space-y-4 border-t border-border px-3 py-4">
                            {/* ① 正式定义 */}
                            <section>
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                                一、正式定义
                              </p>
                              <p className="text-sm leading-relaxed">{d.formalDef}</p>
                            </section>

                            {/* ② 固定语法骨架 */}
                            <section>
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                                二、固定语法骨架（照抄即可）
                              </p>
                              <pre className="overflow-x-auto rounded-md border border-border bg-muted/60 p-3 font-mono text-xs leading-relaxed">
                                {d.fixed}
                              </pre>
                            </section>

                            {/* ③ 哪些可变 */}
                            <section>
                              <div className="rounded-md border border-info/30 bg-info/10 p-2.5 text-xs leading-relaxed text-info">
                                <span className="font-semibold">哪些是固定搭配 / 哪些部分你能改：</span>
                                {d.variable}
                              </div>
                            </section>

                            {/* ④ 带运行结果的递进示例 */}
                            <section>
                              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                                三、从小到大的示例（含运行结果）
                              </p>
                              <div className="space-y-3">
                                {d.examples.map((ex, i) => (
                                  <div key={i} className="rounded-md border border-border bg-muted/20">
                                    <p className="border-b border-border px-3 py-1 text-[11px] text-muted-foreground">
                                      示例 {i + 1}
                                    </p>
                                    <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed">
                                      {ex.code}
                                    </pre>
                                    <div className="border-t border-border bg-[#0b1220] px-3 py-2">
                                      <p className="mb-1 text-[10px] text-[#4ade80]/60">运行结果</p>
                                      <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-[#4ade80]">
                                        {ex.output}
                                      </pre>
                                    </div>
                                    {ex.note && (
                                      <p className="border-t border-border px-3 py-1.5 text-xs text-muted-foreground">
                                        解读：{ex.note}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </section>

                            {/* ⑤ 新手坑 + ⑥ 实战搭配 */}
                            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs leading-relaxed text-destructive">
                              新手最常踩的坑：{d.rookie}
                            </div>
                            <div className="flex items-start gap-2 rounded-md border border-success/30 bg-success/5 p-2.5 text-xs leading-relaxed text-success">
                              <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                              实际工作里怎么和别的知识配合：{d.realWorld}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 动手练习 + 参考答案 */}
            <div className="rounded-md border border-border bg-card p-3.5">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <ClipboardList className="h-4 w-4 text-primary" /> 动手练习
              </p>
              <p className="mt-1.5 text-sm leading-relaxed">{lesson.practice}</p>
              {practiceAnswer && (
                <details className="mt-3 rounded-md border border-primary/30 bg-primary/5">
                  <summary className="cursor-pointer select-none px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10">
                    先自己做，卡住再展开看参考答案 / 示范
                  </summary>
                  <pre className="overflow-x-auto whitespace-pre-wrap border-t border-primary/20 px-3 py-2.5 font-mono text-xs leading-relaxed text-foreground/90">
                    {practiceAnswer}
                  </pre>
                </details>
              )}
              {practiceVariants && practiceVariants.length > 0 && (
                <div className="mt-3 rounded-md border border-success/30 bg-success/5 p-3">
                  <p className="text-xs font-semibold text-success">举一反三：换个皮再练一次</p>
                  <ul className="mt-2 space-y-1.5">
                    {practiceVariants.map((v, i) => (
                      <li key={i} className="text-xs leading-relaxed text-foreground/80">
                        <span className="font-medium">{v.name}：</span>
                        {v.note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 自检 */}
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4 text-primary" /> 自检清单（能答出来就算学会）
              </p>
              <ul className="mt-2 space-y-1.5">
                {lesson.checklist.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
                {done ? '本节课已完成' : '看完讲解 + 做完练习后，点右侧按钮标记完成'}
              </p>
              <Button onClick={handleDone} disabled={done}>
                <BadgeCheck className="mr-1.5 h-4 w-4" />
                {done ? '已完成' : '我学完了，标记完成'}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">本节课内容建设中，先看路径介绍。</p>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

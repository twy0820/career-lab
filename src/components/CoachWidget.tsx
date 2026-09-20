// 喵喵向导：右下角悬浮猫咪向导，给下一步建议，并可查看任务清单与追踪
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ListTodo, X, MessageCircleQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useProgress } from '@/state/progress-context';
import { PROJECT_BY_ID } from '@/data/projects';
import { SKILL_BY_ID } from '@/data/skills';
import { BEGINNER_TRACK } from '@/data/lessons';
import { searchDives, buildDictionaryAnswer, TUTOR_TIPS, type TutorHit } from '@/lib/tutor';

interface Rec {
  title: string;
  desc: string;
  href: string;
  action: string;
  reason: string;
  focusSkillId?: string;
}

function computeRec(state: ReturnType<typeof useProgress>['state']): Rec {
  const next = BEGINNER_TRACK.find(
    (t) => !state.doneLessons.includes(`${t.skillId}-${t.stepIndex}`)
  );
  if (next) {
    const s = SKILL_BY_ID[next.skillId];
    return {
      title: `新手主线：${s.name} · 第 ${next.stepIndex + 1} 课`,
      desc: next.why,
      href: '/skills',
      action: '打开课程',
      reason: '0 基础第一步：按主线学，别自己乱找资料',
      focusSkillId: next.skillId,
    };
  }
  if (state.joinedProjects.length === 0) {
    return {
      title: '加入你的第一个企业实战项目',
      desc: '推荐「智答 · 企业知识库 RAG 助手」——和你刚学的大模型技能直接对口，最容易出成果。',
      href: '/projects',
      action: '去选项目',
      reason: '课学完了，该在真实任务里练手了',
    };
  }
  for (const pid of state.joinedProjects) {
    const p = PROJECT_BY_ID[pid];
    if (!p) continue;
    const pendingPhase = p.phases.find(
      (ph) => !ph.tickets.every((t) => state.doneTasks.includes(t.id))
    );
    if (pendingPhase) {
      const undoneTickets = pendingPhase.tickets.filter(
        (t) => !state.doneTasks.includes(t.id)
      );
      const missingDeliverables = pendingPhase.deliverables.filter(
        (d) => !(state.deliverableNotes[d.id] ?? '').trim()
      );
      const desc =
        missingDeliverables.length > 0
          ? `先写产出物：${missingDeliverables.map((d) => d.name).join('、')}；再做任务：${undoneTickets
              .map((t) => t.title)
              .join('、')}`
          : `下一步任务：${undoneTickets.map((t) => t.title).join('、')}`;
      return {
        title: `进行中：${p.title} · ${pendingPhase.name}`,
        desc,
        href: `/projects/${pid}`,
        action: '继续推进',
        reason: '项目要按阶段推进，别跳步',
      };
    }
  }
  return {
    title: '手头项目都做完了，干得漂亮',
    desc: '去「竞赛练兵」做一道模拟赛题检验自己，或者再加入一个新项目攒更多履历。',
    href: '/arena',
    action: '去练兵',
    reason: '保持节奏，学习最怕停',
  };
}

interface TaskRow {
  pid: string;
  projectTitle: string;
  phase: string;
  task: string;
  href: string;
}

function buildTaskList(state: ReturnType<typeof useProgress>['state']): TaskRow[] {
  const rows: TaskRow[] = [];
  for (const pid of state.joinedProjects) {
    const p = PROJECT_BY_ID[pid];
    if (!p) continue;
    for (const ph of p.phases) {
      for (const t of ph.tickets) {
        if (!state.doneTasks.includes(t.id)) {
          rows.push({
            pid,
            projectTitle: p.title,
            phase: ph.name,
            task: t.title,
            href: `/projects/${pid}`,
          });
        }
      }
    }
  }
  return rows;
}

export default function CoachWidget() {
  const { state, setCoachMode, nickname } = useProgress();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'next' | 'tasks' | 'ask'>('next');
  const [input, setInput] = useState('');
  const [hit, setHit] = useState<TutorHit | null>(null);
  const [asked, setAsked] = useState('');

  if (!state.coachMode) return null;
  const rec = computeRec(state);
  const tasks = buildTaskList(state);
  const doneCount = state.doneTasks.length;

  const go = (href: string) => {
    navigate(href);
    setOpen(false);
    if (rec.focusSkillId) {
      setTimeout(() => {
        const el = document.getElementById(`skill-${rec.focusSkillId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
          setTimeout(() => el.classList.remove('ring-2', 'ring-primary', 'ring-offset-2'), 2500);
        }
      }, 120);
    }
  };

  const ask = (q: string) => {
    const query = q.trim();
    if (!query) return;
    const hits = searchDives(query, 3);
    setAsked(query);
    setInput('');
    setHit(hits[0] ?? null);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="w-80 rounded-lg border border-primary/40 bg-popover p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-bold">
              <img src="/mascot.jpg" alt="喵喵向导" className="h-6 w-6 rounded-full object-cover ring-1 ring-primary/50" />
              喵喵向导 · {nickname || '猫同学'}
            </p>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex gap-1 rounded-md bg-muted/60 p-1 text-xs">
            <button
              onClick={() => setTab('next')}
              className={`flex-1 rounded px-2 py-1 ${tab === 'next' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            >
              下一步
            </button>
            <button
              onClick={() => setTab('tasks')}
              className={`flex-1 rounded px-2 py-1 ${tab === 'tasks' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            >
              <span className="inline-flex items-center gap-1">
                <ListTodo className="h-3.5 w-3.5" /> 任务清单（{tasks.length}）
              </span>
            </button>
            <button
              onClick={() => setTab('ask')}
              className={`flex-1 rounded px-2 py-1 ${tab === 'ask' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            >
              <span className="inline-flex items-center gap-1">
                <MessageCircleQuestion className="h-3.5 w-3.5" /> 问喵喵
              </span>
            </button>
          </div>

          {tab === 'next' ? (
            <>
              <p className="mt-2 text-xs text-muted-foreground">{rec.reason}</p>
              <div className="mt-2 rounded-md border border-border bg-muted/40 p-3">
                <p className="text-sm font-semibold">{rec.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{rec.desc}</p>
              </div>
              <Button className="mt-3 w-full" onClick={() => go(rec.href)}>
                {rec.action} <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          ) : tab === 'tasks' ? (
            <>n              <p className="mt-2 text-xs text-muted-foreground">
                已完成 {doneCount} 个任务，待办 {tasks.length} 个。点任务直接跳到对应项目阶段。
              </p>
              <div className="mt-2 max-h-64 space-y-2 overflow-y-auto pr-1">
                {tasks.length === 0 && (
                  <p className="rounded-md border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                    没有待办任务，去加入新项目或做竞赛吧。
                  </p>
                )}
                {tasks.map((t, i) => (
                  <button
                    key={`${t.pid}-${i}`}
                    onClick={() => go(t.href)}
                    className="block w-full rounded-md border border-border bg-muted/40 p-2 text-left transition hover:border-primary/40"
                  >
                    <p className="text-xs font-medium">{t.task}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {t.projectTitle} · {t.phase}
                    </p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-xs text-muted-foreground">
                哪个知识点没看懂，直接打字问我（比如「__name__ 是什么」「+ 怎么用」）。我从课程库里查，不瞎编。
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {TUTOR_TIPS.map((tip) => (
                  <button
                    key={tip}
                    onClick={() => ask(tip)}
                    className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  >
                    {tip}
                  </button>
                ))}
              </div>
              <div className="mt-2 max-h-72 overflow-y-auto pr-1">
                {asked && !hit && (
                  <div className="rounded-md border border-dashed border-border p-2 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>没直接讲到「{asked}」。换个关键词再问。</span>
                      <button
                        onClick={() => { setHit(null); setAsked(''); }}
                        className="text-[10px] text-muted-foreground hover:text-foreground"
                      >
                        清除
                      </button>
                    </div>
                  </div>
                )}
                {hit && (
                  <div className="relative">
                    <button
                      onClick={() => { setHit(null); setAsked(''); }}
                      className="absolute right-1 top-1 rounded p-1 text-[10px] text-muted-foreground hover:bg-accent hover:text-foreground"
                      title="清除这条回答"
                    >
                      清除 ✕
                    </button>
                    <pre className="whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-2 text-[11px] leading-relaxed">
{buildDictionaryAnswer(hit)}
                    </pre>
                  </div>
                )}
              </div>
              <div className="mt-2 flex gap-1">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && ask(input)}
                  placeholder="问喵喵：哪个不懂？"
                  className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs outline-none focus:border-primary/50"
                />
                <Button size="sm" onClick={() => ask(input)}>问</Button>
              </div>
            </>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-xs">
            <span className="text-muted-foreground">关闭喵喵向导</span>
            <Switch checked={state.coachMode} onCheckedChange={setCoachMode} />
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-14 w-14 overflow-hidden rounded-full border-2 border-primary/60 shadow-lg shadow-primary/30 transition hover:scale-105 hover:shadow-xl"
        title="喵喵向导：告诉我下一步 / 查看任务清单"
      >
        <img src="/mascot.jpg" alt="喵喵向导" className="h-full w-full object-cover" />
      </button>
    </div>
  );
}

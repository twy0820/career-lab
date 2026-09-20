// 技能图谱：分类浏览技能、学习路径、企业需求热度与状态标记
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Building2, Check, Circle, Compass, ExternalLink, GraduationCap, Rocket, Swords } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TerminalPanel from '@/components/TerminalPanel';
import LessonDialog from '@/components/LessonDialog';
import { useProgress } from '@/state/progress-context';
import {
  SKILLS,
  SKILL_CATEGORIES,
  TOP_DEMAND_SKILLS,
  DEMAND_SOURCE_NOTE,
} from '@/data/skills';
import { PROJECT_BY_ID } from '@/data/projects';
import { ARENA_BY_ID } from '@/data/arena';
import { LESSON_BY_ID, BEGINNER_TRACK, ADVANCED_TRACK, SIDE_TRACKS } from '@/data/lessons';
import type { ITrackItem } from '@/data/lessons';
import type { ISkill, ISkillStatus } from '@/data/types';

const JD_SOURCES = [
  { name: '腾讯招聘 · 后端/Agent 岗位', url: 'https://hr.tencent.com/m/jobdesc.html?postId=1915242132004782080' },
  { name: '曙光信息 · AI Infra 校招岗', url: 'https://sugon.zhiye.com/campus/jobs' },
  { name: '拼多多云弧计划 · AI Infra 研发', url: 'https://career.nankai.edu.cn/correcruit/content/id/116282.html' },
  { name: 'BOSS直聘 · AI 应用开发工程师 26 校招', url: 'https://www.zhipin.com/job_detail/c8ef3f9865a8890c0nZ-3ty6EVpS.html' },
  { name: '猎聘 · IT 校招 Java/Python 方向', url: 'https://www.liepin.com/a/78867121.shtml' },
  { name: '牛客 · Go 后端开发 2026 校招', url: 'https://mnowpick.nowcoder.com/m/detail/index?jobId=440327' },
  { name: '上海AI实验室 · 多模态大模型研究员', url: 'https://www.shlab.org.cn/joinus/detail/7655242543031273737?mode=6' },
  { name: '湖南大学就业网 · Java 后端岗位', url: 'https://scc.hnu.edu.cn/detail/career?id=684678' },
];

const STATUS_META: Record<ISkillStatus, { label: string; pill: string; dot: string }> = {
  todo: { label: '未开始', pill: 'border-border bg-muted/60 text-muted-foreground', dot: 'bg-muted-foreground' },
  learning: { label: '学习中', pill: 'border-info/50 bg-info/15 text-info', dot: 'bg-info' },
  mastered: { label: '已掌握', pill: 'border-success/50 bg-success/15 text-success', dot: 'bg-success' },
};

function SkillCard({ skill }: { skill: ISkill }) {
  const { state, setSkillStatus } = useProgress();
  const status = state.skillStatus[skill.id] ?? 'todo';
  const [open, setOpen] = useState(false);
  const [lesson, setLesson] = useState<{
    id: string;
    title: string;
    detail: string;
    idx: number;
  } | null>(null);

  const totalLessons = skill.steps.filter((_, i) => LESSON_BY_ID[`${skill.id}-${i}`]).length;
  const doneLessons = skill.steps.filter((_, i) =>
    state.doneLessons.includes(`${skill.id}-${i}`)
  ).length;
  const pct = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0;

  return (
    <Card id={`skill-${skill.id}`} className="flex h-full flex-col scroll-mt-20">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm">{skill.name}</CardTitle>
          <span className="shrink-0 font-mono text-xs text-primary" title="企业需求热度">
            {'★'.repeat(skill.demand)}
            <span className="text-muted-foreground">{'★'.repeat(5 - skill.demand)}</span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{skill.blurb}</p>

        {/* 状态 + 进度 */}
        <div className="mt-2 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_META[status].pill}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${STATUS_META[status].dot}`} />
            {STATUS_META[status].label}
          </span>
          <span className="ml-auto font-mono text-[11px] text-muted-foreground">
            {doneLessons}/{totalLessons} 课
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all ${
              status === 'mastered' ? 'bg-success' : status === 'learning' ? 'bg-info' : 'bg-muted-foreground/40'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex gap-1.5">
          {(Object.keys(STATUS_META) as ISkillStatus[]).map((s) => (
            <Button
              key={s}
              type="button"
              size="sm"
              variant={status === s ? 'default' : 'outline'}
              className={`h-7 flex-1 px-2 text-xs ${
                status === s
                  ? s === 'learning'
                    ? 'border-info bg-info text-info-foreground hover:bg-info/90'
                    : s === 'mastered'
                      ? 'border-success bg-success text-success-foreground hover:bg-success/90'
                      : 'bg-foreground text-background hover:bg-foreground/90'
                  : ''
              }`}
              onClick={() => setSkillStatus(skill.id, s)}
            >
              {s === 'todo' && <Circle className="mr-1 h-3 w-3" />}
              {s === 'learning' && <BookOpen className="mr-1 h-3 w-3" />}
              {s === 'mastered' && <Check className="mr-1 h-3 w-3" />}
              {STATUS_META[s].label}
            </Button>
          ))}
        </div>

        <Collapsible open={open} onOpenChange={setOpen} className="mt-auto">
          <CollapsibleTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="w-full justify-between px-2">
              学习路径 {open ? '收起' : '展开'}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {skill.steps.map((st, i) => {
              const lessonId = `${skill.id}-${i}`;
              const hasLesson = Boolean(LESSON_BY_ID[lessonId]);
              const done = state.doneLessons.includes(lessonId);
              return (
                <button
                  key={st.title}
                  type="button"
                  disabled={!hasLesson}
                  onClick={() =>
                    hasLesson &&
                    setLesson({ id: lessonId, title: st.title, detail: st.detail, idx: i })
                  }
                  className={`w-full rounded-md border p-2.5 text-left transition ${
                    done
                      ? 'border-success/40 bg-success/10'
                      : 'border-border bg-muted/40 hover:border-primary/50'
                  }`}
                  title={hasLesson ? '点开学习这一课' : '内容建设中'}
                >
                  <div className="flex items-center gap-1.5">
                    {done ? (
                      <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                    ) : (
                      <span className="font-mono text-primary">{i + 1}.</span>
                    )}
                    <p className="text-xs font-medium">{st.title}</p>
                    {hasLesson && !done && (
                      <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-[10px]">
                        点开学
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{st.detail}</p>
                </button>
              );
            })}
            {(skill.linkedProjects.length > 0 || skill.linkedArena.length > 0) && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skill.linkedProjects.map((pid) => (
                  <Link key={pid} to={`/projects/${pid}`}>
                    <Badge variant="outline" className="gap-1 hover:border-primary/50">
                      <Building2 className="h-3 w-3" />
                      {PROJECT_BY_ID[pid]?.title.slice(0, 12)}…
                    </Badge>
                  </Link>
                ))}
                {skill.linkedArena.map((aid) => (
                  <Link key={aid} to={`/arena/${aid}`}>
                    <Badge variant="outline" className="gap-1 hover:border-primary/50">
                      <Swords className="h-3 w-3" />
                      {ARENA_BY_ID[aid]?.title.slice(0, 12)}…
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      {lesson && (
        <LessonDialog
          open={lesson !== null}
          onOpenChange={(v) => !v && setLesson(null)}
          lessonId={lesson.id}
          stepTitle={lesson.title}
          stepDetail={lesson.detail}
          stepIndex={lesson.idx}
          totalSteps={skill.steps.length}
        />
      )}
    </Card>
  );
}

function TrackBanner({
  title,
  blurb,
  items,
  tone,
  icon: Icon,
}: {
  title: string;
  blurb: string;
  items: ITrackItem[];
  tone: 'primary' | 'accent' | 'muted';
  icon: typeof GraduationCap;
}) {
  const { state } = useProgress();
  const done = items.filter((t) =>
    state.doneLessons.includes(`${t.skillId}-${t.stepIndex}`)
  ).length;
  const toneCls = {
    primary: 'border-primary/40 bg-primary/10 text-primary',
    accent: 'border-info/40 bg-info/10 text-info',
    muted: 'border-border bg-card text-foreground',
  }[tone];
  return (
    <div className={`rounded-lg border p-4 ${toneCls}`}>
      <p className="flex items-center gap-2 text-sm font-bold">
        <Icon className="h-4 w-4" /> {title}（共 {items.length} 课）
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{blurb}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        已完成 {done} / {items.length}。
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {items.map((t, i) => {
          const id = `${t.skillId}-${t.stepIndex}`;
          const isDone = state.doneLessons.includes(id);
          const s = SKILLS.find((x) => x.id === t.skillId);
          return (
            <span
              key={i}
              title={t.why}
              className={`rounded-full border px-2.5 py-1 text-[11px] ${
                isDone
                  ? 'border-success/40 bg-success/10 text-success'
                  : 'border-border bg-card text-muted-foreground'
              }`}
            >
              {i + 1}. {s?.name ?? t.skillId} 第{t.stepIndex + 1}课
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function SkillsPage() {
  const [tab, setTab] = useState('all');
  const skills = tab === 'all' ? SKILLS : SKILLS.filter((s) => s.categoryId === tab);

  return (
    <div className="space-y-6">
      <TerminalPanel title="~/skills/map">
        <div>
          <h2 className="text-lg font-bold">技能图谱</h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            按「2026 年秋招岗位要求」梳理的高频技能。企业要求最多的编程语言（C/C++、Python、Java、Go）
            与 AI 应用（RAG/Agent）都标了需求热度；每门技能配套学习路径和可练手的模拟项目/竞赛，
            学完直接到项目里用。
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{DEMAND_SOURCE_NOTE}</p>
        </div>
      </TerminalPanel>

      {/* 学习路线：新手主线 → 进阶主线 → 各支线方向 */}
      <TrackBanner
        title="新手主线"
        blurb="0 基础按这个顺序学。学完就具备加入第一个企业项目的基础。"
        items={BEGINNER_TRACK}
        tone="primary"
        icon={GraduationCap}
      />
      <TrackBanner
        title="进阶主线"
        blurb="新手主线毕业后走这条，目标是能独立写出完整后端 / AI 服务。"
        items={ADVANCED_TRACK}
        tone="accent"
        icon={Rocket}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {SIDE_TRACKS.map((t) => (
          <TrackBanner
            key={t.id}
            title={t.name}
            blurb={t.blurb}
            items={t.items}
            tone="muted"
            icon={Compass}
          />
        ))}
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-primary" /> 企业需求 Top 技能
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {TOP_DEMAND_SKILLS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 text-xs">
                <span className="w-5 shrink-0 font-mono text-primary">#{i + 1}</span>
                <span className="w-24 shrink-0 font-medium">{s.name}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(s.demand / 5) * 100}%` }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right font-mono text-muted-foreground">
                  {s.demand}/5
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">全部</TabsTrigger>
          {SKILL_CATEGORIES.map((c) => (
            <TabsTrigger key={c.id} value={c.id}>
              {c.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {skills.map((s) => (
            <SkillCard key={s.id} skill={s} />
          ))}
        </div>
      </Tabs>

      <Collapsible className="rounded-lg border border-border bg-card">
        <CollapsibleTrigger asChild>
          <Button type="button" variant="ghost" className="w-full justify-between px-4">
            <span className="text-sm font-medium">技能热度依据的公开岗位信息</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4">
          <ul className="space-y-1.5">
            {JD_SOURCES.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-info hover:underline"
                >
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

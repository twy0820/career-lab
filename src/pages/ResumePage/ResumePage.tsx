// 简历生成器：填写个人信息 + 自动拉取成就/履历 → 生成可导出的简历
import { useMemo, useState } from 'react';
import { Download, FileText, Printer, RefreshCw, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import TerminalPanel from '@/components/TerminalPanel';
import { useProgress } from '@/state/progress-context';
import { store } from '@/lib/store';
import { PROJECT_BY_ID } from '@/data/projects';
import { ARENA_BY_ID } from '@/data/arena';
import { SKILLS } from '@/data/skills';
import { useContests } from '@/hooks/use-contests';

interface IResumeForm {
  name: string;
  phone: string;
  email: string;
  school: string;
  major: string;
  degree: string;
  gradYear: string;
  targetRole: string;
  skillsText: string;
  selfEval: string;
}

const FORM_KEY = 'resume-form-v1';
const DEFAULT_FORM: IResumeForm = {
  name: '',
  phone: '',
  email: '',
  school: '',
  major: '',
  degree: '本科',
  gradYear: '',
  targetRole: '',
  skillsText: '',
  selfEval: '',
};

const ticketsOf = (p: { phases: { tickets: { id: string; xp: number }[] }[] }) =>
  p.phases.flatMap((ph) => ph.tickets);

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default function ResumePage() {
  const { state, xp, level, achievements, projectsCompleted } = useProgress();
  const { contests } = useContests();
  const [form, setForm] = useState<IResumeForm>(() =>
    store.get<IResumeForm>(FORM_KEY, DEFAULT_FORM)
  );

  const masteredSkills = useMemo(
    () => SKILLS.filter((s) => state.skillStatus[s.id] === 'mastered'),
    [state.skillStatus]
  );
  const completedProjects = useMemo(
    () => projectsCompleted.map((pid) => PROJECT_BY_ID[pid]).filter(Boolean),
    [projectsCompleted]
  );
  const subs = state.submissions.map((s) => ({ s, a: ARENA_BY_ID[s.arenaId] }));

  const set = (k: keyof IResumeForm, v: string) => {
    setForm((f) => {
      const next = { ...f, [k]: v };
      store.set(FORM_KEY, next);
      return next;
    });
  };

  const buildHtml = (): string => {
    const skillList = [
      ...masteredSkills.map((s) => s.name),
      ...form.skillsText
        .split(/[,，、\n]/)
        .map((x) => x.trim())
        .filter(Boolean),
    ];
    const uniqSkills = [...new Set(skillList)];

    const projectHtml = completedProjects.length
      ? completedProjects
          .map((p) => {
            const allT = ticketsOf(p);
            const done = allT.filter((t) => state.doneTasks.includes(t.id)).length;
            const note = state.portfolioNotes[p.id] ?? '';
            return `<div class="item">
              <div class="item-head"><b>${esc(p.title)}</b><span class="meta">${esc(p.role)} · ${esc(p.company)}</span></div>
              <div class="tags">${p.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join('')}</div>
              <p>按企业级验收标准完成需求评审、开发、测试与复盘全流程，交付 ${done}/${allT.length} 项任务（模拟企业实战）。</p>
              ${note ? `<p class="note">个人贡献：${esc(note)}</p>` : ''}
            </div>`;
          })
          .join('')
      : '<p class="empty">暂无项目经历，去「项目实战」完成企业模拟项目后会自动填入。</p>';

    const contestItems: string[] = [];
    subs.forEach(({ s, a }) => {
      if (a) contestItems.push(`<li>${esc(a.title)}（竞赛模拟 · 自评 ${s.selfScore}/5）</li>`);
    });
    state.favorites.forEach((fid) => {
      const c = contests.find((x) => x.id === fid);
      if (c) contestItems.push(`<li>${esc(c.name)}（已报名/关注 · ${esc(c.host)}）</li>`);
    });
    const contestHtml = contestItems.length
      ? `<ul>${contestItems.join('')}</ul>`
      : '<p class="empty">暂无竞赛经历，去「竞赛练兵」「竞赛雷达」参与。</p>';

    const achievementHtml = achievements.length
      ? `<ul>${achievements.map((a) => `<li>${esc(a.title)}：${esc(a.desc)}</li>`).join('')}</ul>`
      : '<p class="empty">完成学习与项目后会解锁成就。</p>';

    return `<!doctype html>
<html lang="zh"><head><meta charset="utf-8"/>
<title>${esc(form.name || '我的简历')} - 简历</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif; color:#1f2937; margin:0; background:#f3f4f6; }
  .page { max-width: 800px; margin: 24px auto; background:#fff; padding: 40px 48px; box-shadow:0 2px 12px rgba(0,0,0,.08); }
  h1 { font-size: 28px; margin: 0; }
  .role { font-size: 16px; color:#b45309; margin: 4px 0 12px; }
  .contact { font-size: 13px; color:#4b5563; border-bottom: 2px solid #b45309; padding-bottom: 14px; }
  h2 { font-size: 15px; color:#b45309; border-left: 4px solid #b45309; padding-left: 8px; margin: 22px 0 10px; }
  .tags { margin: 6px 0; }
  .tag { display:inline-block; background:#fef3c7; color:#92400e; border-radius:4px; padding:2px 8px; font-size:12px; margin:2px 4px 2px 0; }
  .item { margin-bottom: 14px; }
  .item-head { display:flex; justify-content:space-between; flex-wrap:wrap; }
  .meta { font-size: 12px; color:#6b7280; }
  .item p { margin: 4px 0; font-size: 13px; line-height: 1.6; }
  .note { color:#374151; }
  ul { margin: 6px 0; padding-left: 20px; font-size: 13px; line-height: 1.7; }
  .empty { color:#9ca3af; font-size: 13px; }
  .grid { display:flex; justify-content:space-between; }
  @media print { body{background:#fff;} .page{box-shadow:none;margin:0;max-width:100%;} }
</style></head>
<body><div class="page">
  <h1>${esc(form.name || '你的姓名')}</h1>
  <div class="role">求职意向：${esc(form.targetRole || '（填写意向岗位）')} · 成长等级 Lv.${level}</div>
  <div class="contact">
    ${esc(form.phone)} ${form.phone ? '·' : ''} ${esc(form.email)}
  </div>

  <h2>教育背景</h2>
  <div class="grid">
    <span><b>${esc(form.school || '学校')}</b> · ${esc(form.major || '专业')} · ${esc(form.degree)}</span>
    <span>${esc(form.gradYear || '毕业年份')}</span>
  </div>

  ${form.selfEval ? `<h2>个人简介</h2><p style="font-size:13px;line-height:1.7">${esc(form.selfEval)}</p>` : ''}

  <h2>专业技能</h2>
  <div class="tags">
    ${uniqSkills.length ? uniqSkills.map((s) => `<span class="tag">${esc(s)}</span>`).join('') : '<span class="empty">在技能图谱把技能标为「已掌握」或在此填写。</span>'}
  </div>

  <h2>项目经历（企业模拟实战）</h2>
  ${projectHtml}

  <h2>竞赛 / 荣誉</h2>
  ${contestHtml}

  <h2>能力成就</h2>
  ${achievementHtml}

  <p style="margin-top:24px;font-size:11px;color:#9ca3af">本简历由「实战工场 TechForge Lab」生成 · 累计 ${xp} XP · 项目经历为企业全流程模拟实战，用于展示工程能力。</p>
</div></body></html>`;
  };

  const handleDownload = () => {
    const html = buildHtml();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.name || '我的'}-简历.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success('简历 HTML 已下载，双击打开后可在浏览器里另存为 PDF');
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win) {
      toast.error('浏览器拦截了弹窗，请允许弹出后再试');
      return;
    }
    win.document.write(buildHtml());
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  };

  const field = (k: keyof IResumeForm, label: string, placeholder = '') => (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input
        value={form[k]}
        placeholder={placeholder}
        onChange={(e) => set(k, e.target.value)}
        className="h-9 text-sm"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <TerminalPanel
        title="~/resume/builder"
        status={`Lv.${level}`}
        action={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handlePrint}>
              <Printer className="mr-1.5 h-4 w-4" /> 打印 / 存 PDF
            </Button>
            <Button size="sm" onClick={handleDownload}>
              <Download className="mr-1.5 h-4 w-4" /> 下载简历
            </Button>
          </div>
        }
      >
        <div>
          <h2 className="text-lg font-bold">简历生成器</h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            填写下方基本信息，平台会自动把你已掌握的技能、完成的企业模拟项目、竞赛经历与成就
            包装成一份排版好的简历，可直接下载或打印为 PDF。数据只保存在你本机浏览器。
          </p>
        </div>
      </TerminalPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 表单 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-primary" /> 基本信息
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {field('name', '姓名', '张三')}
            {field('targetRole', '求职意向', '如：后端开发 / 数据分析师')}
            {field('phone', '手机号', '138...')}
            {field('email', '邮箱', 'you@example.com')}
            {field('school', '学校', '湖南第一师范学院')}
            {field('major', '专业', '数据科学与大数据技术')}
            {field('degree', '学历', '本科')}
            {field('gradYear', '毕业年份', '2027')}
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">补充技能（逗号分隔，会和已掌握技能合并）</Label>
              <Input
                value={form.skillsText}
                placeholder="如：Python, C++, SQL, PyTorch, Git"
                onChange={(e) => set('skillsText', e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">个人简介（选填，3-5 行）</Label>
              <Textarea
                value={form.selfEval}
                rows={4}
                placeholder="如：数据科学专业，熟悉 Python/SQL 与机器学习流程，完成过企业级全栈项目模拟..."
                onChange={(e) => set('selfEval', e.target.value)}
                className="text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* 自动拉取的履历 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <RefreshCw className="h-4 w-4 text-primary" /> 自动装入的履历
              <span className="ml-auto text-xs font-normal text-muted-foreground">来自你的进度</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">已掌握技能（{masteredSkills.length}）</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {masteredSkills.length ? (
                  masteredSkills.map((s) => (
                    <span key={s.id} className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-[11px] text-success">
                      {s.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">把技能标为「已掌握」后自动进入简历</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">项目经历（{completedProjects.length}）</p>
              <div className="mt-1.5 space-y-1.5">
                {completedProjects.length ? (
                  completedProjects.map((p) => (
                    <div key={p.id} className="rounded-md border border-border bg-card p-2 text-xs">
                      <p className="font-medium">{p.title}</p>
                      <p className="text-muted-foreground">{p.role} · {p.stack.join(' / ')}</p>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">去「项目实战」完成企业模拟项目</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">竞赛 / 成就</p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {subs.length} 条竞赛模拟 · {state.favorites.length} 个已收藏赛事 · {achievements.length} 项成就
              </p>
            </div>
            <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
              <FileText className="mr-1 inline h-3.5 w-3.5" />
              填完后点右上角「下载简历」或「打印 / 存 PDF」即可拿到成品。
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

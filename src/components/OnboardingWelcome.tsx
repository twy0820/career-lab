// 第一次打开时的欢迎引导：讲清楚怎么用这个平台
import { ArrowRight, GraduationCap, Rocket, Swords, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useProgress } from '@/state/progress-context';

export default function OnboardingWelcome() {
  const { state, setOnboardingDone, setCoachMode } = useProgress();
  const show = !state.onboardingDone;

  const handleStart = () => {
    setCoachMode(true);
    setOnboardingDone();
  };

  return (
    <Dialog open={show} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <GraduationCap className="h-6 w-6 text-primary" />
            欢迎来到实战工场
          </DialogTitle>
          <DialogDescription>
            这不是一个给你扔一堆链接的网站——它会一步步带你：从 0 开始学技能 → 跟着做企业项目 → 打模拟竞赛 → 最后攒出能写进简历的履历。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {[
            {
              icon: GraduationCap,
              t: '第一步 · 学技能（内置课程）',
              d: '技能图谱里每一步都有讲解、代码和动手练习，不用再去别处找资料。',
            },
            {
              icon: Rocket,
              t: '第二步 · 做企业实战项目',
              d: '项目按阶段推进：装环境、写需求文档、开发、测试、复盘 PPT，全流程带你走一遍。',
            },
            {
              icon: Swords,
              t: '第三步 · 打模拟竞赛',
              d: '用模拟赛题练手，按真实赛制提交，拿到逐维度的评审反馈。',
            },
            {
              icon: Trophy,
              t: '第四步 · 真实竞赛 + 履历',
              d: '竞赛雷达收集了正在报名的真实赛事；完成的项目会自动沉淀成简历素材。',
            },
          ].map((s) => (
            <div key={s.t} className="flex items-start gap-3 rounded-md border border-border bg-card p-3">
              <s.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">{s.t}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 p-3 text-xs text-primary">
          <GraduationCap className="h-4 w-4 shrink-0" />
          已为你开启「宝宝引导模式」：右下角会有个教练一直告诉你「下一步该做什么」。
        </div>

        <Button onClick={handleStart} className="w-full">
          开始我的第一站 <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '@/state/progress-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, FileText, Star, Coins } from 'lucide-react';

export default function ProfilePage() {
  const { state, level } = useProgress();
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🐱</div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{state.nickname || '猫同学'}</h1>
              <p className="text-sm text-muted-foreground">Lv.{level}</p>
              <div className="mt-2 flex gap-4 text-sm">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 text-amber-500" /> {state.stars ?? 0} 星</span>
                <span className="flex items-center gap-1"><Coins className="h-4 w-4 text-amber-400" /> {state.coins ?? 0} 币</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="achievements">
        <TabsList>
          <TabsTrigger value="achievements">成就履历</TabsTrigger>
          <TabsTrigger value="resume">简历生成器</TabsTrigger>
        </TabsList>
        <TabsContent value="achievements">
          <Card><CardHeader><CardTitle>我的成就</CardTitle></CardHeader><CardContent>
            <p className="text-sm text-muted-foreground">已完成 {state.doneLessons.length} 课程，{state.submissions.length} 次提交</p>
            <Button asChild className="mt-2"><Link to="/portfolio">查看完整成就</Link></Button>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="resume">
          <Card><CardHeader><CardTitle>简历</CardTitle></CardHeader><CardContent>
            <Button asChild><Link to="/resume">打开简历生成器</Link></Button>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

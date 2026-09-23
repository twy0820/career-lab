import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '@/state/progress-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, FileText, Star, Coins } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const { state, level } = useProgress();
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [myContests, setMyContests] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from('custom_projects').select('*').eq('author', data.user.id).then(({ data: p }) => setMyProjects(p ?? []));
        supabase.from('custom_contests').select('*').eq('author', data.user.id).then(({ data: c }) => setMyContests(c ?? []));
      }
    });
  }, []);

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
          <TabsTrigger value="published">我发布的</TabsTrigger>
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
        <TabsContent value="published">
          <div className="space-y-3">
            <Card>
              <CardHeader><CardTitle>我发布的项目 ({myProjects.length})</CardTitle></CardHeader>
              <CardContent>
                {myProjects.map(p => (
                  <div key={p.id} className="mb-2 rounded border p-2 text-sm">
                    <p className="font-medium">{p.title} {p.is_public === false && <span className="text-xs text-gray-400">(私密)</span>}</p>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>我发布的竞赛 ({myContests.length})</CardTitle></CardHeader>
              <CardContent>
                {myContests.map(c => (
                  <div key={c.id} className="mb-2 rounded border p-2 text-sm">
                    <p className="font-medium">{c.title} {c.is_public === false && <span className="text-xs text-gray-400">(私密)</span>}</p>
                    <p className="text-xs text-muted-foreground">{c.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
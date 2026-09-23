import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Crosshair } from 'lucide-react';

export default function RankingPage() {
  const [national, setNational] = useState<any[]>([]);
  const [guild, setGuild] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [contests, setContests] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [me, setMe] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) setMe(userData.user.id);
      const { data: n } = await supabase.from('user_meta').select('*').order('stars',{ascending:false}).limit(100);
      setNational(n ?? []);
      const { data: g } = await supabase.from('guilds').select('*').order('member_count',{ascending:false});
      setGuild(g ?? []);
      const { data: p } = await supabase.from('custom_projects').select('*').limit(200);
      const { data: allLikes } = await supabase.from('likes').select('target_type,target_id');
      const { data: allFavs } = await supabase.from('favorites').select('target_type,target_id');
      const { data: allRatings } = await supabase.from('ratings').select('target_type,target_id,score');
      const scoreOf = (type: string, tid: string) => {
        const lk = (allLikes ?? []).filter((x:any)=>x.target_type===type && x.target_id===tid).length;
        const fv = (allFavs ?? []).filter((x:any)=>x.target_type===type && x.target_id===tid).length;
        const rt = (allRatings ?? []).filter((x:any)=>x.target_type===type && x.target_id===tid);
        const avg = rt.length ? rt.reduce((s:number,r:any)=>s+(r.score||0),0)/rt.length : 0;
        return lk*1 + fv*2 + avg*3;
      };
      setProjects((p ?? []).map((x:any)=>({...x, _score: scoreOf('project', x.id)})).sort((a:any,b:any)=>b._score-a._score).slice(0,50));
      const { data: cc } = await supabase.from('custom_contests').select('*').limit(200);
      setContests((cc ?? []).map((x:any)=>({...x, _score: scoreOf('contest', x.id)})).sort((a:any,b:any)=>b._score-a._score).slice(0,50));
      if (userData.user) {
        const { data: f } = await supabase.from('friends').select('*').or(`user_id.eq.${userData.user.id},friend_id.eq.${userData.user.id}`);
        setFriends(f ?? []);
      }
    })();
  }, []);

  const myRank = national.findIndex(u => u.id === me);

  const scrollToMe = () => {
    const el = document.getElementById('rank-me');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <Tabs defaultValue="national">
      <TabsList>
        <TabsTrigger value="national">全国排名</TabsTrigger>
        <TabsTrigger value="friends">好友排名</TabsTrigger>
        <TabsTrigger value="guild">公会排名</TabsTrigger>
        <TabsTrigger value="projects">项目排名</TabsTrigger>
        <TabsTrigger value="contests">竞赛排名</TabsTrigger>
      </TabsList>
      <TabsContent value="national">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>全国排名（按星星）{myRank >= 0 && <span className="ml-2 text-sm text-muted-foreground">我的排名: {myRank+1}</span>}</CardTitle>
            <Button size="sm" variant="outline" onClick={scrollToMe}><Crosshair className="h-3 w-3" /> 定位到我</Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {national.map((u,i)=>(
                <div key={u.id} id={u.id===me?'rank-me':undefined} className={`flex p-2 text-sm border-b ${u.id===me?'bg-amber-500/20 font-bold':''}`}>
                  <span className="w-8 text-muted-foreground">{i+1}</span>
                  <Link to={'/user/' + u.id} className="flex-1 hover:underline">{u.nickname}{u.id===me?' (我)':''}</Link>
                  <span>⭐{u.stars}</span>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="friends">
        <Card>
          <CardHeader><CardTitle>好友排名</CardTitle></CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {friends.map((f,i)=>(
                <div key={f.id} className={'flex p-2 text-sm border-b ' + (f.id===me?'bg-amber-500/20 font-bold':'')}>
                  <span className="w-8 text-muted-foreground">{i+1}</span>
                  <Link to={'/user/' + f.id} className="flex-1 hover:underline">{f.nickname || '未命名'}{f.id===me?' (我)':''}</Link>
                  <span>⭐{f.stars || 0}</span>
                </div>
              ))}
              {friends.length === 0 && <p className="p-2 text-sm text-muted-foreground">还没有好友，去「好友」页添加吧</p>}
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="guild"><Card><CardHeader><CardTitle>公会排名</CardTitle></CardHeader><CardContent><ScrollArea className="h-[600px]">{guild.map((g,i)=><div key={g.id} className="flex p-2 text-sm border-b"><span className="w-8 text-muted-foreground">{i+1}</span><span className="flex-1">{g.name} <span className="text-xs text-muted-foreground">Lv.{g.level || 1}</span></span><span>{g.member_count}人</span></div>)}</ScrollArea></CardContent></Card></TabsContent>
      <TabsContent value="projects"><Card><CardHeader><CardTitle>项目发布排名</CardTitle></CardHeader><CardContent><ScrollArea className="h-[600px]">{projects.map((p,i)=><div key={p.id} className="flex p-2 text-sm border-b"><span className="w-8 text-muted-foreground">{i+1}</span><span className="flex-1">{p.title}</span><span className="text-xs text-muted-foreground">综合分 {p._score?.toFixed(1)}</span></div>)}</ScrollArea></CardContent></Card></TabsContent>
      <TabsContent value="contests"><Card><CardHeader><CardTitle>竞赛发布排名</CardTitle></CardHeader><CardContent><ScrollArea className="h-[600px]">{contests.map((c,i)=><div key={c.id} className="flex p-2 text-sm border-b"><span className="w-8 text-muted-foreground">{i+1}</span><span className="flex-1">{c.title}</span><span className="text-xs text-muted-foreground">综合分 {c._score?.toFixed(1)}</span></div>)}</ScrollArea></CardContent></Card></TabsContent>
    </Tabs>
  );
}

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

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
      const { data: p } = await supabase.from('custom_projects').select('*').order('created_at',{ascending:false}).limit(50);
      setProjects(p ?? []);
      const { data: cc } = await supabase.from('custom_contests').select('*').order('created_at',{ascending:false}).limit(50);
      setContests(cc ?? []);
      if (userData.user) {
        const { data: f } = await supabase.from('friends').select('*').or(`user_id.eq.${userData.user.id},friend_id.eq.${userData.user.id}`);
        setFriends(f ?? []);
      }
    })();
  }, []);

  return (
    <Tabs defaultValue="national">
      <TabsList>
        <TabsTrigger value="national">全国排名</TabsTrigger>
        <TabsTrigger value="friends">好友排名</TabsTrigger>
        <TabsTrigger value="guild">公会排名</TabsTrigger>
        <TabsTrigger value="projects">项目排名</TabsTrigger>
        <TabsTrigger value="contests">竞赛排名</TabsTrigger>
      </TabsList>
      <TabsContent value="national"><Card><CardHeader><CardTitle>全国排名（按星星）</CardTitle></CardHeader><CardContent><ScrollArea className="h-[600px]">{national.map((u,i)=><div key={u.id} className="flex p-2 text-sm border-b"><span className="w-8 text-muted-foreground">{i+1}</span><span className="flex-1">{u.nickname}</span><span>⭐{u.stars}</span></div>)}</ScrollArea></CardContent></Card></TabsContent>
      <TabsContent value="friends"><Card><CardHeader><CardTitle>好友排名</CardTitle></CardHeader><CardContent><ScrollArea className="h-[600px]">{friends.map((f,i)=><div key={f.id} className="flex p-2 text-sm border-b"><span className="w-8 text-muted-foreground">{i+1}</span><span className="flex-1">好友</span></div>)}</ScrollArea></CardContent></Card></TabsContent>
      <TabsContent value="guild"><Card><CardHeader><CardTitle>公会排名</CardTitle></CardHeader><CardContent><ScrollArea className="h-[600px]">{guild.map((g,i)=><div key={g.id} className="flex p-2 text-sm border-b"><span className="w-8 text-muted-foreground">{i+1}</span><span className="flex-1">{g.name}</span><span>{g.member_count}人</span></div>)}</ScrollArea></CardContent></Card></TabsContent>
      <TabsContent value="projects"><Card><CardHeader><CardTitle>项目发布排名</CardTitle></CardHeader><CardContent><ScrollArea className="h-[600px]">{projects.map((p,i)=><div key={p.id} className="flex p-2 text-sm border-b"><span className="w-8 text-muted-foreground">{i+1}</span><span className="flex-1">{p.title}</span><span className="text-xs text-muted-foreground">难度{p.difficulty}</span></div>)}</ScrollArea></CardContent></Card></TabsContent>
      <TabsContent value="contests"><Card><CardHeader><CardTitle>竞赛发布排名</CardTitle></CardHeader><CardContent><ScrollArea className="h-[600px]">{contests.map((c,i)=><div key={c.id} className="flex p-2 text-sm border-b"><span className="w-8 text-muted-foreground">{i+1}</span><span className="flex-1">{c.title}</span><span className="text-xs text-muted-foreground">难度{c.difficulty}</span></div>)}</ScrollArea></CardContent></Card></TabsContent>
    </Tabs>
  );
}

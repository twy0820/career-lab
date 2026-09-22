import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Gift, Crown } from 'lucide-react';

export default function CommunityPlusPage() {
  const [me, setMe] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [guilds, setGuilds] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [packetText, setPacketText] = useState('');
  const [packetAmt, setPacketAmt] = useState(100);
  const [announce, setAnnounce] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => data.user && setMe(data.user.id));
    refresh();
  }, [me]);

  const refresh = async () => {
    const { data: p } = await supabase.from('user_meta').select('*').order('stars',{ascending:false}).limit(50);
    setProfiles(p ?? []);
    const { data: g } = await supabase.from('guilds').select('*').order('member_count',{ascending:false});
    setGuilds(g ?? []);
    const { data: t } = await supabase.from('teams').select('*,custom_projects(title)').eq('status','forming');
    setTeams(t ?? []);
  };

  const visit = async (u: any) => {
    setSelected(u);
    const { data: cp } = await supabase.from('custom_projects').select('*').eq('author', u.id);
    setPosts(cp ?? []);
    if (me) await supabase.from('visits').insert({ visitor: me, target: u.id });
  };

  const sendPacket = async () => {
    if (!me) return;
    await supabase.from('red_packets').insert({ guild_id: guilds[0]?.id, sender: me, amount: packetAmt, text: packetText });
    setPacketText('');
  };

  return (
    <Tabs defaultValue="rank">
      <TabsList>
        <TabsTrigger value="rank">多维排名</TabsTrigger>
        <TabsTrigger value="users">用户主页</TabsTrigger>
        <TabsTrigger value="teams">队伍匹配</TabsTrigger>
        <TabsTrigger value="guild">公会红包</TabsTrigger>
      </TabsList>

      <TabsContent value="rank" className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader><CardTitle>全国排名（按星星）</CardTitle></CardHeader>
          <CardContent><ScrollArea className="h-96">{profiles.map((u,i)=><div key={u.id} className="flex p-2 text-sm"><span className="w-8 text-muted-foreground">{i+1}</span><span className="flex-1">{u.nickname}</span><span>⭐{u.stars}</span></div>)}</ScrollArea></CardContent></Card>
        <Card><CardHeader><CardTitle>公会排名</CardTitle></CardHeader>
          <CardContent><ScrollArea className="h-96">{guilds.map((g,i)=><div key={g.id} className="flex p-2 text-sm"><span className="w-8 text-muted-foreground">{i+1}</span><span className="flex-1">{g.name}</span><span>{g.member_count}人</span></div>)}</ScrollArea></CardContent></Card>
      </TabsContent>

      <TabsContent value="users">
        <Card><CardHeader><CardTitle>用户主页</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <ScrollArea className="h-96 border rounded p-2">
              {profiles.map(u=><button key={u.id} onClick={()=>visit(u)} className="block w-full p-2 hover:bg-muted text-left text-sm">{u.nickname} Lv.{u.level} ⭐{u.stars}</button>)}
            </ScrollArea>
            {selected && (
              <div>
                <p className="font-bold">{selected.nickname}</p>
                <p className="text-xs text-muted-foreground">Lv.{selected.level} ⭐{selected.stars} 🐟{selected.coins}</p>
                <p className="mt-2 text-sm font-semibold">他发布的项目：</p>
                {posts.map(p=><div key={p.id} className="text-sm p-1 border-b">{p.title}</div>)}
              </div>
            )}
          </CardContent></Card>
      </TabsContent>

      <TabsContent value="teams">
        <Card><CardHeader><CardTitle>等待中的队伍</CardTitle></CardHeader>
          <CardContent><ScrollArea className="h-96">{teams.map(t=><div key={t.id} className="p-3 border rounded mb-2"><p className="text-sm font-semibold">{(t as any).custom_projects?.title}</p><p className="text-xs text-muted-foreground">需 {t.needed} 人</p><Button size="sm" className="mt-1" onClick={async()=>{if(me){await supabase.from('team_members').insert({team_id:t.id,user_id:me});refresh();}}}>加入队伍</Button></div>)}</ScrollArea></CardContent></Card>
      </TabsContent>

      <TabsContent value="guild">
        <Card><CardHeader><CardTitle>公会红包</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <input className="w-full border rounded p-2" placeholder="红包留言" value={packetText} onChange={e=>setPacketText(e.target.value)} />
            <input className="w-full border rounded p-2" type="number" placeholder="金额" value={packetAmt} onChange={e=>setPacketAmt(+e.target.value)} />
            <Button onClick={sendPacket}><Gift className="h-4 w-4" />发红包</Button>
          </CardContent></Card>
      </TabsContent>
    </Tabs>
  );
}

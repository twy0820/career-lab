import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Users, Coins } from 'lucide-react';

export default function CommunityPage() {
  const [me, setMe] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [guilds, setGuilds] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [cost, setCost] = useState(0);
  const [reward, setReward] = useState(100);
  const [guildName, setGuildName] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => data.user && setMe(data.user.id));
    refresh();
  }, []);

  const refresh = async () => {
    const { data: cp } = await supabase.from('custom_projects').select('*,custom_participants(count)').order('created_at', { ascending: false });
    setProjects(cp ?? []);
    const { data: g } = await supabase.from('guilds').select('*').order('member_count', { ascending: false });
    setGuilds(g ?? []);
  };

  const createProject = async () => {
    if (!me || !title.trim()) return;
    await supabase.from('custom_projects').insert({ author: me, title, description: desc, entry_cost: cost, reward_coins: reward });
    setTitle(''); setDesc('');
    refresh();
  };

  const joinProject = async (p: any) => {
    if (!me) return;
    await supabase.from('custom_participants').insert({ project_id: p.id, user_id: me });
    refresh();
  };

  const createGuild = async () => {
    if (!me || !guildName.trim()) return;
    const { data: g } = await supabase.from('guilds').insert({ name: guildName, leader: me, description: '' }).select().single();
    if (g) await supabase.from('guild_members').insert({ guild_id: g.id, user_id: me, role: 'leader' });
    setGuildName('');
    refresh();
  };

  const joinGuild = async (g: any) => {
    if (!me) return;
    await supabase.from('guild_members').insert({ guild_id: g.id, user_id: me });
    await supabase.from('guilds').update({ member_count: g.member_count + 1 }).eq('id', g.id);
    refresh();
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>用户项目市场</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="项目标题" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="项目描述" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <div className="flex gap-2">
            <Input type="number" placeholder="参与花费" value={cost} onChange={(e) => setCost(+e.target.value)} />
            <Input type="number" placeholder="奖励币" value={reward} onChange={(e) => setReward(+e.target.value)} />
            <Button onClick={createProject}><Plus className="h-4 w-4" /> 发布</Button>
          </div>
          <ScrollArea className="h-80">
            {projects.map((p) => (
              <div key={p.id} className="mb-2 rounded border p-3">
                <p className="font-semibold">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.description}</p>
                <div className="mt-1 flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1"><Coins className="h-3 w-3" /> 参与:{p.entry_cost} 奖:{p.reward_coins}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {p.custom_participants?.[0]?.count ?? 0}人</span>
                  <Button size="sm" variant="outline" onClick={() => joinProject(p)}>参加</Button>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>公会</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="公会名" value={guildName} onChange={(e) => setGuildName(e.target.value)} />
            <Button onClick={createGuild}><Plus className="h-4 w-4" /> 创建</Button>
          </div>
          <ScrollArea className="h-80">
            {guilds.map((g) => (
              <div key={g.id} className="mb-2 flex items-center justify-between rounded border p-3">
                <div>
                  <p className="font-semibold">{g.name}</p>
                  <p className="text-xs text-muted-foreground">{g.member_count} 人</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => joinGuild(g)}>加入</Button>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

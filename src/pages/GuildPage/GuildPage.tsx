import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Gift, Plus, Crown, Shield, User, Trash2, MessageSquare } from 'lucide-react';

export default function GuildPage() {
  const [me, setMe] = useState<string | null>(null);
  const [guilds, setGuilds] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [redPackets, setRedPackets] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [showMembers, setShowMembers] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [amt, setAmt] = useState(100);
  const [chatGuild, setChatGuild] = useState<string | null>(null);
  const [chatMsgs, setChatMsgs] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [redTo, setRedTo] = useState('');
  const [noticeGuild, setNoticeGuild] = useState<string | null>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [noticeInput, setNoticeInput] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => data.user && setMe(data.user.id));
    refresh();
  }, []);

  const refresh = async () => {
    const { data: g } = await supabase.from('guilds').select('*').order('member_count',{ascending:false});
    setGuilds(g ?? []);
    const { data: t } = await supabase.from('teams').select('*,custom_projects(title)').eq('status','forming');
    setTeams(t ?? []);
    const { data: r } = await supabase.from('red_packets').select('*').order('created_at',{ascending:false}).limit(20);
    setRedPackets(r ?? []);
  };

  const create = async () => {
    if (!me || !name.trim()) return;
    const { data: g } = await supabase.from('guilds').insert({ name, leader: me }).select().single();
    if (g) await supabase.from('guild_members').insert({ guild_id: g.id, user_id: me, role: 'leader' });
    setName(''); refresh();
  };

  const join = async (g: any) => {
    if (!me) return;
    await supabase.from('guild_members').insert({ guild_id: g.id, user_id: me });
    await supabase.from('guilds').update({ member_count: g.member_count + 1 }).eq('id', g.id);
    refresh();
  };

  const disband = async (g: any) => {
    if (!me || g.leader !== me) return;
    if (!confirm('确认解散公会？此操作不可恢复。')) return;
    await supabase.from('guild_members').delete().eq('guild_id', g.id);
    await supabase.from('guilds').delete().eq('id', g.id);
    refresh();
  };

  const loadMembers = async (gid: string) => {
    const { data } = await supabase.from('guild_members').select('*').eq('guild_id', gid);
    setMembers(data ?? []);
    setShowMembers(gid);
  };

  const promote = async (mid: string, role: string) => {
    await supabase.from('guild_members').update({ role }).eq('id', mid);
    loadMembers(showMembers!);
  };

  const sendRed = async (gid: string) => {
    if (!me) return;
    const { data: u } = await supabase.from('user_meta').select('coins').eq('id', me).single();
    if (!u || u.coins < amt) { alert('猫猫币不足，无法发红包'); return; }
    await supabase.from('user_meta').update({ coins: u.coins - amt }).eq('id', me);
    await supabase.from('red_packets').insert({ guild_id: gid, sender: me, amount: amt, receiver: redTo || null });
    refresh();
  };

  const openNotices = async (gid: string) => {
    setNoticeGuild(gid);
    const { data } = await supabase.from('guild_notices').select('*').eq('guild_id', gid).order('created_at',{ascending:false});
    setNotices(data ?? []);
  };

  const postNotice = async () => {
    if (!me || !noticeGuild || !noticeInput.trim()) return;
    await supabase.from('guild_notices').insert({ guild_id: noticeGuild, author: me, content: noticeInput.trim() });
    setNoticeInput('');
    openNotices(noticeGuild);
  };

  const openChat = async (gid: string) => {
    setChatGuild(gid);
    const { data } = await supabase.from('group_messages').select('*').eq('group_id', gid).order('created_at');
    setChatMsgs(data ?? []);
  };

  const sendChat = async () => {
    if (!me || !chatGuild || !chatInput.trim()) return;
    await supabase.from('group_messages').insert({ group_id: chatGuild, sender: me, text: chatInput });
    setChatInput('');
    openChat(chatGuild);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>我的公会</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-2">
            <Input placeholder="公会名" value={name} onChange={e=>setName(e.target.value)} />
            <Button onClick={create}><Plus className="h-4 w-4" />创建</Button>
          </div>
          <ScrollArea className="h-96">
            {guilds.map(g=>(
              <div key={g.id} className="mb-2 rounded border p-3">
                <p className="font-semibold">{g.name} <span className="text-xs text-muted-foreground">Lv.{g.level || 1}</span></p>
                <p className="text-xs text-muted-foreground">{g.member_count} 人</p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={()=>join(g)}>加入</Button>
                  <Button size="sm" variant="outline" onClick={()=>loadMembers(g.id)}>成员</Button>
                  <Button size="sm" variant="outline" onClick={()=>openChat(g.id)}><MessageSquare className="h-3 w-3" />聊天</Button>
                  <Button size="sm" variant="outline" onClick={()=>openNotices(g.id)}>公告招聘</Button>
                  {g.leader === me && <Button size="sm" variant="outline" onClick={()=>disband(g)}><Trash2 className="h-3 w-3" />解散</Button>}
                  <div className="flex gap-1">
                    <Input type="number" value={amt} onChange={e=>setAmt(+e.target.value)} className="h-7 w-20" placeholder="金额" />
                    <Input value={redTo} onChange={e=>setRedTo(e.target.value)} className="h-7 w-24" placeholder="指定用户ID(可空)" />
                    <Button size="sm" variant="outline" onClick={()=>sendRed(g.id)}><Gift className="h-3 w-3" />红包</Button>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>队伍招募</CardTitle></CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {teams.map(t=>(
              <div key={t.id} className="mb-2 rounded border p-3">
                <p className="text-sm font-semibold">{(t as any).custom_projects?.title}</p>
                <p className="text-xs text-muted-foreground">需 {t.needed} 人</p>
                <Button size="sm" className="mt-1" onClick={async()=>{if(me){await supabase.from('team_members').insert({team_id:t.id,user_id:me});refresh();}}}>加入队伍</Button>
                <Button size="sm" variant="outline" className="mt-1 ml-1" onClick={async()=>{if(me){await supabase.from('teams').update({status:'matching'}).eq('id',t.id);refresh();}}}>系统匹配</Button>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
      {showMembers && (
        <Card>
          <CardHeader><CardTitle>成员 ({members.length})</CardTitle></CardHeader>
          <CardContent>
            {members.map((m:any)=>(
              <div key={m.id} className="flex items-center p-2 text-sm border-b">
                <span className="flex-1">{m.user_id}</span>
                <span className="text-xs">{m.role}</span>
                {m.role!=='leader' && <><Button size="sm" variant="ghost" onClick={()=>promote(m.id,'officer')}>任命</Button><Button size="sm" variant="ghost" onClick={()=>promote(m.id,'member')}>降职</Button></>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      {chatGuild && (
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>公会交流</CardTitle></CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              {chatMsgs.map(m=>(
                <div key={m.id} className={`mb-1 ${m.sender===me?'text-right':''}`}>
                  <span className="inline-block rounded bg-muted px-2 py-1 text-xs">{m.text}</span>
                </div>
              ))}
            </ScrollArea>
            <div className="mt-2 flex gap-2">
              <Input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendChat()} />
              <Button size="sm" onClick={sendChat}>发送</Button>
            </div>
          </CardContent>
        </Card>
      )}
      {noticeGuild && (
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>公会公告 / 招聘</CardTitle></CardHeader>
          <CardContent>
            <ScrollArea className="h-40">
              {notices.map((n:any)=>(
                <div key={n.id} className="mb-2 rounded border p-2 text-sm">{n.content}</div>
              ))}
            </ScrollArea>
            <div className="mt-2 flex gap-2">
              <Input value={noticeInput} onChange={e=>setNoticeInput(e.target.value)} placeholder="发布招聘或公告..." />
              <Button size="sm" onClick={postNotice}>发布</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Card className="md:col-span-2">
        <CardHeader><CardTitle>红包记录</CardTitle></CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            {redPackets.map(r=>(
              <div key={r.id} className="flex items-center gap-2 p-2 text-sm border-b">
                <Gift className="h-4 w-4 text-amber-500" />
                <span className="flex-1">猫猫币 x {r.amount}</span>
                <span className="text-xs text-muted-foreground">{r.created_at?.slice(0,10)}</span>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Heart, Star, Users, Clock, Coins, ArrowLeft, ChevronDown, Trash2, Pencil, Eye, EyeOff, Send } from 'lucide-react';
import { RANKS } from '@/data/ranks';

const emptyForm = {
  title: '', description: '', difficulty: 2,
  isPublic: true, startDate: '',
  enableReward: false, rewardCoins: 100, entryCost: 10,
  enableCondition: false, minLevel: 1, minRank: '', minStars: 0, entryCostFree: 0,
  needed: 3, days: 7,
};

export default function UserProjectsPage() {
  const nav = useNavigate();
  const [me, setMe] = useState<string | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [list, setList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) { setMe(data.user.id); setMyId(data.user.id); } });
    refresh();
  }, [me]);

  const refresh = async () => {
    const { data } = await supabase.from('custom_projects').select('*').order('created_at', { ascending: false });
    setList(data ?? []);
  };

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm }); setShowForm(true); };
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      title: p.title, description: p.description, difficulty: p.difficulty,
      isPublic: p.is_public !== false, startDate: p.start_date || '',
      enableReward: p.entry_cost > 0 || p.reward_coins > 0, rewardCoins: p.reward_coins || 100, entryCost: p.entry_cost || 10,
      enableCondition: p.min_level > 0, minLevel: p.min_level || 1, minRank: p.min_rank || '', minStars: p.min_stars || 0, entryCostFree: p.entry_cost || 0,
      needed: p.needed || 3, days: p.deadline_days || 7,
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!me || !form.title.trim()) return;
    const payload = {
      title: form.title, description: form.description, difficulty: form.difficulty,
      is_public: form.isPublic, start_date: form.startDate,
      entry_cost: form.enableReward ? form.entryCost : 0,
      reward_coins: form.enableReward ? form.rewardCoins : 0,
      needed: form.needed, deadline_days: form.days,
      min_level: form.enableCondition ? form.minLevel : 0,
      min_rank: form.enableCondition ? form.minRank : '',
      min_stars: form.enableCondition ? form.minStars : 0,
    };
    if (editing) {
      await supabase.from('custom_projects').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('custom_projects').insert({ ...payload, author: me });
    }
    setShowForm(false);
    refresh();
  };

  const del = async (id: string) => {
    if (!confirm('确认删除？')) return;
    await supabase.from('custom_projects').delete().eq('id', id);
    refresh();
  };

  const myProjects = list.filter(p => p.author === myId);
  const otherProjects = list.filter(p => p.author !== myId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => nav('/projects')}><ArrowLeft className="h-4 w-4" /> 返回项目实战</Button>
        <h1 className="text-xl font-bold">用户项目市场</h1>
      </div>

      <Button onClick={openCreate} className="w-full">
        <Plus className="h-4 w-4" /> 发布新项目 <ChevronDown className={showForm ? 'rotate-180 transition' : 'transition'} />
      </Button>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>{editing ? '编辑项目' : '填写项目详情'}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><label className="text-xs text-muted-foreground">项目标题（必填）</label><Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
            <div><label className="text-xs text-muted-foreground">项目描述</label><Textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-xs text-muted-foreground">难度（1=入门 5=挑战）</label><Input type="number" min={1} max={5} value={form.difficulty} onChange={e=>setForm({...form,difficulty:+e.target.value})} /></div>
              <div><label className="text-xs text-muted-foreground">开始时间</label><Input type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} /></div>
            </div>
            <div className="flex items-center gap-2"><Switch checked={form.isPublic} onCheckedChange={v=>setForm({...form,isPublic:v})} /><span className="text-xs font-medium">{form.isPublic ? <><Eye className="inline h-3 w-3" /> 公开项目（上架需猫猫币）</> : <><EyeOff className="inline h-3 w-3" /> 私密项目（免费，仅自己/好友可见）</>}</span></div>
            <div className="flex items-center gap-2"><Switch checked={form.enableReward} onCheckedChange={v=>setForm({...form,enableReward:v})} /><span className="text-xs font-medium">开启押金奖惩</span></div>
            {form.enableReward && (
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-xs text-muted-foreground">押金（参加者支付猫猫币，完成退还+奖励）</label><Input type="number" value={form.entryCost} onChange={e=>setForm({...form,entryCost:+e.target.value})} /></div>
                <div><label className="text-xs text-muted-foreground">完成奖励猫猫币</label><Input type="number" value={form.rewardCoins} onChange={e=>setForm({...form,rewardCoins:+e.target.value})} /></div>
              </div>
            )}
            <div className="flex items-center gap-2"><Switch checked={form.enableCondition} onCheckedChange={v=>setForm({...form,enableCondition:v})} /><span className="text-xs font-medium">开启报名条件</span></div>
            {form.enableCondition && (
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-xs text-muted-foreground">最低等级 Lv</label><Input type="number" value={form.minLevel} onChange={e=>setForm({...form,minLevel:+e.target.value})} /></div>
                <div><label className="text-xs text-muted-foreground">段位要求</label><select className="w-full border rounded p-2" value={form.minRank} onChange={e=>setForm({...form,minRank:e.target.value})}><option value="">不限</option>{RANKS.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
                <div><label className="text-xs text-muted-foreground">最低星星</label><Input type="number" value={form.minStars} onChange={e=>setForm({...form,minStars:+e.target.value})} /></div>
                <div><label className="text-xs text-muted-foreground">参加需额外花费猫猫币</label><Input type="number" value={form.entryCostFree} onChange={e=>setForm({...form,entryCostFree:+e.target.value})} /></div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-xs text-muted-foreground">队伍人数（必填）</label><Input type="number" value={form.needed} onChange={e=>setForm({...form,needed:+e.target.value})} /></div>
              <div><label className="text-xs text-muted-foreground">完成期限/天（必填）</label><Input type="number" value={form.days} onChange={e=>setForm({...form,days:+e.target.value})} /></div>
            </div>
            <div className="flex gap-2">
              <Button onClick={save} className="flex-1"><Send className="h-4 w-4" /> {editing ? '保存修改（进入赛季等待队列）' : '确认发布'}</Button>
              {editing && <Button variant="outline" onClick={() => setShowForm(false)}>取消</Button>}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>我发布的项目 ({myProjects.length})</CardTitle></CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {myProjects.map(p => (
              <div key={p.id} className="mb-3 rounded border border-amber-500/40 p-3 bg-amber-500/5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{p.title} {p.is_public === false && <span className="ml-1 rounded bg-gray-500/30 px-1 text-[10px]">私密</span>}</p>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.deadline_days}天</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{p.needed}人</span>
                      {p.start_date && <span className="text-muted-foreground">开始 {p.start_date}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="h-3 w-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => del(p.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>别人发布的项目 ({otherProjects.length})</CardTitle></CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {otherProjects.map(p => (
              <div key={p.id} className="mb-3 rounded border p-3">
                <p className="font-semibold">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.description}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.deadline_days}天</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{p.needed}人</span>
                  {p.reward_coins>0 && <span className="flex items-center gap-1"><Coins className="h-3 w-3" />{p.entry_cost}→{p.reward_coins}</span>}
                </div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline"><Heart className="h-3 w-3" /> 赞</Button>
                  <Button size="sm" variant="outline"><Star className="h-3 w-3" /> 收藏</Button>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
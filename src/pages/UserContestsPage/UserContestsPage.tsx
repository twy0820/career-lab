import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Heart, Star, Users, Clock, Coins, ArrowLeft, ChevronDown, Trophy } from 'lucide-react';
import { RANKS } from '@/data/ranks';

export default function UserContestsPage() {
  const nav = useNavigate();
  const [me, setMe] = useState<string | null>(null);
  const [list, setList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', difficulty: 2,
    enableReward: false, rewardCoins: 200, entryCost: 20,
    enableCondition: false, minLevel: 1, minRank: '', minStars: 0,
    needed: 3, days: 7,
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => data.user && setMe(data.user.id));
    refresh();
  }, [me]);

  const refresh = async () => {
    const { data } = await supabase.from('custom_contests').select('*').order('created_at', { ascending: false });
    setList(data ?? []);
  };

  const create = async () => {
    if (!me || !form.title.trim()) return;
    await supabase.from('custom_contests').insert({
      author: me, title: form.title, description: form.description,
      difficulty: form.difficulty, entry_cost: form.enableReward ? form.entryCost : 0,
      reward_coins: form.enableReward ? form.rewardCoins : 0,
      needed: form.needed, deadline_days: form.days,
      min_level: form.enableCondition ? form.minLevel : 0,
      min_rank: form.enableCondition ? form.minRank : '',
      min_stars: form.enableCondition ? form.minStars : 0,
    });
    setShowForm(false);
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => nav('/arena')}><ArrowLeft className="h-4 w-4" /> 返回竞赛练兵</Button>
        <h1 className="text-xl font-bold">用户竞赛市场</h1>
      </div>

      <Button onClick={() => setShowForm(!showForm)} className="w-full">
        <Trophy className="h-4 w-4" /> {showForm ? '收起发布表单' : '发布新竞赛'} <ChevronDown className={showForm ? 'rotate-180 transition' : 'transition'} />
      </Button>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>填写竞赛详情</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><label className="text-xs text-muted-foreground">竞赛标题（必填）</label><Input placeholder="例如：前端攻防赛" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
            <div><label className="text-xs text-muted-foreground">竞赛描述</label><Textarea placeholder="赛题、规则、评分标准" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
            <div><label className="text-xs text-muted-foreground">难度（1=入门 5=挑战）</label><Input type="number" min={1} max={5} value={form.difficulty} onChange={e=>setForm({...form,difficulty:+e.target.value})} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.enableReward} onCheckedChange={v=>setForm({...form,enableReward:v})} /><span className="text-xs font-medium">开启奖惩机制</span></div>
            {form.enableReward && (
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-xs text-muted-foreground">参赛者支付猫猫币</label><Input type="number" value={form.entryCost} onChange={e=>setForm({...form,entryCost:+e.target.value})} /></div>
                <div><label className="text-xs text-muted-foreground">获奖奖励猫猫币</label><Input type="number" value={form.rewardCoins} onChange={e=>setForm({...form,rewardCoins:+e.target.value})} /></div>
              </div>
            )}
            <div className="flex items-center gap-2"><Switch checked={form.enableCondition} onCheckedChange={v=>setForm({...form,enableCondition:v})} /><span className="text-xs font-medium">开启报名条件</span></div>
            {form.enableCondition && (
              <div className="grid grid-cols-3 gap-2">
                <div><label className="text-xs text-muted-foreground">最低等级 Lv</label><Input type="number" value={form.minLevel} onChange={e=>setForm({...form,minLevel:+e.target.value})} /></div>
                <div><label className="text-xs text-muted-foreground">段位要求</label><select className="w-full border rounded p-2" value={form.minRank} onChange={e=>setForm({...form,minRank:e.target.value})}><option value="">不限</option>{RANKS.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
                <div><label className="text-xs text-muted-foreground">最低星星</label><Input type="number" value={form.minStars} onChange={e=>setForm({...form,minStars:+e.target.value})} /></div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-xs text-muted-foreground">队伍人数（必填）</label><Input type="number" value={form.needed} onChange={e=>setForm({...form,needed:+e.target.value})} /></div>
              <div><label className="text-xs text-muted-foreground">完成期限/天（必填）</label><Input type="number" value={form.days} onChange={e=>setForm({...form,days:+e.target.value})} /></div>
            </div>
            <Button onClick={create} className="w-full"><Plus className="h-4 w-4" /> 确认发布</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>已发布竞赛 ({list.length})</CardTitle></CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {list.map(p => (
              <div key={p.id} className="mb-3 rounded border p-3">
                <p className="font-semibold">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.description}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.deadline_days}天</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{p.needed}人</span>
                  {p.reward_coins>0 && <span className="flex items-center gap-1"><Coins className="h-3 w-3" />{p.entry_cost}→{p.reward_coins}</span>}
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
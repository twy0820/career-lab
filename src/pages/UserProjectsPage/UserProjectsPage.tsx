import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Heart, Star, Users, Clock, Coins } from 'lucide-react';
import { RANKS } from '@/data/ranks';

export default function UserProjectsPage() {
  const [me, setMe] = useState<string | null>(null);
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: '', description: '', difficulty: 2,
    enableReward: false, rewardCoins: 100, entryCost: 10,
    enableCondition: false, minLevel: 1, minRank: '', minStars: 0,
    needed: 3, days: 7,
  });
  const [myLikes, setMyLikes] = useState<Set<string>>(new Set());
  const [myFavs, setMyFavs] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => data.user && setMe(data.user.id));
    refresh();
  }, [me]);

  const refresh = async () => {
    const { data } = await supabase.from('custom_projects').select('*').order('created_at', { ascending: false });
    setList(data ?? []);
    if (me) {
      const { data: l } = await supabase.from('likes').select('target_id').eq('user_id', me).eq('target_type','project');
      setMyLikes(new Set((l ?? []).map((x:any) => x.target_id)));
      const { data: f } = await supabase.from('favorites').select('target_id').eq('user_id', me).eq('target_type','project');
      setMyFavs(new Set((f ?? []).map((x:any) => x.target_id)));
    }
  };

  const create = async () => {
    if (!me || !form.title.trim()) return;
    await supabase.from('custom_projects').insert({
      author: me, title: form.title, description: form.description,
      difficulty: form.difficulty, entry_cost: form.enableReward ? form.entryCost : 0,
      reward_coins: form.enableReward ? form.rewardCoins : 0,
      needed: form.needed, deadline_days: form.days,
      min_level: form.enableCondition ? form.minLevel : 0,
      min_rank: form.enableCondition ? form.minRank : '',
      min_stars: form.enableCondition ? form.minStars : 0,
    });
    refresh();
  };

  const toggle = async (table: string, id: string) => {
    if (!me) return;
    if (table === 'likes') {
      if (myLikes.has(id)) { await supabase.from('likes').delete().eq('user_id',me).eq('target_id',id); }
      else { await supabase.from('likes').insert({user_id:me,target_type:'project',target_id:id}); }
    } else {
      if (myFavs.has(id)) { await supabase.from('favorites').delete().eq('user_id',me).eq('target_id',id); }
      else { await supabase.from('favorites').insert({user_id:me,target_type:'project',target_id:id}); }
    }
    refresh();
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader><CardTitle>鍙戝竷椤圭洰</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="鏍囬" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
          <Textarea placeholder="鎻忚堪" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
          <Input type="number" placeholder="闅惧害1-5" value={form.difficulty} onChange={e=>setForm({...form,difficulty:+e.target.value})} />
          <div className="flex items-center gap-2"><Switch checked={form.enableReward} onCheckedChange={v=>setForm({...form,enableReward:v})} /><span className="text-xs">寮€鍚鎯?/span></div>
          {form.enableReward && (
            <>
              <Input type="number" placeholder="鍙備笌鑺辫垂甯? value={form.entryCost} onChange={e=>setForm({...form,entryCost:+e.target.value})} />
              <Input type="number" placeholder="濂栧姳甯? value={form.rewardCoins} onChange={e=>setForm({...form,rewardCoins:+e.target.value})} />
            </>
          )}
          <div className="flex items-center gap-2"><Switch checked={form.enableCondition} onCheckedChange={v=>setForm({...form,enableCondition:v})} /><span className="text-xs">寮€鍚姤鍚嶆潯浠?/span></div>
          {form.enableCondition && (
            <>
              <Input type="number" placeholder="鏈€浣庣瓑绾? value={form.minLevel} onChange={e=>setForm({...form,minLevel:+e.target.value})} />
              <select className="w-full border rounded p-2" value={form.minRank} onChange={e=>setForm({...form,minRank:e.target.value})}>
                <option value="">涓嶉檺娈典綅</option>
                {RANKS.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <Input type="number" placeholder="鏈€浣庢槦鏄? value={form.minStars} onChange={e=>setForm({...form,minStars:+e.target.value})} />
            </>
          )}
          <Input type="number" placeholder="闇€瑕佷汉鏁? value={form.needed} onChange={e=>setForm({...form,needed:+e.target.value})} />
          <Input type="number" placeholder="闄愭椂澶╂暟" value={form.days} onChange={e=>setForm({...form,days:+e.target.value})} />
          <Button onClick={create} className="w-full"><Plus className="h-4 w-4" />鍙戝竷</Button>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader><CardTitle>鐢ㄦ埛鍙戝竷鐨勯」鐩?({list.length})</CardTitle></CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {list.map(p => (
              <div key={p.id} className="mb-3 rounded border p-3">
                <p className="font-semibold">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.description}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.deadline_days}澶?/span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{p.needed}浜?/span>
                  {p.reward_coins>0 && <span className="flex items-center gap-1"><Coins className="h-3 w-3" />{p.entry_cost}鈫抺p.reward_coins}</span>}
                  {p.min_level>0 && <span className="text-muted-foreground">Lv.{p.min_level}+</span>}
                </div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant={myLikes.has(p.id)?'default':'outline'} onClick={()=>toggle('likes',p.id)}><Heart className="h-3 w-3" />{myLikes.has(p.id)?'宸茶禐':'璧?}</Button>
                  <Button size="sm" variant={myFavs.has(p.id)?'default':'outline'} onClick={()=>toggle('favorites',p.id)}><Star className="h-3 w-3" />{myFavs.has(p.id)?'宸茶棌':'鏀惰棌'}</Button>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}


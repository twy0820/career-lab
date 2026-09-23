import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Heart, Star, Users, Clock, Coins, ArrowLeft, ChevronDown, Trash2, Pencil, Eye, EyeOff, Send, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';
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
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [commentText, setCommentText] = useState('');
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [ratingText, setRatingText] = useState('');
  const [tab, setTab] = useState<'mine' | 'others' | 'joined'>('mine');
  const [joined, setJoined] = useState<any[]>([]);
  const [myCoins, setMyCoins] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) { setMe(data.user.id); setMyId(data.user.id); } });
    refresh();
  }, [me]);

  const refresh = async () => {
    const { data } = await supabase.from('custom_projects').select('*').order('created_at', { ascending: false });
    setList(data ?? []);
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (uid) {
      const { data: parts } = await supabase.from('custom_participants').select('*').eq('user_id', uid).not('project_id','is',null);
      const ids = (parts ?? []).map((x:any)=>x.project_id);
      const { data: ps } = ids.length ? await supabase.from('custom_projects').select('*').in('id', ids) : { data: [] };
      setJoined((ps ?? []).map((x:any)=>{ const rec = (parts??[]).find((y:any)=>y.project_id===x.id); return {...x, _status: rec?.status, _recId: rec?.id}; }));
      const { data: u } = await supabase.from('user_meta').select('coins').eq('id', uid).single();
      setMyCoins(u?.coins || 0);
    }
  };

  const completeProject = async (p: any) => {
    if (!me) return;
    await supabase.from('custom_participants').update({ status: 'completed' }).eq('id', p._recId);
    const { data: u } = await supabase.from('user_meta').select('coins,stars').eq('id', me).single();
    const refund = p.entry_cost || 0;
    const bonus = p.reward_coins || 0;
    await supabase.from('user_meta').update({ coins: (u?.coins||0) + refund + bonus, stars: (u?.stars||0) + 1 }).eq('id', me);
    alert('提交完成！退还押金 ' + refund + '，获得奖励 ' + bonus + ' 猫猫币，+1 星');
    refresh();
  };

  const quitProject = async (p: any) => {
    if (!me) return;
    if (!confirm('放弃后押金不退还，确认放弃？')) return;
    await supabase.from('custom_participants').update({ status: 'abandoned' }).eq('id', p._recId);
    alert('已放弃该项目，押金不退还');
    refresh();
  };

  const loadComments = async (pid: string) => {
    const { data } = await supabase.from('comments').select('*').eq('target_type','project').eq('target_id',pid).order('is_pinned',{ascending:false}).order('likes',{ascending:false});
    setComments(prev => ({...prev, [pid]: data ?? []}));
  };

  const addComment = async (pid: string) => {
    if (!me || !commentText.trim()) return;
    await supabase.from('comments').insert({user_id:me,target_type:'project',target_id:pid,content:commentText.trim()});
    setCommentText('');
    loadComments(pid);
  };

  const rate = async (pid: string) => {
    if (!me || !ratingText.trim()) return;
    const p = list.find(x => x.id === pid);
    const { data: parts } = await supabase.from('custom_participants').select('*').eq('project_id', pid).eq('user_id', me);
    const part = parts && parts[0];
    if (!part) { alert('只有参加过该项目的用户可以评分'); return; }
    const days = p?.deadline_days || 7;
    const elapsed = (Date.now() - new Date(part.created_at || Date.now()).getTime()) / 86400000;
    const abandoned = part.status === 'abandoned' || part.status === 'quit';
    if (!abandoned && elapsed < days / 2) {
      alert('项目进行未过半（已进行 ' + elapsed.toFixed(1) + ' 天 / 共 ' + days + ' 天），需过半或中途放弃后才能评分');
      return;
    }
    await supabase.from('ratings').insert({user_id:me,target_type:'project',target_id:pid,score:parseFloat(ratingText)});
    setRatingText('');
    alert('评分成功');
  };

  const delComment = async (cid: string, pid: string) => {
    await supabase.from('comments').delete().eq('id',cid);
    loadComments(pid);
  };

  const pinComment = async (cid: string, pid: string, v: boolean) => {
    await supabase.from('comments').update({is_pinned:v}).eq('id',cid);
    loadComments(pid);
  };

  const likeComment = async (cid: string, pid: string) => {
    const { data } = await supabase.from('comments').select('likes').eq('id', cid).single();
    await supabase.from('comments').update({likes: (data?.likes || 0) + 1}).eq('id', cid);
    loadComments(pid);
  };

  const joinProject = async (p: any) => {
    if (!me) { alert('请先登录'); return; }
    if (p.author === me) { alert('不能参加自己发布的项目'); return; }
    const { data: exist } = await supabase.from('custom_participants').select('id').eq('project_id', p.id).eq('user_id', me);
    const already = !!(exist && exist.length);
    const { data: u } = await supabase.from('user_meta').select('*').eq('id', me).single();
    if (!u) { alert('用户资料未初始化，请先完善个人资料'); return; }
    if (p.min_level > 0 && (u.level || 1) < p.min_level) { alert('等级不足，需要 Lv.' + p.min_level); return; }
    if (p.min_rank && u.rank && u.rank !== p.min_rank) { alert('段位不符合要求'); return; }
    if (p.min_stars > 0 && (u.stars || 0) < p.min_stars) { alert('星星不足，需要 ' + p.min_stars + ' 星'); return; }
    const cost = (p.entry_cost || 0) + (p.min_level > 0 ? 0 : 0);
    if (cost > 0 && (u.coins || 0) < cost) { alert('猫猫币不足，需要 ' + cost + ' 币'); return; }
    if (cost > 0) await supabase.from('user_meta').update({ coins: u.coins - cost }).eq('id', me);
    if (!already) {
      await supabase.from('custom_participants').insert({ project_id: p.id, user_id: me, status: 'active' });
      await supabase.from('custom_projects').update({ usage_count: (p.usage_count || 0) + 1 }).eq('id', p.id);
    }
    alert(already ? '你已参加过该项目（重复参加不重复计数）' : '参加成功！押金 ' + cost + ' 猫猫币，完成后退还并获得奖励');
    refresh();
  };

  const toggleLike = async (pid: string) => {
    if (!me) return;
    const { data } = await supabase.from('likes').select('id').eq('user_id',me).eq('target_type','project').eq('target_id',pid);
    if (data && data.length) { await supabase.from('likes').delete().eq('id', data[0].id); }
    else { await supabase.from('likes').insert({user_id:me,target_type:'project',target_id:pid}); }
  };

  const toggleFav = async (pid: string) => {
    if (!me) return;
    const { data } = await supabase.from('favorites').select('id').eq('user_id',me).eq('target_type','project').eq('target_id',pid);
    if (data && data.length) { await supabase.from('favorites').delete().eq('id', data[0].id); }
    else { await supabase.from('favorites').insert({user_id:me,target_type:'project',target_id:pid}); }
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
      if (editing.is_public !== false && (editing.usage_count || 0) > 0) {
        await supabase.from('custom_projects').update({ pending_changes: payload }).eq('id', editing.id);
        alert('该项目正在被参与，修改已进入赛季等待队列，赛季结算后自动生效。也可在卡片上点击「立即生效」花费猫猫币即时推送。');
      } else {
        await supabase.from('custom_projects').update(payload).eq('id', editing.id);
      }
    } else {
      if (form.isPublic) {
        const { data: u } = await supabase.from('user_meta').select('coins').eq('id', me).single();
        const cost = 50;
        if (!u || (u.coins || 0) < cost) { alert('上架公开项目需要 ' + cost + ' 猫猫币，余额不足'); return; }
        await supabase.from('user_meta').update({ coins: u.coins - cost }).eq('id', me);
      }
      await supabase.from('custom_projects').insert({ ...payload, author: me });
    }
    setShowForm(false);
    refresh();
  };

  const pushNow = async (p: any) => {
    if (!me || !p.pending_changes) return;
    const cost = 200;
    const { data: u } = await supabase.from('user_meta').select('coins').eq('id', me).single();
    if (!u || (u.coins || 0) < cost) { alert('立即生效需要 ' + cost + ' 猫猫币，余额不足'); return; }
    if (!confirm('立即生效将花费 ' + cost + ' 猫猫币，确认？')) return;
    await supabase.from('user_meta').update({ coins: u.coins - cost }).eq('id', me);
    await supabase.from('custom_projects').update({ ...p.pending_changes, pending_changes: null }).eq('id', p.id);
    refresh();
  };

  const withdrawPending = async (p: any) => {
    await supabase.from('custom_projects').update({ pending_changes: null }).eq('id', p.id);
    refresh();
  };

  const del = async (id: string) => {
    if (!confirm('确认删除？此操作不可恢复。')) return;
    await supabase.from('custom_participants').delete().eq('project_id', id);
    await supabase.from('comments').delete().eq('target_type','project').eq('target_id', id);
    await supabase.from('ratings').delete().eq('target_type','project').eq('target_id', id);
    const { error } = await supabase.from('custom_projects').delete().eq('id', id);
    if (error) alert('删除失败: ' + error.message);
    refresh();
  };

  const myProjects = list.filter(p => p.author === myId);
  const otherProjects = list.filter(p => p.author !== myId && (p.is_public !== false) && ((p.usage_count || 0) / (p.needed || 1) >= 0.5));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => nav('/projects')}><ArrowLeft className="h-4 w-4" /> 返回项目实战</Button>
        <h1 className="text-xl font-bold">用户项目市场</h1>
      </div>

      <Button onClick={() => setShowForm(!showForm)} className="w-full">
        <Plus className="h-4 w-4" /> {showForm ? '收起发布表单' : '发布新项目'} <ChevronDown className={showForm ? 'rotate-180 transition' : 'transition'} />
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

      <div className="flex gap-2">
        <Button variant={tab==='mine'?'default':'outline'} onClick={()=>setTab('mine')}>我发布的 ({myProjects.length})</Button>
        <Button variant={tab==='others'?'default':'outline'} onClick={()=>setTab('others')}>别人发布的 ({otherProjects.length})</Button>
        <Button variant={tab==='joined'?'default':'outline'} onClick={()=>setTab('joined')}>我的参与 ({joined.length})</Button>
      </div>

      {tab === 'mine' && (
        <Card>
          <CardHeader><CardTitle>我发布的项目</CardTitle></CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {myProjects.map(p => (
                <div key={p.id} className="mb-3 rounded border border-amber-500/40 p-3 bg-amber-500/5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold">{p.title} {p.is_public === false && <span className="ml-1 rounded bg-gray-500/30 px-1 text-[10px]">私密</span>}{p.pending_changes && <span className="ml-1 rounded bg-sky-500/30 px-1 text-[10px]">待生效修改</span>}</p>
                      <p className="text-xs text-muted-foreground">{p.description}</p>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs">
                        <p className="text-[10px] text-muted-foreground">参与人数: {p.usage_count || 0}</p>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.deadline_days}天</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{p.needed}人</span>
                        {p.start_date && <span className="text-muted-foreground">开始 {p.start_date}</span>}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="h-3 w-3" /></Button>
                      <Button size="sm" variant="outline" onClick={() => del(p.id)}><Trash2 className="h-3 w-3" /></Button>
                      <Button size="sm" variant="outline" onClick={() => { setOpenComments(openComments===p.id?null:p.id); loadComments(p.id); }}><MessageSquare className="h-3 w-3" /></Button>
                      {p.pending_changes && <><Button size="sm" variant="outline" onClick={() => pushNow(p)}>立即生效</Button><Button size="sm" variant="ghost" onClick={() => withdrawPending(p)}>撤回</Button></>}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {openComments && comments[openComments] && (
        <Card>
          <CardHeader><CardTitle>评论区</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {comments[openComments].map((cm:any) => (
              <div key={cm.id} className={"rounded border p-2 text-sm " + (cm.is_pinned ? 'border-amber-500 bg-amber-500/10' : '')}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{cm.is_pinned ? '📌 ' : ''}{cm.user_id === me ? '我' : '用户'}</span>
                  <span className="flex items-center gap-1 text-xs"><ThumbsUp className="h-3 w-3" />{cm.likes || 0}</span>
                </div>
                <p>{cm.content}</p>
                <div className="mt-1 flex gap-2">
                  {cm.user_id === me && <Button size="sm" variant="ghost" onClick={() => delComment(cm.id, openComments)}><Trash2 className="h-3 w-3" /></Button>}
                  <Button size="sm" variant="ghost" onClick={() => likeComment(cm.id, openComments)}><ThumbsUp className="h-3 w-3" /> 赞</Button>
                  {list.find(x=>x.id===openComments)?.author === me && <Button size="sm" variant="ghost" onClick={() => pinComment(cm.id, openComments, !cm.is_pinned)}>{cm.is_pinned ? '取消置顶' : '置顶'}</Button>}
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <Input placeholder="写评论..." value={commentText} onChange={e=>setCommentText(e.target.value)} />
              <Button size="sm" onClick={() => addComment(openComments)}>发送</Button>
            </div>
            <div className="flex gap-2">
              <Input type="number" min="1" max="5" placeholder="评分1-5" value={ratingText} onChange={e=>setRatingText(e.target.value)} />
              <Button size="sm" variant="outline" onClick={() => rate(openComments)}>评分</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === 'joined' && (
        <Card>
          <CardHeader><CardTitle>我参与的项目（猫猫币余额 {myCoins}）</CardTitle></CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {joined.map(p => (
                <div key={p.id} className="mb-3 rounded border p-3">
                  <p className="font-semibold">{p.title} <span className="ml-1 rounded bg-sky-500/20 px-1 text-[10px]">{p._status === 'completed' ? '已完成' : p._status === 'abandoned' ? '已放弃' : '进行中'}</span></p>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.deadline_days}天</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{p.needed}人</span>
                    {p.reward_coins>0 && <span className="flex items-center gap-1"><Coins className="h-3 w-3" />押金{p.entry_cost} → 奖励{p.reward_coins}</span>}
                  </div>
                  {p._status === 'active' && (
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" onClick={()=>completeProject(p)}>提交完成</Button>
                      <Button size="sm" variant="outline" onClick={()=>quitProject(p)}>放弃</Button>
                    </div>
                  )}
                </div>
              ))}
              {joined.length === 0 && <p className="text-sm text-muted-foreground">还没有参加任何项目，去「别人发布的」里看看吧</p>}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {tab === 'others' && (
        <Card>
          <CardHeader><CardTitle>别人发布的项目</CardTitle></CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
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
                    <Button size="sm" onClick={()=>joinProject(p)}><Users className="h-3 w-3" /> 参加</Button>
                    <Button size="sm" variant="outline" onClick={()=>toggleLike(p.id)}><Heart className="h-3 w-3" /> 赞</Button>
                    <Button size="sm" variant="outline" onClick={()=>toggleFav(p.id)}><Star className="h-3 w-3" /> 收藏</Button>
                    <Button size="sm" variant="outline" onClick={()=>{navigator.clipboard.writeText(location.origin+'/career-lab/user-projects');alert('项目链接已复制，可分享给好友');}}><Share2 className="h-3 w-3" /> 转发</Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

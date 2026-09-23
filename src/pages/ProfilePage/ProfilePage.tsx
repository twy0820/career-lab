import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '@/state/progress-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, FileText, Star, Coins, Gem, Heart, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const { state, level, isMaxLevel, maxLevel, xp } = useProgress();
  const [me, setMe] = useState<string | null>(null);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [myContests, setMyContests] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [myGuild, setMyGuild] = useState<any>(null);
  const [diamonds, setDiamonds] = useState(0);
  const SEASON_DAYS = 90;
  const SEASON_EPOCH = new Date('2026-01-01T00:00:00Z').getTime();
  const daysSinceEpoch = Math.floor((Date.now() - SEASON_EPOCH) / 86400000);
  const seasonNo = Math.floor(daysSinceEpoch / SEASON_DAYS) + 1;
  const seasonDaysLeft = SEASON_DAYS - (daysSinceEpoch % SEASON_DAYS);
  const [coins, setCoins] = useState(0);
  const [exchangeAmt, setExchangeAmt] = useState(10);
  const [privacy, setPrivacy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const uid = data.user.id;
        setMe(uid);
        supabase.from('custom_projects').select('*').eq('author', uid).then(({ data: p }) => setMyProjects(p ?? []));
        supabase.from('custom_contests').select('*').eq('author', uid).then(({ data: c }) => setMyContests(c ?? []));
        supabase.from('visits').select('*').eq('host', uid).order('created_at',{ascending:false}).limit(10).then(({ data: v }) => setVisits(v ?? []));
        supabase.from('favorites').select('*').eq('user_id', uid).then(({ data: f }) => setFavorites(f ?? []));
        supabase.from('likes').select('*').eq('user_id', uid).then(({ data: l }) => setLikes(l ?? []));
        supabase.from('user_meta').select('coins,diamonds,private_records').eq('id', uid).single().then(({ data: u }) => {
          if (u) { setCoins(u.coins || 0); setDiamonds(u.diamonds || 0); setPrivacy(u.private_records || false); }
        });
        supabase.from('guild_members').select('guilds(*)').eq('user_id', uid).limit(1).then(({ data: g }) => {
          setMyGuild(g?.[0]?.guilds ?? null);
        });
      }
    });
  }, []);

  const exchange = async () => {
    if (!me || exchangeAmt <= 0) return;
    if (diamonds < exchangeAmt) { alert('钻石不足'); return; }
    const gain = exchangeAmt * 100;
    await supabase.from('user_meta').update({ diamonds: diamonds - exchangeAmt, coins: coins + gain }).eq('id', me);
    setDiamonds(diamonds - exchangeAmt);
    setCoins(coins + gain);
    alert(`兑换成功：${exchangeAmt} 钻石 → ${gain} 猫猫币`);
  };

  const togglePrivacy = async (v: boolean) => {
    setPrivacy(v);
    if (me) await supabase.from('user_meta').update({ private_records: v }).eq('id', me);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🐱</div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{state.nickname || '猫同学'}</h1>
              <p className="text-sm text-muted-foreground">Lv.{level}{isMaxLevel ? ' · 已满级' : ' / ' + maxLevel}{myGuild && <span className="ml-2">· 公会：{myGuild.name}</span>}</p>
              {isMaxLevel && <p className="text-xs text-amber-500">已达等级上限（经验 {xp}），后续经验按 50% 转为猫猫币加成</p>}
              <div className="mt-2 flex gap-4 text-sm">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 text-amber-500" /> {state.stars ?? 0} 星</span>
                <span className="flex items-center gap-1"><Coins className="h-4 w-4 text-amber-400" /> {coins} 币</span>
                <span className="flex items-center gap-1"><Gem className="h-4 w-4 text-sky-400" /> {diamonds} 钻石</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>赛季信息</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>当前赛季：第 {seasonNo} 赛季（每 90 天结算一次）</p>
          <p className="text-muted-foreground">距下次结算还有 {seasonDaysLeft} 天</p>
          <p className="text-muted-foreground">结算规则：等待队列修改自动生效 · 使用率低于 50% 的项目自动下架 · 星星 ×0.3 降段并折算猫猫币 · 已解锁过的段位不再受报名限制 · 踩奶境不掉星，哈气境及以上逾期未完成扣星</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Gem className="h-4 w-4" />钻石兑换</CardTitle></CardHeader>
        <CardContent className="flex items-end gap-2">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">消耗钻石数量（1 钻石 = 100 猫猫币）</label>
            <Input type="number" value={exchangeAmt} onChange={e=>setExchangeAmt(+e.target.value)} />
          </div>
          <Button onClick={exchange}>兑换猫猫币</Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="achievements">
        <TabsList>
          <TabsTrigger value="achievements">成就履历</TabsTrigger>
          <TabsTrigger value="resume">简历生成器</TabsTrigger>
          <TabsTrigger value="published">我发布的</TabsTrigger>
          <TabsTrigger value="favorites">我的收藏</TabsTrigger>
          <TabsTrigger value="likes">我的点赞</TabsTrigger>
          <TabsTrigger value="visits">访客</TabsTrigger>
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

        <TabsContent value="favorites">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Heart className="h-4 w-4" />我的收藏 ({favorites.length})</CardTitle></CardHeader>
            <CardContent>
              {favorites.map((f:any) => (
                <div key={f.id} className="mb-2 rounded border p-2 text-sm">
                  <span className="text-xs text-muted-foreground">{f.target_type === 'contest' ? '竞赛' : '项目'}</span>
                  <span className="ml-2">{f.target_id}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="likes">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Heart className="h-4 w-4" />我的点赞 ({likes.length})</CardTitle></CardHeader>
            <CardContent>
              {likes.map((l:any) => (
                <div key={l.id} className="mb-2 rounded border p-2 text-sm">
                  <span className="text-xs text-muted-foreground">{l.target_type === 'contest' ? '竞赛' : '项目'}</span>
                  <span className="ml-2">{l.target_id}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visits">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>最近访客 ({visits.length})</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">收藏/点赞记录设为私密</span>
                <Switch checked={privacy} onCheckedChange={togglePrivacy} />
              </div>
            </CardHeader>
            <CardContent>
              {visits.map((v:any) => <p key={v.id} className="text-sm">{v.visitor} 来访</p>)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

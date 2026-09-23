import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Star, Coins, Heart, UserPlus, Users } from 'lucide-react';

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [me, setMe] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [contests, setContests] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [guild, setGuild] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const myId = userData.user?.id ?? null;
      setMe(myId);

      const { data: u } = await supabase.from('user_meta').select('*').eq('id', id).single();
      setUser(u);

      const { data: p } = await supabase.from('custom_projects').select('*').eq('author', id);
      setProjects((p ?? []).filter((x:any) => x.is_public !== false));
      const { data: c } = await supabase.from('custom_contests').select('*').eq('author', id);
      setContests((c ?? []).filter((x:any) => x.is_public !== false));

      const { data: gm } = await supabase.from('guild_members').select('guilds(*)').eq('user_id', id).limit(1);
      setGuild(gm?.[0]?.guilds ?? null);

      if (u?.private_records === false || u?.private_records === null) {
        const { data: f } = await supabase.from('favorites').select('*').eq('user_id', id);
        setFavorites(f ?? []);
        const { data: l } = await supabase.from('likes').select('*').eq('user_id', id);
        setLikes(l ?? []);
      }

      if (myId && myId !== id) {
        await supabase.from('visits').insert({ host: id, visitor: myId });
        const { data: lk } = await supabase.from('likes').select('id').eq('user_id', myId).eq('target_type','user').eq('target_id', id);
        setLiked(!!(lk && lk.length));
        const { data: fr } = await supabase.from('friends').select('id').or(`and(user_a.eq.${myId},user_b.eq.${id}),and(user_a.eq.${id},user_b.eq.${myId})`);
        setIsFriend(!!(fr && fr.length));
      }
    })();
  }, [id]);

  const toggleUserLike = async () => {
    if (!me || !id) return;
    if (liked) {
      await supabase.from('likes').delete().eq('user_id', me).eq('target_type','user').eq('target_id', id);
      setLiked(false);
    } else {
      await supabase.from('likes').insert({ user_id: me, target_type: 'user', target_id: id });
      setLiked(true);
    }
  };

  const addFriend = async () => {
    if (!me || !id || me === id) return;
    const [a, b] = [me, id].sort();
    await supabase.from('friends').upsert({ user_a: a, user_b: b });
    setIsFriend(true);
  };

  if (!user) return <p className="text-sm text-muted-foreground">加载中...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => nav(-1)}><ArrowLeft className="h-4 w-4" /> 返回</Button>
        <h1 className="text-xl font-bold">用户主页</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🐱</div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{user.nickname || '猫同学'}</h1>
              <p className="text-sm text-muted-foreground">Lv.{user.level || 1}{guild && <span className="ml-2">· 公会：{guild.name}</span>}</p>
              <div className="mt-2 flex gap-4 text-sm">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 text-amber-500" /> {user.stars ?? 0} 星</span>
                <span className="flex items-center gap-1"><Coins className="h-4 w-4 text-amber-400" /> {user.coins ?? 0} 币</span>
              </div>
            </div>
            {me && me !== id && (
              <div className="flex gap-2">
                <Button variant={liked?'default':'outline'} size="sm" onClick={toggleUserLike}><Heart className="h-3 w-3" /> {liked?'已赞':'点赞'}</Button>
                {!isFriend && <Button variant="outline" size="sm" onClick={addFriend}><UserPlus className="h-3 w-3" /> 加好友</Button>}
                {isFriend && <span className="text-xs text-muted-foreground self-center">已是好友</span>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="published">
        <TabsList>
          <TabsTrigger value="published">发布内容</TabsTrigger>
          <TabsTrigger value="favorites">收藏</TabsTrigger>
          <TabsTrigger value="likes">点赞</TabsTrigger>
        </TabsList>

        <TabsContent value="published">
          <div className="space-y-3">
            <Card>
              <CardHeader><CardTitle>发布的项目 ({projects.length})</CardTitle></CardHeader>
              <CardContent>
                {projects.map(p => (
                  <div key={p.id} className="mb-2 rounded border p-2 text-sm">
                    <p className="font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>发布的竞赛 ({contests.length})</CardTitle></CardHeader>
              <CardContent>
                {contests.map(c => (
                  <div key={c.id} className="mb-2 rounded border p-2 text-sm">
                    <p className="font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Heart className="h-4 w-4" />收藏 ({favorites.length})</CardTitle></CardHeader>
            <CardContent>
              {favorites.length === 0 && <p className="text-sm text-muted-foreground">该用户将收藏记录设为私密，或暂无收藏</p>}
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
            <CardHeader><CardTitle className="flex items-center gap-2"><Heart className="h-4 w-4" />点赞 ({likes.length})</CardTitle></CardHeader>
            <CardContent>
              {likes.length === 0 && <p className="text-sm text-muted-foreground">该用户将点赞记录设为私密，或暂无点赞</p>}
              {likes.map((l:any) => (
                <div key={l.id} className="mb-2 rounded border p-2 text-sm">
                  <span className="text-xs text-muted-foreground">{l.target_type === 'contest' ? '竞赛' : l.target_type === 'user' ? '用户' : '项目'}</span>
                  <span className="ml-2">{l.target_id}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

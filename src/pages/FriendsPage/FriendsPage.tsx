import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, UserPlus, Trophy } from 'lucide-react';

interface UserMeta {
  id: string;
  nickname: string;
  level: number;
  stars: number;
}

export default function FriendsPage() {
  const [me, setMe] = useState<string | null>(null);
  const [friends, setFriends] = useState<UserMeta[]>([]);
  const [rankList, setRankList] = useState<UserMeta[]>([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserMeta[]>([]);
  const [chatWith, setChatWith] = useState<UserMeta | null>(null);
  const [messages, setMessages] = useState<{ id: string; sender: string; text: string; created_at: string }[]>([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setMe(data.user.id);
    });
  }, []);

  useEffect(() => {
    if (!me) return;
    (async () => {
      const { data: f } = await supabase.from('friends').select('user_b').or(`user_a.eq.${me},user_b.eq.${me}`);
      const ids = (f ?? []).map((r: any) => (r.user_a === me ? r.user_b : r.user_a));
      if (ids.length) {
        const { data: meta } = await supabase.from('user_meta').select('*').in('id', ids);
        setFriends(meta ?? []);
      }
      const { data: top } = await supabase.from('user_meta').select('*').order('stars', { ascending: false }).limit(50);
      setRankList(top ?? []);
    })();
  }, [me]);

  const search = async () => {
    if (!query.trim()) return;
    const { data } = await supabase.from('user_meta').select('*').ilike('nickname', `%${query}%`).limit(20);
    setSearchResults(data ?? []);
  };

  const addFriend = async (otherId: string) => {
    if (!me || otherId === me) return;
    const [a, b] = [me, otherId].sort();
    await supabase.from('friends').upsert({ user_a: a, user_b: b });
    setSearchResults([]);
  };

  const openChat = async (u: UserMeta) => {
    setChatWith(u);
    const { data } = await supabase.from('messages').select('*').or(`and(sender.eq.${me},receiver.eq.${u.id}),and(sender.eq.${u.id},receiver.eq.${me})`).order('created_at');
    setMessages(data ?? []);
  };

  const send = async () => {
    if (!me || !chatWith || !draft.trim()) return;
    await supabase.from('messages').insert({ sender: me, receiver: chatWith.id, text: draft });
    setDraft('');
    openChat(chatWith);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader><CardTitle>找朋友</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Input placeholder="搜昵称" value={query} onChange={(e) => setQuery(e.target.value)} />
            <Button onClick={search}><UserPlus className="h-4 w-4" /></Button>
          </div>
          {searchResults.map((u) => (
            <div key={u.id} className="flex items-center justify-between rounded border p-2">
              <span>{u.nickname} Lv.{u.level}</span>
              <Button size="sm" variant="outline" onClick={() => addFriend(u.id)}>加</Button>
            </div>
          ))}
          <h3 className="mt-4 text-sm font-semibold">好友 ({friends.length})</h3>
          <ScrollArea className="h-40">
            {friends.map((u) => (
              <button key={u.id} onClick={() => openChat(u)} className="flex w-full items-center gap-2 rounded p-2 text-left hover:bg-muted">
                <Avatar className="h-6 w-6"><AvatarFallback>{u.nickname[0]}</AvatarFallback></Avatar>
                <span className="text-sm">{u.nickname}</span>
                <span className="ml-auto text-xs text-muted-foreground">⭐{u.stars}</span>
              </button>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>排行榜</CardTitle></CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {rankList.map((u, i) => (
              <div key={u.id} className="flex items-center gap-2 rounded p-2">
                <span className="w-6 text-xs text-muted-foreground">{i + 1}</span>
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-sm">{u.nickname}</span>
                <span className="ml-auto text-xs text-muted-foreground">Lv.{u.level} ⭐{u.stars}</span>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{chatWith ? `和 ${chatWith.nickname} 聊天` : '选个好友聊天'}</CardTitle></CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            {messages.map((m) => (
              <div key={m.id} className={`mb-2 ${m.sender === me ? 'text-right' : ''}`}>
                <span className="inline-block rounded bg-muted px-2 py-1 text-xs">{m.text}</span>
              </div>
            ))}
          </ScrollArea>
          {chatWith && (
            <div className="mt-2 flex gap-2">
              <Input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
              <Button onClick={send}><Send className="h-4 w-4" /></Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

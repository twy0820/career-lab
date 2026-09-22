import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, UserPlus, X } from 'lucide-react';

interface ChatWindow { id: string; name: string; }

export default function FriendsPage() {
  const [me, setMe] = useState<string | null>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [chats, setChats] = useState<ChatWindow[]>([]);
  const [openChat, setOpenChat] = useState<ChatWindow | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => data.user && setMe(data.user.id));
  }, [me]);

  useEffect(() => {
    if (!me) return;
    (async () => {
      const { data: f } = await supabase.from('friends').select('*').or(`user_a.eq.${me},user_b.eq.${me}`);
      const ids = (f ?? []).map((r:any) => r.user_a === me ? r.user_b : r.user_a);
      if (ids.length) {
        const { data: meta } = await supabase.from('user_meta').select('*').in('id', ids);
        setFriends(meta ?? []);
      }
    })();
  }, [me]);

  const search = async () => {
    if (!query.trim()) return;
    const { data } = await supabase.from('user_meta').select('*').ilike('nickname', `%${query}%`).limit(20);
    setResults(data ?? []);
  };

  const addFriend = async (otherId: string) => {
    if (!me || otherId === me) return;
    const [a, b] = [me, otherId].sort();
    await supabase.from('friends').upsert({ user_a: a, user_b: b });
    setResults([]);
  };

  const openDialog = (u: any) => {
    const c = { id: u.id, name: u.nickname };
    setOpenChat(c);
    if (!chats.find(x=>x.id===u.id)) setChats([...chats, c]);
    loadMsgs(u.id);
  };

  const loadMsgs = async (uid: string) => {
    if (!me) return;
    const { data } = await supabase.from('messages').select('*').or(`and(sender.eq.${me},receiver.eq.${uid}),and(sender.eq.${uid},receiver.eq.${me})`).order('created_at');
    setMessages(data ?? []);
  };

  const send = async () => {
    if (!me || !openChat || !draft.trim()) return;
    await supabase.from('messages').insert({ sender: me, receiver: openChat.id, text: draft });
    setDraft('');
    loadMsgs(openChat.id);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>好友列表 ({friends.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-2">
            <Input placeholder="搜索昵称加好友" value={query} onChange={e=>setQuery(e.target.value)} />
            <Button onClick={search}><UserPlus className="h-4 w-4" /></Button>
          </div>
          {results.map(u=>(
            <div key={u.id} className="flex items-center justify-between rounded border p-2 mb-1">
              <span className="text-sm">{u.nickname} Lv.{u.level}</span>
              <Button size="sm" variant="outline" onClick={()=>addFriend(u.id)}>加好友</Button>
            </div>
          ))}
          <ScrollArea className="h-80">
            {friends.map(u=>(
              <button key={u.id} onClick={()=>openDialog(u)} className="flex w-full items-center gap-2 rounded p-2 hover:bg-muted text-left">
                <Avatar className="h-6 w-6"><AvatarFallback>{u.nickname[0]}</AvatarFallback></Avatar>
                <span className="text-sm">{u.nickname}</span>
                <span className="ml-auto text-xs text-muted-foreground">⭐{u.stars}</span>
              </button>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>最近对话</CardTitle></CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {chats.map(c=>(
              <button key={c.id} onClick={()=>setOpenChat(c)} className={`flex w-full items-center justify-between rounded p-2 hover:bg-muted text-left ${openChat?.id===c.id?'bg-muted':''}`}>
                <span className="text-sm">{c.name}</span>
                <X className="h-3 w-3 text-muted-foreground" onClick={(e)=>{e.stopPropagation();setChats(chats.filter(x=>x.id!==c.id));if(openChat?.id===c.id)setOpenChat(null);}} />
              </button>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {openChat && (
        <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-xl">
          <CardHeader className="py-2"><CardTitle className="text-sm">{openChat.name}</CardTitle></CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              {messages.map(m=>(
                <div key={m.id} className={`mb-1 ${m.sender===me?'text-right':''}`}>
                  <span className="inline-block rounded bg-muted px-2 py-1 text-xs">{m.text}</span>
                </div>
              ))}
            </ScrollArea>
            <div className="mt-2 flex gap-1">
              <Input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} className="h-8" />
              <Button size="sm" onClick={send}><Send className="h-3 w-3" /></Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

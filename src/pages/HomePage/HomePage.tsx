import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, ArrowRight, Swords, Briefcase, Trophy } from 'lucide-react';

export default function HomePage() {
  const [me, setMe] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<any[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => data.user && setMe(data.user.id));
    refresh();
    const sub = supabase
      .channel('public-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => refresh())
      .subscribe();
    return () => { sub.unsubscribe(); };
  }, []);

  const refresh = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*, sender_meta:user_meta(nickname)')
      .eq('receiver', 'national')
      .order('created_at', { ascending: false })
      .limit(50);
    setMsgs((data ?? []).reverse());
  };

  const send = async () => {
    if (!me || !text.trim()) return;
    await supabase.from('messages').insert({ sender: me, receiver: 'national', text });
    setText('');
    refresh();
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-6">
          <h1 className="text-2xl font-bold">实战工场</h1>
          <p className="mt-1 text-sm text-muted-foreground">0 基础大学生就业训练平台 · 模拟企业实战 · 竞赛雷达 · 履历包装</p>
          <div className="mt-4 flex gap-2">
            <Button asChild><Link to="/skills">开始学习 <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button variant="outline" asChild><Link to="/projects">项目实战</Link></Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Card><CardContent className="p-3 text-center"><Briefcase className="mx-auto h-5 w-5 text-primary" /><p className="mt-1 text-xs">50+ 模拟项目</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><Swords className="mx-auto h-5 w-5 text-primary" /><p className="mt-1 text-xs">30+ 模拟竞赛</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><Trophy className="mx-auto h-5 w-5 text-primary" /><p className="mt-1 text-xs">八境猫段位</p></CardContent></Card>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm">全国交流大厅</CardTitle></CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {msgs.map(m => (
              <div key={m.id} className="mb-2">
                <p className="text-[10px] text-muted-foreground">{(m as any).sender_meta?.nickname || '匿名'}</p>
                <p className="text-xs rounded bg-muted px-2 py-1">{m.text}</p>
              </div>
            ))}
          </ScrollArea>
          {me ? (
            <div className="mt-2 flex gap-2">
              <Input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="说点什么..." />
              <Button size="sm" onClick={send}><Send className="h-4 w-4" /></Button>
            </div>
          ) : (
            <p className="mt-2 text-xs text-center text-muted-foreground">登录后可发言</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


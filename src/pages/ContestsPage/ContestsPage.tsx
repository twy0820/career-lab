// 竞赛雷达：真实公开竞赛聚合（数据文件可自行更新）
import { useEffect, useMemo, useState } from 'react';
import {
  BellRing,
  CalendarDays,
  ExternalLink,
  RefreshCw,
  Search,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TerminalPanel from '@/components/TerminalPanel';
import { useProgress } from '@/state/progress-context';
import {
  useContests,
  contestStatus,
  CONTEST_STATUS_META,
  CONTEST_CATEGORIES,
  formatDate,
  daysText,
} from '@/hooks/use-contests';
import type { IContestStatus } from '@/data/types';
import { useMocks } from '@/hooks/use-mocks';

const STATUS_TABS: { key: IContestStatus | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'open', label: '报名中' },
  { key: 'upcoming', label: '即将开始' },
  { key: 'running', label: '进行中' },
  { key: 'closed', label: '已截止' },
  { key: 'recurring', label: '常驻平台' },
];

export default function ContestsPage() {
  const { contests, loading, error, refreshing, refresh, updatedAt } = useContests();
  const mocks = useMocks();
  const { state, toggleFavorite } = useProgress();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const [statusTab, setStatusTab] = useState<IContestStatus | 'all'>('all');
  const [category, setCategory] = useState('all');
  const [keyword, setKeyword] = useState('');

  const filtered = useMemo(() => {
    return contests
      .map((c) => ({ c, st: contestStatus(c, now) }))
      .filter(({ c, st }) => {
        if (statusTab !== 'all' && st !== statusTab) return false;
        if (category !== 'all' && c.category !== category) return false;
        if (keyword.trim()) {
          const kw = keyword.trim().toLowerCase();
          const hit =
            c.name.toLowerCase().includes(kw) ||
            c.host.toLowerCase().includes(kw) ||
            c.tags.some((t) => t.toLowerCase().includes(kw));
          if (!hit) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const af = mocks.freshContestIds.has(a.c.id) ? 0 : 1;
        const bf = mocks.freshContestIds.has(b.c.id) ? 0 : 1;
        if (af !== bf) return af - bf;
        return a.c.regEnd.localeCompare(b.c.regEnd);
      });
  }, [contests, now, statusTab, category, keyword]);

  const handleFavorite = (id: string) => {
    toggleFavorite(id);
    toast.success(state.favorites.includes(id) ? '已取消收藏' : '已收藏，工作台会提醒你报名');
  };

  return (
    <div className="space-y-6">
      <TerminalPanel title="~/contests/radar" status="实时倒计时">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-bold">竞赛雷达</h2>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              收集面向社会公开报名的真实赛事与训练营：编程竞赛、数据/AI 赛事、数学建模、创新创业与
              企业训练营。报名信息均来自官方渠道，点「去报名」直达官方页面。
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span className="font-mono text-success">数据更新于 {updatedAt}</span>
              <span className="text-muted-foreground/60">·</span>
              <span>报名倒计时按你的当前时间实时计算</span>
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={refreshing}
            onClick={() => {
              refresh().then(() => toast.success('已重新拉取竞赛数据'));
            }}
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? '刷新中…' : '刷新数据'}
          </Button>
        </div>
      </TerminalPanel>

      {/* 筛选区 */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <Tabs
            value={statusTab}
            onValueChange={(v) => setStatusTab(v as IContestStatus | 'all')}
            className="flex-1"
          >
            <TabsList className="flex-wrap">
              {STATUS_TABS.map((t) => (
                <TabsTrigger key={t.key} value={t.key}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex flex-wrap gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                {CONTEST_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索赛事 / 主办方 / 标签"
                className="w-56 pl-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 列表 */}
      {loading ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          正在读取竞赛数据…
        </div>
      ) : error ? (
        <div className="space-y-3 rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center">
          <p className="text-sm text-destructive">竞赛数据加载失败：{error}</p>
          <p className="text-xs text-muted-foreground">
            请确认 public/data/competitions.json 文件存在且为合法 JSON。
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          没有符合当前筛选条件的赛事，换个筛选试试。
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map(({ c, st }) => {
            const meta = CONTEST_STATUS_META[st];
            const fav = state.favorites.includes(c.id);
            return (
              <TerminalPanel
                key={c.id}
                title={`~/contests/${c.id}`}
                action={
                  <Badge variant="outline" className={`border px-2 py-0.5 ${meta.cls}`}>
                    {meta.label}
                  </Badge>
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold leading-snug flex items-center gap-2">
                  {c.name}
                  {mocks.freshContestIds.has(c.id) && (
                    <span className="rounded bg-gradient-to-r from-fuchsia-500/20 to-violet-500/20 px-1.5 py-0.5 text-[10px] font-normal text-fuchsia-300 border border-fuchsia-500/40">
                      ✨ AI 本周新增
                    </span>
                  )}
                </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.host}</p>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0"
                    onClick={() => handleFavorite(c.id)}
                    title={fav ? '取消收藏' : '收藏'}
                  >
                    <Star
                      className={`h-4 w-4 ${fav ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                    />
                  </Button>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="border border-border text-[10px]">
                    {c.category}
                  </Badge>
                  <Badge variant="secondary" className="border border-border text-[10px]">
                    {c.level}
                  </Badge>
                  {c.tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{c.summary}</p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    报名 {formatDate(c.regStart)} ~ {formatDate(c.regEnd)}
                  </span>
                  {st === 'open' && now && (
                    <span className="font-semibold text-success">{daysText(c.regEnd, now)}</span>
                  )}
                </div>
                {c.note && (
                  <p className="mt-2 text-xs text-muted-foreground">注：{c.note}</p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" asChild variant="default">
                    <a href={c.registrationUrl} target="_blank" rel="noreferrer">
                      去报名 <ExternalLink className="ml-1 h-3.5 w-3.5" />
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={c.officialUrl} target="_blank" rel="noreferrer">
                      官方通知
                    </a>
                  </Button>
                  {!fav && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="gap-1 text-xs"
                      onClick={() => handleFavorite(c.id)}
                    >
                      <BellRing className="h-3.5 w-3.5" /> 设置提醒
                    </Button>
                  )}
                </div>
              </TerminalPanel>
            );
          })}
        </div>
      )}

      <div className="flex items-start gap-2 rounded-md border border-border bg-card p-3 text-xs text-muted-foreground">
        <RefreshCw className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          实时性说明：本页数据为人工核验的官方来源快照。报名时间以官方页面为准；数据文件可自行
          维护更新（参考上文路径），也可在后续版本接入官方 API / RSS 实现自动同步。
        </span>
      </div>
    </div>
  );
}

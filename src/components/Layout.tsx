// EXPORTS: Layout
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { Toaster } from 'sonner';
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  Swords,
  Radar,
  Trophy,
  BookMarked,
  Terminal,
  Zap,
  Users,
  Building2,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import ProgressProvider from '@/state/ProgressProvider';
import { useProgress } from '@/state/progress-context';
import CoachWidget from './CoachWidget';
import OnboardingWelcome from './OnboardingWelcome';
import { Switch } from '@/components/ui/switch';
import { RANKS, rankForLevel } from '@/data/ranks';
import { Bot, LogIn, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

const NAV_ITEMS = [
  { path: '/', label: '主页', icon: LayoutDashboard },
  { path: '/skills', label: '技能图谱', icon: BookOpen },
  { path: '/projects', label: '项目实战', icon: Briefcase },
  { path: '/arena', label: '竞赛练兵', icon: Swords },
  { path: '/contests', label: '竞赛雷达', icon: Radar },
  { path: '/friends', label: '好友', icon: Users },
  { path: '/ranking', label: '排名', icon: Trophy },
  { path: '/guild', label: '公会', icon: Building2 },
  { path: '/dict', label: '喵喵字典', icon: BookMarked },
];

export const Layout = () => {
  return (
    <ProgressProvider>
      <Shell />
    </ProgressProvider>
  );
};

function Shell() {
  const { pathname } = useLocation();
  const { xp, level, levelProgress, nextLevelXp, state, setCoachMode, titles, setNickname } = useProgress();
  const rank = rankForLevel(level);
  const shownRank = RANKS.find((r) => r.id === state.selectedRankId) ?? rank;
  const shownTitle = titles.find((tt) => tt.id === state.selectedTitleId);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => { sub.subscription.unsubscribe(); };
  }, []);
  const login = () => supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: window.location.origin + '/career-lab/' },
  });
  const logout = () => supabase.auth.signOut();
  const editNickname = () => {
    const n = window.prompt('给你的喵侠起个名字', state.nickname || '');
    if (n && n.trim()) setNickname(n.trim().slice(0, 12));
  };
  const current = NAV_ITEMS.find((item) =>
    item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)
  );

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Terminal className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">实战工场</p>
              <p className="font-mono text-[10px] text-muted-foreground">TechForge Lab</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => {
              const active = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                    <NavLink to={item.path} end={item.path === '/'}>
                      <item.icon />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <NavLink to="/me" className="flex w-full items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-left hover:bg-primary/20">
            <span className="text-xl">{shownRank.emoji}</span>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-semibold">{state.nickname || '猫同学'}</p>
                <span onClick={(e)=>{e.stopPropagation();e.preventDefault();editNickname();}} className="text-[10px] text-muted-foreground hover:text-primary">✎</span>
              </div>
              <p className="text-[10px] opacity-80">{shownRank.name} · Lv.{level}</p>
            </div>
            <div className="text-right text-[10px]">
              <p>⭐{state.stars ?? 0}</p>
              <p className="text-amber-400">🐟{state.coins ?? 0}</p>
            </div>
          </NavLink>
          <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <div className="min-w-0 flex-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(levelProgress * 100)}%` }} />
              </div>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">Lv.{level}</span>
          </div>
          <div className="flex items-center justify-between rounded-md border border-primary/30 bg-primary/10 px-3 py-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
              <Bot className="h-3.5 w-3.5" /> 喵喵向导
            </span>
            <Switch checked={state.coachMode} onCheckedChange={setCoachMode} />
          </div>
          {user ? (
            <div className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
              <span className="truncate text-xs">{user.user_metadata?.user_name || user.email}</span>
              <button onClick={logout} title="退出登录" className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button onClick={login} className="flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90">
              <LogIn className="h-3.5 w-3.5" /> GitHub 登录
            </button>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger />
          <h1 className="text-sm font-semibold">{current ? current.label : '实战工场'}</h1>
          <span className="ml-auto hidden font-mono text-xs text-muted-foreground sm:block">
            企业实战模拟 · 竞赛雷达 · 履历包装
          </span>
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
      <CoachWidget />
      <OnboardingWelcome />
      <Toaster position="top-center" theme="dark" />
    </SidebarProvider>
  );
}

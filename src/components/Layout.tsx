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
  FileText,
  BookMarked,
  Terminal,
  Zap,
  Users,
  Building2,
  FolderPlus,
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
  { path: '/', label: '涓婚〉', icon: LayoutDashboard },
  { path: '/skills', label: '鎶€鑳藉浘璋?, icon: BookOpen },
  { path: '/projects', label: '椤圭洰瀹炴垬', icon: Briefcase },
  { path: '/arena', label: '绔炶禌缁冨叺', icon: Swords },
  { path: '/contests', label: '绔炶禌闆疯揪', icon: Radar },
  { path: '/friends', label: '濂藉弸', icon: Users },
  { path: '/ranking', label: '鎺掑悕', icon: Trophy },
  { path: '/guild', label: '鍏細', icon: Building2 },
  { path: '/portfolio', label: '鎴愬氨灞ュ巻', icon: FolderPlus },
  { path: '/resume', label: '绠€鍘嗙敓鎴愬櫒', icon: FileText },
  { path: '/dict', label: '鍠靛柕瀛楀吀', icon: BookMarked },
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
    return () => sub.subscription.unsubscribe();
  }, []);
  const login = () => supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: window.location.origin + '/career-lab/' },
  });
  const logout = () => supabase.auth.signOut();
  const editNickname = () => {
    const n = window.prompt('缁欎綘鐨勫柕渚犺捣涓悕瀛?, state.nickname || '');
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
              <p className="text-sm font-semibold">瀹炴垬宸ュ満</p>
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
          {/* 绮剧畝鐢ㄦ埛鍗＄墖 */}
          <button
            onClick={() => window.location.href = '/career-lab/me'}
            className="flex w-full items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-left hover:bg-primary/20"
            title="鐐瑰嚮鏌ョ湅鎴戠殑涓婚〉"
          >
            <span className="text-xl">{shownRank.emoji}</span>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-semibold">{state.nickname || '鐚悓瀛?}</p>
                <span onClick={(e)=>{e.stopPropagation();editNickname();}} className="text-[10px] text-muted-foreground hover:text-primary">鉁?/span>
              </div>
              <p className="text-[10px] opacity-80">{shownRank.name} 路 Lv.{level}</p>
            </div>
            <div className="text-right text-[10px]">
              <p>猸恵state.stars ?? 0}</p>
              <p className="text-amber-400">馃悷{state.coins ?? 0}</p>
            </div>
          </button>
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
              <Bot className="h-3.5 w-3.5" /> 鍠靛柕鍚戝
            </span>
            <Switch checked={state.coachMode} onCheckedChange={setCoachMode} />
          </div>
          {user ? (
            <div className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
              <span className="truncate text-xs">{user.user_metadata?.user_name || user.email}</span>
              <button onClick={logout} title="閫€鍑虹櫥褰? className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button onClick={login} className="flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90">
              <LogIn className="h-3.5 w-3.5" /> GitHub 鐧诲綍
            </button>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger />
          <h1 className="text-sm font-semibold">{current ? current.label : '瀹炴垬宸ュ満'}</h1>
          <span className="ml-auto hidden font-mono text-xs text-muted-foreground sm:block">
            浼佷笟瀹炴垬妯℃嫙 路 绔炶禌闆疯揪 路 灞ュ巻鍖呰
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


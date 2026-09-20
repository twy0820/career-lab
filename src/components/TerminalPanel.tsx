// EXPORTS: TerminalPanel（default）
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TerminalPanelProps {
  title: string;
  status?: string;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}

/** 终端式面板：带模拟窗口标题栏（红黄绿圆点 + 标题），是本应用的签名组件 */
export default function TerminalPanel({
  title,
  status,
  action,
  className,
  bodyClassName,
  children,
}: TerminalPanelProps) {
  return (
    <section className={cn('overflow-hidden rounded-lg border border-border bg-card', className)}>
      <header className="flex items-center gap-3 border-b border-border bg-muted/50 px-4 py-2">
        <span className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        </span>
        <span className="min-w-0 truncate font-mono text-xs font-medium text-muted-foreground">
          {title}
        </span>
        {status ? (
          <span className="ml-auto flex shrink-0 items-center gap-1.5 font-mono text-xs text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            {status}
          </span>
        ) : null}
        {action ? <span className="ml-auto shrink-0">{action}</span> : null}
      </header>
      <div className={cn('p-4', bodyClassName)}>{children}</div>
    </section>
  );
}

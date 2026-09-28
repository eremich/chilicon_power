import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: ReactNode;
}

/** Nothing here yet: say why, and offer the one action that fills it. */
export const EmptyState = ({ icon: Icon, title, body, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
    <span className="flex size-16 items-center justify-center rounded-chip bg-brand/15 text-brand-ink">
      <Icon aria-hidden className="size-7" strokeWidth={1.75} />
    </span>
    <h2 className="text-title2 text-ink">{title}</h2>
    <p className="text-subheadline text-muted">{body}</p>
    {action && <div className="mt-2 w-full">{action}</div>}
  </div>
);

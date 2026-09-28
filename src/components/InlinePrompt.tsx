import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

export interface InlinePromptProps {
  icon: LucideIcon;
  title: string;
  body?: string;
  onClick: () => void;
}

/** A quiet nudge inside a screen: "Add your electricity rate to see savings". Tappable, never blocking. */
export const InlinePrompt = ({ icon: Icon, title, body, onClick }: InlinePromptProps) => (
  <button type="button" onClick={onClick} className="press flex w-full items-center gap-3 rounded-card border border-dashed border-brand/60 bg-brand/5 p-3 text-left">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-chip bg-brand/15 text-brand-ink">
      <Icon aria-hidden className="size-5" strokeWidth={2} />
    </span>
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="text-subheadline font-semibold text-ink">{title}</span>
      {body && <span className="text-footnote text-muted">{body}</span>}
    </span>
    <ChevronRight aria-hidden className="size-5 shrink-0 text-muted" />
  </button>
);

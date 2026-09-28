import type { LucideIcon } from 'lucide-react';
import { cx } from '../lib/cx';

export interface IconButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  /** Small dot for unread items */
  dot?: boolean;
  tone?: 'plain' | 'filled';
}

/** 44 pt icon-only button. Always has an accessible label. */
export const IconButton = ({ label, icon: Icon, onClick, dot = false, tone = 'plain' }: IconButtonProps) => (
  <button type="button" aria-label={label} onClick={onClick} className="press relative flex size-11 items-center justify-center rounded-chip">
    <span className={cx('flex size-9 items-center justify-center rounded-chip transition-colors duration-150', tone === 'filled' ? 'bg-surface text-ink hover:bg-raised' : 'text-ink hover:bg-raised')}>
      <Icon aria-hidden className="size-[22px]" strokeWidth={1.75} />
    </span>
    {dot && <span aria-hidden className="absolute right-2.5 top-2.5 size-2 rounded-chip bg-fault ring-2 ring-canvas" />}
  </button>
);

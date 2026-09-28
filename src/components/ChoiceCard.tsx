import type { LucideIcon } from 'lucide-react';
import { cx } from '../lib/cx';

export interface ChoiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

/** One option of a single-choice question ("Who are you?"). Use inside a role="radiogroup". */
export const ChoiceCard = ({ icon: Icon, title, description, selected, onSelect }: ChoiceCardProps) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onSelect}
    className={cx('press flex w-full items-center gap-4 rounded-card bg-surface p-4 text-left ring-inset transition-shadow duration-150', selected ? 'ring-2 ring-brand' : 'ring-1 ring-transparent hover:ring-line')}
  >
    <span className={cx('flex size-12 shrink-0 items-center justify-center rounded-chip transition-colors duration-150', selected ? 'bg-brand text-on-brand' : 'bg-raised text-ink')}>
      <Icon aria-hidden className="size-6" strokeWidth={1.75} />
    </span>
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="text-headline text-ink">{title}</span>
      <span className="text-subheadline text-muted">{description}</span>
    </span>
    <span aria-hidden className={cx('flex size-6 shrink-0 items-center justify-center rounded-chip border-2 transition-colors duration-150', selected ? 'border-brand bg-brand' : 'border-line')}>
      {selected && <span className="size-2 rounded-chip bg-on-brand" />}
    </span>
  </button>
);

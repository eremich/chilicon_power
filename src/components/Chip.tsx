import { cx } from '../lib/cx';

export interface ChipProps {
  label: string;
  count?: number;
  selected: boolean;
  onClick: () => void;
}

/** Filter or choice chip. Selected = inverted, so it reads without color. 36 pt visual, 44 pt target. */
export const Chip = ({ label, count, selected, onClick }: ChipProps) => (
  <button type="button" aria-pressed={selected} onClick={onClick} className="press flex h-11 shrink-0 items-center">
    <span
      className={cx(
        'tnum flex h-9 items-center gap-1.5 rounded-chip px-3.5 text-subheadline transition-colors duration-150',
        selected ? 'bg-ink font-semibold text-canvas' : 'bg-surface text-ink ring-1 ring-inset ring-line hover:bg-raised',
      )}
    >
      {label}
      {count !== undefined && <span className={selected ? 'text-canvas/70' : 'text-muted'}>{count}</span>}
    </span>
  </button>
);

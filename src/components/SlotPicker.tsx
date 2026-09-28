import { Chip } from './Chip';
import { cx } from '../lib/cx';

export interface SlotPickerProps {
  days: string[];
  slots: { label: string; taken?: boolean }[];
  day: string;
  slot?: string;
  onDay: (d: string) => void;
  onSlot: (s: string) => void;
}

/** Visit scheduling: pick a day, then a two-hour window. Taken windows stay visible but disabled. */
export const SlotPicker = ({ days, slots, day, slot, onDay, onSlot }: SlotPickerProps) => (
  <div className="flex flex-col gap-4">
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]" role="group" aria-label="Day">
      {days.map((d) => (
        <Chip key={d} label={d} selected={d === day} onClick={() => onDay(d)} />
      ))}
    </div>
    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Time window">
      {slots.map((s) => {
        const on = s.label === slot;
        return (
          <button
            key={s.label}
            type="button"
            role="radio"
            aria-checked={on}
            disabled={s.taken}
            onClick={() => onSlot(s.label)}
            className={cx(
              'press flex h-13 flex-col items-center justify-center rounded-control text-subheadline ring-inset transition-colors duration-150 disabled:cursor-not-allowed',
              on ? 'bg-brand font-semibold text-on-brand' : 'bg-raised text-ink hover:bg-line disabled:bg-transparent disabled:text-muted disabled:ring-1 disabled:ring-line',
            )}
          >
            <span className="tnum">{s.label}</span>
            {s.taken && <span className="text-caption font-normal">Taken</span>}
          </button>
        );
      })}
    </div>
  </div>
);

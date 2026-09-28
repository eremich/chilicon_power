import { TONE } from '../lib/status';
import { cx } from '../lib/cx';

export type FleetFilter = 'all' | 'offline' | 'warn' | 'ok';

export interface FleetSummaryProps {
  counts: { offline: number; warn: number; ok: number };
  value: FleetFilter;
  onChange: (f: FleetFilter) => void;
}

const ITEMS = [
  { key: 'offline', label: 'Offline', tone: TONE.offline },
  { key: 'warn', label: 'Issues', tone: TONE.warn },
  { key: 'ok', label: 'OK', tone: TONE.ok },
] as const;

/** Fleet health at a glance. Each count is also a filter; tapping the selected one clears it. */
export const FleetSummary = ({ counts, value, onChange }: FleetSummaryProps) => (
  <div className="grid grid-cols-3 gap-2" role="group" aria-label="Filter sites by status">
    {ITEMS.map(({ key, label, tone }) => {
      const on = value === key;
      const n = counts[key];
      const Icon = tone.icon;
      return (
        <button
          key={key}
          type="button"
          aria-pressed={on}
          onClick={() => onChange(on ? 'all' : key)}
          className={cx('press flex flex-col items-start gap-1 rounded-card p-3 text-left ring-inset transition-shadow duration-150', on ? 'bg-surface ring-2 ring-ink' : 'bg-surface ring-1 ring-transparent hover:ring-line')}
        >
          <Icon aria-hidden className={cx('size-5', n === 0 && key !== 'ok' ? 'text-muted' : tone.fill)} strokeWidth={2} />
          <span className="tnum text-title2 text-ink">{n}</span>
          <span className="text-footnote text-muted">{label}</span>
        </button>
      );
    })}
  </div>
);

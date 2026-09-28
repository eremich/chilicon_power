import { cx } from '../lib/cx';

export interface SegmentedProps<K extends string> {
  label: string;
  options: { key: K; label: string }[];
  value: K;
  onChange: (key: K) => void;
}

/** iOS segmented control. The thumb slides to the new option. */
export const Segmented = <K extends string>({ label, options, value, onChange }: SegmentedProps<K>) => {
  const index = Math.max(0, options.findIndex((o) => o.key === value));
  return (
    <div role="tablist" aria-label={label} className="relative grid rounded-segment bg-raised p-0.5" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      <span
        aria-hidden
        className="absolute inset-y-0.5 left-0.5 rounded-[7px] bg-surface shadow-thumb transition-transform duration-thumb ease-out"
        style={{ width: `calc((100% - 4px) / ${options.length})`, transform: `translateX(${index * 100}%)` }}
      />
      {options.map((o) => {
        const on = o.key === value;
        return (
          <button
            key={o.key}
            role="tab"
            type="button"
            aria-selected={on}
            onClick={() => onChange(o.key)}
            className={cx('relative flex h-8 items-center justify-center rounded-[7px] text-subheadline transition-colors duration-150', on ? 'font-semibold text-ink' : 'text-muted hover:text-ink')}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
};

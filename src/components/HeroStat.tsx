import { cx } from '../lib/cx';

export interface HeroStatProps {
  label: string;
  value: string;
  /** Unit set smaller next to the number: "kWh", "%" */
  unit?: string;
  /** Short context line: "Above your May average" */
  note?: string;
  size?: 'hero' | 'compact';
}

/** A number in plain language. Label on top, the number big, unit smaller. Tabular numerals. */
export const HeroStat = ({ label, value, unit, note, size = 'hero' }: HeroStatProps) => (
  <div className="flex min-w-0 flex-col">
    <span className="text-footnote text-muted">{label}</span>
    <span className={cx('tnum flex items-baseline gap-1 text-ink', size === 'hero' ? 'text-hero' : 'text-title2')}>
      {value}
      {unit && <span className={cx('font-semibold text-muted', size === 'hero' ? 'text-headline' : 'text-footnote')}>{unit}</span>}
    </span>
    {note && <span className="tnum text-footnote text-muted">{note}</span>}
  </div>
);

import { ChevronRight } from 'lucide-react';
import { TONE, type Tone } from '../lib/status';
import { cx } from '../lib/cx';

export interface SiteRowProps {
  customer: string;
  city: string;
  sizeKw: number;
  tone: Tone;
  /** What is wrong, in owner words: "Panel 7 producing 40% less". Omit when OK */
  issue?: string;
  updated: string;
  onClick?: () => void;
}

/** A customer site in the installer's list. Problems first: the status icon and issue line lead. */
export const SiteRow = ({ customer, city, sizeKw, tone, issue, updated, onClick }: SiteRowProps) => {
  const t = TONE[tone];
  const Icon = t.icon;
  return (
    <li>
      <button type="button" onClick={onClick} className="flex w-full items-center gap-3 px-4 text-left transition-colors duration-150 hover:bg-raised/60 active:bg-raised">
        <Icon aria-hidden className={cx('size-6 shrink-0', t.fill)} strokeWidth={2} />
        <span className="flex min-w-0 flex-1 items-center gap-2 border-b border-line py-3">
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="flex items-baseline justify-between gap-2">
              <span className="truncate text-headline text-ink">{customer}</span>
              <span className="tnum shrink-0 text-footnote text-muted">{updated}</span>
            </span>
            <span className="tnum truncate text-footnote text-muted">
              {city} · {sizeKw.toFixed(1)} kW
            </span>
            <span className={cx('text-subheadline', tone === 'ok' ? 'text-muted' : t.text)}>
              <span className="sr-only">{t.label}: </span>
              {issue ?? 'All panels producing'}
            </span>
          </span>
          <ChevronRight aria-hidden className="size-5 shrink-0 text-muted/70" />
        </span>
      </button>
    </li>
  );
};

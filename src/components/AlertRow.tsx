import { ChevronRight } from 'lucide-react';
import { TONE } from '../lib/status';
import { cx } from '../lib/cx';

export interface AlertRowProps {
  customer: string;
  city: string;
  title: string;
  cause: string;
  age: string;
  tone: 'offline' | 'warn' | 'ok';
  /** The owner sent a report from the app */
  fromOwner?: boolean;
  unread?: boolean;
  onClick?: () => void;
}

/** One alert in the installer feed: what is wrong, where, the likely cause and how long ago. */
export const AlertRow = ({ customer, city, title, cause, age, tone, fromOwner, unread, onClick }: AlertRowProps) => {
  const t = TONE[tone];
  const Icon = t.icon;
  return (
    <li>
      <button type="button" onClick={onClick} className="flex w-full items-start gap-3 px-4 text-left transition-colors duration-150 hover:bg-raised/60 active:bg-raised">
        <span className="relative mt-3">
          <Icon aria-hidden className={cx('size-6', t.fill)} strokeWidth={2} />
          {unread && <span aria-hidden className="absolute -left-2.5 top-2 size-2 rounded-chip bg-brand" />}
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-2 border-b border-line py-3">
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="flex items-baseline justify-between gap-2">
              <span className={cx('text-headline', tone === 'ok' ? 'text-ink' : t.text)}>
                <span className="sr-only">{unread ? 'New. ' : ''}{t.label}: </span>
                {title}
              </span>
              <span className="tnum shrink-0 text-footnote text-muted">{age}</span>
            </span>
            <span className="text-subheadline text-ink">
              {customer} · {city}
            </span>
            <span className="text-footnote text-muted">{cause}</span>
            {fromOwner && <span className="mt-1 w-fit rounded-chip bg-brand/15 px-2 py-0.5 text-caption text-brand-ink">Reported by owner</span>}
          </span>
          <ChevronRight aria-hidden className="size-5 shrink-0 text-muted/70" />
        </span>
      </button>
    </li>
  );
};

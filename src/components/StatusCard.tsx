import { ChevronRight } from 'lucide-react';
import { TONE, type Tone } from '../lib/status';
import { cx } from '../lib/cx';

export interface StatusCardProps {
  tone: Tone;
  /** The answer, in one sentence: "All 24 panels producing" */
  title: string;
  /** Freshness or the next step: "Updated 2 min ago" */
  detail?: string;
  onClick?: () => void;
}

/** The first thing on Home. Answers "is my system OK?" with an icon, a sentence and how fresh the data is. */
export const StatusCard = ({ tone, title, detail, onClick }: StatusCardProps) => {
  const t = TONE[tone];
  const Icon = t.icon;
  const body = (
    <>
      <span className={cx('flex size-10 shrink-0 items-center justify-center rounded-chip', t.tint)}>
        <Icon aria-hidden className={cx('size-6', t.fill)} strokeWidth={2} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span className={cx('text-headline', tone === 'ok' ? 'text-ink' : t.text)}>
          <span className="sr-only">{t.label}: </span>
          {title}
        </span>
        {detail && <span className="tnum text-footnote text-muted">{detail}</span>}
      </span>
      {onClick && <ChevronRight aria-hidden className="size-5 shrink-0 text-muted" />}
    </>
  );
  const cls = 'flex w-full items-center gap-3 rounded-card bg-surface p-3 pr-4';
  return onClick ? (
    <button type="button" onClick={onClick} className={cx(cls, 'press')}>
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  );
};

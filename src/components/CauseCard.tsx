import type { ReactNode } from 'react';
import { CloudSun, Leaf, Unplug } from 'lucide-react';
import { cx } from '../lib/cx';

export type Cause = 'shade' | 'device' | 'weather';

const CAUSE: Record<Cause, { icon: typeof Leaf; title: string; tone: string; tint: string }> = {
  shade: { icon: Leaf, title: 'Likely shade or dirt', tone: 'text-warn-ink', tint: 'bg-warn/15' },
  device: { icon: Unplug, title: 'Microinverter not reporting', tone: 'text-fault-ink', tint: 'bg-fault/10' },
  weather: { icon: CloudSun, title: 'Cloudy day, whole system is low', tone: 'text-ink', tint: 'bg-raised' },
};

export interface CauseCardProps {
  cause: Cause;
  /** Why we think so, in one or two sentences */
  reason: string;
  /** What the owner can do, in order */
  steps?: string[];
  /** Buttons: "Contact installer", "Remind me in 3 days" */
  actions?: ReactNode;
}

/** Instead of a raw alert: the likely cause, why we think so, and what to do next. */
export const CauseCard = ({ cause, reason, steps, actions }: CauseCardProps) => {
  const c = CAUSE[cause];
  const Icon = c.icon;
  return (
    <section className="flex flex-col gap-3 rounded-card bg-surface p-4" aria-label={c.title}>
      <div className="flex items-center gap-3">
        <span className={cx('flex size-10 shrink-0 items-center justify-center rounded-chip', c.tint)}>
          <Icon aria-hidden className={cx('size-5', c.tone)} strokeWidth={2} />
        </span>
        <div className="flex flex-col">
          <span className="text-footnote text-muted">Likely cause</span>
          <h3 className={cx('text-headline', c.tone)}>{c.title}</h3>
        </div>
      </div>
      <p className="text-subheadline text-ink">{reason}</p>
      {steps && (
        <ol className="flex flex-col gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex gap-3 text-subheadline text-ink">
              <span className="tnum flex size-6 shrink-0 items-center justify-center rounded-chip bg-raised text-footnote font-semibold text-muted">{i + 1}</span>
              <span className="pt-0.5">{s}</span>
            </li>
          ))}
        </ol>
      )}
      {actions && <div className="mt-1 flex flex-col gap-2">{actions}</div>}
    </section>
  );
};

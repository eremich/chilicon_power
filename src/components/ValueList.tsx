import type { ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface ValueListProps {
  rows: { label: string; value: ReactNode; tone?: 'solar' | 'home' | 'battery' | 'grid' | 'ok' | 'warn' | 'fault' }[];
}

const DOT = { solar: 'bg-solar', home: 'bg-home', battery: 'bg-battery', grid: 'bg-grid', ok: 'bg-ok', warn: 'bg-warn', fault: 'bg-fault' };

/** Label–value pairs with hairlines: bar details, device facts. Values are tabular and right-aligned. */
export const ValueList = ({ rows }: ValueListProps) => (
  <dl className="divide-y divide-line">
    {rows.map((r) => (
      <div key={r.label} className="flex min-h-11 items-center justify-between gap-4 py-2">
        <dt className="flex items-center gap-2 text-subheadline text-muted">
          {r.tone && <span aria-hidden className={cx('size-2 rounded-chip', DOT[r.tone])} />}
          {r.label}
        </dt>
        <dd className="tnum text-right text-headline text-ink">{r.value}</dd>
      </div>
    ))}
  </dl>
);

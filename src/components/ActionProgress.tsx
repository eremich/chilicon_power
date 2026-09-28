import { useEffect, useState } from 'react';
import { Check, LoaderCircle } from 'lucide-react';
import { cx } from '../lib/cx';

export interface ActionProgressProps {
  /** "Restarting C130085D" */
  label: string;
  /** Shown when done: "Back online" */
  doneLabel: string;
  running: boolean;
  /** Expected duration, for the bar */
  durationMs: number;
}

/** Progress of a remote action (restart, firmware). The bar is an estimate; the label says what is happening. */
export const ActionProgress = ({ label, doneLabel, running, durationMs }: ActionProgressProps) => {
  const [pct, setPct] = useState(running ? 0 : 100);
  useEffect(() => {
    if (!running) {
      setPct(100);
      return;
    }
    setPct(0);
    const start = performance.now();
    const id = setInterval(() => setPct(Math.min(95, ((performance.now() - start) / durationMs) * 100)), 100);
    return () => clearInterval(id);
  }, [running, durationMs]);
  return (
    <div className="flex flex-col gap-2 rounded-card bg-surface p-3" role="status" aria-live="polite">
      <div className="flex items-center gap-2">
        {running ? <LoaderCircle aria-hidden className="size-5 animate-spin text-brand-ink" /> : <Check aria-hidden className="size-5 text-ok" strokeWidth={2.5} />}
        <span className={cx('flex-1 text-subheadline font-semibold', running ? 'text-ink' : 'text-ok-ink')}>{running ? `${label}…` : doneLabel}</span>
        {running && <span className="tnum text-footnote text-muted">{Math.round(pct)}%</span>}
      </div>
      <div className="h-1.5 overflow-hidden rounded-chip bg-raised" aria-hidden>
        <div className={cx('h-full rounded-chip transition-[width] duration-100', running ? 'bg-brand' : 'bg-ok')} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

import type { ReactNode } from 'react';
import { NavBar, NAV_BAR_PX } from './NavBar';
import { useScrolledPast } from '../lib/useScrolledPast';
import { cx } from '../lib/cx';

export interface StepScreenProps {
  title: string;
  lead?: ReactNode;
  onBack?: () => void;
  /** Setup progress: current step (1-based) of total. Omit on account screens */
  step?: [number, number];
  /** Top right: "Log in", "Skip" */
  trailing?: ReactNode;
  /** Pinned to the bottom: the primary action, then a secondary one */
  footer?: ReactNode;
  children?: ReactNode;
}

/** Scaffold for onboarding and setup: back, progress, one title, one lead, content, actions at thumb height. */
export const StepScreen = ({ title, lead, onBack, step, trailing, footer, children }: StepScreenProps) => {
  const [ref, past] = useScrolledPast<HTMLHeadingElement>(NAV_BAR_PX);
  const progress = step && (
    <div role="progressbar" aria-label="Setup progress" aria-valuemin={1} aria-valuemax={step[1]} aria-valuenow={step[0]} aria-valuetext={`Step ${step[0]} of ${step[1]}`} className="flex gap-1.5">
      {Array.from({ length: step[1] }, (_, i) => (
        <span key={i} className={cx('h-1.5 rounded-chip transition-all duration-300 ease-out', i < step[0] ? 'w-6 bg-brand' : 'w-1.5 bg-line')} />
      ))}
    </div>
  );
  return (
    <div className="screen-enter flex flex-1 flex-col">
      <NavBar title={title} showTitle={past} scrolled={past} onBack={onBack} center={progress} trailing={trailing} />
      <div className="flex flex-1 flex-col px-4 pt-3">
        <h1 ref={ref} className="text-largeTitle text-ink">
          {title}
        </h1>
        {lead && <p className="mt-2 text-body text-muted">{lead}</p>}
        <div className="mt-6 flex flex-1 flex-col">{children}</div>
      </div>
      {footer && <div className="sticky bottom-0 flex shrink-0 flex-col gap-2 bg-canvas px-4 pb-8 pt-3">{footer}</div>}
    </div>
  );
};

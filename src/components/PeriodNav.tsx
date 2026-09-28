import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PeriodNavProps {
  title: string;
  onPrev: () => void;
  /** Omit at the current period: there is no future data */
  onNext?: () => void;
}

/** ‹ Today, May 21 › — steps through periods of the selected length. */
export const PeriodNav = ({ title, onPrev, onNext }: PeriodNavProps) => (
  <div className="flex items-center justify-between">
    <button type="button" onClick={onPrev} aria-label="Previous period" className="press flex size-11 items-center justify-center rounded-chip text-brand-ink hover:bg-brand/10">
      <ChevronLeft aria-hidden className="size-6" />
    </button>
    <span aria-live="polite" className="tnum text-headline text-ink">
      {title}
    </span>
    <button type="button" onClick={onNext} disabled={!onNext} aria-label="Next period" className="press flex size-11 items-center justify-center rounded-chip text-brand-ink hover:bg-brand/10 disabled:text-line disabled:hover:bg-transparent">
      <ChevronRight aria-hidden className="size-6" />
    </button>
  </div>
);

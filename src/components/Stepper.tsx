import { Minus, Plus } from 'lucide-react';

export interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  /** Word after the number: "rows", "pairs" */
  unit?: string;
}

/** iOS-style stepper for small whole numbers. */
export const Stepper = ({ label, value, min, max, onChange, unit }: StepperProps) => (
  <div className="flex min-h-11 items-center justify-between gap-3">
    <span className="text-body text-ink">{label}</span>
    <div className="flex items-center gap-3">
      <span className="tnum min-w-16 text-right text-headline text-ink" aria-live="polite">
        {value} {unit}
      </span>
      <div className="flex h-9 overflow-hidden rounded-[9px] bg-raised">
        <button type="button" aria-label={`Fewer ${unit ?? label}`} disabled={value <= min} onClick={() => onChange(value - 1)} className="flex w-12 items-center justify-center text-ink hover:bg-line disabled:text-line">
          <Minus aria-hidden className="size-4" strokeWidth={2.5} />
        </button>
        <span aria-hidden className="my-2 w-px bg-line" />
        <button type="button" aria-label={`More ${unit ?? label}`} disabled={value >= max} onClick={() => onChange(value + 1)} className="flex w-12 items-center justify-center text-ink hover:bg-line disabled:text-line">
          <Plus aria-hidden className="size-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  </div>
);

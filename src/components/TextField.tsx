import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label: string;
  /** Inline help under the field; replaced by the error when there is one */
  hint?: ReactNode;
  error?: string;
  prefix?: string;
  suffix?: string;
}

/** Labeled input. Errors say what happened and what to do, under the field, with the field outlined. */
export const TextField = ({ label, hint, error, prefix, suffix, className, ...rest }: TextFieldProps) => {
  const id = useId();
  const help = `${id}-help`;
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-footnote font-semibold text-muted">
        {label}
      </label>
      <div className={cx('flex h-13 items-center gap-1 rounded-control bg-raised px-4 ring-inset transition-shadow duration-150 focus-within:ring-2', error ? 'ring-2 ring-fault' : 'focus-within:ring-brand-ink')}>
        {prefix && <span className="text-body text-muted">{prefix}</span>}
        <input id={id} aria-invalid={!!error} aria-describedby={hint || error ? help : undefined} className="tnum h-full min-w-0 flex-1 bg-transparent text-body text-ink outline-none placeholder:text-muted/70" {...rest} />
        {suffix && <span className="text-body text-muted">{suffix}</span>}
      </div>
      {(error || hint) && (
        <p id={help} className={cx('text-footnote', error ? 'text-fault-ink' : 'text-muted')}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
};

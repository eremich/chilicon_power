import { useId, type TextareaHTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

/** Multi-line note: resolve notes, messages to the owner. Same shape as TextField. */
export const TextArea = ({ label, hint, error, className, ...rest }: TextAreaProps) => {
  const id = useId();
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-footnote font-semibold text-muted">
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        aria-invalid={!!error}
        aria-describedby={hint || error ? `${id}-help` : undefined}
        className={cx('resize-none rounded-control bg-raised px-4 py-3 text-body text-ink outline-none ring-inset placeholder:text-muted/70 focus:ring-2', error ? 'ring-2 ring-fault' : 'focus:ring-brand-ink')}
        {...rest}
      />
      {(error || hint) && (
        <p id={`${id}-help`} className={cx('text-footnote', error ? 'text-fault-ink' : 'text-muted')}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
};

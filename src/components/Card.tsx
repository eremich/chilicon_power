import type { ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface CardProps {
  title?: string;
  /** Right side of the title row: a link-style button or a value */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Flat surface on canvas. Optional title row. No shadow, no border. */
export const Card = ({ title, action, children, className }: CardProps) => (
  <section className={cx('rounded-card bg-surface p-4', className)}>
    {(title || action) && (
      <div className="mb-3 flex items-center justify-between gap-3">
        {title && <h2 className="text-headline text-ink">{title}</h2>}
        {action}
      </div>
    )}
    {children}
  </section>
);

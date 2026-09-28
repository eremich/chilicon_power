import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cx } from '../lib/cx';

export interface ListRowProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Icon or avatar on the left */
  leading?: ReactNode;
  /** Value or control on the right: "$0.32/kWh", a switch */
  trailing?: ReactNode;
  /** Shows a chevron and makes the row pressable */
  onClick?: () => void;
  destructive?: boolean;
}

/** One row of an inset grouped list. Rows separate themselves with a hairline that starts after the icon, like iOS. */
export const ListRow = ({ title, subtitle, leading, trailing, onClick, destructive = false }: ListRowProps) => {
  const content = (
    <>
      {leading && <span className="flex shrink-0 items-center text-muted">{leading}</span>}
      <span className="flex min-h-11 min-w-0 flex-1 items-center gap-3 border-b border-line py-2.5 group-last/row:border-b-0">
        <span className="flex min-w-0 flex-1 flex-col text-left">
          <span className={cx('text-body', destructive ? 'text-fault-ink' : 'text-ink')}>{title}</span>
          {subtitle && <span className="tnum text-footnote text-muted">{subtitle}</span>}
        </span>
        {trailing && <span className="tnum flex shrink-0 items-center text-body text-muted">{trailing}</span>}
        {onClick && <ChevronRight aria-hidden className="size-5 shrink-0 text-muted/70" />}
      </span>
    </>
  );
  const cls = 'group/row flex w-full items-center gap-3 pl-4 pr-3';
  return onClick ? (
    <li className="group/row">
      <button type="button" onClick={onClick} className={cx(cls, 'transition-colors duration-150 hover:bg-raised/60 active:bg-raised')}>
        {content}
      </button>
    </li>
  ) : (
    <li className={cls}>{content}</li>
  );
};

export interface ListGroupProps {
  header?: string;
  footer?: string;
  children: ReactNode;
}

/** iOS inset grouped list: a rounded surface on canvas, small header above, footnote below. */
export const ListGroup = ({ header, footer, children }: ListGroupProps) => (
  <section className="flex flex-col gap-1.5">
    {header && <h2 className="px-4 text-footnote uppercase tracking-wide text-muted">{header}</h2>}
    <ul className="overflow-hidden rounded-card bg-surface">{children}</ul>
    {footer && <p className="px-4 text-footnote text-muted">{footer}</p>}
  </section>
);

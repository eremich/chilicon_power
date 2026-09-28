import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { cx } from '../lib/cx';

export const NAV_BAR_PX = 44;

export interface NavBarProps {
  /** Compact title in the middle */
  title?: string;
  /** Show the compact title: always on pushed screens, after the large title scrolls away on tab roots */
  showTitle?: boolean;
  /** Content scrolled under the bar: blurred background and hairline */
  scrolled?: boolean;
  onBack?: () => void;
  backLabel?: string;
  /** Middle content when the title is hidden, e.g. setup progress */
  center?: ReactNode;
  /** Bar buttons. They stay put while the large title scrolls away */
  trailing?: ReactNode;
}

/**
 * iOS navigation bar. Sticky, 44 pt. Transparent over the large title; once content scrolls under it,
 * it gets a blurred canvas background, a hairline and the compact title fades in.
 */
export const NavBar = ({ title, showTitle = true, scrolled = false, onBack, backLabel = 'Back', center, trailing }: NavBarProps) => (
  <div
    className={cx(
      'sticky top-0 z-sticky grid h-11 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b px-2 transition-[background-color,border-color] duration-200 ease-out',
      scrolled ? 'border-line bg-canvas/80 backdrop-blur-xl' : 'border-transparent',
    )}
  >
    <div className="flex min-w-0">
      {onBack && (
        <button type="button" onClick={onBack} className="press flex h-11 items-center gap-0.5 rounded-control pl-1 pr-3 text-body text-brand-ink hover:bg-brand/10">
          <ChevronLeft aria-hidden className="size-6 shrink-0" />
          <span className="truncate">{backLabel}</span>
        </button>
      )}
    </div>
    <div className="relative flex max-w-[200px] items-center justify-center">
      {center && <div className={cx('transition-opacity duration-200', title && showTitle ? 'opacity-0' : 'opacity-100')}>{center}</div>}
      {title && (
        <span aria-hidden={!showTitle} className={cx('truncate text-headline text-ink transition-opacity duration-200', !!center && 'absolute inset-x-0 text-center', showTitle ? 'opacity-100' : 'opacity-0')}>
          {title}
        </span>
      )}
    </div>
    <div className="flex min-w-0 justify-end">{trailing}</div>
  </div>
);

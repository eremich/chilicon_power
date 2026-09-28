import type { ReactNode } from 'react';
import { NavBar, NAV_BAR_PX } from './NavBar';
import { useScrolledPast } from '../lib/useScrolledPast';

export interface ScreenHeaderProps {
  title: string;
  subtitle?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  /** Bar buttons, kept in the nav bar so they never scroll away */
  trailing?: ReactNode;
  /** Large title for tab roots, compact bar for pushed screens */
  large?: boolean;
}

/**
 * iOS header. Tab roots: a large title under the nav bar that scrolls away, then the compact title fades into the bar.
 * Pushed screens: the compact bar only, sticky, with Back.
 */
export const ScreenHeader = ({ title, subtitle, onBack, backLabel = 'Back', trailing, large = false }: ScreenHeaderProps) => {
  // Large: watch the title itself. Compact: watch a hairline sentinel right under the bar
  const [ref, past] = useScrolledPast<HTMLDivElement>(NAV_BAR_PX);
  return large ? (
    <>
      <NavBar title={title} showTitle={past} scrolled={past} onBack={onBack} backLabel={backLabel} trailing={trailing} />
      <header className="px-4 pb-3">
        {subtitle && <p className="tnum text-footnote text-muted">{subtitle}</p>}
        <div ref={ref}>
          <h1 className="text-largeTitle text-ink">{title}</h1>
        </div>
      </header>
    </>
  ) : (
    <>
      <NavBar title={title} scrolled={past} onBack={onBack} backLabel={backLabel} trailing={trailing} />
      <div ref={ref} aria-hidden className="h-px" />
    </>
  );
};

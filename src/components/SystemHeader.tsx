import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { NavBar, NAV_BAR_PX } from './NavBar';
import { TONE, type Tone } from '../lib/status';
import { useScrolledPast } from '../lib/useScrolledPast';
import { cx } from '../lib/cx';

export interface SystemHeaderProps {
  name: string;
  /** Short live state under the name: "Exporting 1.2 kW" */
  state: string;
  tone: Tone;
  /** Shows the chevron and opens the system switcher */
  onSwitch?: () => void;
  /** Bar buttons: stay in the nav bar while the large title scrolls away */
  trailing?: ReactNode;
}

/** Home header, Tesla-style content in an iOS shell: large system name with a switcher and one live line; collapses on scroll. */
export const SystemHeader = ({ name, state, tone, onSwitch, trailing }: SystemHeaderProps) => {
  const [ref, past] = useScrolledPast<HTMLDivElement>(NAV_BAR_PX);
  const title = (
    <>
      <span className="text-largeTitle text-ink">{name}</span>
      {onSwitch && <ChevronDown aria-hidden className="mt-1.5 size-6 text-muted" strokeWidth={2.25} />}
    </>
  );
  return (
    <>
      <NavBar title={name} showTitle={past} scrolled={past} trailing={trailing} />
      <header className="flex flex-col px-4 pb-2">
        <div ref={ref}>
          {onSwitch ? (
            <button type="button" onClick={onSwitch} aria-label={`${name}. Switch system`} className="press -ml-1 flex items-center gap-1 rounded-control px-1 text-left">
              {title}
            </button>
          ) : (
            <h1 className="flex items-center gap-1">{title}</h1>
          )}
        </div>
        <span className={cx('tnum text-subheadline font-semibold', tone === 'ok' ? 'text-ok-ink' : TONE[tone].text === 'text-ink' ? 'text-muted' : TONE[tone].text)}>{state}</span>
      </header>
    </>
  );
};

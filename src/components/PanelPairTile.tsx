import { CircleAlert, WifiOff } from 'lucide-react';
import { cx } from '../lib/cx';

export type PanelState = 'ok' | 'low' | 'offline';

export interface PanelInfo {
  /** Panel number on the roof, 1-based */
  n: number;
  /** 0..1 of the panel rating (340 W, or its best day in kWh): picks the step on the output scale */
  level: number;
  state: PanelState;
}

export interface PanelPairTileProps {
  /** The two panels one microinverter serves */
  panels: [PanelInfo, PanelInfo];
  selected?: boolean;
  onClick?: () => void;
  /** Spoken summary, e.g. "Panels 7 and 8, 212 W and 318 W" */
  label: string;
}

const STEP = ['bg-out-0', 'bg-out-1', 'bg-out-2', 'bg-out-3', 'bg-out-4'];
export const levelStep = (level: number) => Math.min(4, Math.max(0, Math.round(level * 4)));

const Panel = ({ p }: { p: PanelInfo }) => (
  <span
    className={cx(
      'relative flex flex-1 items-end justify-start rounded-tile p-1',
      p.state === 'offline' ? 'hatch bg-raised text-line' : STEP[levelStep(p.level)],
      p.state === 'low' && 'ring-2 ring-inset ring-warn',
    )}
  >
    <span className={cx('tnum text-[11px] font-semibold leading-none', p.state === 'offline' ? 'text-muted' : levelStep(p.level) >= 3 ? 'text-on-brand/70' : 'text-ink/60')}>{p.n}</span>
    {p.state !== 'ok' && (
      <span className={cx('absolute right-1 top-1 flex size-4 items-center justify-center rounded-chip', p.state === 'low' ? 'bg-warn text-surface' : 'bg-fault text-surface')}>
        {p.state === 'low' ? <CircleAlert aria-hidden className="size-3" strokeWidth={2.5} /> : <WifiOff aria-hidden className="size-2.5" strokeWidth={2.5} />}
      </span>
    )}
  </span>
);

/** One microinverter and its two panels. The pair shares a subtle outline; problems carry an icon, not only color. */
export const PanelPairTile = ({ panels, selected = false, onClick, label }: PanelPairTileProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    aria-pressed={selected}
    className={cx('press flex h-14 gap-0.5 rounded-[8px] p-0.5 transition-shadow duration-150', selected ? 'bg-ink/80 ring-2 ring-ink' : 'bg-line/70 hover:bg-line')}
  >
    <Panel p={panels[0]} />
    <Panel p={panels[1]} />
  </button>
);

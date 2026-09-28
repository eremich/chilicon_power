import { ChevronRight } from 'lucide-react';
import { TONE } from '../lib/status';
import { cx } from '../lib/cx';

export type DeviceState = 'ok' | 'low' | 'offline';

export interface DeviceRowProps {
  deviceId: string;
  panels: string;
  /** Output right now, formatted: "318 W" */
  output: string;
  firmware: string;
  lastSeen: string;
  state: DeviceState;
  onClick?: () => void;
}

const STATE = { ok: TONE.ok, low: TONE.warn, offline: TONE.offline };
const WORD = { ok: 'Producing', low: 'Low', offline: 'No data' };

/** Installer technical view: one microinverter per row, mono device ID, output and firmware. */
export const DeviceRow = ({ deviceId, panels, output, firmware, lastSeen, state, onClick }: DeviceRowProps) => {
  const t = STATE[state];
  const Icon = t.icon;
  return (
    <li>
      <button type="button" onClick={onClick} className="flex w-full items-center gap-3 px-4 text-left transition-colors duration-150 hover:bg-raised/60 active:bg-raised">
        <Icon aria-hidden className={cx('size-5 shrink-0', t.fill)} strokeWidth={2} />
        <span className="flex min-w-0 flex-1 items-center gap-2 border-b border-line py-2.5">
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-subheadline font-semibold text-ink">{deviceId}</span>
              <span className={cx('tnum text-headline', state === 'offline' ? 'text-muted' : 'text-ink')}>{state === 'offline' ? '—' : output}</span>
            </span>
            <span className="tnum flex justify-between gap-2 text-footnote text-muted">
              <span>
                {panels} · FW {firmware}
              </span>
              <span className={state === 'ok' ? undefined : t.text}>{state === 'ok' ? lastSeen : `${WORD[state]} · ${lastSeen}`}</span>
            </span>
          </span>
          <ChevronRight aria-hidden className="size-5 shrink-0 text-muted/70" />
        </span>
      </button>
    </li>
  );
};

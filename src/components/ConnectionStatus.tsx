import { Check, LoaderCircle, WifiOff } from 'lucide-react';
import { cx } from '../lib/cx';

export type ConnectionState = 'searching' | 'online' | 'offline';

export interface ConnectionStatusProps {
  state: ConnectionState;
  gatewayId: string;
}

const COPY: Record<ConnectionState, { title: string; body: string }> = {
  searching: { title: 'Looking for your gateway', body: 'This takes up to a minute. Keep the app open.' },
  online: { title: 'Gateway online', body: 'It is connected and talking to your microinverters.' },
  offline: { title: 'We can’t reach your gateway', body: 'Check these three things, then try again.' },
};

export const OFFLINE_CHECKS = ['The gateway is plugged in and its light is on', 'It is connected to your Wi-Fi or router cable', 'Your router is on and online'];

/** Big state for the connection step: searching (spinner), online (green check), offline (what to check). */
export const ConnectionStatus = ({ state, gatewayId }: ConnectionStatusProps) => (
  <div className="flex flex-col items-center gap-4 text-center" aria-live="polite">
    <span
      className={cx(
        'flex size-24 items-center justify-center rounded-chip transition-colors duration-300',
        state === 'online' ? 'bg-ok/15 text-ok' : state === 'offline' ? 'bg-fault/10 text-fault' : 'bg-raised text-muted',
      )}
    >
      {state === 'searching' && <LoaderCircle aria-hidden className="size-10 animate-spin" strokeWidth={2} />}
      {state === 'online' && <Check aria-hidden className="size-11" strokeWidth={2.5} />}
      {state === 'offline' && <WifiOff aria-hidden className="size-10" strokeWidth={2} />}
    </span>
    <div className="flex flex-col gap-1">
      <h2 className="text-title2 text-ink">{COPY[state].title}</h2>
      <p className="text-subheadline text-muted">{COPY[state].body}</p>
      <p className="font-mono text-footnote text-muted">{gatewayId}</p>
    </div>
    {state === 'offline' && (
      <ol className="mt-2 flex w-full flex-col gap-2 rounded-card bg-surface p-4 text-left">
        {OFFLINE_CHECKS.map((c, i) => (
          <li key={c} className="flex gap-3 text-subheadline text-ink">
            <span className="tnum flex size-6 shrink-0 items-center justify-center rounded-chip bg-raised text-footnote font-semibold text-muted">{i + 1}</span>
            <span className="pt-0.5">{c}</span>
          </li>
        ))}
      </ol>
    )}
  </div>
);

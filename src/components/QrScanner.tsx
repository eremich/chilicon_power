import { CameraOff, Check, CircleAlert } from 'lucide-react';
import { cx } from '../lib/cx';

export type ScanState = 'ready' | 'scanning' | 'found' | 'error' | 'denied';

export interface QrScannerProps {
  state: ScanState;
  /** Tap on the viewfinder simulates pointing the camera at the code */
  onScan?: () => void;
}

/** Deterministic 21×21 QR-like pattern with the three finder squares, so the sticker reads as a QR code */
const QR = Array.from({ length: 21 * 21 }, (_, i) => {
  const x = i % 21;
  const y = Math.floor(i / 21);
  const finder = (fx: number, fy: number) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7;
  if (finder(0, 0) || finder(14, 0) || finder(0, 14)) {
    const lx = x >= 14 ? x - 14 : x;
    const ly = y >= 14 ? y - 14 : y;
    return lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4);
  }
  return (x * 7 + y * 13 + x * y) % 5 < 2;
});

const HINT: Record<ScanState, string> = {
  ready: 'Point at the QR code on the gateway sticker',
  scanning: 'Hold still…',
  found: 'Gateway found',
  error: 'Code not recognized. Try again or enter it manually.',
  denied: 'Camera access is off',
};

/**
 * Simulated camera for scanning the gateway QR. The scene is always dark, like a real viewfinder, in both themes.
 * Frame corners turn green on success and red on error; the hint says what to do.
 */
export const QrScanner = ({ state, onScan }: QrScannerProps) => {
  const frame = state === 'found' ? 'border-ok' : state === 'error' ? 'border-fault' : 'border-knob';
  return (
    <button
      type="button"
      onClick={onScan}
      disabled={!onScan || state === 'scanning' || state === 'found' || state === 'denied'}
      aria-label={state === 'ready' || state === 'error' ? 'Scan the gateway QR code' : HINT[state]}
      className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-card bg-scrim text-knob disabled:cursor-default"
    >
      {/* The "camera scene": a gateway box on a wall, softly out of focus */}
      <span aria-hidden className="absolute inset-0 bg-gradient-to-b from-knob/10 via-transparent to-knob/5" />
      {state !== 'denied' && (
        <span aria-hidden className={cx('absolute flex size-44 items-center justify-center rounded-[20px] bg-knob/10 transition-opacity duration-300', state === 'found' && 'opacity-60')}>
          <span className="grid size-28 gap-px rounded-[6px] bg-knob p-2" style={{ gridTemplateColumns: 'repeat(21, 1fr)' }}>
            {QR.map((on, i) => (
              <span key={i} className={on ? 'bg-scrim' : undefined} />
            ))}
          </span>
        </span>
      )}

      {state === 'denied' ? (
        <span className="relative flex flex-col items-center gap-3 px-8 text-center">
          <CameraOff aria-hidden className="size-10 opacity-80" strokeWidth={1.5} />
          <span className="text-headline">Camera access is off</span>
          <span className="text-subheadline opacity-80">Enter the gateway ID and code from the sticker instead, or allow the camera in Settings.</span>
        </span>
      ) : (
        <>
          {/* Viewfinder corners */}
          <span aria-hidden className="absolute size-56">
            {['left-0 top-0 border-l-4 border-t-4 rounded-tl-[18px]', 'right-0 top-0 border-r-4 border-t-4 rounded-tr-[18px]', 'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-[18px]', 'bottom-0 right-0 border-b-4 border-r-4 rounded-br-[18px]'].map((c) => (
              <span key={c} className={cx('absolute size-10 transition-colors duration-200', frame, c)} />
            ))}
            {state === 'scanning' && <span className="scan-line absolute inset-x-3 top-3 h-0.5 rounded-chip bg-brand shadow-[0_0_12px_2px] shadow-brand/60" />}
          </span>
          {state === 'found' && (
            <span aria-hidden className="banner-enter absolute flex size-16 items-center justify-center rounded-chip bg-ok">
              <Check className="size-9 text-knob" strokeWidth={3} />
            </span>
          )}
          <span className={cx('absolute inset-x-4 bottom-4 flex items-center justify-center gap-2 rounded-control px-3 py-2 text-center text-subheadline', state === 'error' ? 'bg-fault text-knob' : 'bg-scrim/70')} role={state === 'error' ? 'alert' : undefined}>
            {state === 'error' && <CircleAlert aria-hidden className="size-4 shrink-0" />}
            {HINT[state]}
          </span>
        </>
      )}
    </button>
  );
};

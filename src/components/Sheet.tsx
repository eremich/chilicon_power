import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cx } from '../lib/cx';

export type Detent = 'medium' | 'large';

export interface SheetProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  /** Starting height. The grabber toggles between medium (about half) and large */
  detent?: Detent;
  /** Element the sheet renders into. Defaults to the phone screen overlay slot. */
  container?: HTMLElement | null;
}

const EXIT_MS = 200;
const HEIGHT: Record<Detent, string> = { medium: 'h-[52%]', large: 'h-[92%]' };

/** iOS sheet with a grabber and two detents. Slides up with the drawer curve, closes faster than it opens. */
export const Sheet = ({ open, title, description, onClose, children, footer, detent = 'medium', container }: SheetProps) => {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const [size, setSize] = useState<Detent>(detent);
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (open) {
      setSize(detent);
      setMounted(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(raf);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(t);
  }, [open, detent]);

  useEffect(() => {
    if (!shown) return;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shown, onClose]);

  const target = container ?? (typeof document !== 'undefined' ? document.getElementById('sheet-root') : null);
  if (!mounted || !target) return null;

  return createPortal(
    <div className="pointer-events-auto absolute inset-0 z-sheet flex flex-col justify-end">
      <div aria-hidden onClick={onClose} className={cx('absolute inset-0 bg-scrim/40 transition-opacity', shown ? 'opacity-100 duration-300' : 'opacity-0 duration-200')} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx(
          'relative flex flex-col rounded-t-sheet bg-surface shadow-sheet outline-none transition-[transform,height]',
          HEIGHT[size],
          shown ? 'translate-y-0 duration-300 ease-drawer' : 'translate-y-full duration-200 ease-out',
        )}
      >
        <button
          type="button"
          onClick={() => setSize(size === 'medium' ? 'large' : 'medium')}
          aria-label={size === 'medium' ? 'Expand sheet' : 'Shrink sheet'}
          className="mx-auto flex h-5 w-16 items-center justify-center"
        >
          <span aria-hidden className="h-[5px] w-9 rounded-chip bg-line" />
        </button>
        <div className="flex items-start gap-3 px-4 pb-3">
          <div className="flex-1">
            <h2 id={titleId} className="text-title2 text-ink">
              {title}
            </h2>
            {description && <p className="tnum mt-0.5 text-subheadline text-muted">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="press -mr-1 flex size-11 items-center justify-center">
            <span className="flex size-8 items-center justify-center rounded-chip bg-raised text-muted">
              <X aria-hidden className="size-4" strokeWidth={2.5} />
            </span>
          </button>
        </div>
        <div className="scroll-area flex-1 px-4 pb-4">{children}</div>
        {footer && <div className="border-t border-line px-4 pb-8 pt-3">{footer}</div>}
      </div>
    </div>,
    target,
  );
};

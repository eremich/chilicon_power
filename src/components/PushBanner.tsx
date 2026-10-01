import { X } from 'lucide-react';
import { AppIcon } from './AppIcon';

export interface PushBannerProps {
  title: string;
  body: string;
  time?: string;
  onOpen: () => void;
  onDismiss: () => void;
}

/** Simulated iOS notification at the top of the phone. Tapping it deep-links to the issue. */
export const PushBanner = ({ title, body, time = 'now', onOpen, onDismiss }: PushBannerProps) => (
  <div className="banner-enter flex items-start gap-3 rounded-[22px] bg-surface/95 p-3 shadow-banner ring-1 ring-line">
    <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-start gap-3 text-left">
      <AppIcon size={38} decorative />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex justify-between gap-2 text-footnote">
          <span className="font-semibold text-ink">Chilicon Power</span>
          <span className="text-muted">{time}</span>
        </span>
        <span className="text-subheadline font-semibold text-ink">{title}</span>
        <span className="text-subheadline text-ink">{body}</span>
      </span>
    </button>
    <button type="button" onClick={onDismiss} aria-label="Dismiss notification" className="-m-1 flex size-8 items-center justify-center rounded-chip text-muted hover:bg-raised">
      <X aria-hidden className="size-4" />
    </button>
  </div>
);

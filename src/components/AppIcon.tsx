import lightUrl from '../assets/brand/app-icon.svg';
import darkUrl from '../assets/brand/app-icon-dark.svg';
import { cx } from '../lib/cx';

export interface AppIconProps {
  /** Rendered size in px. iOS sizes: 180 home screen @3×, 60 home screen, 40 notification, 29 settings */
  size?: number;
  /** Light is the default icon; dark is the iOS dark-mode variant */
  variant?: 'light' | 'dark';
  /** Decorative next to a visible app name; otherwise it is announced as the app */
  decorative?: boolean;
  className?: string;
}

/** The app icon: the logo mark on a square master, shown with the iOS corner radius (22.37% of the size). */
export const AppIcon = ({ size = 60, variant = 'light', decorative = false, className }: AppIconProps) => (
  <img
    src={variant === 'dark' ? darkUrl : lightUrl}
    width={size}
    height={size}
    alt={decorative ? '' : 'Chilicon Power app icon'}
    aria-hidden={decorative || undefined}
    className={cx('shrink-0 ring-1 ring-inset ring-ink/10', className)}
    style={{ borderRadius: size * 0.2237 }}
  />
);

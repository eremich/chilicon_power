import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';
import { cx } from '../lib/cx';

type Variant = 'primary' | 'secondary' | 'plain' | 'destructive';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'md' | 'lg';
  icon?: ReactNode;
  loading?: boolean;
  block?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  // Orange with dark text: 8:1. Disabled stays orange-tinted so it never reads as the old grey "primary"
  primary: 'bg-brand text-on-brand hover:bg-brand-deep disabled:bg-brand/35 disabled:text-on-brand/60',
  secondary: 'bg-raised text-ink hover:bg-line disabled:text-muted',
  plain: 'bg-transparent text-brand-ink hover:bg-brand/10 disabled:text-muted',
  destructive: 'bg-fault/10 text-fault-ink hover:bg-fault/15 disabled:text-muted',
};

/** Says what happens: "Scan gateway", "Contact installer". One primary per screen. Scales to 0.97 on press. */
export const Button = ({ variant = 'primary', size = 'lg', icon, loading = false, block = false, className, children, disabled, ...rest }: ButtonProps) => (
  <button
    type="button"
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={cx(
      'press inline-flex items-center justify-center gap-2 rounded-control text-headline transition-colors duration-150 disabled:cursor-not-allowed',
      size === 'lg' ? 'min-h-13 px-5' : 'min-h-11 px-4',
      block && 'w-full',
      VARIANTS[variant],
      className,
    )}
    {...rest}
  >
    {loading ? <LoaderCircle aria-hidden className="size-5 animate-spin" /> : icon}
    {children}
  </button>
);

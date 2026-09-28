import { Check, Circle } from 'lucide-react';
import { cx } from '../lib/cx';

export interface PasswordRulesProps {
  password: string;
  email?: string;
}

export const passwordChecks = (password: string, email = '') => [
  { label: 'At least 8 characters', ok: password.length >= 8 },
  { label: 'At least one number', ok: /\d/.test(password) },
  { label: 'Different from your email', ok: !!password && password.toLowerCase() !== email.toLowerCase() && !email.toLowerCase().startsWith(password.toLowerCase()) },
];

/** Inline password rules that tick as you type. Checks are text + icon, never color alone. */
export const PasswordRules = ({ password, email }: PasswordRulesProps) => (
  <ul aria-label="Password rules" className="flex flex-col gap-1.5">
    {passwordChecks(password, email).map((c) => (
      <li key={c.label} className={cx('flex items-center gap-2 text-footnote transition-colors duration-150', c.ok ? 'text-ok-ink' : 'text-muted')}>
        {c.ok ? <Check aria-hidden className="size-4" strokeWidth={2.5} /> : <Circle aria-hidden className="size-4" strokeWidth={1.75} />}
        {c.label}
        <span className="sr-only">{c.ok ? ', done' : ', not yet'}</span>
      </li>
    ))}
  </ul>
);

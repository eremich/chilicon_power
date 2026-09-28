import { CircleCheck } from 'lucide-react';

export interface ToastProps {
  message: string;
}

/** Short confirmation that repeats the action: "Report sent to Sunline Solar". */
export const Toast = ({ message }: ToastProps) => (
  <div role="status" className="banner-enter flex items-center gap-2.5 rounded-control bg-ink px-4 py-3 text-subheadline font-semibold text-surface shadow-banner">
    <CircleCheck aria-hidden className="size-5 shrink-0 text-ok" strokeWidth={2.5} />
    {message}
  </div>
);

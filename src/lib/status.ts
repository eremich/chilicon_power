import { CircleAlert, CircleCheck, CircleX, Cloud, Hourglass, Moon, WifiOff, type LucideIcon } from 'lucide-react';

/** System-level status tones. Status is never color alone: each tone has an icon and a spoken label. */
export type Tone = 'ok' | 'warn' | 'fault' | 'offline' | 'cloudy' | 'night' | 'pending';

export const TONE: Record<Tone, { icon: LucideIcon; text: string; fill: string; tint: string; label: string }> = {
  ok: { icon: CircleCheck, text: 'text-ok-ink', fill: 'text-ok', tint: 'bg-ok/10', label: 'OK' },
  warn: { icon: CircleAlert, text: 'text-warn-ink', fill: 'text-warn', tint: 'bg-warn/15', label: 'Needs attention' },
  fault: { icon: CircleX, text: 'text-fault-ink', fill: 'text-fault', tint: 'bg-fault/10', label: 'Fault' },
  offline: { icon: WifiOff, text: 'text-fault-ink', fill: 'text-fault', tint: 'bg-fault/10', label: 'Offline' },
  cloudy: { icon: Cloud, text: 'text-ink', fill: 'text-muted', tint: 'bg-raised', label: 'Low output' },
  night: { icon: Moon, text: 'text-ink', fill: 'text-muted', tint: 'bg-raised', label: 'Night' },
  pending: { icon: Hourglass, text: 'text-ink', fill: 'text-muted', tint: 'bg-raised', label: 'Waiting for data' },
};

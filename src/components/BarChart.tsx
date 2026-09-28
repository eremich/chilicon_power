import { cx } from '../lib/cx';
import { num } from '../lib/format';

export interface EnergyBar {
  key: string;
  /** Axis label; empty to skip (dense day view) */
  label: string;
  produced: number;
  used: number;
  /** Period still running (today, this month): drawn hatched */
  partial?: boolean;
}

export interface BarChartProps {
  bars: EnergyBar[];
  selected?: string;
  onSelect?: (key: string) => void;
  height?: number;
  ariaLabel: string;
}

const WIDTH = 358;
const PAD = { top: 26, right: 30, bottom: 20 };

/**
 * Energy totals (kWh) as paired bars: produced (solar) and used (home). Bars, not lines: these are amounts, not rates.
 * The running period is hatched. Tapping a bar selects it, dims the rest and shows its value.
 */
export const BarChart = ({ bars, selected, onSelect, height = 200, ariaLabel }: BarChartProps) => {
  const peak = Math.max(...bars.flatMap((b) => [b.produced, b.used]), 0.1);
  const mag = 10 ** Math.floor(Math.log10(peak));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => peak / s <= 3)!;
  const top = Math.ceil(peak / step) * step;
  const h = height - PAD.top - PAD.bottom;
  const w = WIDTH - PAD.right;
  const slot = w / bars.length;
  const bw = Math.min(14, Math.max(3, slot * 0.4));
  const gap = Math.max(1, Math.min(3, slot * 0.06));
  const y = (v: number) => PAD.top + h - (v / top) * h;
  const r = Math.min(3, bw / 2);
  const sel = bars.find((b) => b.key === selected);
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);

  const bar = (xPos: number, v: number, tone: 'solar' | 'home', partial: boolean, dim: boolean) => {
    const yTop = y(v);
    const hh = Math.max(0, y(0) - yTop);
    const d = hh < r ? `M${xPos},${y(0)} h${bw} v${-hh} h${-bw} Z` : `M${xPos},${y(0)} v${-(hh - r)} q0,${-r} ${r},${-r} h${bw - 2 * r} q${r},0 ${r},${r} v${hh - r} Z`;
    return (
      <path
        d={d}
        className={cx(tone === 'solar' ? 'fill-solar text-solar' : 'fill-home text-home', 'transition-opacity duration-150', dim && 'opacity-30')}
        fill={partial ? `url(#hatch-${tone})` : undefined}
        stroke={partial ? 'currentColor' : undefined}
        strokeWidth={partial ? 1 : undefined}
      />
    );
  };

  return (
    <svg viewBox={`0 0 ${WIDTH} ${height}`} role="group" aria-label={ariaLabel} className="block h-auto w-full select-none">
      <defs>
        {(['solar', 'home'] as const).map((t) => (
          <pattern key={t} id={`hatch-${t}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="4" height="4" className={t === 'solar' ? 'fill-solar/25' : 'fill-home/25'} />
            <rect width="2" height="4" className={t === 'solar' ? 'fill-solar' : 'fill-home'} />
          </pattern>
        ))}
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={0} x2={w} y1={y(t)} y2={y(t)} className={cx('stroke-line', t !== 0 && '[stroke-dasharray:2_3]')} strokeWidth={1} />
          <text x={WIDTH} y={y(t) + 4} textAnchor="end" className="tnum fill-muted text-[11px]">
            {t === 0 ? '0 kWh' : num(t, t % 1 ? 1 : 0)}
          </text>
        </g>
      ))}
      {bars.map((b, i) => {
        const cxPos = i * slot + slot / 2;
        const dim = !!sel && sel.key !== b.key;
        return (
          <g key={b.key}>
            {bar(cxPos - bw - gap / 2, b.produced, 'solar', !!b.partial, dim)}
            {bar(cxPos + gap / 2, b.used, 'home', !!b.partial, dim)}
            {b.label && (
              <text x={i === 0 ? Math.max(0, cxPos - bw - gap) : cxPos} y={height - 4} textAnchor={i === 0 ? 'start' : 'middle'} className={cx('tnum text-[11px]', sel?.key === b.key ? 'fill-ink font-semibold' : 'fill-muted')}>
                {b.label}
              </text>
            )}
            {onSelect && (
              <rect
                x={i * slot}
                y={PAD.top}
                width={slot}
                height={h}
                className="cursor-pointer fill-transparent outline-none focus-visible:fill-brand/10"
                role="button"
                tabIndex={0}
                aria-pressed={sel?.key === b.key}
                aria-label={`${b.label || b.key}: produced ${num(b.produced)} kWh, used ${num(b.used)} kWh${b.partial ? ', so far' : ''}`}
                onClick={() => onSelect(b.key)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect(b.key))}
              />
            )}
          </g>
        );
      })}
      {sel && (() => {
        const i = bars.indexOf(sel);
        const label = `${num(sel.produced)} kWh`;
        const pw = label.length * 6.6 + 14;
        const px = Math.min(Math.max(i * slot + slot / 2 - pw / 2, 0), w - pw);
        return (
          <g pointerEvents="none">
            <rect x={px} y={2} width={pw} height={20} rx={10} className="fill-ink" />
            <text x={px + pw / 2} y={16} textAnchor="middle" className="tnum fill-surface text-[12px] font-semibold">
              {label}
            </text>
          </g>
        );
      })()}
    </svg>
  );
};

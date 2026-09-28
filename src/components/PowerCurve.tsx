import { useId } from 'react';
import { hourLabel } from '../lib/format';
import { cx } from '../lib/cx';

export interface CurveSeries {
  /** kW samples, evenly spaced over the day. null = not yet (future) */
  values: (number | null)[];
  tone: 'solar' | 'home' | 'muted';
  kind: 'area' | 'line' | 'dashed';
  label: string;
}

export interface PowerCurveProps {
  series: CurveSeries[];
  /** Minute of the day for the "now" marker */
  nowMin?: number;
  /** Axis maximum in kW; defaults to the data max rounded up */
  max?: number;
  unit?: 'kW' | 'W';
  height?: number;
  ariaLabel: string;
}

const WIDTH = 358;
const PAD = { top: 8, right: 30, bottom: 20, left: 0 };
const STROKE = { solar: 'stroke-solar', home: 'stroke-home', muted: 'stroke-muted' };
const FILL = { solar: 'fill-solar', home: 'fill-home', muted: 'fill-muted' };

/**
 * Power over the day (kW, a rate), drawn as a curve — never as bars, which are for energy totals (kWh).
 * Used on Home (production vs consumption today) and on panel detail (this panel vs its neighbors).
 */
export const PowerCurve = ({ series, nowMin, max, unit = 'kW', height = 150, ariaLabel }: PowerCurveProps) => {
  const gid = useId();
  const peak = max ?? Math.max(...series.flatMap((s) => s.values.filter((v): v is number => v !== null)));
  const step = unit === 'W' ? (peak > 200 ? 100 : 50) : peak > 4 ? 2 : 1;
  const top = Math.max(step, Math.ceil(peak / step) * step);
  const h = height - PAD.top - PAD.bottom;
  const w = WIDTH - PAD.left - PAD.right;
  const x = (i: number, n: number) => PAD.left + (i / (n - 1)) * w;
  const y = (v: number) => PAD.top + h - (v / top) * h;

  const line = (values: (number | null)[]) =>
    values
      .map((v, i) => (v === null ? null : `${x(i, values.length).toFixed(1)},${y(v).toFixed(1)}`))
      .filter(Boolean)
      .join(' ');
  const area = (values: (number | null)[]) => {
    const pts = values.map((v, i) => [i, v] as const).filter(([, v]) => v !== null) as [number, number][];
    if (!pts.length) return '';
    const n = values.length;
    return `M${x(pts[0][0], n)},${y(0)} ` + pts.map(([i, v]) => `L${x(i, n).toFixed(1)},${y(v).toFixed(1)}`).join(' ') + ` L${x(pts[pts.length - 1][0], n)},${y(0)} Z`;
  };

  const ticks = [0, top / 2, top];
  return (
    <figure className="m-0">
      <svg viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label={ariaLabel} className="block h-auto w-full">
        <defs>
          <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="rgb(var(--c-solar))" stopOpacity="0.35" />
            <stop offset="1" stopColor="rgb(var(--c-solar))" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={PAD.left + w} y1={y(t)} y2={y(t)} className={cx('stroke-line', t !== 0 && '[stroke-dasharray:2_3]')} strokeWidth={1} />
            <text x={WIDTH} y={y(t) + 4} textAnchor="end" className="tnum fill-muted text-[11px]">
              {t === 0 ? `0 ${unit}` : unit === 'W' ? t : t.toFixed(t % 1 ? 1 : 0)}
            </text>
          </g>
        ))}
        {[6, 12, 18].map((hr) => (
          <text key={hr} x={PAD.left + (hr / 24) * w} y={height - 4} textAnchor="middle" className="tnum fill-muted text-[11px]">
            {hourLabel(hr)}
          </text>
        ))}
        {series.map((s) =>
          s.kind === 'area' ? (
            <g key={s.label}>
              <path d={area(s.values)} fill={s.tone === 'solar' ? `url(#${gid})` : undefined} className={s.tone !== 'solar' ? cx(FILL[s.tone], 'opacity-15') : undefined} />
              <polyline points={line(s.values)} className={cx('fill-none', STROKE[s.tone])} strokeWidth={2} strokeLinejoin="round" />
            </g>
          ) : (
            <polyline key={s.label} points={line(s.values)} className={cx('fill-none', STROKE[s.tone], s.kind === 'dashed' && '[stroke-dasharray:4_4]')} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          ),
        )}
        {nowMin !== undefined && (
          <g>
            <line x1={PAD.left + (nowMin / 1440) * w} x2={PAD.left + (nowMin / 1440) * w} y1={PAD.top} y2={PAD.top + h} className="stroke-ink/40" strokeWidth={1} />
            <text x={PAD.left + (nowMin / 1440) * w + 4} y={PAD.top + 10} className="fill-muted text-[11px] font-semibold">
              Now
            </text>
          </g>
        )}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-footnote text-muted">
        {series.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <span aria-hidden className={cx('h-0.5 w-3 rounded-chip', s.tone === 'solar' ? 'bg-solar' : s.tone === 'home' ? 'bg-home' : 'bg-muted', s.kind === 'dashed' && 'opacity-60')} />
            {s.label}
          </span>
        ))}
      </figcaption>
    </figure>
  );
};

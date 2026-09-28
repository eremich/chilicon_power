import { kW, pct } from '../lib/format';
import { cx } from '../lib/cx';

export interface EnergyFlowProps {
  solarKw: number;
  homeKw: number;
  /** Omit when the system has no battery. kw > 0 charging, < 0 discharging */
  battery?: { kw: number; pct: number };
  /** kw > 0 exporting to the grid, < 0 importing */
  gridKw: number;
  night?: boolean;
  /** Gateway offline: no live values, no flow */
  offline?: boolean;
  /** false = illustration only (welcome screen): no callouts, decorative */
  callouts?: boolean;
}

/* Isometric projection. x runs right-down, y left-down, z up. Units are "house meters". */
const S = 22;
const CX = 181;
const CY = 138;
const P = (x: number, y: number, z: number): [number, number] => [CX + (x - y) * 0.866 * S, CY + (x + y) * 0.5 * S - z * S];
const pts = (...ps: [number, number, number][]) => ps.map((p) => P(...p).map((n) => n.toFixed(1)).join(',')).join(' ');
const path = (...ps: [number, number, number][]) => 'M' + ps.map((p) => P(...p).map((n) => n.toFixed(1)).join(' ')).join(' L');

// House: 7 × 4.4 footprint, 2.8 walls, gable ridge along x at 4.8
const W = 7;
const D = 4.4;
const H = 2.8;
const RIDGE: [number, number] = [D / 2, 4.8];
const EAVE: [number, number] = [D + 0.4, H - 0.36];
const roofPt = (x: number, v: number): [number, number, number] => [x, EAVE[0] + (RIDGE[0] - EAVE[0]) * v, EAVE[1] + (RIDGE[1] - EAVE[1]) * v];

const COLS = 8;
const ROWS = 3;
const PANELS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  const x0 = 0.35 + c * 0.79;
  const v0 = 0.1 + r * 0.275;
  return { x0, x1: x0 + 0.74, v0, v1: v0 + 0.25 };
});

const WALL_Y = D + 0.05;
const GATEWAY: [number, number, number] = [6.2, WALL_Y, 1.5];
/** Battery hangs on the gable wall, far right; the grid post stands far left, so the two bottom callouts never meet */
const BATTERY_Y: [number, number] = [0.45, 1.35];
const POST: [number, number] = [-0.9, D + 1.3];

const WIRES = {
  solar: path(roofPt(6.2, 0), [6.2, EAVE[0], 1.95], [6.2, WALL_Y + 0.1, 1.85]),
  home: path([5.9, WALL_Y, 1.5], [5.0, WALL_Y, 1.5]),
  battery: path([6.5, WALL_Y, 1.25], [W + 0.03, WALL_Y, 1.25], [W + 0.03, BATTERY_Y[1], 1.25]),
  grid: path([6.2, WALL_Y, 1.15], [6.2, WALL_Y, 0.02], [POST[0], WALL_Y, 0.02], [POST[0], POST[1], 0.02], [POST[0], POST[1], 0.9]),
};

/**
 * Tesla-style callout: a hairline from the object to a value and a small caps caption.
 * Label above the object (ly < object) or below it; text sits beside the line.
 */
const Callout = ({ x, objY, ly, value, caption, state, tone, align }: { x: number; objY: number; ly: number; value: string; caption: string; state?: string; tone: string; align: 'start' | 'end' }) => {
  const above = ly < objY;
  const tx = align === 'start' ? x + 7 : x - 7;
  const valueY = above ? ly : ly + 14;
  const capY = valueY + 16;
  return (
    <g>
      <line x1={x} y1={above ? ly - 13 : objY} x2={x} y2={above ? objY : capY + (state ? 18 : 2)} className="stroke-muted/60" strokeWidth={1} />
      <text x={tx} y={valueY} textAnchor={align} className="tnum fill-ink text-[17px] font-semibold">
        {value}
      </text>
      <rect x={align === 'start' ? tx : tx - 7} y={capY - 7} width={7} height={7} rx={1.5} className={tone} />
      <text x={align === 'start' ? tx + 11 : tx - 11} y={capY} textAnchor={align} className="fill-muted text-[11px] font-semibold uppercase tracking-[0.06em]">
        {caption}
      </text>
      {state && (
        <text x={tx} y={capY + 16} textAnchor={align} className="fill-muted text-[12px]">
          {state}
        </text>
      )}
    </g>
  );
};

/**
 * The hero of Home: an isometric house with live energy moving between solar, home, battery and grid.
 * Flow direction is real (dots travel the way energy goes), values are kW. The only looping motion in the app.
 */
export const EnergyFlow = ({ solarKw, homeKw, battery, gridKw, night = false, offline = false, callouts = true }: EnergyFlowProps) => {
  const live = !offline;
  const charging = battery && battery.kw > 0.05;
  const discharging = battery && battery.kw < -0.05;
  const exporting = gridKw > 0.05;
  const importing = gridKw < -0.05;
  const dash = (on: boolean, reverse = false) => (live && on ? cx('flow-line', reverse && '[animation-direction:reverse]') : 'hidden');
  const v = (text: string) => (live ? text : '—');

  const gridState = !live ? 'No data' : exporting ? 'Exporting' : importing ? 'Importing' : 'Idle';
  const battState = !live ? 'No data' : charging ? 'Charging' : discharging ? 'Powering home' : 'Idle';
  const summary = offline
    ? 'Gateway offline. No live energy data.'
    : [
        `Solar ${kW(solarKw)}`,
        `home uses ${kW(homeKw)}`,
        battery && `battery ${charging ? 'charging' : discharging ? 'supplying' : 'idle'} at ${kW(Math.abs(battery.kw))}, ${pct(battery.pct)} full`,
        `${exporting ? 'exporting' : importing ? 'importing' : 'no flow to'} ${exporting || importing ? kW(Math.abs(gridKw)) + ' ' : ''}${exporting ? 'to' : importing ? 'from' : ''} the grid`,
      ]
        .filter(Boolean)
        .join(', ') + '.';

  const [solarX, solarY] = P(...roofPt(1.6, 0.9));
  const [homeX, homeY] = P(W, 2.85, 2.05);
  const [battX, battY] = P(W + 0.1, (BATTERY_Y[0] + BATTERY_Y[1]) / 2, 0.15);
  const [postX, postY] = P(POST[0], POST[1], 0);

  return (
    <svg
      viewBox={callouts ? '0 0 358 318' : '4 60 350 240'}
      role={callouts ? 'img' : undefined}
      aria-label={callouts ? summary : undefined}
      aria-hidden={callouts ? undefined : true}
      className={cx('block h-auto w-full', offline && 'opacity-70')}
    >
      {/* Ground */}
      <polygon points={pts([-1.4, -0.6, 0], [W + 2.6, -0.6, 0], [W + 2.6, D + 1.6, 0], [-1.4, D + 1.6, 0])} className="fill-illo-ground/60" />

      {/* Walls */}
      <polygon points={pts([0, D, 0], [W, D, 0], [W, D, H], [0, D, H])} className="fill-illo-wall-shade" />
      <polygon points={pts([W, 0, 0], [W, D, 0], [W, D, H], [W, RIDGE[0], RIDGE[1]], [W, 0, H])} className="fill-illo-wall" />

      {/* Windows: warm and lit at night */}
      {[
        [0.9, 1.7],
        [2.3, 3.1],
      ].map(([a, b]) => (
        <polygon key={a} points={pts([a, D, 0.95], [b, D, 0.95], [b, D, 2.05], [a, D, 2.05])} className={night ? 'fill-solar/80' : 'fill-illo-window'} />
      ))}
      <polygon points={pts([W, 2.3, 0.95], [W, 3.4, 0.95], [W, 3.4, 2.05], [W, 2.3, 2.05])} className={night ? 'fill-solar/70' : 'fill-illo-window'} />
      {/* Door */}
      <polygon points={pts([4.0, D, 0], [4.8, D, 0], [4.8, D, 1.9], [4.0, D, 1.9])} className="fill-illo-roof-shade" />

      {/* Roof with panels */}
      <polygon points={pts([-0.3, RIDGE[0], RIDGE[1]], [W + 0.3, RIDGE[0], RIDGE[1]], [W + 0.3, EAVE[0], EAVE[1]], [-0.3, EAVE[0], EAVE[1]])} className="fill-illo-roof" />
      <polyline points={pts([W + 0.3, -0.4, H - 0.36], [W + 0.3, RIDGE[0], RIDGE[1]], [W + 0.3, EAVE[0], EAVE[1]])} className="fill-none stroke-illo-roof-shade" strokeWidth={3} strokeLinejoin="round" />
      {PANELS.map((p, i) => (
        <g key={i} className={night ? 'opacity-70' : undefined}>
          <polygon points={pts(roofPt(p.x0, p.v0), roofPt(p.x1, p.v0), roofPt(p.x1, p.v1), roofPt(p.x0, p.v1))} className="fill-illo-panel stroke-illo-panel-line" strokeWidth={0.6} />
          <path d={path(roofPt((p.x0 + p.x1) / 2, p.v0), roofPt((p.x0 + p.x1) / 2, p.v1))} className="stroke-illo-panel-line" strokeWidth={0.5} />
        </g>
      ))}

      {/* Battery on the gable wall */}
      {battery && (
        <g>
          <polygon points={pts([W + 0.1, BATTERY_Y[0], 0.15], [W + 0.1, BATTERY_Y[1], 0.15], [W + 0.1, BATTERY_Y[1], 1.75], [W + 0.1, BATTERY_Y[0], 1.75])} className="fill-surface stroke-line" strokeWidth={1} />
          <polygon points={pts([W + 0.11, BATTERY_Y[0] + 0.14, 0.45], [W + 0.11, BATTERY_Y[0] + 0.2, 0.45], [W + 0.11, BATTERY_Y[0] + 0.2, 0.45 + 1.0 * (battery.pct / 100)], [W + 0.11, BATTERY_Y[0] + 0.14, 0.45 + 1.0 * (battery.pct / 100)])} className="fill-battery" />
        </g>
      )}

      {/* Grid meter post */}
      <line x1={postX} y1={postY} x2={postX} y2={P(POST[0], POST[1], 1.35)[1]} className="stroke-illo-roof-shade" strokeWidth={3} strokeLinecap="round" />
      <rect x={postX - 7} y={P(POST[0], POST[1], 1.35)[1] - 2} width={14} height={16} rx={3} className="fill-surface stroke-line" strokeWidth={1} />

      {/* Wires, then energy moving along them */}
      <g className="fill-none" strokeLinecap="round" strokeLinejoin="round">
        {(['solar', 'home', 'grid'] as const).map((k) => (
          <path key={k} d={WIRES[k]} className="stroke-muted/40" strokeWidth={1.5} />
        ))}
        {battery && <path d={WIRES.battery} className="stroke-muted/40" strokeWidth={1.5} />}
        <path d={WIRES.solar} className={cx('stroke-solar', dash(solarKw > 0.05))} strokeWidth={3} />
        <path d={WIRES.home} className={cx('stroke-home', dash(homeKw > 0.05))} strokeWidth={3} />
        {battery && <path d={WIRES.battery} className={cx('stroke-battery', dash(!!(charging || discharging), !!discharging))} strokeWidth={3} />}
        <path d={WIRES.grid} className={cx('stroke-grid', dash(exporting || importing, importing))} strokeWidth={3} />
      </g>

      {/* Gateway */}
      <polygon points={pts([GATEWAY[0] - 0.3, WALL_Y + 0.1, 1.15], [GATEWAY[0] + 0.3, WALL_Y + 0.1, 1.15], [GATEWAY[0] + 0.3, WALL_Y + 0.1, 1.85], [GATEWAY[0] - 0.3, WALL_Y + 0.1, 1.85])} className="fill-surface stroke-line" strokeWidth={1} />
      <circle cx={P(GATEWAY[0], WALL_Y + 0.1, 1.6)[0]} cy={P(GATEWAY[0], WALL_Y + 0.1, 1.6)[1]} r={1.8} className={offline ? 'fill-fault' : 'fill-ok'} />

      {/* Callouts */}
      {callouts && (
        <>
      <Callout x={solarX} objY={solarY} ly={34} value={night ? '0 kW' : v(kW(solarKw))} caption="Solar" tone="fill-solar" align="end" />
      <Callout x={homeX} objY={homeY} ly={34} value={v(kW(homeKw))} caption="Home" tone="fill-home" align="start" />
      {battery && (
        <Callout x={battX} objY={battY} ly={266} value={live ? `${kW(Math.abs(battery.kw))} · ${pct(battery.pct)}` : `— · ${pct(battery.pct)}`} caption="Battery" state={battState} tone="fill-battery" align="end" />
      )}
      <Callout x={postX} objY={postY} ly={266} value={v(kW(Math.abs(gridKw)))} caption="Grid" state={gridState} tone="fill-grid" align="start" />
        </>
      )}
    </svg>
  );
};

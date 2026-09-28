import type { ReactNode } from 'react';
import markUrl from '../assets/brand/logo-mark.svg';
import wordmarkUrl from '../assets/brand/logo-wordmark.svg';
import { color, elevation, font, material, motion, outputScale, radius, space, type, units } from './tokens.js';

/** Foundations pages render tokens.js directly — values are never copied into docs. */

const hexToRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const lum = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const Page = ({ title, lead, children }: { title: string; lead: string; children: ReactNode }) => (
  <div className="min-h-screen bg-surface p-8 font-sans text-ink">
    <h1 className="text-largeTitle">{title}</h1>
    <p className="mt-2 max-w-2xl text-subheadline text-muted">{lead}</p>
    <div className="mt-8">{children}</div>
  </div>
);

const Grade = ({ ratio }: { ratio: number }) => {
  const pass = ratio >= 4.5 ? 'AA text' : ratio >= 3 ? 'Large text / UI' : 'Fill only';
  const tone = ratio >= 4.5 ? 'bg-ok/10 text-ok-ink' : ratio >= 3 ? 'bg-warn/15 text-warn-ink' : 'bg-raised text-muted';
  return (
    <span className={`tnum inline-flex rounded-chip px-2 py-0.5 text-caption ${tone}`}>
      {ratio.toFixed(2)}:1 · {pass}
    </span>
  );
};

type Theme = 'light' | 'dark';

const Swatch = ({ hex, theme }: { hex: string; theme: Theme }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <div className="h-10 w-16 shrink-0 rounded-control border border-line" style={{ background: hex }} />
      <code className="text-footnote text-muted">{hex}</code>
    </div>
    <span className="text-footnote text-muted">
      surface <Grade ratio={contrast(hex, color.surface[theme])} />
    </span>
    <span className="text-footnote text-muted">
      canvas <Grade ratio={contrast(hex, color.canvas[theme])} />
    </span>
  </div>
);

const GROUPS: { title: string; keys: (keyof typeof color)[] }[] = [
  { title: 'Neutrals', keys: ['ink', 'muted', 'canvas', 'surface', 'raised', 'knob', 'line'] },
  { title: 'Brand', keys: ['brand', 'brand-deep', 'on-brand', 'brand-ink'] },
  { title: 'Energy', keys: ['solar', 'solar-ink', 'home', 'battery', 'battery-ink', 'grid', 'grid-ink'] },
  { title: 'Status', keys: ['ok', 'ok-ink', 'warn', 'warn-ink', 'fault', 'fault-ink'] },
  { title: 'Illustration', keys: ['illo-wall', 'illo-wall-shade', 'illo-roof', 'illo-roof-shade', 'illo-panel', 'illo-panel-line', 'illo-window', 'illo-ground'] },
  { title: 'Utility', keys: ['scrim', 'desk'] },
];

export const ColorsPage = () => (
  <Page
    title="Colors"
    lead="One set of names, two themes. Components use the names; the values flip with the theme. Energy and status colors never swap meaning. Contrast is computed live against that theme's surface and canvas."
  >
    <section className="mb-10">
      <h2 className="mb-3 text-title2">Logo</h2>
      <p className="mb-4 max-w-2xl text-subheadline text-muted">The palette starts here: the sun orange #FBAB16 is brand and solar, the leaf green #00AA79 is status OK.</p>
      <div className="flex flex-wrap gap-4">
        <div className="flex h-32 w-40 items-center justify-center rounded-card bg-canvas">
          <img src={markUrl} alt="Chilicon Power mark" className="h-20" />
        </div>
        {(['light', 'dark'] as const).map((t) => (
          <div key={t} data-theme={t} className="flex h-32 w-80 items-center justify-center rounded-card bg-canvas">
            <img src={wordmarkUrl} alt="Chilicon Power wordmark" className="h-6" />
          </div>
        ))}
      </div>
    </section>
    {GROUPS.map((g) => (
      <section key={g.title} className="mb-10">
        <h2 className="mb-2 text-title2">{g.title}</h2>
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-8 border-b border-line pb-2 text-caption text-muted">
          <span>Token</span>
          <span className="w-60">Light</span>
          <span className="w-60">Dark</span>
        </div>
        <div className="divide-y divide-line">
          {g.keys.map((name) => (
            <div key={name} className="grid grid-cols-[1fr_auto_auto] items-start gap-x-8 py-4">
              <div>
                <div className="text-headline">{name}</div>
                <div className="max-w-sm text-subheadline text-muted">{color[name].use}</div>
              </div>
              <div className="w-60">
                <Swatch hex={color[name].light} theme="light" />
              </div>
              <div className="w-60">
                <Swatch hex={color[name].dark} theme="dark" />
              </div>
            </div>
          ))}
        </div>
      </section>
    ))}
    <section>
      <h2 className="mb-2 text-title2">Output scale</h2>
      <p className="mb-4 max-w-2xl text-subheadline text-muted">{outputScale.use}.</p>
      {(['light', 'dark'] as const).map((t) => (
        <div key={t} data-theme={t} className="mb-3 flex items-center gap-4 rounded-card bg-canvas p-4">
          <span className="w-12 text-footnote text-muted">{t}</span>
          <div className="flex gap-1.5">
            {outputScale[t].map((hex) => (
              <div key={hex} className="flex flex-col items-center gap-1">
                <div className="h-14 w-10 rounded-tile" style={{ background: hex }} />
                <code className="text-caption text-muted">{hex}</code>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  </Page>
);

const SAMPLE: Record<string, string> = {
  hero: '38.6 kWh',
  largeTitle: 'Home',
  title2: 'Panel 7',
  headline: 'All 24 panels producing',
  body: 'Exporting 1.2 kW to the grid',
  subheadline: 'Likely shade or dirt on the panel',
  footnote: 'Updated 2 min ago',
  caption: '6 AM   12 PM   6 PM',
};

export const TypePage = () => (
  <Page title="Typography" lead="San Francisco the iOS way: SF Pro Text up to 19 pt, SF Pro Display from 20 pt, Apple tracking per size. Referenced, never bundled: Apple devices get it, others fall back to the system UI font. Tabular numerals for every number, sentence case everywhere.">
    <div className="divide-y divide-line">
      {Object.entries(type).map(([name, t]) => (
        <div key={name} className="grid grid-cols-[200px_1fr] items-baseline gap-6 py-5">
          <div>
            <div className="text-headline">{name}</div>
            <div className="tnum text-footnote text-muted">
              {t.size} / {t.line} · {t.weight} · {'display' in t ? 'SF Pro Display' : 'SF Pro Text'}
            </div>
            <div className="text-footnote text-muted">{t.use}</div>
          </div>
          <div className="tnum" style={{ fontFamily: 'display' in t ? font.display : font.family, fontSize: t.size, lineHeight: `${t.line}px`, letterSpacing: t.tracking, fontWeight: t.weight }}>
            {SAMPLE[name]}
          </div>
        </div>
      ))}
      <div className="grid grid-cols-[200px_1fr] items-baseline gap-6 py-5">
        <div className="text-headline">tnum</div>
        <div className="text-title2">
          <div style={{ fontVariantNumeric: 'proportional-nums' }}>Proportional 11.1 kWh · $41.10</div>
          <div className="tnum">Tabular&nbsp;&nbsp;&nbsp; 11.1 kWh · $41.10</div>
        </div>
      </div>
    </div>
  </Page>
);

export const UnitsPage = () => (
  <Page title="Units" lead="Units are sacred. Power is a rate, energy is an amount; mixing them was the most common error in the old app. Every number goes through lib/format, which enforces these rules.">
    <table className="w-full max-w-3xl text-left">
      <thead>
        <tr className="border-b border-line text-caption text-muted">
          <th className="py-2">Rule</th>
          <th>Example</th>
        </tr>
      </thead>
      <tbody>
        {units.map((u) => (
          <tr key={u.rule} className="border-b border-line">
            <td className="py-3 pr-6 text-subheadline">{u.rule}</td>
            <td className="tnum text-headline">{u.example}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Page>
);

export const ShapePage = () => (
  <Page title="Shape, space and elevation" lead="Radius follows hierarchy. 4 px grid, 16 px screen padding, 44 pt touch targets. Cards sit flat on canvas; elevation only on sheets, banners and the floating tab bar. Glass only on the tab bar.">
    <h2 className="mb-3 text-title2">Radius</h2>
    <div className="flex flex-wrap gap-4">
      {Object.entries(radius).map(([name, t]) => (
        <div key={name} className="w-40">
          <div className="h-24 border-2 border-brand bg-brand/10" style={{ borderRadius: Math.min(t.value, 48) }} />
          <div className="mt-2 text-headline">
            {name} <span className="tnum font-normal text-muted">{t.value}</span>
          </div>
          <div className="text-footnote text-muted">{t.use}</div>
        </div>
      ))}
    </div>
    <h2 className="mb-3 mt-10 text-title2">Spacing (4 px grid)</h2>
    <div className="flex items-end gap-3">
      {space.steps.map((s) => (
        <div key={s} className="flex flex-col items-center gap-1">
          <div className="bg-brand" style={{ width: s, height: s }} />
          <span className="tnum text-caption text-muted">{s}</span>
        </div>
      ))}
    </div>
    <p className="mt-3 text-subheadline text-muted">
      Screen padding {space.screen}. Touch targets at least {space.touch} × {space.touch}.
    </p>
    <h2 className="mb-3 mt-10 text-title2">Material: glass</h2>
    <p className="mb-3 max-w-2xl text-subheadline text-muted">{material.glass.use}. Blur {material.glass.blur}px, saturation {material.glass.saturate}%.</p>
    <div className="flex flex-wrap gap-6">
      {(['light', 'dark'] as const).map((theme) => (
        <div key={theme} data-theme={theme} className="relative h-40 w-80 overflow-hidden rounded-card bg-canvas">
          <div className="absolute inset-0 flex flex-col gap-2 p-3">
            <div className="h-8 rounded-tile bg-solar/80" />
            <div className="h-8 w-2/3 rounded-tile bg-battery/70" />
            <div className="h-8 w-1/2 rounded-tile bg-grid/70" />
          </div>
          <div className="material-glass absolute inset-x-3 bottom-3 flex h-14 items-center justify-center rounded-chip text-headline text-ink shadow-floating">
            {theme} · alpha {material.glass[theme].alpha}
          </div>
        </div>
      ))}
    </div>
    <h2 className="mb-3 mt-10 text-title2">Elevation</h2>
    <div className="flex flex-wrap gap-6 bg-canvas p-6">
      {Object.entries(elevation).map(([name, t]) => (
        <div key={name} className="w-48 rounded-card bg-surface p-4" style={{ boxShadow: t.value }}>
          <div className="text-headline">{name}</div>
          <div className="text-footnote text-muted">{t.use}</div>
        </div>
      ))}
      <div className="w-48 rounded-card bg-surface p-4">
        <div className="text-headline">card</div>
        <div className="text-footnote text-muted">No shadow, no border. Surface on canvas.</div>
      </div>
    </div>
  </Page>
);

export const MotionPage = () => (
  <Page title="Motion" lead="Motion shows state: a press, a sheet arriving, energy moving. The energy flow is the only looping animation. Everything else is under 320 ms with a strong ease-out, and becomes a crossfade with reduced motion.">
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-line text-caption text-muted">
          <th className="py-2">Token</th>
          <th>Value</th>
          <th>Use</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(motion).map(([name, t]) => (
          <tr key={name} className="border-b border-line">
            <td className="py-3 text-headline">{name}</td>
            <td>
              <code className="text-footnote">{t.value}</code>
            </td>
            <td className="text-subheadline text-muted">{t.use}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Page>
);

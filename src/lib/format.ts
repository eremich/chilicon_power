/**
 * Every number on screen goes through here, so the unit rules hold everywhere:
 * power is kW (or W for one panel), energy is kWh, 12-hour US time, "May 21" dates, USD.
 */

const fixed = (n: number, digits: number) => n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** Instant power. Under 1 kW shows W only when asked (single panel or device) */
export const kW = (kw: number, { watts = false } = {}) => (watts && Math.abs(kw) < 1 ? `${Math.round(kw * 1000)} W` : `${fixed(kw, 1)} kW`);

/** Power of a single panel or device, always in W */
export const W = (w: number) => `${Math.round(w).toLocaleString('en-US')} W`;

/** Energy over time. One decimal under 100, whole numbers above; MWh never, to keep one unit */
export const kWh = (v: number) => `${v >= 100 ? Math.round(v).toLocaleString('en-US') : fixed(v, 1)} kWh`;

/** Number part only, for layouts that set the unit separately */
export const num = (v: number, digits = 1) => (v >= 100 ? Math.round(v).toLocaleString('en-US') : fixed(v, digits));

export const usd = (v: number) => (v >= 100 ? `$${Math.round(v).toLocaleString('en-US')}` : `$${fixed(v, 2)}`);

export const pct = (v: number) => `${Math.round(v)}%`;

/** Minutes since midnight → "6:12 am" */
export const clock = (min: number) => {
  const h = Math.floor(min / 60) % 24;
  const m = Math.round(min % 60);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
};

/** Hour → axis label "6 am", "12 pm" */
export const hourLabel = (h: number) => `${h % 12 === 0 ? 12 : h % 12} ${h % 24 < 12 ? 'am' : 'pm'}`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const monthName = (m: number) => MONTHS[m];

/** Date → "May 21" */
export const shortDate = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getDate()}`;

export const ago = (minutes: number) => (minutes < 1 ? 'Updated just now' : minutes < 60 ? `Updated ${Math.round(minutes)} min ago` : `Updated ${Math.round(minutes / 60)} h ago`);

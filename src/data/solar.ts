/**
 * Deterministic mock energy data. No randomness: screenshots must be identical on every run.
 * Home, Sacramento CA: 8.8 kW, 24 panels on 12 microinverters, clear May day ≈ 40 kWh.
 */

export const SUNRISE = 6 * 60 + 12; // 6:12 am
export const SUNSET = 20 * 60 + 18; // 8:18 pm
/** Frozen "now" for the prototype: May 21, 1:12 pm */
export const NOW_MIN = 13 * 60 + 12;
export const TODAY = new Date(2026, 4, 21);

const DAY_KWH = 39.8;

/** Relative sun shape, 0 at sunrise and sunset, 1 at solar noon */
const shape = (min: number) => {
  if (min <= SUNRISE || min >= SUNSET) return 0;
  const t = (min - SUNRISE) / (SUNSET - SUNRISE);
  return Math.sin(Math.PI * t) ** 1.35;
};

// Scale the shape so the day integrates to DAY_KWH
const AREA = Array.from({ length: 24 * 12 }, (_, i) => shape(i * 5) * (5 / 60)).reduce((a, b) => a + b, 0);
const PEAK_KW = DAY_KWH / AREA;

/** Whole-system production in kW at a minute of the day. `factor` dims it (clouds) */
export const solarKw = (min: number, factor = 1) => PEAK_KW * shape(min) * factor;

/** Home consumption in kW: overnight base, a morning bump, an evening peak */
export const homeKw = (min: number) => {
  const h = min / 60;
  const bump = (c: number, w: number, a: number) => a * Math.exp(-(((h - c) / w) ** 2));
  return 0.45 + bump(7.3, 1.1, 0.9) + bump(13, 2.5, 0.8) + bump(19.2, 1.8, 1.9);
};

/** Energy per hour (kWh) for hours 0..23 */
export const hourly = (kwAt: (min: number) => number) =>
  Array.from({ length: 24 }, (_, h) => Array.from({ length: 12 }, (_, i) => kwAt(h * 60 + i * 5 + 2.5) / 12).reduce((a, b) => a + b, 0));

/** Power samples every 15 min for the Home curve */
export const samples = (kwAt: (min: number) => number, until = 24 * 60) =>
  Array.from({ length: 97 }, (_, i) => i * 15).map((min) => ({ min, kw: min <= until ? kwAt(min) : null }));

/** Day-to-day weather factor, fixed per day index so the month looks real (a few cloudy days) */
const WEATHER = [1, 0.97, 0.99, 0.62, 0.48, 0.9, 1, 1, 0.98, 0.95, 1, 0.99, 0.74, 0.88, 1, 1, 0.97, 1, 0.96, 0.99, 1, 0.93, 1, 1, 0.58, 0.84, 1, 0.99, 1, 0.98, 1];
export const weatherOf = (dayIndex: number) => WEATHER[dayIndex % WEATHER.length];

export const DAY_PRODUCED = DAY_KWH;
export const DAY_USED = hourly(homeKw).reduce((a, b) => a + b, 0);

/** Share of monthly production relative to May, Sacramento-like seasonality */
export const SEASON = [0.45, 0.58, 0.78, 0.92, 1, 1.06, 1.08, 1.02, 0.88, 0.7, 0.52, 0.42];
/** Monthly consumption shape: AC in summer */
export const USE_SEASON = [1.05, 0.95, 0.88, 0.85, 0.95, 1.2, 1.4, 1.38, 1.15, 0.92, 0.95, 1.08];

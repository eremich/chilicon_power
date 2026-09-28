import type { Period, SolarSystem, SystemId, Tariff } from './types';
import { DAY_PRODUCED, homeKw, hourly, SEASON, solarKw, USE_SEASON, weatherOf } from './solar';
import { hourLabel, monthName } from '../lib/format';
import type { EnergyBar } from '../components/BarChart';

export const SYSTEMS: Record<SystemId, SolarSystem> = {
  home: { id: 'home', name: 'Home', city: 'Sacramento, CA', sizeKw: 8.8, panels: 24, pairsPerRow: 4, scale: 1, batteryKwh: 13.5, firstDevice: 0x130085a, gatewayId: 'GW-7F3A21', installedOn: 'Apr 12, 2026' },
  cabin: { id: 'cabin', name: 'Cabin', city: 'Lake Tahoe, CA', sizeKw: 4.4, panels: 12, pairsPerRow: 3, scale: 0.5, firstDevice: 0x13008a0, gatewayId: 'GW-2C9E04', installedOn: 'Jun 3, 2025' },
};

export const OWNER = { name: 'Maya Chen', email: 'maya.chen@example.com', initials: 'MC' };
export const INSTALLER_CO = { company: 'Sunline Solar', name: 'Marco Ruiz', phone: '(916) 555-0142', email: 'service@sunline.example' };
export const DEFAULT_TARIFF: Tariff = { rate: 0.32, exportCredit: 0.08 };

export const deviceId = (sys: SolarSystem, pair: number) => `C${(sys.firstDevice + pair - 1).toString(16).toUpperCase()}`;

/** Battery charge and discharge limit, kW (one hour = kWh). Charging takes ~55% of surplus so export and charging share the afternoon */
const MAX_CHARGE_KW = 3.3;

export interface HourFlow {
  produced: number;
  used: number;
  exported: number;
  imported: number;
  /** + charged, − discharged, kWh */
  battery: number;
  soc: number;
}

/**
 * One day, hour by hour, with a simple battery policy: solar surplus charges the battery first, then exports;
 * a deficit draws the battery down to 10%, then imports. Deterministic.
 */
export const simulateDay = (sys: SolarSystem, weather: number, withBattery: boolean, startSoc = 0.22): HourFlow[] => {
  const prod = hourly((m) => solarKw(m, weather)).map((v) => v * sys.scale);
  const use = hourly(homeKw).map((v) => v * (sys.id === 'cabin' ? 0.55 : 1));
  const cap = withBattery && sys.batteryKwh ? sys.batteryKwh : 0;
  let soc = startSoc * cap;
  return prod.map((p, h) => {
    const u = use[h];
    let net = p - u;
    let battery = 0;
    if (cap) {
      if (net > 0) battery = Math.min(net * 0.55, cap - soc, MAX_CHARGE_KW);
      else battery = -Math.min(-net, soc - cap * 0.1, MAX_CHARGE_KW);
      soc += battery;
      net -= battery;
    }
    return { produced: p, used: u, exported: Math.max(0, net), imported: Math.max(0, -net), battery, soc: cap ? soc / cap : 0 };
  });
};

export const sum = (hours: HourFlow[]) =>
  hours.reduce(
    (a, h) => ({ produced: a.produced + h.produced, used: a.used + h.used, exported: a.exported + h.exported, imported: a.imported + h.imported, battery: a.battery + h.battery }),
    { produced: 0, used: 0, exported: 0, imported: 0, battery: 0 },
  );

export type Totals = ReturnType<typeof sum>;

/** What the owner did not pay: energy used from their own solar (directly or via battery) at the rate, plus export credit */
export const savings = (t: Totals, tariff: Tariff) => (t.used - t.imported) * tariff.rate + t.exported * tariff.exportCredit;
export const selfPowered = (t: Totals) => (t.used ? ((t.used - t.imported) / t.used) * 100 : 0);

/** Day index 20 = May 21 (today). Earlier days use the fixed weather pattern */
export const TODAY_INDEX = 20;

export interface PeriodData {
  title: string;
  bars: (EnergyBar & { totals: Totals; weather: number })[];
  totals: Totals;
}

/** Hours of a day, cut at `untilMin` (today) — past hours in full, the current one pro rata */
const cutDay = (hours: HourFlow[], untilMin = 24 * 60) =>
  hours.map((h, i) => {
    const k = i < Math.floor(untilMin / 60) ? 1 : i === Math.floor(untilMin / 60) ? (untilMin % 60) / 60 : 0;
    return { ...h, produced: h.produced * k, used: h.used * k, exported: h.exported * k, imported: h.imported * k, battery: h.battery * k };
  });

const dayTotals = (sys: SolarSystem, dayIndex: number, withBattery: boolean, cloudyToday: boolean, nowMin: number) => {
  const w = dayIndex === TODAY_INDEX && cloudyToday ? 0.35 : weatherOf(((dayIndex % 31) + 31) % 31);
  return { totals: sum(cutDay(simulateDay(sys, w, withBattery), dayIndex === TODAY_INDEX ? nowMin : undefined)), weather: w };
};

/** Bars and totals for a period. `offset` 0 = the current period, −1 = the previous one */
export const periodData = (sys: SolarSystem, period: Period, offset: number, withBattery: boolean, nowMin: number, cloudyToday = false): PeriodData => {
  const nowHour = Math.floor(nowMin / 60);
  if (period === 'day') {
    const dayIndex = TODAY_INDEX + offset;
    const w = dayIndex === TODAY_INDEX && cloudyToday ? 0.35 : weatherOf(((dayIndex % 31) + 31) % 31);
    const hours = simulateDay(sys, w, withBattery);
    // Today: past hours in full, the current hour only for the minutes that have passed
    const share = (i: number) => (offset !== 0 || i < nowHour ? 1 : i === nowHour ? (nowMin % 60) / 60 : 0);
    const bars = hours.map((h, i) => {
      const k = share(i);
      const t = { produced: h.produced * k, used: h.used * k, exported: h.exported * k, imported: h.imported * k, battery: h.battery * k };
      return { key: `h${i}`, label: i % 6 === 0 ? hourLabel(i) : '', produced: t.produced, used: t.used, partial: offset === 0 && i === nowHour, totals: t, weather: w };
    });
    const d = new Date(2026, 4, 21 + offset);
    return { title: offset === 0 ? `Today, ${monthName(d.getMonth())} ${d.getDate()}` : offset === -1 ? `Yesterday, ${monthName(d.getMonth())} ${d.getDate()}` : `${monthName(d.getMonth())} ${d.getDate()}`, bars, totals: sum(bars.map((b) => ({ ...b.totals, soc: 0 }))) };
  }
  if (period === 'week') {
    const end = TODAY_INDEX + offset * 7;
    const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const bars = Array.from({ length: 7 }, (_, i) => {
      const di = end - 6 + i;
      const future = di > TODAY_INDEX;
      const { totals, weather } = future ? { totals: sum([]), weather: 1 } : dayTotals(sys, di, withBattery, cloudyToday, nowMin);
      const d = new Date(2026, 4, di + 1);
      return { key: `w${di}`, label: DOW[(d.getDay() + 6) % 7], produced: totals.produced, used: totals.used, partial: di === TODAY_INDEX, totals, weather };
    });
    const a = new Date(2026, 4, end - 5);
    const b = new Date(2026, 4, end + 1);
    return { title: `${monthName(a.getMonth())} ${a.getDate()} – ${monthName(b.getMonth())} ${b.getDate()}`, bars, totals: sum(bars.map((x) => ({ ...x.totals, soc: 0 }))) };
  }
  if (period === 'month') {
    const month = 4 + offset;
    const days = new Date(2026, month + 1, 0).getDate();
    const season = SEASON[((month % 12) + 12) % 12];
    const bars = Array.from({ length: days }, (_, d) => {
      const future = offset === 0 && d > TODAY_INDEX;
      const base = future ? { totals: sum([]), weather: 1 } : dayTotals(sys, offset === 0 ? d : d + 3 * offset + 100, withBattery, offset === 0 && cloudyToday, nowMin);
      const k = offset === 0 ? 1 : season;
      const totals = { ...base.totals, produced: base.totals.produced * k, exported: base.totals.exported * k };
      return { key: `d${d + 1}`, label: [1, 8, 15, 22, 29].includes(d + 1) ? String(d + 1) : '', produced: totals.produced, used: totals.used, partial: offset === 0 && d === TODAY_INDEX, totals, weather: base.weather };
    });
    const m = new Date(2026, month, 1);
    return { title: `${monthName(m.getMonth())} ${m.getFullYear()}`, bars, totals: sum(bars.map((x) => ({ ...x.totals, soc: 0 }))) };
  }
  const year = 2026 + offset;
  const monthDay = sum(simulateDay(sys, 0.93, withBattery));
  const bars = SEASON.map((s, m) => {
    const future = year === 2026 && m > 4;
    const before = year < 2026 && m < 3; // the home system went live in April 2025
    const days = year === 2026 && m === 4 ? 21 : 30;
    const f = future || (before && sys.id === 'home') ? 0 : days;
    const totals = { produced: monthDay.produced * s * f, used: monthDay.used * USE_SEASON[m] * f, exported: monthDay.exported * s * f, imported: monthDay.imported * USE_SEASON[m] * f, battery: 0 };
    return { key: `m${m}`, label: monthName(m).slice(0, 1), produced: totals.produced, used: totals.used, partial: year === 2026 && m === 4, totals, weather: 1 };
  });
  return { title: String(year), bars, totals: sum(bars.map((x) => ({ ...x.totals, soc: 0 }))) };
};

/** Sanity reference for the brief: a clear May day on the home system is about 40 kWh */
export const CLEAR_DAY_KWH = DAY_PRODUCED;

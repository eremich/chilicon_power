import type { Issue, Scenario, SolarSystem, Tariff } from './types';
import { homeKw, samples, solarKw, SUNRISE, NOW_MIN } from './solar';
import { savings, selfPowered, simulateDay, sum, type Totals } from './systems';
import type { Tone } from '../lib/status';
import type { RoofCase } from './roof';
import { clock } from '../lib/format';

export const NIGHT_MIN = 21 * 60 + 40;
export const OFFLINE_SINCE = 9 * 60 + 14;
export const CLOUDY = 0.35;

export interface LiveInput {
  scenario: Scenario;
  system: SolarSystem;
  battery: boolean;
  tariff: Tariff | null;
  issue: Issue;
}

export interface Live {
  now: number;
  night: boolean;
  offline: boolean;
  pending: boolean;
  weather: number;
  solarKw: number;
  homeKw: number;
  battery?: { kw: number; pct: number };
  gridKw: number;
  today: Totals;
  saved: number | null;
  selfPct: number;
  tone: Tone;
  status: string;
  detail: string;
  roof: RoofCase;
  /** Share of panel peak output right now, for the roof map */
  share: number;
  curve: { solar: (number | null)[]; home: (number | null)[] };
}

/** Everything Home shows "right now", derived from the scenario and the owner's choices. Pure. */
export const live = ({ scenario, system, battery: withBattery, tariff, issue }: LiveInput): Live => {
  const now = scenario === 'night' ? NIGHT_MIN : NOW_MIN;
  const weather = scenario === 'cloudy' ? CLOUDY : 1;
  const offline = scenario === 'offline';
  const pending = scenario === 'first-data';
  const hasBattery = withBattery && !!system.batteryKwh;
  const hours = simulateDay(system, weather, hasBattery);
  const h = Math.floor(now / 60);
  const frac = (now % 60) / 60;
  const upTo = offline ? OFFLINE_SINCE : now;
  const hu = Math.floor(upTo / 60);
  const today = sum([...hours.slice(0, hu), ...(hours[hu] ? [{ ...hours[hu], produced: hours[hu].produced * ((upTo % 60) / 60), used: hours[hu].used * ((upTo % 60) / 60), exported: hours[hu].exported * ((upTo % 60) / 60), imported: hours[hu].imported * ((upTo % 60) / 60), battery: hours[hu].battery * ((upTo % 60) / 60) }] : [])]);

  const issueOpen = issue.status === 'open' || issue.status === 'reported' || issue.status === 'visit';
  const lowFactor = issueOpen ? 1 - 0.4 / system.panels : 1;
  const solar = solarKw(now, weather) * system.scale * lowFactor;
  const home = homeKw(now) * (system.id === 'cabin' ? 0.55 : 1);
  const bh = hours[h];
  // The hourly model gives an average; right now the battery only covers the actual gap (or takes the actual surplus)
  const gap = solar - home;
  const batteryKw = !hasBattery ? 0 : bh.battery > 0 ? Math.min(bh.battery, Math.max(0, gap)) : -Math.min(-bh.battery, Math.max(0, -gap));
  const pct = hasBattery ? Math.round((hours[Math.max(0, h - 1)].soc + (bh.soc - hours[Math.max(0, h - 1)].soc) * frac) * 100) : 0;
  const grid = solar - home - batteryKw;

  let tone: Tone = 'ok';
  let status = `All ${system.panels} panels producing`;
  let detail = 'Updated 2 min ago';
  let roof: RoofCase = 'normal';
  if (pending) (tone = 'pending'), (status = 'Waiting for first data'), (detail = 'Usually takes a few minutes. We’ll notify you.');
  else if (offline) (tone = 'offline'), (status = `Gateway offline since ${clock(OFFLINE_SINCE)}`), (detail = 'Check its power and Wi-Fi'), (roof = 'gateway-offline');
  else if (issueOpen) {
    tone = 'warn';
    status = `Panel ${issue.panel} is producing 40% less`;
    detail = issue.status === 'reported' ? 'Reported to Sunline Solar' : issue.status === 'visit' ? 'Installer visit scheduled' : `Since ${issue.since} · Tap to see why`;
    roof = 'issue';
  } else if (scenario === 'night') (tone = 'night'), (status = `Night. Panels start around ${clock(SUNRISE)}`), (detail = 'Updated 4 min ago'), (roof = 'night');
  else if (scenario === 'cloudy') (tone = 'cloudy'), (status = 'Cloudy day. Output is low across the roof'), (detail = 'Nothing to fix · Updated 2 min ago');

  const peakShare = solarKw(now, weather) / solarKw(13 * 60 + 15);
  const cut = offline ? OFFLINE_SINCE : now;
  return {
    now,
    night: scenario === 'night',
    offline,
    pending,
    weather,
    solarKw: solar,
    homeKw: home,
    battery: hasBattery ? { kw: batteryKw, pct } : undefined,
    gridKw: grid,
    today,
    saved: tariff ? savings(today, tariff) : null,
    selfPct: selfPowered(today),
    tone,
    status,
    detail,
    roof,
    share: Math.max(0, Math.min(1, peakShare)) * 0.82,
    curve: {
      solar: samples((m) => solarKw(m, weather) * system.scale * lowFactor, cut).map((s) => s.kw),
      home: samples((m) => homeKw(m) * (system.id === 'cabin' ? 0.55 : 1), cut).map((s) => s.kw),
    },
  };
};

import type { Issue } from './types';
import { SYSTEMS } from './systems';

/** Sunline Solar's fleet: 20 sites across California. Invented names. One site is Maya's home system. */

export type SiteTone = 'offline' | 'warn' | 'ok';

export interface Site {
  id: string;
  customer: string;
  email: string;
  phone: string;
  city: string;
  sizeKw: number;
  panels: number;
  pairsPerRow: number;
  /** Minutes since the last data */
  updatedMin: number;
  installedOn: string;
  gatewayId: string;
  firstDevice: number;
  /** Devices still on the previous firmware */
  oldFirmware: number;
  /** Static problem for sites other than Maya's */
  problem?: { tone: 'offline' | 'warn'; text: string; cause: string; panel?: number; since: string; ageMin: number };
  battery?: number;
}

export const MAYA_SITE = 'maya';
export const FIRMWARE = '2.4.1';
export const OLD_FIRMWARE = '2.3.9';

const S = (id: string, customer: string, city: string, sizeKw: number, updatedMin: number, installedOn: string, extra: Partial<Site> = {}): Site => {
  const panels = Math.round(sizeKw / 0.3667 / 2) * 2;
  const n = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    id,
    customer,
    email: `${customer.split(' ')[0].toLowerCase()}@example.com`,
    phone: `(${[916, 559, 408, 530, 707][n % 5]}) 555-01${String(n % 90).padStart(2, '0')}`,
    city,
    sizeKw,
    panels,
    pairsPerRow: panels >= 20 ? 4 : 3,
    updatedMin,
    installedOn,
    gatewayId: `GW-${(0x5a1c00 + n * 37).toString(16).toUpperCase().slice(0, 6)}`,
    firstDevice: 0x1300a00 + n * 16,
    oldFirmware: n % 4 === 0 ? 2 : 0,
    ...extra,
  };
};

export const FLEET: Site[] = [
  S('okafor', 'Daniel Okafor', 'Fresno', 6.6, 242, 'Aug 2, 2025', { problem: { tone: 'offline', text: 'Gateway offline since 9:14 am', cause: 'No data from the gateway', since: '9:14 am', ageMin: 238 } }),
  {
    ...S(MAYA_SITE, 'Maya Chen', 'Sacramento', SYSTEMS.home.sizeKw, 2, SYSTEMS.home.installedOn),
    email: 'maya.chen@example.com',
    phone: '(916) 555-0187',
    panels: SYSTEMS.home.panels,
    pairsPerRow: SYSTEMS.home.pairsPerRow,
    gatewayId: SYSTEMS.home.gatewayId,
    firstDevice: SYSTEMS.home.firstDevice,
    oldFirmware: 3,
    battery: SYSTEMS.home.batteryKwh,
  },
  S('fernandez', 'Lucas Fernández', 'San Jose', 7.7, 4, 'Mar 18, 2026', { problem: { tone: 'warn', text: 'Panel 11 producing 30% less', cause: 'Likely shade', panel: 11, since: 'May 19', ageMin: 2 * 1440 } }),
  S('nair', 'Priya Nair', 'Davis', 7.2, 5, 'Jan 9, 2026'),
  S('bergstrom', 'Elin Bergström', 'Roseville', 9.5, 3, 'Feb 22, 2026'),
  S('adeyemi', 'Tunde Adeyemi', 'Oakland', 5.5, 6, 'Oct 30, 2025'),
  S('kowalski', 'Anna Kowalski', 'Folsom', 8.1, 2, 'Nov 14, 2025'),
  S('reyes', 'Carmen Reyes', 'Stockton', 6.2, 9, 'Jul 7, 2025'),
  S('tanaka', 'Hiro Tanaka', 'Palo Alto', 10.3, 4, 'Apr 1, 2026'),
  S('obrien', 'Siobhan O’Brien', 'Berkeley', 4.8, 7, 'Sep 12, 2025'),
  S('haddad', 'Karim Haddad', 'Modesto', 8.8, 3, 'Dec 3, 2025'),
  S('lindqvist', 'Nora Lindqvist', 'Elk Grove', 7.0, 5, 'May 20, 2025'),
  S('mensah', 'Kofi Mensah', 'Vacaville', 6.6, 8, 'Jun 16, 2025'),
  S('silva', 'Rafael Silva', 'Santa Rosa', 9.2, 2, 'Mar 5, 2026'),
  S('park', 'Ji-woo Park', 'Fremont', 5.9, 6, 'Aug 28, 2025'),
  S('novak', 'Petra Novak', 'Chico', 7.4, 11, 'Oct 2, 2025'),
  S('ibrahim', 'Amira Ibrahim', 'Merced', 8.4, 4, 'Jan 27, 2026'),
  S('moreau', 'Julien Moreau', 'Napa', 6.9, 3, 'Feb 8, 2026'),
  S('castillo', 'Diego Castillo', 'Visalia', 10.6, 7, 'Nov 21, 2025'),
  S('walsh', 'Grace Walsh', 'Auburn', 5.1, 5, 'Apr 14, 2026'),
];

/** Maya's site reflects the shared issue: reported, visit, resolved all show up here */
export const siteTone = (site: Site, issue: Issue): SiteTone => {
  if (site.id === MAYA_SITE) return ['open', 'reported', 'visit'].includes(issue.status) ? 'warn' : 'ok';
  return site.problem?.tone ?? 'ok';
};

export const siteIssueText = (site: Site, issue: Issue) =>
  site.id === MAYA_SITE ? (['open', 'reported', 'visit'].includes(issue.status) ? `Panel ${issue.panel} producing 40% less` : undefined) : site.problem?.text;

const RANK: Record<SiteTone, number> = { offline: 0, warn: 1, ok: 2 };
export const sortSites = (sites: Site[], issue: Issue) => [...sites].sort((a, b) => RANK[siteTone(a, issue)] - RANK[siteTone(b, issue)] || a.updatedMin - b.updatedMin);

export const deviceIdOf = (site: Site, pair: number) => `C${(site.firstDevice + pair - 1).toString(16).toUpperCase()}`;

export const ago = (min: number) => (min < 1 ? 'just now' : min < 60 ? `${Math.round(min)} min ago` : min < 1440 ? `${Math.round(min / 60)} h ago` : `${Math.round(min / 1440)} d ago`);

export interface Alert {
  id: string;
  siteId: string;
  customer: string;
  city: string;
  title: string;
  cause: string;
  ageMin: number;
  tone: 'offline' | 'warn' | 'ok';
  fromOwner?: boolean;
  resolved?: boolean;
}

/** Alerts feed across the fleet, newest first. Maya's alert follows the shared issue lifecycle */
export const alertsFor = (issue: Issue, hasFleet: boolean): { active: Alert[]; earlier: Alert[] } => {
  if (!hasFleet) return { active: [], earlier: [] };
  const maya: Alert = {
    id: 'maya-7',
    siteId: MAYA_SITE,
    customer: 'Maya Chen',
    city: 'Sacramento',
    title: `Panel ${issue.panel} producing 40% less`,
    cause: issue.status === 'visit' ? 'Microinverter not reporting · Visit May 23, 9–11 am' : 'Microinverter not reporting',
    ageMin: issue.status === 'reported' || issue.status === 'visit' ? 1 : 3 * 1440,
    tone: 'warn',
    fromOwner: issue.status === 'reported' || issue.status === 'visit',
  };
  const others: Alert[] = FLEET.filter((s) => s.problem).map((s) => ({
    id: `${s.id}-p`,
    siteId: s.id,
    customer: s.customer,
    city: s.city,
    title: s.problem!.text,
    cause: s.problem!.cause,
    ageMin: s.problem!.ageMin,
    tone: s.problem!.tone,
  }));
  const open = ['open', 'reported', 'visit'].includes(issue.status);
  const active = [...others, ...(open ? [maya] : [])].sort((a, b) => a.ageMin - b.ageMin);
  const earlier: Alert[] = [
    ...(issue.status === 'resolved' ? [{ ...maya, cause: issue.resolvedNote ?? 'Resolved', resolved: true, ageMin: 1, tone: 'ok' as const, fromOwner: false }] : []),
    { id: 'nair-gw', siteId: 'nair', customer: 'Priya Nair', city: 'Davis', title: 'Gateway offline for 3 hours', cause: 'Router replaced. Back online', ageMin: 22 * 1440, tone: 'ok', resolved: true },
  ];
  return { active, earlier };
};

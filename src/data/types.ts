export type Role = 'owner' | 'installer';

export const SCENARIOS = ['default', 'issue', 'offline', 'night', 'cloudy', 'no-battery', 'no-tariff', 'first-data', 'empty-installer', 'resolved'] as const;
export type Scenario = (typeof SCENARIOS)[number];

export type SystemId = 'home' | 'cabin';

export interface SolarSystem {
  id: SystemId;
  name: string;
  city: string;
  sizeKw: number;
  panels: number;
  pairsPerRow: number;
  /** Output relative to the 8.8 kW Sacramento system */
  scale: number;
  batteryKwh?: number;
  /** First device ID; the rest count up in hex */
  firstDevice: number;
  gatewayId: string;
  installedOn: string;
}

export type Period = 'day' | 'week' | 'month' | 'year';

/** Owner-side issue lifecycle for the end-to-end scenario */
export type IssueStatus = 'none' | 'open' | 'reported' | 'visit' | 'resolved';

export interface Issue {
  status: IssueStatus;
  /** Panel with low output */
  panel: number;
  /** 1-based microinverter pair index */
  pair: number;
  cause: 'device' | 'shade';
  since: string;
  reportedAt?: string;
  resolvedNote?: string;
  remindIn?: number;
}

export interface Tariff {
  rate: number;
  exportCredit: number;
}

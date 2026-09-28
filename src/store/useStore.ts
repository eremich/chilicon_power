import { create } from 'zustand';
import type { Issue, Role, Scenario, SystemId, Tariff } from '../data/types';
import { DEFAULT_TARIFF } from '../data/systems';
import { applyTheme, saveTheme, type ThemeChoice } from '../lib/theme';

export interface ToastMsg {
  id: number;
  message: string;
}

export interface Banner {
  title: string;
  body: string;
  to: string;
}

export interface Onboarding {
  name: string;
  email: string;
  role: Role;
  company: string;
  gateways: string[];
  address: string;
  sizeKw: string;
  battery: boolean;
}

const ONBOARDING: Onboarding = { name: '', email: '', role: 'owner', company: '', gateways: [], address: '', sizeKw: '8.8', battery: true };

const ISSUE: Issue = { status: 'none', panel: 7, pair: 4, cause: 'device', since: 'May 18' };

interface State {
  scenario: Scenario;
  role: Role;
  theme: ThemeChoice;
  systemId: SystemId;
  /** Battery layer per system; the cabin has none */
  battery: boolean;
  tariff: Tariff | null;
  issue: Issue;
  /** Resolved issues, newest first */
  history: { title: string; date: string; note: string }[];
  toasts: ToastMsg[];
  banner: Banner | null;
  /** Screens that already showed their loading skeleton */
  loaded: Record<string, boolean>;
  notifications: { issues: boolean; daily: boolean; monthly: boolean };
  emailReports: 'off' | 'daily' | 'monthly';
  installerAccess: 'owner' | 'full';
  /** Owner has an installer linked; without one, issue help goes to "find an installer nearby" */
  installerLinked: boolean;
  onboarding: Onboarding;
  /** Installer side */
  hasFleet: boolean;
  /** Pair index being restarted per site, and the ones already restarted */
  restarting: Record<string, number | undefined>;
  restarted: Record<string, number[]>;
  firmwareUpdated: Record<string, boolean>;
  visit: { siteId: string; day: string; slot: string } | null;
  /** Notifications waiting for the other role; shown as a push when you switch to it */
  inbox: Record<Role, Banner[]>;
  /** Installer alerts not yet opened: drives the Alerts tab badge */
  unseenAlerts: number;

  loadScenario: (s: Scenario) => void;
  setRole: (r: Role) => void;
  setTheme: (t: ThemeChoice, persist?: boolean) => void;
  setSystem: (id: SystemId) => void;
  setBattery: (on: boolean) => void;
  setTariff: (t: Tariff | null) => void;
  toast: (message: string) => void;
  showBanner: (b: Banner | null) => void;
  markLoaded: (key: string) => void;
  setPrefs: (patch: Partial<Pick<State, 'notifications' | 'emailReports' | 'installerAccess' | 'installerLinked'>>) => void;

  setOnboarding: (patch: Partial<Onboarding>) => void;
  /** Setup done: land on Home waiting for the first data */
  finishSetup: () => void;

  restartDevice: (siteId: string, pair: number) => void;
  updateFirmware: (siteId: string) => void;
  scheduleVisit: (siteId: string, day: string, slot: string) => void;
  seeAlerts: () => void;

  reportIssue: () => void;
  remindLater: () => void;
  resolveIssue: (note: string) => void;
}

let toastId = 0;
/** Simulated remote restart: the device goes quiet, then reports again */
export const RESTART_MS = 3200;

/** Scenario seeds. Everything a screen shows derives from this state */
const seed = (
  s: Scenario,
): Pick<State, 'scenario' | 'battery' | 'tariff' | 'issue' | 'history' | 'systemId' | 'loaded' | 'hasFleet' | 'restarting' | 'restarted' | 'firmwareUpdated' | 'visit' | 'inbox' | 'unseenAlerts'> => ({
  scenario: s,
  hasFleet: s !== 'empty-installer',
  restarting: {},
  restarted: {},
  firmwareUpdated: {},
  visit: null,
  inbox: { owner: [], installer: [] },
  unseenAlerts: s === 'empty-installer' ? 0 : 2,
  systemId: 'home',
  battery: s !== 'no-battery',
  tariff: s === 'no-tariff' ? null : DEFAULT_TARIFF,
  issue: s === 'issue' ? { ...ISSUE, status: 'open' } : s === 'resolved' ? { ...ISSUE, status: 'resolved', resolvedNote: 'Restarted microinverter C130085D remotely. Back online.' } : ISSUE,
  history:
    s === 'resolved'
      ? [{ title: 'Panel 7 producing 40% less', date: 'May 21', note: 'Microinverter restarted remotely by Sunline Solar' }]
      : [{ title: 'Gateway offline for 3 hours', date: 'Apr 29', note: 'Router replaced. Back online' }],
  loaded: {},
});

export const useStore = create<State>((set, get) => ({
  ...seed('default'),
  role: 'owner',
  theme: 'system',
  toasts: [],
  banner: null,
  notifications: { issues: true, daily: false, monthly: true },
  emailReports: 'monthly',
  installerAccess: 'full',
  installerLinked: true,
  onboarding: ONBOARDING,

  loadScenario: (s) => set({ ...seed(s), banner: null }),
  setRole: (role) => {
    // A notification waiting for this role appears as a push the moment you switch to it
    const [next, ...rest] = get().inbox[role];
    set((st) => ({ role, inbox: { ...st.inbox, [role]: rest }, banner: next ?? st.banner }));
  },
  setTheme: (theme, persist = true) => {
    applyTheme(theme);
    if (persist) saveTheme(theme);
    set({ theme });
  },
  setSystem: (systemId) => set({ systemId, battery: systemId === 'home' && get().scenario !== 'no-battery' }),
  setBattery: (battery) => set({ battery }),
  setTariff: (tariff) => set({ tariff }),
  toast: (message) => {
    const id = ++toastId;
    set((st) => ({ toasts: [...st.toasts, { id, message }] }));
    setTimeout(() => set((st) => ({ toasts: st.toasts.filter((t) => t.id !== id) })), 2600);
  },
  showBanner: (banner) => set({ banner }),
  markLoaded: (key) => set((st) => ({ loaded: { ...st.loaded, [key]: true } })),
  setPrefs: (patch) => set(patch),

  setOnboarding: (patch) => set((st) => ({ onboarding: { ...st.onboarding, ...patch } })),
  finishSetup: () => set({ ...seed('first-data'), role: 'owner', battery: get().onboarding.battery }),

  reportIssue: () =>
    set((st) => ({
      issue: { ...st.issue, status: 'reported', reportedAt: '1:14 pm' },
      unseenAlerts: st.unseenAlerts + 1,
      inbox: { ...st.inbox, installer: [...st.inbox.installer, { title: 'Maya Chen reported panel 7', body: 'Producing 40% less since May 18. Microinverter not reporting.', to: `/i/sites/maya` }] },
    })),
  remindLater: () => set((st) => ({ issue: { ...st.issue, remindIn: 3 } })),
  resolveIssue: (note) =>
    set((st) => ({
      issue: { ...st.issue, status: 'resolved', resolvedNote: note },
      history: [{ title: `Panel ${st.issue.panel} producing 40% less`, date: 'May 21', note }, ...st.history],
      visit: null,
      inbox: { ...st.inbox, owner: [...st.inbox.owner, { title: 'All 24 panels producing', body: `Sunline Solar fixed panel ${st.issue.panel}: ${note}`, to: '/o' }] },
    })),

  restartDevice: (siteId, pair) => {
    set((st) => ({ restarting: { ...st.restarting, [siteId]: pair } }));
    setTimeout(
      () =>
        set((st) => ({
          restarting: { ...st.restarting, [siteId]: undefined },
          restarted: { ...st.restarted, [siteId]: [...(st.restarted[siteId] ?? []), pair] },
        })),
      RESTART_MS,
    );
  },
  updateFirmware: (siteId) => set((st) => ({ firmwareUpdated: { ...st.firmwareUpdated, [siteId]: true } })),
  scheduleVisit: (siteId, day, slot) =>
    set((st) => ({
      visit: { siteId, day, slot },
      issue: siteId === 'maya' && st.issue.status !== 'resolved' && st.issue.status !== 'none' ? { ...st.issue, status: 'visit' } : st.issue,
      inbox: siteId === 'maya' ? { ...st.inbox, owner: [...st.inbox.owner, { title: 'Installer visit scheduled', body: `Sunline Solar will visit ${day}, ${slot}.`, to: '/o/panels/4' }] } : st.inbox,
    })),
  seeAlerts: () => set({ unseenAlerts: 0 }),
}));

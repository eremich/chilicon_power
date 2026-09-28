import { useEffect, useRef, type ReactNode } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, BatteryFull, Bell, House, LayoutGrid, MapPinned, Signal, User, Wifi } from 'lucide-react';
import { TabBar, type TabItem } from '../components/TabBar';
import { Toast } from '../components/Toast';
import { PushBanner } from '../components/PushBanner';
import { Segmented } from '../components/Segmented';
import { Switch } from '../components/Switch';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { SCENARIOS, type Role, type Scenario } from '../data/types';
import { useStore } from '../store/useStore';
import { useLive, useSystem } from './hooks';
import { clock } from '../lib/format';
import { cx } from '../lib/cx';
import type { ThemeChoice } from '../lib/theme';

export const ROLE_HOME: Record<Role, string> = { owner: '/o', installer: '/i' };
const ROLE_READY: Record<Role, boolean> = { owner: true, installer: true };
const ROLE_LABEL: Record<Role, string> = { owner: 'Homeowner · Maya Chen', installer: 'Installer · Marco Ruiz' };

const TABS: Record<Role, (TabItem & { path: string })[]> = {
  owner: [
    { key: 'home', label: 'Home', icon: House, path: '/o' },
    { key: 'energy', label: 'Energy', icon: BarChart3, path: '/o/energy' },
    { key: 'panels', label: 'Panels', icon: LayoutGrid, path: '/o/panels' },
    { key: 'profile', label: 'Profile', icon: User, path: '/o/profile' },
  ],
  installer: [
    { key: 'sites', label: 'Sites', icon: MapPinned, path: '/i' },
    { key: 'alerts', label: 'Alerts', icon: Bell, path: '/i/alerts' },
    { key: 'profile', label: 'Profile', icon: User, path: '/i/profile' },
  ],
};

const roleOfPath = (path: string): Role => (path.startsWith('/i') ? 'installer' : 'owner');

const StatusBar = () => {
  const { now } = useLive();
  return (
    <div aria-hidden className="status-bar flex h-[54px] shrink-0 items-end justify-between px-8 pb-2 text-headline text-ink">
      <span className="tnum">{clock(now).replace(/ (am|pm)$/, '')}</span>
      <span className="flex items-center gap-1.5">
        <Signal className="size-4" strokeWidth={2.5} />
        <Wifi className="size-4" strokeWidth={2.5} />
        <BatteryFull className="size-6" strokeWidth={1.75} />
      </span>
    </div>
  );
};

/** Desktop-only controls outside the phone frame. Not part of screenshots. */
const DeskPanel = ({ role, onPick }: { role: Role; onPick: (r: Role) => void }) => {
  const scenario = useStore((s) => s.scenario);
  const loadScenario = useStore((s) => s.loadScenario);
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const battery = useStore((s) => s.battery);
  const setBattery = useStore((s) => s.setBattery);
  const showBanner = useStore((s) => s.showBanner);
  const issue = useStore((s) => s.issue);
  const system = useSystem();
  const installerLinked = useStore((s) => s.installerLinked);
  const setPrefs = useStore((s) => s.setPrefs);
  const navigate = useNavigate();
  return (
    <aside className="desk-panel hidden w-64 shrink-0 flex-col gap-6 lg:flex">
      <div>
        <Logo variant="wordmark" className="h-6" />
        <p className="mt-2 text-subheadline text-muted">Mobile 2026 · clickable prototype</p>
      </div>
      <div>
        <p className="mb-2 text-footnote font-semibold text-ink">View as</p>
        <div className="flex flex-col gap-1">
          {(Object.keys(ROLE_HOME) as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={role === r}
              disabled={!ROLE_READY[r]}
              onClick={() => onPick(r)}
              className={cx('press flex min-h-11 items-center justify-between gap-2 rounded-control px-3 text-left text-subheadline transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60', role === r ? 'bg-surface font-semibold text-ink' : 'text-muted hover:bg-surface/60 disabled:hover:bg-transparent')}
            >
              {ROLE_LABEL[r]}
              {!ROLE_READY[r] && <span className="text-footnote">next phase</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="scenario" className="text-footnote font-semibold text-ink">
          Scenario
        </label>
        <select
          id="scenario"
          value={scenario}
          onChange={(e) => {
            loadScenario(e.target.value as Scenario);
            navigate(ROLE_HOME[role]);
          }}
          className="h-11 w-full rounded-control border border-line bg-surface px-3 text-subheadline text-ink"
        >
          {SCENARIOS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <p className="mt-3 text-footnote font-semibold text-ink">Theme</p>
        <Segmented<ThemeChoice> label="Theme" value={theme} onChange={setTheme} options={[{ key: 'light', label: 'Light' }, { key: 'dark', label: 'Dark' }, { key: 'system', label: 'Auto' }]} />
        <label className="mt-3 flex items-center justify-between gap-3 text-subheadline text-ink">
          Owner has an installer
          <Switch checked={installerLinked} onChange={(v) => setPrefs({ installerLinked: v })} label="Owner has an installer" />
        </label>
        {system.batteryKwh && (
          <label className="mt-3 flex items-center justify-between gap-3 text-subheadline text-ink">
            Battery layer
            <Switch checked={battery} onChange={setBattery} label="Battery layer" />
          </label>
        )}
        {issue.status === 'open' && role === 'owner' && (
          <Button
            variant="secondary"
            size="md"
            className="mt-3"
            onClick={() => showBanner({ title: `Panel ${issue.panel} needs attention`, body: `It is producing 40% less than its neighbors since ${issue.since}.`, to: `/o/panels/${issue.pair}` })}
          >
            Send test notification
          </Button>
        )}
        <p className="mt-3 text-footnote font-semibold text-ink">Jump to</p>
        <div className="flex flex-wrap gap-2">
          {(role === 'owner'
            ? [
                ['Welcome', '/start'],
                ['Setup', '/setup'],
                ['Scan', '/setup/scan'],
              ]
            : [
                ['Maya’s site', '/i/sites/maya'],
                ['Offline site', '/i/sites/okafor'],
                ['Add site', '/i/add'],
              ]
          ).map(([label, to]) => (
            <button key={to} type="button" onClick={() => navigate(to)} className="press h-9 rounded-chip bg-surface px-3 text-footnote font-semibold text-ink hover:bg-raised">
              {label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-footnote text-muted">Clock frozen at Thu, May 21, 1:12 pm. Sacramento, clear sky.</p>
      </div>
    </aside>
  );
};

const Overlays = () => {
  const toasts = useStore((s) => s.toasts);
  const banner = useStore((s) => s.banner);
  const showBanner = useStore((s) => s.showBanner);
  const navigate = useNavigate();
  return (
    <>
      {banner && (
        <div className="absolute inset-x-2 top-2 z-toast">
          <PushBanner
            title={banner.title}
            body={banner.body}
            onOpen={() => {
              navigate(banner.to);
              showBanner(null);
            }}
            onDismiss={() => showBanner(null)}
          />
        </div>
      )}
      <div aria-live="polite" className="pointer-events-none absolute inset-x-4 bottom-28 z-toast flex flex-col items-center gap-2">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} />
        ))}
      </div>
    </>
  );
};

export const Shell = ({ children, bare = false }: { children?: ReactNode; bare?: boolean }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const setRole = useStore((s) => s.setRole);
  const role = roleOfPath(pathname);
  const main = useRef<HTMLElement>(null);
  const unseen = useStore((s) => s.unseenAlerts);
  const tabs = TABS[role].map((t) => (t.key === 'alerts' ? { ...t, badge: unseen } : t));
  const activeTab = tabs.find((t) => t.path === pathname);

  useEffect(() => {
    main.current?.scrollTo({ top: 0 });
  }, [pathname]);

  const pick = (r: Role) => {
    setRole(r);
    navigate(ROLE_HOME[r]);
  };

  return (
    <div className="flex min-h-full items-center justify-center gap-16 phone:p-8">
      {!bare && <DeskPanel role={role} onPick={pick} />}
      <div id="phone" className="relative flex h-[100dvh] w-full flex-col overflow-clip bg-canvas phone:h-[844px] phone:w-[390px] phone:rounded-phone phone:shadow-phone">
        <StatusBar />
        {/* Content scrolls under the floating tab bar; bottom padding keeps the last item reachable */}
        <main ref={main} id="screen" className={cx('scroll-area relative flex flex-1 flex-col', activeTab && 'pb-24')}>
          {children ?? <Outlet />}
        </main>
        {activeTab && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-tabbar px-5 pb-[max(22px,env(safe-area-inset-bottom))]">
            <div className="pointer-events-auto">
              <TabBar items={tabs} active={activeTab.key} onSelect={(k) => navigate(tabs.find((t) => t.key === k)!.path)} />
            </div>
          </div>
        )}
        <div id="sheet-root" className="pointer-events-none absolute inset-0 z-sheet" />
        <Overlays />
      </div>
    </div>
  );
};

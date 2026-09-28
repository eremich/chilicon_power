import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, CircleDollarSign, House } from 'lucide-react';
import { SystemHeader } from '../../components/SystemHeader';
import { IconButton } from '../../components/IconButton';
import { StatusCard } from '../../components/StatusCard';
import { EnergyFlow } from '../../components/EnergyFlow';
import { HeroStat } from '../../components/HeroStat';
import { Card } from '../../components/Card';
import { PowerCurve } from '../../components/PowerCurve';
import { InlinePrompt } from '../../components/InlinePrompt';
import { Sheet } from '../../components/Sheet';
import { ListGroup, ListRow } from '../../components/ListRow';
import { SkeletonHome } from '../../components/Skeleton';
import { SYSTEMS } from '../../data/systems';
import { useStore } from '../../store/useStore';
import { useFirstLoad, useLive, useSystem } from '../../app/hooks';
import { clock, kW, num, usd } from '../../lib/format';
import type { Live } from '../../data/live';

/** One line under the system name: what it is doing right now */
const flowLine = (l: Live) => {
  if (l.pending) return 'Connecting to your system';
  if (l.offline) return `No live data since ${clock(9 * 60 + 14)}`;
  if (l.battery && l.battery.kw < -0.05 && l.gridKw > -0.05) return `Running on battery · ${l.battery.pct}%`;
  if (l.gridKw > 0.05) return `Exporting ${kW(l.gridKw)} to the grid`;
  if (l.gridKw < -0.05) return `Importing ${kW(-l.gridKw)} from the grid`;
  return 'Fully self-powered right now';
};

export const Home = () => {
  const navigate = useNavigate();
  const loading = useFirstLoad('home');
  const l = useLive();
  const system = useSystem();
  const systemId = useStore((s) => s.systemId);
  const setSystem = useStore((s) => s.setSystem);
  const tariff = useStore((s) => s.tariff);
  const issue = useStore((s) => s.issue);
  const [switcher, setSwitcher] = useState(false);
  const loadScenario = useStore((s) => s.loadScenario);
  const setBattery = useStore((s) => s.setBattery);
  const showBanner = useStore((s) => s.showBanner);
  const onboardingBattery = useStore((s) => s.onboarding.battery);

  // Right after setup: the first data "arrives" a few seconds later, with a notification
  useEffect(() => {
    if (!l.pending) return;
    const t = setTimeout(() => {
      loadScenario('default');
      setBattery(onboardingBattery);
      showBanner({ title: 'Your first numbers are in', body: 'All 24 panels are producing. Tap to see today so far.', to: '/o' });
    }, 5000);
    return () => clearTimeout(t);
  }, [l.pending, loadScenario, setBattery, showBanner, onboardingBattery]);

  const openStatus = () => {
    if (l.tone === 'warn') navigate(`/o/panels/${issue.pair}`);
    else navigate('/o/panels');
  };

  return (
    <div className="screen-enter flex flex-col pb-6">
      <SystemHeader
        name={system.name}
        state={flowLine(l)}
        tone={l.offline ? 'offline' : l.pending || l.night ? 'night' : 'ok'}
        onSwitch={() => setSwitcher(true)}
        trailing={<IconButton label="Notifications" icon={Bell} dot={l.tone === 'warn'} onClick={openStatus} />}
      />
      {loading ? (
        <SkeletonHome />
      ) : (
        <div className="flex flex-col gap-3 px-4">
          <StatusCard tone={l.tone} title={l.status} detail={l.detail} onClick={l.pending ? undefined : openStatus} />

          <Card className="px-0 pb-2 pt-1">
            <EnergyFlow solarKw={l.solarKw} homeKw={l.homeKw} battery={l.battery} gridKw={l.gridKw} night={l.night} offline={l.offline || l.pending} />
          </Card>

          {!l.pending && (
            <Card>
              <div className="grid grid-cols-2 gap-4">
                <HeroStat label="Produced today" value={num(l.today.produced)} unit="kWh" />
                {l.saved !== null ? <HeroStat label="Saved today" value={usd(l.saved)} /> : <HeroStat label="Used today" value={num(l.today.used)} unit="kWh" />}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-3">
                <HeroStat size="compact" label="Self-powered" value={String(Math.round(l.selfPct))} unit="%" />
                <HeroStat size="compact" label="Exported" value={num(l.today.exported)} unit="kWh" note={tariff ? `+${usd(l.today.exported * tariff.exportCredit)} credit` : undefined} />
                <HeroStat size="compact" label="Imported" value={num(l.today.imported)} unit="kWh" note={tariff ? `${usd(l.today.imported * tariff.rate)} cost` : undefined} />
              </div>
              {!tariff && (
                <div className="mt-4">
                  <InlinePrompt icon={CircleDollarSign} title="Add your electricity rate to see savings" body="It is on your utility bill" onClick={() => navigate('/o/profile?edit=rate')} />
                </div>
              )}
            </Card>
          )}

          {!l.pending && (
            <Card
              title="Today"
              action={
                <button type="button" onClick={() => navigate('/o/energy')} className="press -mr-2 flex h-11 items-center gap-0.5 rounded-control px-2 text-subheadline font-semibold text-brand-ink">
                  Energy
                  <ChevronRight aria-hidden className="size-4" />
                </button>
              }
            >
              <PowerCurve
                ariaLabel={`Power today until ${clock(l.now)}. Production and consumption in kilowatts.`}
                nowMin={l.offline ? undefined : l.now}
                series={[
                  { values: l.curve.solar, tone: 'solar', kind: 'area', label: 'Production' },
                  { values: l.curve.home, tone: 'home', kind: 'line', label: 'Consumption' },
                ]}
              />
            </Card>
          )}
        </div>
      )}

      <Sheet open={switcher} onClose={() => setSwitcher(false)} title="Your systems">
        <ListGroup>
          {Object.values(SYSTEMS).map((s) => (
            <ListRow
              key={s.id}
              leading={<House aria-hidden className="size-[22px]" strokeWidth={1.75} />}
              title={`${s.name}, ${s.city}`}
              subtitle={`${s.sizeKw.toFixed(1)} kW · ${s.panels} panels${s.batteryKwh ? ` · ${s.batteryKwh} kWh battery` : ''}`}
              trailing={s.id === systemId ? <span className="text-subheadline font-semibold text-brand-ink">Current</span> : undefined}
              onClick={() => {
                setSystem(s.id);
                setSwitcher(false);
              }}
            />
          ))}
        </ListGroup>
      </Sheet>
    </div>
  );
};

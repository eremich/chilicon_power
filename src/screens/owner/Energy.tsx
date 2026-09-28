import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, CloudSun, CircleDollarSign, Share, Sun } from 'lucide-react';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Segmented } from '../../components/Segmented';
import { PeriodNav } from '../../components/PeriodNav';
import { Card } from '../../components/Card';
import { HeroStat } from '../../components/HeroStat';
import { BarChart } from '../../components/BarChart';
import { InlinePrompt } from '../../components/InlinePrompt';
import { Sheet } from '../../components/Sheet';
import { ValueList } from '../../components/ValueList';
import { Button } from '../../components/Button';
import { Skeleton } from '../../components/Skeleton';
import { periodData, savings, selfPowered } from '../../data/systems';
import type { Period } from '../../data/types';
import { useStore } from '../../store/useStore';
import { useFirstLoad, useLive, useSystem } from '../../app/hooks';
import { hourLabel, kWh, monthName, num, usd } from '../../lib/format';

const PERIODS: { key: Period; label: string }[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

/** Sheet title for a tapped bar: "May 21, 1 pm", "May 4", "March 2026" */
const barTitle = (period: Period, offset: number, key: string) => {
  const n = Number(key.slice(1));
  const date = (d: Date) => `${monthName(d.getMonth())} ${d.getDate()}`;
  if (period === 'day') return `${date(new Date(2026, 4, 21 + offset))}, ${hourLabel(n)}`;
  if (period === 'week') return date(new Date(2026, 4, n + 1));
  if (period === 'month') return date(new Date(2026, 4 + offset, n));
  return `${monthName(n)} ${2026 + offset}`;
};

const weatherOf = (w: number) => (w >= 0.9 ? { icon: Sun, label: 'Sunny' } : w >= 0.6 ? { icon: CloudSun, label: 'Partly cloudy' } : { icon: Cloud, label: 'Cloudy' });

export const Energy = () => {
  const navigate = useNavigate();
  const loading = useFirstLoad('energy');
  const system = useSystem();
  const l = useLive();
  const battery = useStore((s) => s.battery);
  const tariff = useStore((s) => s.tariff);
  const scenario = useStore((s) => s.scenario);
  const toast = useStore((s) => s.toast);
  const [period, setPeriod] = useState<Period>('day');
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<string>();

  const data = useMemo(
    () => periodData(system, period, offset, battery && !!system.batteryKwh, l.now, scenario === 'cloudy'),
    [system, period, offset, battery, l.now, scenario],
  );
  const bar = data.bars.find((b) => b.key === selected);
  const t = data.totals;

  const choose = (p: Period) => {
    setPeriod(p);
    setOffset(0);
    setSelected(undefined);
  };
  const step = (d: number) => {
    setOffset(offset + d);
    setSelected(undefined);
  };

  return (
    <div className="screen-enter flex flex-col pb-6">
      <ScreenHeader title="Energy" large subtitle={`${system.name} · ${system.sizeKw.toFixed(1)} kW`} />
      <div className="flex flex-col gap-3 px-4">
        <Segmented label="Period" value={period} onChange={choose} options={PERIODS} />
        <PeriodNav title={data.title} onPrev={() => step(-1)} onNext={offset < 0 ? () => step(1) : undefined} />
        {loading ? (
          <Skeleton className="h-[330px] rounded-card" />
        ) : (
          <Card>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <HeroStat size="compact" label="Produced" value={num(t.produced)} unit="kWh" />
              <HeroStat size="compact" label="Used" value={num(t.used)} unit="kWh" />
              <HeroStat size="compact" label="Exported" value={num(t.exported)} unit="kWh" />
              {tariff ? <HeroStat size="compact" label="Saved" value={usd(savings(t, tariff))} /> : <HeroStat size="compact" label="Self-powered" value={String(Math.round(selfPowered(t)))} unit="%" />}
            </div>
            <div className="mt-4 border-t border-line pt-3">
              <BarChart bars={data.bars} selected={selected} onSelect={(k) => setSelected(k)} ariaLabel={`Energy, ${data.title}. Tap a bar for details.`} />
              <div className="mt-2 flex gap-4 text-footnote text-muted">
                <span className="flex items-center gap-1.5">
                  <span aria-hidden className="size-2.5 rounded-[3px] bg-solar" />
                  Produced
                </span>
                <span className="flex items-center gap-1.5">
                  <span aria-hidden className="size-2.5 rounded-[3px] bg-home" />
                  Used
                </span>
                <span className="ml-auto">Tap a bar for details</span>
              </div>
            </div>
          </Card>
        )}
        {!tariff && <InlinePrompt icon={CircleDollarSign} title="Add your electricity rate to see savings" body="It is on your utility bill" onClick={() => navigate('/o/profile?edit=rate')} />}
        {period === 'month' && (
          <Button variant="secondary" block icon={<Share aria-hidden className="size-5" />} onClick={() => toast(`${data.title} report ready to share`)}>
            Share monthly report
          </Button>
        )}
      </div>

      <Sheet
        open={!!bar}
        onClose={() => setSelected(undefined)}
        title={bar ? barTitle(period, offset, bar.key) : ''}
        description={bar ? `${weatherOf(bar.weather).label}${bar.partial ? ' · so far' : ''}` : undefined}
      >
        {bar && (
          <ValueList
            rows={[
              { label: 'Produced', value: kWh(bar.totals.produced), tone: 'solar' },
              { label: 'Used at home', value: kWh(bar.totals.used), tone: 'home' },
              { label: 'Exported', value: kWh(bar.totals.exported), tone: 'grid' },
              { label: 'Imported', value: kWh(bar.totals.imported), tone: 'grid' },
              ...(battery && system.batteryKwh ? [{ label: 'Battery', value: `${bar.totals.battery >= 0 ? '+' : '−'}${kWh(Math.abs(bar.totals.battery))}`, tone: 'battery' as const }] : []),
              ...(tariff ? [{ label: 'Saved', value: usd(savings(bar.totals, tariff)) }] : []),
            ]}
          />
        )}
      </Sheet>
    </div>
  );
};

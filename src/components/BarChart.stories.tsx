import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart, type EnergyBar } from './BarChart';
import { hourly, homeKw, solarKw, weatherOf, DAY_PRODUCED, DAY_USED, SEASON, USE_SEASON } from '../data/solar';
import { hourLabel, monthName } from '../lib/format';

const prod = hourly(solarKw);
const use = hourly(homeKw);
const DAY: EnergyBar[] = prod.map((p, h) => ({ key: `h${h}`, label: h % 6 === 0 ? hourLabel(h) : '', produced: h <= 13 ? p : 0, used: h <= 13 ? use[h] : 0, partial: h === 13 }));
const MONTH: EnergyBar[] = Array.from({ length: 31 }, (_, d) => ({
  key: `d${d + 1}`,
  label: [1, 8, 15, 22, 29].includes(d + 1) ? String(d + 1) : '',
  produced: d < 21 ? DAY_PRODUCED * weatherOf(d) : 0,
  used: d < 21 ? DAY_USED * (0.92 + ((d * 7) % 5) * 0.04) : 0,
  partial: d === 20,
}));
const YEAR: EnergyBar[] = SEASON.map((s, m) => ({ key: `m${m}`, label: monthName(m).slice(0, 1), produced: m <= 4 ? DAY_PRODUCED * 30 * s * 0.93 : 0, used: m <= 4 ? DAY_USED * 30 * USE_SEASON[m] : 0, partial: m === 4 }));

const Demo = ({ bars, label }: { bars: EnergyBar[]; label: string }) => {
  const [sel, setSel] = useState<string>();
  return <BarChart bars={bars} selected={sel} onSelect={(k) => setSel(k === sel ? undefined : k)} ariaLabel={label} />;
};

const meta = {
  title: 'Data viz/BarChart',
  component: BarChart,
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
  parameters: { docs: { description: { component: 'Energy totals in kWh: produced (solar) next to used (home). The running period is hatched. Tap a bar to select it; the Energy screen then opens a sheet with details.' } } },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Day: Story = { args: {} as never, render: () => <Demo bars={DAY} label="Energy by hour today" /> };
export const Month: Story = { args: {} as never, render: () => <Demo bars={MONTH} label="Energy by day, May" /> };
export const Year: Story = { args: {} as never, render: () => <Demo bars={YEAR} label="Energy by month, 2026" /> };
export const Selected: Story = { args: { bars: MONTH, selected: 'd4', ariaLabel: 'Energy by day, May' } };

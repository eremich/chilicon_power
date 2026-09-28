import type { Meta, StoryObj } from '@storybook/react-vite';
import { PowerCurve } from './PowerCurve';
import { homeKw, NOW_MIN, samples, solarKw } from '../data/solar';

const solarToday = samples(solarKw, NOW_MIN).map((s) => s.kw);
const homeToday = samples(homeKw, NOW_MIN).map((s) => s.kw);
const panel = samples((m) => (solarKw(m) / 24) * 1000 * 0.6).map((s) => s.kw);
const neighbors = samples((m) => (solarKw(m) / 24) * 1000).map((s) => s.kw);

const meta = {
  title: 'Data viz/PowerCurve',
  component: PowerCurve,
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
  args: {
    ariaLabel: 'Power today: production peaked around 1 pm; home use stayed under 2 kW',
    nowMin: NOW_MIN,
    series: [
      { values: solarToday, tone: 'solar', kind: 'area', label: 'Production' },
      { values: homeToday, tone: 'home', kind: 'line', label: 'Consumption' },
    ],
  },
  parameters: { docs: { description: { component: 'Power over the day in kW: a rate, so a curve. Home shows today so far with a "Now" marker; panel detail compares one panel with the average of its neighbors in W.' } } },
} satisfies Meta<typeof PowerCurve>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Today: Story = {};
export const PanelVsNeighbors: Story = {
  args: {
    unit: 'W',
    nowMin: undefined,
    ariaLabel: 'Panel 7 produced about 40% less than the average of its neighbors all day',
    series: [
      { values: neighbors, tone: 'muted', kind: 'dashed', label: 'Neighbors average' },
      { values: panel, tone: 'solar', kind: 'area', label: 'Panel 7' },
    ],
  },
};

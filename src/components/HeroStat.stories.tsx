import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeroStat } from './HeroStat';

const meta = {
  title: 'Components/HeroStat',
  component: HeroStat,
  args: { label: 'Produced today', value: '38.6', unit: 'kWh', note: 'Above your May average' },
  parameters: { docs: { description: { component: 'Hero numbers on Home: produced today (kWh), saved today ($), self-powered (%). Energy is always kWh, never kW.' } } },
} satisfies Meta<typeof HeroStat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Produced: Story = {};
export const Saved: Story = { args: { label: 'Saved today', value: '$11.40', unit: undefined, note: 'At $0.32/kWh' } };
export const Compact: Story = { args: { size: 'compact', label: 'Self-powered', value: '86', unit: '%', note: undefined } };
export const HomeRow: Story = {
  render: () => (
    <div className="flex w-[358px] flex-col gap-4 rounded-card bg-surface p-4">
      <div className="grid grid-cols-2 gap-4">
        <HeroStat label="Produced today" value="38.6" unit="kWh" />
        <HeroStat label="Saved today" value="$11.40" />
      </div>
      <div className="grid grid-cols-3 gap-4 border-t border-line pt-3">
        <HeroStat size="compact" label="Self-powered" value="86" unit="%" />
        <HeroStat size="compact" label="Exported" value="12.4" unit="kWh" />
        <HeroStat size="compact" label="Imported" value="3.1" unit="kWh" />
      </div>
    </div>
  ),
};

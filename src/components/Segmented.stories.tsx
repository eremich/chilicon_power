import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Segmented } from './Segmented';

const meta = {
  title: 'Components/Segmented',
  component: Segmented,
  parameters: { docs: { description: { component: 'Periods (Day / Week / Month / Year), Now / Today on the roof map, Overview / Technical for installers. Two to four options.' } } },
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj<typeof meta>;

const Periods = () => {
  const [v, setV] = useState<'day' | 'week' | 'month' | 'year'>('day');
  return (
    <div className="w-[358px]">
      <Segmented label="Period" value={v} onChange={setV} options={[{ key: 'day', label: 'Day' }, { key: 'week', label: 'Week' }, { key: 'month', label: 'Month' }, { key: 'year', label: 'Year' }]} />
    </div>
  );
};
const TwoOptions = () => {
  const [v, setV] = useState<'now' | 'today'>('now');
  return (
    <div className="w-[240px]">
      <Segmented label="Roof map shows" value={v} onChange={setV} options={[{ key: 'now', label: 'Now' }, { key: 'today', label: 'Today' }]} />
    </div>
  );
};

export const Period: Story = { args: {} as never, render: () => <Periods /> };
export const NowToday: Story = { name: 'Now / Today', args: {} as never, render: () => <TwoOptions /> };

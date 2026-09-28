import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FleetSummary, type FleetFilter } from './FleetSummary';

const Demo = () => {
  const [v, setV] = useState<FleetFilter>('all');
  return (
    <div className="w-[358px] bg-canvas p-2">
      <FleetSummary counts={{ offline: 1, warn: 2, ok: 17 }} value={v} onChange={setV} />
    </div>
  );
};

const meta = {
  title: 'Components/FleetSummary',
  component: FleetSummary,
  parameters: { docs: { description: { component: 'Top of the installer Sites tab: offline, issues, OK. Problems first, each count filters the list.' } } },
} satisfies Meta<typeof FleetSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = { args: {} as never, render: () => <Demo /> };
export const AllClear: Story = { args: { counts: { offline: 0, warn: 0, ok: 20 }, value: 'all', onChange: () => {} } };

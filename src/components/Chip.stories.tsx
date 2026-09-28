import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from './Chip';

const Filters = () => {
  const [v, setV] = useState('all');
  const opts: [string, string, number][] = [
    ['all', 'All', 20],
    ['offline', 'Offline', 1],
    ['warn', 'Issues', 2],
    ['ok', 'OK', 17],
  ];
  return (
    <div className="flex gap-2">
      {opts.map(([k, l, c]) => (
        <Chip key={k} label={l} count={c} selected={v === k} onClick={() => setV(k)} />
      ))}
    </div>
  );
};

const meta = {
  title: 'Components/Chip',
  component: Chip,
  args: { label: 'Offline', count: 1, selected: false, onClick: () => {} },
  parameters: { docs: { description: { component: 'Filters on the installer sites list, day choice in the visit sheet. Selected chips invert.' } } },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const FilterRow: Story = { render: () => <Filters /> };

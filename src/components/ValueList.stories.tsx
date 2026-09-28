import type { Meta, StoryObj } from '@storybook/react-vite';
import { ValueList } from './ValueList';

const meta = {
  title: 'Components/ValueList',
  component: ValueList,
  decorators: [(S) => <div className="w-[358px] rounded-card bg-surface px-4"><S /></div>],
  args: {
    rows: [
      { label: 'Produced', value: '38.6 kWh', tone: 'solar' },
      { label: 'Used at home', value: '27.9 kWh', tone: 'home' },
      { label: 'Exported', value: '12.4 kWh', tone: 'grid' },
      { label: 'Battery', value: '+6.1 kWh', tone: 'battery' },
      { label: 'Saved', value: '$9.30' },
    ],
  },
  parameters: { docs: { description: { component: 'Exact values in sheets and detail screens. Energy rows carry their energy color dot.' } } },
} satisfies Meta<typeof ValueList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnergyDetails: Story = {};
export const DeviceFacts: Story = { args: { rows: [{ label: 'Device ID', value: 'C130085D' }, { label: 'Firmware', value: '2.4.1' }, { label: 'Last seen', value: '11:40 am' }, { label: 'Status', value: 'Not reporting', tone: 'fault' }] } };

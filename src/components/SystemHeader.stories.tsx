import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell } from 'lucide-react';
import { SystemHeader } from './SystemHeader';
import { IconButton } from './IconButton';

const meta = {
  title: 'Components/SystemHeader',
  component: SystemHeader,
  decorators: [(S) => <div className="w-[390px] bg-canvas py-2"><S /></div>],
  args: { name: 'Home', state: 'Exporting 1.2 kW', tone: 'ok', onSwitch: () => {}, trailing: <IconButton label="Notifications" icon={Bell} /> },
  parameters: { docs: { description: { component: 'Home header. System name with a switcher (only when there is more than one system) and one live line: what the system is doing right now.' } } },
} satisfies Meta<typeof SystemHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Exporting: Story = {};
export const Issue: Story = { args: { state: 'Panel 7 needs attention', tone: 'warn' } };
export const Offline: Story = { args: { state: 'No data since 9:14 am', tone: 'offline' } };
export const Night: Story = { args: { state: 'Running on battery', tone: 'night' } };
export const SingleSystem: Story = { args: { onSwitch: undefined } };

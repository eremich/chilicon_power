import type { Meta, StoryObj } from '@storybook/react-vite';
import { DeviceRow } from './DeviceRow';

const meta = {
  title: 'Components/DeviceRow',
  component: DeviceRow,
  decorators: [(S) => <ul className="w-[390px] bg-surface"><S /></ul>],
  args: { deviceId: 'C1300861', panels: 'Panels 5–6', output: '524 W', firmware: '2.4.1', lastSeen: '1 min ago', state: 'ok', onClick: () => {} },
  parameters: { docs: { description: { component: 'Installer technical view. One microinverter per row: device ID, panels it serves, output now, firmware, last seen.' } } },
} satisfies Meta<typeof DeviceRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ok: Story = {};
export const Low: Story = { args: { deviceId: 'C1300863', panels: 'Panels 7–8', output: '331 W', state: 'low' } };
export const NotReporting: Story = { args: { deviceId: 'C1300863', panels: 'Panels 7–8', state: 'offline', lastSeen: '11:40 am' } };

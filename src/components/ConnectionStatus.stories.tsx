import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConnectionStatus } from './ConnectionStatus';

const meta = {
  title: 'Components/ConnectionStatus',
  component: ConnectionStatus,
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
  args: { state: 'searching', gatewayId: 'GW-7F3A21' },
  parameters: { docs: { description: { component: 'The connection step of setup. Offline explains what to check instead of just failing.' } } },
} satisfies Meta<typeof ConnectionStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Searching: Story = {};
export const Online: Story = { args: { state: 'online' } };
export const Offline: Story = { args: { state: 'offline' } };

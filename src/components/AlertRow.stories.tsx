import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertRow } from './AlertRow';

const meta = {
  title: 'Components/AlertRow',
  component: AlertRow,
  decorators: [(S) => <ul className="w-[390px] bg-surface"><S /></ul>],
  args: { customer: 'Maya Chen', city: 'Sacramento', title: 'Panel 7 producing 40% less', cause: 'Microinverter not reporting', age: '1 min ago', tone: 'warn', fromOwner: true, unread: true, onClick: () => {} },
  parameters: { docs: { description: { component: 'Installer alerts feed. New alerts carry a dot; owner reports are tagged so they get a fast reply.' } } },
} satisfies Meta<typeof AlertRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReportedByOwner: Story = {};
export const Offline: Story = { args: { customer: 'Daniel Okafor', city: 'Fresno', title: 'Gateway offline since 9:14 am', cause: 'No data from the gateway', age: '4 h ago', tone: 'offline', fromOwner: false, unread: false } };
export const Resolved: Story = { args: { title: 'Panel 7 producing 40% less', cause: 'Restarted microinverter remotely. Back online.', tone: 'ok', fromOwner: false, unread: false, age: 'just now' } };

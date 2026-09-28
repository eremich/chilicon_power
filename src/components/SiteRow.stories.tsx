import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteRow } from './SiteRow';

const meta = {
  title: 'Components/SiteRow',
  component: SiteRow,
  decorators: [(S) => <ul className="w-[390px] bg-surface"><S /></ul>],
  args: { customer: 'Maya Chen', city: 'Sacramento', sizeKw: 8.8, tone: 'ok', updated: '2 min ago', onClick: () => {} },
  parameters: { docs: { description: { component: 'Installer sites list. Sorted by status: offline, issues, OK. The issue line uses owner words.' } } },
} satisfies Meta<typeof SiteRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ok: Story = {};
export const Issue: Story = { args: { tone: 'warn', issue: 'Panel 7 producing 40% less' } };
export const Offline: Story = { args: { customer: 'Daniel Okafor', city: 'Fresno', sizeKw: 6.6, tone: 'offline', issue: 'Gateway offline since 9:14 am', updated: '4 h ago' } };
export const List: Story = {
  render: () => (
    <>
      <SiteRow customer="Daniel Okafor" city="Fresno" sizeKw={6.6} tone="offline" issue="Gateway offline since 9:14 am" updated="4 h ago" onClick={() => {}} />
      <SiteRow customer="Maya Chen" city="Sacramento" sizeKw={8.8} tone="warn" issue="Panel 7 producing 40% less" updated="2 min ago" onClick={() => {}} />
      <SiteRow customer="Priya Nair" city="Davis" sizeKw={7.2} tone="ok" updated="5 min ago" onClick={() => {}} />
    </>
  ),
};

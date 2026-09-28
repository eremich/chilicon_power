import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusCard } from './StatusCard';

const meta = {
  title: 'Components/StatusCard',
  component: StatusCard,
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
  args: { tone: 'ok', title: 'All 24 panels producing', detail: 'Updated 2 min ago', onClick: () => {} },
  parameters: {
    docs: {
      description: {
        component:
          'Answers "is my system OK?" before anything else on Home. One sentence, an icon, and how fresh the data is. Tappable when there is something to open. A cloudy day or night is neutral, not an alert.',
      },
    },
  },
} satisfies Meta<typeof StatusCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ok: Story = {};
export const Issue: Story = { args: { tone: 'warn', title: 'Panel 7 is producing 40% less', detail: 'Since May 18 · Tap to see why' } };
export const Offline: Story = { args: { tone: 'offline', title: 'Gateway offline since 9:14 am', detail: 'Check its power and Wi-Fi' } };
export const Cloudy: Story = { args: { tone: 'cloudy', title: 'Cloudy day. Output is low across the roof', detail: 'Nothing to fix · Updated 2 min ago', onClick: undefined } };
export const Night: Story = { args: { tone: 'night', title: 'Night. Panels start around 6:12 am', detail: 'Updated 4 min ago', onClick: undefined } };
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <StatusCard tone="ok" title="All 24 panels producing" detail="Updated 2 min ago" onClick={() => {}} />
      <StatusCard tone="warn" title="Panel 7 is producing 40% less" detail="Since May 18 · Tap to see why" onClick={() => {}} />
      <StatusCard tone="offline" title="Gateway offline since 9:14 am" detail="Check its power and Wi-Fi" onClick={() => {}} />
      <StatusCard tone="cloudy" title="Cloudy day. Output is low across the roof" detail="Nothing to fix" />
      <StatusCard tone="night" title="Night. Panels start around 6:12 am" detail="Updated 4 min ago" />
      <StatusCard tone="pending" title="Waiting for first data" detail="Usually takes a few minutes" />
    </div>
  ),
};

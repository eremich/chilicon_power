import type { Meta, StoryObj } from '@storybook/react-vite';
import { PushBanner } from './PushBanner';

const meta = {
  title: 'Components/PushBanner',
  component: PushBanner,
  decorators: [(S) => <div className="w-[374px]"><S /></div>],
  args: { title: 'Panel 7 needs attention', body: 'It is producing 40% less than its neighbors since May 18.', onOpen: () => {}, onDismiss: () => {} },
  parameters: { docs: { description: { component: 'Simulated push notification. Only sent when there is something to do: a cloudy day never triggers one.' } } },
} satisfies Meta<typeof PushBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Issue: Story = {};
export const Resolved: Story = { args: { title: 'All 24 panels producing', body: 'Sunline Solar fixed the microinverter behind panel 7.' } };

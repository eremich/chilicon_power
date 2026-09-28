import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionProgress } from './ActionProgress';

const meta = {
  title: 'Components/ActionProgress',
  component: ActionProgress,
  decorators: [(S) => <div className="w-[358px] bg-canvas p-2"><S /></div>],
  args: { label: 'Restarting C130085D', doneLabel: 'C130085D is back online', running: true, durationMs: 3200 },
  parameters: { docs: { description: { component: 'Remote action in progress, then its result. Used for restart and firmware update.' } } },
} satisfies Meta<typeof ActionProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {};
export const Done: Story = { args: { running: false } };

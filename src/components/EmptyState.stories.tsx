import type { Meta, StoryObj } from '@storybook/react-vite';
import { BellOff, MapPinned } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { Button } from './Button';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
  args: { icon: MapPinned, title: 'No sites yet', body: 'Add your first customer’s system. You’ll scan its gateway and invite the owner.', action: <Button block>Add a site</Button> },
  parameters: { docs: { description: { component: 'Empty lists guide to the next action instead of showing nothing.' } } },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoSites: Story = {};
export const NoAlerts: Story = { args: { icon: BellOff, title: 'All clear', body: 'No site needs attention right now. We’ll tell you when one does.', action: undefined } };

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, Share } from 'lucide-react';
import { IconButton } from './IconButton';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  args: { label: 'Notifications', icon: Bell },
  parameters: { docs: { description: { component: '44 pt touch target, 36 pt visual. Label is spoken by screen readers. A dot marks unread items.' } } },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const WithDot: Story = { args: { dot: true } };
export const Filled: Story = { args: { tone: 'filled', icon: Share, label: 'Share report' } };

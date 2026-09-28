import type { Meta, StoryObj } from '@storybook/react-vite';
import { Logo } from './Logo';

const meta = {
  title: 'Components/Logo',
  component: Logo,
  args: { variant: 'mark', className: 'h-20' },
  parameters: { docs: { description: { component: 'Mark (sun and leaf) for the welcome screen and app icon; wordmark for headers. Works on light and dark canvas.' } } },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mark: Story = {};
export const Wordmark: Story = { args: { variant: 'wordmark', className: 'h-7' } };

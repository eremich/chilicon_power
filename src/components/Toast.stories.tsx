import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast } from './Toast';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  args: { message: 'Report sent to Sunline Solar' },
  parameters: { docs: { description: { component: 'Confirms an action for 2.6 s above the tab bar. Inverted surface, check icon, repeats what happened.' } } },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

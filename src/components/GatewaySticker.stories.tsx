import type { Meta, StoryObj } from '@storybook/react-vite';
import { GatewaySticker } from './GatewaySticker';

const meta = {
  title: 'Components/GatewaySticker',
  component: GatewaySticker,
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
  parameters: { docs: { description: { component: 'Help for manual entry. The line matching the focused field lights up, so people know exactly what to copy.' } } },
} satisfies Meta<typeof GatewaySticker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const HighlightId: Story = { args: { highlight: 'id' } };
export const HighlightCode: Story = { args: { highlight: 'code' } };

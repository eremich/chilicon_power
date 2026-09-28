import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleDollarSign } from 'lucide-react';
import { InlinePrompt } from './InlinePrompt';

const meta = {
  title: 'Components/InlinePrompt',
  component: InlinePrompt,
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
  args: { icon: CircleDollarSign, title: 'Add your electricity rate to see savings', body: 'Takes 10 seconds. Your bill has it.', onClick: () => {} },
  parameters: { docs: { description: { component: 'A missing-setup nudge placed where the missing value would be. Dashed brand outline, never an alert color.' } } },
} satisfies Meta<typeof InlinePrompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoTariff: Story = {};

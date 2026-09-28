import type { Meta, StoryObj } from '@storybook/react-vite';
import { PeriodNav } from './PeriodNav';

const meta = {
  title: 'Components/PeriodNav',
  component: PeriodNav,
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
  args: { title: 'Today, May 21', onPrev: () => {} },
  parameters: { docs: { description: { component: 'Steps through days, weeks, months or years. Next is disabled at the current period.' } } },
} satisfies Meta<typeof PeriodNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Current: Story = {};
export const Past: Story = { args: { title: 'April 2026', onNext: () => {} } };

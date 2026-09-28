import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { HeroStat } from './HeroStat';

const meta = {
  title: 'Components/Card',
  component: Card,
  decorators: [(S) => <div className="w-[358px] bg-canvas p-4"><S /></div>],
  args: { title: 'Today', children: <HeroStat label="Produced" value="28.4" unit="kWh" /> },
  parameters: { docs: { description: { component: 'The one container on screens. Surface on canvas, 16 radius, flat. Title row is optional.' } } },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTitle: Story = {};
export const WithAction: Story = { args: { action: <button className="text-subheadline font-semibold text-brand-ink">See all</button> } };
export const Plain: Story = { args: { title: undefined } };

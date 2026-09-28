import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScreenHeader } from './ScreenHeader';

const meta = {
  title: 'Components/ScreenHeader',
  component: ScreenHeader,
  decorators: [(S) => <div className="scroll-area h-[400px] w-[390px] bg-canvas"><S /><div className="h-[900px]" /></div>],
  args: { title: 'Energy', large: true },
  parameters: { docs: { description: { component: 'Large title on tab roots collapses into a compact bar on scroll (iOS). Pushed screens use the compact bar with Back.' } } },
} satisfies Meta<typeof ScreenHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Large: Story = {};
export const Pushed: Story = { args: { title: 'Panel 7', large: false, onBack: () => {}, backLabel: 'Panels' } };

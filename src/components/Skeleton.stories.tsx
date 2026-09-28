import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton, SkeletonHome } from './Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  args: { className: 'h-5 w-40' },
  parameters: { docs: { description: { component: 'Shown for 600 ms the first time a screen opens. Shapes match the content that replaces them. Static with reduced motion.' } } },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {};
export const Home: Story = { render: () => <div className="w-[390px] bg-canvas py-4"><SkeletonHome /></div> };

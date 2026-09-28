import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus } from 'lucide-react';
import { NavBar } from './NavBar';
import { ScreenHeader } from './ScreenHeader';
import { IconButton } from './IconButton';

const meta = {
  title: 'Components/NavBar',
  component: NavBar,
  decorators: [(S) => <div className="w-[390px] bg-canvas"><S /></div>],
  args: { title: 'Panels 7–8', onBack: () => {}, backLabel: 'Panels' },
  parameters: {
    docs: {
      description: {
        component:
          'iOS navigation bar, 44 pt, sticky. Over a large title it is transparent and shows no title; when content scrolls under it, it blurs, gets a hairline and the compact title fades in. Bar buttons never scroll away.',
      },
    },
  },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pushed: Story = {};
export const Scrolled: Story = { args: { scrolled: true } };
export const OverLargeTitle: Story = { args: { onBack: undefined, showTitle: false, title: 'Sites', trailing: <IconButton label="Add a site" icon={Plus} /> } };

/** Scroll inside the frame: the large title slides under the bar and the compact title appears */
export const CollapsingLargeTitle: Story = {
  args: {} as never,
  render: () => (
    <div className="scroll-area h-[420px] w-[390px] bg-canvas">
      <ScreenHeader title="Sites" large subtitle="Sunline Solar · 20 sites" trailing={<IconButton label="Add a site" icon={Plus} />} />
      <div className="flex flex-col gap-2 px-4 pb-8">
        {Array.from({ length: 14 }, (_, i) => (
          <div key={i} className="h-14 rounded-card bg-surface" />
        ))}
      </div>
    </div>
  ),
};

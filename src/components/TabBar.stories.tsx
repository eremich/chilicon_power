import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, BarChart3, House, LayoutGrid, MapPinned, User } from 'lucide-react';
import { TabBar, type TabItem } from './TabBar';

const meta = {
  title: 'Components/TabBar',
  component: TabBar,
  parameters: { docs: { description: { component: 'Floating glass tab bar, iOS 26. Homeowner: Home · Energy · Panels · Profile. Installer: Sites · Alerts · Profile. Labels always visible; the capsule slides to the selected tab. Glass is used here and nowhere else.' } } },
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const OWNER: TabItem[] = [
  { key: 'home', label: 'Home', icon: House },
  { key: 'energy', label: 'Energy', icon: BarChart3 },
  { key: 'panels', label: 'Panels', icon: LayoutGrid },
  { key: 'profile', label: 'Profile', icon: User },
];
const INSTALLER: TabItem[] = [
  { key: 'sites', label: 'Sites', icon: MapPinned },
  { key: 'alerts', label: 'Alerts', icon: Bell, badge: 3 },
  { key: 'profile', label: 'Profile', icon: User },
];

const Demo = ({ items }: { items: TabItem[] }) => {
  const [active, setActive] = useState(items[0].key);
  return (
    <div className="relative h-56 w-[390px] overflow-hidden bg-canvas">
      {/* Sample content under the bar shows the glass */}
      <div className="flex flex-col gap-2 p-4">
        <div className="h-16 rounded-card bg-surface" />
        <div className="h-16 rounded-card bg-solar/70" />
        <div className="h-16 rounded-card bg-battery/60" />
      </div>
      <div className="absolute inset-x-5 bottom-5">
        <TabBar items={items} active={active} onSelect={setActive} />
      </div>
    </div>
  );
};

export const Homeowner: Story = { args: {} as never, render: () => <Demo items={OWNER} /> };
export const Installer: Story = { args: {} as never, render: () => <Demo items={INSTALLER} /> };

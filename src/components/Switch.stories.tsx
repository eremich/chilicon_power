import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const Demo = ({ initial }: { initial: boolean }) => {
  const [on, setOn] = useState(initial);
  return <Switch checked={on} onChange={setOn} label="Issue alerts" />;
};

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: { docs: { description: { component: 'Settings toggles: notifications, battery layer. Used inside a ListRow trailing slot.' } } },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const On: Story = { args: {} as never, render: () => <Demo initial /> };
export const Off: Story = { args: {} as never, render: () => <Demo initial={false} /> };

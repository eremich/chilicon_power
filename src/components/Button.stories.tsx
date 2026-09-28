import type { Meta, StoryObj } from '@storybook/react-vite';
import { QrCode, RotateCw } from 'lucide-react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Scan gateway', variant: 'primary', size: 'lg' },
  parameters: {
    docs: {
      description: {
        component:
          'Labels say what happens: "Scan gateway", "Contact installer", "Restart device". Primary is brand orange with dark text, once per screen. Never grey. Heights: lg 52, md 44.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { icon: <QrCode aria-hidden className="size-5" /> } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Enter code manually' } };
export const Plain: Story = { args: { variant: 'plain', children: 'Remind me in 3 days' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Remove system' } };
export const Loading: Story = { args: { loading: true, children: 'Restarting…' } };
export const Disabled: Story = { args: { disabled: true, children: 'Continue' } };

export const States: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-3">
      {(['primary', 'secondary', 'plain', 'destructive'] as const).map((v) => (
        <div key={v} className="flex flex-col gap-2">
          <Button variant={v} size="md">Default</Button>
          <Button variant={v} size="md" id={`hover-${v}`}>Hover</Button>
          <Button variant={v} size="md" id={`focus-${v}`}>Focus</Button>
          <Button variant={v} size="md" id={`active-${v}`}>Pressed</Button>
          <Button variant={v} size="md" disabled>Disabled</Button>
        </div>
      ))}
    </div>
  ),
  parameters: {
    pseudo: {
      hover: ['#hover-primary', '#hover-secondary', '#hover-plain', '#hover-destructive'],
      focusVisible: ['#focus-primary', '#focus-secondary', '#focus-plain', '#focus-destructive'],
      active: ['#active-primary', '#active-secondary', '#active-plain', '#active-destructive'],
    },
  },
};

export const WithIcon: Story = { args: { variant: 'secondary', size: 'md', children: 'Restart device', icon: <RotateCw aria-hidden className="size-5" /> } };

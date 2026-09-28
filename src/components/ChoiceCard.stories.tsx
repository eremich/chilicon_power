import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { House, Wrench } from 'lucide-react';
import { ChoiceCard } from './ChoiceCard';

const Demo = () => {
  const [v, setV] = useState<'owner' | 'installer'>('owner');
  return (
    <div role="radiogroup" aria-label="Who are you?" className="flex w-[358px] flex-col gap-3">
      <ChoiceCard icon={House} title="Homeowner" description="I have solar panels at home" selected={v === 'owner'} onSelect={() => setV('owner')} />
      <ChoiceCard icon={Wrench} title="Installer" description="I install and service systems for customers" selected={v === 'installer'} onSelect={() => setV('installer')} />
    </div>
  );
};

const meta = {
  title: 'Components/ChoiceCard',
  component: ChoiceCard,
  parameters: { docs: { description: { component: 'Single choice with a short description: role, new system or invite. Group them in a radiogroup.' } } },
} satisfies Meta<typeof ChoiceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WhoAreYou: Story = { args: {} as never, render: () => <Demo /> };

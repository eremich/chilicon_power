import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SlotPicker } from './SlotPicker';

const DAYS = ['Fri, May 22', 'Sat, May 23', 'Mon, May 25', 'Tue, May 26'];
const SLOTS = [{ label: '8–10 am' }, { label: '9–11 am' }, { label: '12–2 pm', taken: true }, { label: '2–4 pm' }];

const Demo = () => {
  const [day, setDay] = useState(DAYS[1]);
  const [slot, setSlot] = useState<string>();
  return (
    <div className="w-[358px] bg-surface p-4">
      <SlotPicker days={DAYS} slots={SLOTS} day={day} slot={slot} onDay={setDay} onSlot={setSlot} />
    </div>
  );
};

const meta = {
  title: 'Components/SlotPicker',
  component: SlotPicker,
  parameters: { docs: { description: { component: 'Installer schedules a site visit. The owner gets the day and window as a notification.' } } },
} satisfies Meta<typeof SlotPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = { args: {} as never, render: () => <Demo /> };

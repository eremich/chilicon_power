import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './Stepper';

const Demo = () => {
  const [v, setV] = useState(3);
  return (
    <div className="w-[358px] bg-surface px-4">
      <Stepper label="Rows" value={v} min={1} max={6} onChange={setV} unit="rows" />
    </div>
  );
};

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: { docs: { description: { component: 'Small whole numbers: roof rows, panel pairs per row.' } } },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rows: Story = { args: {} as never, render: () => <Demo /> };

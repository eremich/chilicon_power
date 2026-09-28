import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchField } from './SearchField';

const Demo = ({ initial }: { initial: string }) => {
  const [v, setV] = useState(initial);
  return (
    <div className="w-[358px]">
      <SearchField value={v} onChange={setV} placeholder="Search customers or cities" />
    </div>
  );
};

const meta = {
  title: 'Components/SearchField',
  component: SearchField,
  parameters: { docs: { description: { component: 'Searches the installer sites list by customer name or city.' } } },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: {} as never, render: () => <Demo initial="" /> };
export const WithText: Story = { args: {} as never, render: () => <Demo initial="Sacra" /> };

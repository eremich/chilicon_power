import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
  args: { label: 'Electricity rate', prefix: '$', suffix: '/kWh', defaultValue: '0.32', inputMode: 'decimal', hint: 'The price per kWh on your utility bill' },
  parameters: { docs: { description: { component: 'Label above, value inside, help or error below. Errors outline the field and say what to do.' } } },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rate: Story = {};
export const Empty: Story = { args: { label: 'Gateway ID', prefix: undefined, suffix: undefined, defaultValue: undefined, placeholder: 'GW-XXXXXX', hint: 'On the sticker under the QR code' } };
export const Error: Story = { args: { label: 'Gateway ID', prefix: undefined, suffix: undefined, defaultValue: 'GW-7F3A2', error: 'Gateway IDs have 6 characters after GW-. Check the sticker and try again.' } };

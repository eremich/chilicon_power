import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea } from './TextArea';

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
  args: { label: 'What did you do?', defaultValue: 'Restarted microinverter C130085D remotely. Back online.', hint: 'The owner sees this in their issue history' },
  parameters: { docs: { description: { component: 'Resolve notes and messages. Same label, hint and error pattern as TextField.' } } },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Note: Story = {};
export const Error: Story = { args: { defaultValue: '', error: 'Add a short note so the owner knows what was fixed' } };

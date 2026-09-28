import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordRules } from './PasswordRules';

const meta = {
  title: 'Components/PasswordRules',
  component: PasswordRules,
  args: { password: 'sunny', email: 'maya.chen@example.com' },
  parameters: { docs: { description: { component: 'Rules shown under the password field and ticked as you type, instead of an error after submit.' } } },
} satisfies Meta<typeof PasswordRules>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Partial: Story = {};
export const AllMet: Story = { args: { password: 'sunnyroof24' } };
export const Empty: Story = { args: { password: '' } };

import type { Meta, StoryObj } from '@storybook/react-vite';
import { StepScreen } from './StepScreen';
import { Button } from './Button';
import { TextField } from './TextField';

const meta = {
  title: 'Patterns/StepScreen',
  component: StepScreen,
  decorators: [(S) => <div className="flex h-[700px] w-[390px] flex-col bg-canvas"><S /></div>],
  args: {
    title: 'Where is the system?',
    lead: 'We use it for weather and your local sunrise.',
    step: [2, 4],
    onBack: () => {},
    children: <TextField label="Address" placeholder="Start typing your address" />,
    footer: <Button block>Continue</Button>,
  },
  parameters: { layout: 'centered', docs: { description: { component: 'Every onboarding and setup screen: back, progress dots, one title, one lead, content, actions pinned at thumb height.' } } },
} satisfies Meta<typeof StepScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SetupStep: Story = {};
export const AccountStep: Story = { args: { step: undefined, title: 'Log in', lead: undefined } };

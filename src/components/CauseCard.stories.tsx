import type { Meta, StoryObj } from '@storybook/react-vite';
import { CauseCard } from './CauseCard';
import { Button } from './Button';

const meta = {
  title: 'Components/CauseCard',
  component: CauseCard,
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
  parameters: { docs: { description: { component: 'Replaces raw alerts. States the likely cause, why we think so, and what to do next. A cloudy day is explained, not alarmed.' } } },
} satisfies Meta<typeof CauseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Device: Story = {
  args: {
    cause: 'device',
    reason: 'The microinverter behind panels 7 and 8 stopped reporting several times today. Its neighbors are fine, so this is the device, not the weather.',
    actions: (
      <>
        <Button block>Contact installer</Button>
        <Button block variant="plain">
          Remind me in 3 days
        </Button>
      </>
    ),
  },
};
export const ShadeOrDirt: Story = {
  args: {
    cause: 'shade',
    reason: 'Panel 7 makes 40% less than its neighbors, mostly after 3 pm. That pattern usually means shade from a tree or dirt on the glass.',
    steps: ['Look for new shade from trees or a chimney', 'Rinse the panel from the ground with a hose', 'Check again in 3 days'],
    actions: (
      <Button block variant="secondary">
        Remind me in 3 days
      </Button>
    ),
  },
};
export const Weather: Story = { args: { cause: 'weather', reason: 'Every panel is low by the same amount, so it is the clouds. Nothing to fix.' } };

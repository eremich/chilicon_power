import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelPairTile } from './PanelPairTile';

const meta = {
  title: 'Data viz/PanelPairTile',
  component: PanelPairTile,
  decorators: [(S) => <div className="w-20"><S /></div>],
  args: { label: 'Panels 7 and 8', panels: [{ n: 7, level: 0.95, state: 'ok' }, { n: 8, level: 1, state: 'ok' }] },
  parameters: { docs: { description: { component: 'One microinverter and its two panels, the unit of the roof map.' } } },
} satisfies Meta<typeof PanelPairTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Producing: Story = {};
export const LowPanel: Story = { args: { panels: [{ n: 7, level: 0.55, state: 'low' }, { n: 8, level: 0.97, state: 'ok' }] } };
export const NotReporting: Story = { args: { panels: [{ n: 7, level: 0, state: 'offline' }, { n: 8, level: 0, state: 'offline' }] } };
export const Selected: Story = { args: { selected: true } };
export const Scale: Story = {
  render: () => (
    <div className="flex gap-2">
      {[0, 0.25, 0.5, 0.75, 1].map((l) => (
        <div key={l} className="w-20">
          <PanelPairTile label={`Level ${l}`} panels={[{ n: 1, level: l, state: 'ok' }, { n: 2, level: l, state: 'ok' }]} />
        </div>
      ))}
    </div>
  ),
};

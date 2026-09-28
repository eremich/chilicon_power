import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RoofMap } from './RoofMap';
import { PAIRS_PER_ROW, roofPanels, type RoofCase } from '../data/roof';

const Demo = ({ roof }: { roof: RoofCase }) => {
  const [sel, setSel] = useState<number>();
  return <RoofMap panels={roofPanels(roof)} pairsPerRow={PAIRS_PER_ROW} selectedPair={sel} onSelectPair={setSel} legend={['0 W', '340 W']} />;
};

const meta = {
  title: 'Data viz/RoofMap',
  component: RoofMap,
  decorators: [(S) => <div className="w-[358px] rounded-card bg-surface p-4"><S /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'The roof as a health view. One sequential scale (pale to full solar) by output now or energy today. Pairs share an outline: one microinverter per two panels. Low output gets a warning mark and ring; not reporting is hatched with a wifi-off mark.',
      },
    },
  },
} satisfies Meta<typeof RoofMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = { args: {} as never, render: () => <Demo roof="normal" /> };
export const OneLowPanel: Story = { args: {} as never, render: () => <Demo roof="issue" /> };
export const DeviceNotReporting: Story = { args: {} as never, render: () => <Demo roof="device-offline" /> };
export const GatewayOffline: Story = { args: {} as never, render: () => <Demo roof="gateway-offline" /> };

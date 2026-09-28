import type { Meta, StoryObj } from '@storybook/react-vite';
import { EnergyFlow } from './EnergyFlow';

const meta = {
  title: 'Data viz/EnergyFlow',
  component: EnergyFlow,
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
  args: { solarKw: 5.4, homeKw: 1.6, battery: { kw: 2.6, pct: 72 }, gridKw: 1.2 },
  parameters: {
    docs: {
      description: {
        component:
          'The one hero element on Home. An isometric house with hairline callouts (value in kW, small caps caption). Energy dots travel the real direction: solar → home, battery charging or in use, grid export or import. Colors are the four energy tokens and nothing else. With reduced motion the dots stand still.',
      },
    },
  },
} satisfies Meta<typeof EnergyFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Exporting: Story = {};
export const Importing: Story = { args: { solarKw: 0.9, homeKw: 2.4, battery: { kw: -0.8, pct: 41 }, gridKw: -0.7 } };
export const NoBattery: Story = { args: { battery: undefined, gridKw: 3.8 } };
export const Night: Story = { args: { night: true, solarKw: 0, homeKw: 1.9, battery: { kw: -1.5, pct: 58 }, gridKw: -0.4 } };
export const Offline: Story = { args: { offline: true } };
export const Illustration: Story = { args: { callouts: false } };

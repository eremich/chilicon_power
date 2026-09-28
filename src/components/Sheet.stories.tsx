import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sheet, type Detent } from './Sheet';
import { Button } from './Button';

const meta = {
  title: 'Components/Sheet',
  component: Sheet,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'iOS sheet with a grabber and two detents (medium, large). Tap the grabber to switch. Used for bar details, the installer report, scheduling a visit.' } },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const Demo = ({ detent }: { detent: Detent }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="relative mx-auto h-[700px] w-[390px] overflow-hidden bg-canvas p-4">
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        detent={detent}
        title="May 21, 1 pm"
        description="Sunny · 84°F"
        container={null}
        footer={<Button block onClick={() => setOpen(false)}>Done</Button>}
      >
        <dl className="tnum divide-y divide-line text-body">
          {[['Produced', '5.9 kWh'], ['Used at home', '1.8 kWh'], ['Exported', '3.4 kWh'], ['Battery', '+0.7 kWh']].map(([k, v]) => (
            <div key={k} className="flex justify-between py-3">
              <dt className="text-muted">{k}</dt>
              <dd className="font-semibold text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </Sheet>
      <div id="sheet-root" className="pointer-events-none absolute inset-0 z-sheet" />
    </div>
  );
};

export const Medium: Story = { args: {} as never, render: () => <Demo detent="medium" /> };
export const Large: Story = { args: {} as never, render: () => <Demo detent="large" /> };

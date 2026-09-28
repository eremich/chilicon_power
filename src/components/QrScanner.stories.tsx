import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { QrScanner, type ScanState } from './QrScanner';

const Demo = () => {
  const [state, setState] = useState<ScanState>('ready');
  return (
    <div className="w-[358px]">
      <QrScanner
        state={state}
        onScan={() => {
          setState('scanning');
          setTimeout(() => setState('found'), 1200);
        }}
      />
      <button type="button" className="mt-3 text-subheadline font-semibold text-brand-ink" onClick={() => setState('ready')}>
        Reset
      </button>
    </div>
  );
};

const meta = {
  title: 'Components/QrScanner',
  component: QrScanner,
  decorators: [(S) => <div className="w-[358px]"><S /></div>],
  args: { state: 'ready' },
  parameters: { docs: { description: { component: 'Simulated camera for the gateway QR. Tap the viewfinder to "scan". Always dark like a real camera. Error and camera-denied states lead to manual entry.' } } },
} satisfies Meta<typeof QrScanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = { render: () => <Demo /> };
export const Ready: Story = {};
export const Scanning: Story = { args: { state: 'scanning' } };
export const Found: Story = { args: { state: 'found' } };
export const Error: Story = { args: { state: 'error' } };
export const CameraDenied: Story = { args: { state: 'denied' } };

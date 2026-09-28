import type { Meta, StoryObj } from '@storybook/react-vite';
import { FindInstallerSheet } from './FindInstallerSheet';

const meta = {
  title: 'Patterns/FindInstallerSheet',
  component: FindInstallerSheet,
  decorators: [(S) => <div className="relative h-[700px] w-[390px] overflow-hidden bg-canvas"><S /><div id="sheet-root" className="pointer-events-none absolute inset-0 z-sheet" /></div>],
  args: { open: true, onClose: () => {} },
  parameters: { layout: 'centered', docs: { description: { component: 'For owners with no installer linked: certified installers nearby with rating, distance and first visit day. Picking one sends the report and links them.' } } },
} satisfies Meta<typeof FindInstallerSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};

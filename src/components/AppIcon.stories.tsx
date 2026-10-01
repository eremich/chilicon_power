import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppIcon } from './AppIcon';

const meta = {
  title: 'Components/AppIcon',
  component: AppIcon,
  args: { size: 120, variant: 'light' },
  parameters: {
    docs: {
      description: {
        component:
          'The app icon, built from the logo mark (scripts/app-icon.mjs). Light is the default; dark is the iOS dark-mode variant. The master is a square: the OS applies the corner mask. Used in push notifications and as the home screen icon.',
      },
    },
  },
} satisfies Meta<typeof AppIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {};
export const Dark: Story = { args: { variant: 'dark' } };

/** iOS sizes, light and dark: home screen, Spotlight, notification, settings */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(['light', 'dark'] as const).map((v) => (
        <div key={v} className="flex items-end gap-6">
          {[120, 60, 40, 29].map((s) => (
            <figure key={s} className="m-0 flex flex-col items-center gap-2">
              <AppIcon size={s} variant={v} />
              <figcaption className="tnum text-caption text-muted">{s}</figcaption>
            </figure>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** As it sits on an iPhone home screen, with its label */
export const HomeScreen: Story = {
  render: () => (
    <div className="flex gap-10">
      {(['light', 'dark'] as const).map((v) => (
        <div key={v} data-theme={v} className="flex flex-col items-center gap-1.5 rounded-card bg-canvas px-10 py-8">
          <AppIcon size={60} variant={v} decorative />
          <span className="text-caption font-normal text-ink">Chilicon</span>
        </div>
      ))}
    </div>
  ),
};

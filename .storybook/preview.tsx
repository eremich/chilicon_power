import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/index.css';
import './docs.css';
import { chiliconTheme } from './theme';

// Docs pages are always light (Storybook's docs theme), so the preview must not follow the OS dark mode.
if (!document.documentElement.dataset.theme) document.documentElement.dataset.theme = 'light';

type ThemeGlobal = 'light' | 'dark' | 'both';

/**
 * Same switch as the app: data-theme flips the token variables.
 * "both" renders the story twice, light and dark side by side (tokens are scoped to [data-theme], so a wrapper is enough).
 */
const withTheme: Decorator = (Story, ctx) => {
  const theme = (ctx.globals.theme as ThemeGlobal) ?? 'light';
  const fullscreen = ctx.parameters.layout === 'fullscreen';
  document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
  const frame = (t: 'light' | 'dark') => (
    <div data-theme={t} className={`relative bg-canvas font-sans text-ink ${fullscreen ? '' : 'rounded-card p-6'}`}>
      <Story />
    </div>
  );
  if (theme !== 'both' || fullscreen) return <div className="font-sans text-ink"><Story /></div>;
  return (
    <div className="flex flex-wrap items-start gap-4">
      {frame('light')}
      {frame('dark')}
    </div>
  );
};

const preview: Preview = {
  // Every component gets a generated Docs page: description, live examples with source, props table.
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        dynamicTitle: true,
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'both', title: 'Both side by side', icon: 'sidebyside' },
        ],
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story) => (
      <>
        <Story />
        {/* Sheets portal here, like in the app's phone frame */}
        <div id="sheet-root" className="pointer-events-none fixed inset-0 z-sheet" />
      </>
    ),
    withTheme,
  ],
  parameters: {
    layout: 'centered',
    backgrounds: { disabled: true },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i }, sort: 'requiredFirst' },
    docs: { theme: chiliconTheme, toc: { headingSelector: 'h2, h3', title: 'On this page' } },
    options: {
      storySort: {
        order: ['Introduction', 'Guidelines', 'Foundations', 'Components', 'Data viz', 'Patterns'],
        method: 'alphabetical',
      },
    },
    a11y: { test: 'todo' },
  },
};

export default preview;

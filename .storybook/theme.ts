import { create } from 'storybook/theming/create';
import { color, font } from '../src/design-system/tokens.js';

// The Storybook UI itself is themed from the same token file as the app.
export const chiliconTheme = create({
  base: 'light',
  brandTitle: 'Chilicon Power · Design system',
  brandUrl: './',
  brandTarget: '_self',

  colorPrimary: color['brand-ink'].light,
  colorSecondary: color['brand-ink'].light,

  appBg: color.canvas.light,
  appContentBg: color.surface.light,
  appPreviewBg: color.surface.light,
  appBorderColor: color.line.light,
  appBorderRadius: 12,

  textColor: color.ink.light,
  textMutedColor: color.muted.light,
  barTextColor: color.muted.light,
  barSelectedColor: color['brand-ink'].light,
  barBg: color.surface.light,

  inputBg: color.surface.light,
  inputBorder: color.line.light,
  inputTextColor: color.ink.light,
  inputBorderRadius: 12,

  fontBase: font.family,
  fontCode: 'ui-monospace, Consolas, monospace',
});

/**
 * Chilicon Power design tokens — the single source of truth.
 * tailwind.config.js builds the utility classes from this file,
 * and the Storybook Foundations pages render it directly, so docs and code cannot drift.
 * Each token: value + what it is for.
 */

/**
 * Semantic colors, one value per theme. Names stay the same in both themes,
 * so components never branch on light or dark: the CSS variables flip.
 * Brand comes from the logo: sun orange #FBAB16 (brand, solar) and leaf green #00AA79 (ok).
 * Energy colors (solar, home, battery, grid) and status colors (ok, warn, fault) never swap meaning.
 * Dark theme is near-black and neutral (no blue cast), like iOS and Tesla: color comes only from energy and status.
 * `*-ink` are text versions: in light theme the fills sit below 4.5:1 on white, so text uses a darker step.
 */
export const color = {
  ink: { light: '#15181E', dark: '#F5F5F7', use: 'Primary text' },
  muted: { light: '#5E6573', dark: '#9A9AA1', use: 'Secondary text. AA on surface and canvas in both themes' },
  canvas: { light: '#F4F5F7', dark: '#050506', use: 'App background' },
  surface: { light: '#FFFFFF', dark: '#111113', use: 'Cards, sheets, tab bar' },
  raised: { light: '#EEF0F3', dark: '#1C1C1F', use: 'Controls on a card: segmented track, inputs, chips' },
  knob: { light: '#FFFFFF', dark: '#FFFFFF', use: 'Switch knob and segmented thumb: white in both themes, like iOS' },
  line: { light: '#DDE1E7', dark: '#26262A', use: 'Dividers, borders' },

  brand: { light: '#FBAB16', dark: '#FBAB16', use: 'Primary actions. The sun of the logo. Always with on-brand text, never grey' },
  'brand-deep': { light: '#EC9A06', dark: '#FFC04A', use: 'Primary action hover and pressed' },
  'on-brand': { light: '#15181E', dark: '#15181E', use: 'Text and icons on brand fills. 8:1 in both themes' },
  'brand-ink': { light: '#8F5A00', dark: '#FBAB16', use: 'Links and brand-colored text' },

  solar: { light: '#FBAB16', dark: '#FBAB16', use: 'Solar energy: flow, production bars. Same orange as the logo sun' },
  'solar-ink': { light: '#8F5A00', dark: '#FBAB16', use: 'Solar values as text' },
  home: { light: '#3B4A63', dark: '#C7D0DE', use: 'Home consumption' },
  battery: { light: '#1E7FC2', dark: '#4FA8E8', use: 'Battery. Blue, so it never reads as the green OK status' },
  'battery-ink': { light: '#176AA3', dark: '#4FA8E8', use: 'Battery values as text' },
  grid: { light: '#6B6FD6', dark: '#9A9DF0', use: 'Grid import and export' },
  'grid-ink': { light: '#4F53BD', dark: '#9A9DF0', use: 'Grid values as text' },

  ok: { light: '#00AA79', dark: '#1FC08F', use: 'Status OK. The leaf green of the logo. Fills and icons' },
  'ok-ink': { light: '#007A57', dark: '#1FC08F', use: 'OK text' },
  warn: { light: '#C27C0A', dark: '#E7A33A', use: 'Needs attention. Fills and icons' },
  'warn-ink': { light: '#8A5700', dark: '#E7A33A', use: 'Needs-attention text' },
  fault: { light: '#C8363B', dark: '#EF6A6E', use: 'Fault, offline. Fills, icons and text' },
  'fault-ink': { light: '#A82D32', dark: '#EF6A6E', use: 'Fault text on tinted fills' },

  // House illustration in the energy flow. Neutral, so the four energy colors are the only color in it
  'illo-wall': { light: '#FFFFFF', dark: '#1F2024', use: 'House: lit wall (faces right)' },
  'illo-wall-shade': { light: '#E2E6EC', dark: '#16171A', use: 'House: shaded wall (faces left)' },
  'illo-roof': { light: '#C4CBD5', dark: '#2A2C31', use: 'House: roof plane with panels' },
  'illo-roof-shade': { light: '#A7B0BD', dark: '#202226', use: 'House: roof edge and gable' },
  'illo-panel': { light: '#26344D', dark: '#0F1A2C', use: 'Solar panel glass' },
  'illo-panel-line': { light: '#51658A', dark: '#2E4468', use: 'Solar panel cell lines and frame' },
  'illo-window': { light: '#D3DAE3', dark: '#F1C27A', use: 'Windows. Warm and lit in dark theme' },
  'illo-ground': { light: '#DDE1E7', dark: '#0C0C0E', use: 'Ground shadow under the house' },

  scrim: { light: '#15181E', dark: '#000000', use: 'Backdrop behind sheets (used at 40%)' },
  desk: { light: '#E6E8EC', dark: '#000000', use: 'Desktop background around the phone frame. Not part of the app' },
};

/**
 * Sequential output scale for the roof map: 0 → peak output of a panel.
 * One hue (solar) from pale to full, so a weak pair reads as "lighter" without a legend lookup.
 * Faults and offline panels are not on this scale: they get the fault color and an icon.
 */
export const outputScale = {
  light: ['#FEF1D6', '#FDDC9C', '#FCC55E', '#FBAB16', '#D98E00'],
  dark: ['#2A2112', '#4D3A15', '#86611A', '#C48A17', '#FBAB16'],
  use: 'Roof map tiles by current output (W) or energy today (kWh). Five steps, low to high',
};

/** Physical phone bezel in the desktop frame. Same in both themes */
export const bezel = '#15181E';

export const themes = ['light', 'dark'];

/**
 * San Francisco, the iOS way: SF Pro Text up to 19 pt, SF Pro Display from 20 pt.
 * Referenced, never bundled (Apple's license forbids embedding): Apple devices and machines with SF installed get it,
 * everyone else gets the system UI font.
 */
export const font = {
  family: '"SF Pro Text", "SF Pro", -apple-system, BlinkMacSystemFont, system-ui, "Segoe UI", "Roboto", sans-serif',
  display: '"SF Pro Display", "SF Pro", -apple-system, BlinkMacSystemFont, system-ui, "Segoe UI", "Roboto", sans-serif',
  weights: { normal: 400, semibold: 600, bold: 700 },
};

/** iOS type scale: Apple sizes, line heights and tracking; weights are ours. Numbers are always tabular */
export const type = {
  hero: { size: 40, line: 44, tracking: '0.009em', weight: 700, display: true, use: 'Hero numbers on Home: kWh today, $ saved' },
  largeTitle: { size: 34, line: 41, tracking: '0.011em', weight: 700, display: true, use: 'Large titles on tab roots' },
  title2: { size: 22, line: 28, tracking: '-0.012em', weight: 700, display: true, use: 'Sheet titles, section totals' },
  headline: { size: 17, line: 22, tracking: '-0.025em', weight: 600, use: 'Card titles, buttons, row titles' },
  body: { size: 17, line: 22, tracking: '-0.025em', weight: 400, use: 'Body text, list rows' },
  subheadline: { size: 15, line: 20, tracking: '-0.015em', weight: 400, use: 'Secondary lines, descriptions' },
  footnote: { size: 13, line: 18, tracking: '-0.006em', weight: 400, use: 'Meta: "Updated 2 min ago", units under values' },
  caption: { size: 12, line: 16, tracking: '0', weight: 600, use: 'Chart axes, legends, tab labels' },
};

/** Radius by hierarchy — not one radius on everything */
export const radius = {
  sheet: { value: 16, use: 'Sheets (top corners)' },
  card: { value: 16, use: 'Cards, inset grouped lists' },
  control: { value: 12, use: 'Buttons, inputs' },
  segment: { value: 9, use: 'Segmented control and its thumb' },
  tile: { value: 6, use: 'Roof map panels, chart bar tops' },
  chip: { value: 999, use: 'Chips, badges, pills' },
};

/** 4 px grid. Screen padding 16. Touch targets at least 44 */
export const space = {
  grid: 4,
  screen: 16,
  touch: 44,
  steps: [4, 8, 12, 16, 20, 24, 32, 40, 48],
};

/**
 * Materials. Glass is reserved for system-level floating chrome (the tab bar), like iOS 26 Liquid Glass.
 * Never on cards or content: frosted cards everywhere read as AI slop.
 */
export const material = {
  glass: {
    blur: 24,
    saturate: 180,
    light: { alpha: 0.72, edge: 'rgba(255, 255, 255, 0.65)' },
    dark: { alpha: 0.62, edge: 'rgba(255, 255, 255, 0.09)' },
    use: 'Floating tab bar only: surface at partial opacity, backdrop blur and saturation, light inner edge',
  },
};

/** Elevation only on sheets, banners, the floating tab bar and the phone frame. Cards sit flat on canvas */
export const elevation = {
  floating: { value: '0 10px 30px rgba(21, 24, 30, 0.16), 0 1px 3px rgba(21, 24, 30, 0.10)', use: 'Floating tab bar' },
  sheet: { value: '0 -8px 32px rgba(21, 24, 30, 0.16)', use: 'Sheets' },
  banner: { value: '0 8px 24px rgba(21, 24, 30, 0.18)', use: 'Simulated notification banner, toasts' },
  thumb: { value: '0 1px 3px rgba(21, 24, 30, 0.14), 0 0 0 0.5px rgba(21, 24, 30, 0.06)', use: 'Segmented control thumb' },
};

export const motion = {
  'ease-out': { value: 'cubic-bezier(0.23, 1, 0.32, 1)', use: 'Entrances, press feedback' },
  'ease-drawer': { value: 'cubic-bezier(0.32, 0.72, 0, 1)', use: 'Sheets' },
  press: { value: '160ms', use: 'Button scale to 0.97 on press' },
  sheet: { value: '320ms in / 200ms out', use: 'Sheet slide' },
  thumb: { value: '240ms ease-out', use: 'Segmented thumb and tab capsule slide to the new option' },
  flow: { value: '1.6s linear, loop', use: 'Energy flow dots. The only looping motion in the app. Off with reduced motion' },
  skeleton: { value: '600ms', use: 'Loading skeleton before data appears' },
};

/** Units are sacred. Rendered on the Foundations page and enforced by lib/format */
export const units = [
  { rule: 'Power (right now) is kW, or W under 1 kW for a single panel', example: '4.2 kW · 318 W' },
  { rule: 'Energy (over time) is kWh. Never kW for a total', example: '38.6 kWh today' },
  { rule: 'Always "kW" and "kWh": lowercase k, capital W', example: 'not Kw, KW, kwh' },
  { rule: 'Time is 12-hour US, lowercase am/pm', example: '6:12 am' },
  { rule: 'Dates are short month + day', example: 'May 21' },
  { rule: 'Money is USD with cents for small amounts', example: '$11.40 · $1,240' },
];

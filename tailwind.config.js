import plugin from 'tailwindcss/plugin';
import { bezel, color, elevation, font, material, motion, outputScale, radius, type } from './src/design-system/tokens.js';

/** Utility classes are generated from src/design-system/tokens.js — no raw values here. */
const v = (group) => Object.fromEntries(Object.entries(group).map(([k, t]) => [k, t.value]));
const px = (n) => `${n}px`;
const c = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(' ');
const glass = (theme) => ({ '--glass-alpha': String(material.glass[theme].alpha), '--glass-edge': material.glass[theme].edge });
const vars = (theme) => ({
  ...glass(theme),
  ...Object.fromEntries(Object.entries(color).map(([k, t]) => [`--c-${k}`, rgb(t[theme])])),
  ...Object.fromEntries(outputScale[theme].map((hex, i) => [`--c-out-${i}`, rgb(hex)])),
});

// Every color is a CSS variable, so opacity modifiers (bg-ok/10) work and themes flip without touching components
const colors = Object.fromEntries(Object.keys(color).map((k) => [k, c(k)]));
const out = Object.fromEntries(outputScale.light.map((_, i) => [i, c(`out-${i}`)]));

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,mdx}', './.storybook/**/*.{ts,tsx}'],
  theme: {
    colors: { transparent: 'transparent', current: 'currentColor', ...colors, out },
    fontFamily: { sans: [font.family], display: [font.display] },
    fontSize: Object.fromEntries(
      Object.entries(type).map(([k, t]) => [k, [px(t.size), { lineHeight: px(t.line), letterSpacing: t.tracking, fontWeight: String(t.weight) }]]),
    ),
    fontWeight: Object.fromEntries(Object.entries(font.weights).map(([k, n]) => [k, String(n)])),
    borderRadius: {
      none: '0',
      ...Object.fromEntries(Object.entries(radius).map(([k, t]) => [k, px(t.value)])),
      phone: '52px',
    },
    extend: {
      screens: { phone: '480px' },
      boxShadow: { ...v(elevation), phone: `0 40px 80px rgba(21, 24, 30, 0.18), 0 0 0 10px ${bezel}` },
      spacing: { 13: '52px', 18: '72px', 22: '88px' },
      zIndex: { sticky: '20', tabbar: '30', sheet: '50', toast: '60' },
      transitionDuration: { thumb: '240ms' },
      transitionTimingFunction: { out: motion['ease-out'].value, drawer: motion['ease-drawer'].value },
    },
  },
  plugins: [
    // Sizes from 20 pt use SF Pro Display, like iOS
    plugin(({ addUtilities }) =>
      addUtilities(Object.fromEntries(Object.entries(type).filter(([, t]) => t.display).map(([k]) => [`.text-${k}`, { fontFamily: font.display }]))),
    ),
    // Theme variables: light by default, dark by system preference or data-theme="dark"
    plugin(({ addBase }) =>
      addBase({
        ':root': { ...vars('light'), colorScheme: 'light' },
        '[data-theme="light"]': { ...vars('light'), colorScheme: 'light' },
        '[data-theme="dark"]': { ...vars('dark'), colorScheme: 'dark' },
        '@media (prefers-color-scheme: dark)': { ':root:not([data-theme="light"])': { ...vars('dark'), colorScheme: 'dark' } },
      }),
    ),
  ],
};

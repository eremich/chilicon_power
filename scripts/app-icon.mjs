// Builds the app icon from the logo mark: SVG masters (light and dark) and the PNG sizes the web app needs.
// Run: node scripts/app-icon.mjs   Output: public/app-icon*.svg, public/apple-touch-icon.png, public/icon-*.png
// Copy public/app-icon*.svg to src/assets/brand/ after a change: the AppIcon component imports them from there.
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const root = new URL('../', import.meta.url);
const mark = readFileSync(new URL('src/assets/brand/logo-mark.svg', root), 'utf8');
const inner = mark.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

// Square master, no rounded corners: iOS and Android apply their own mask.
// The mark fills about 64% of the width, centred optically (the sun's rays sit higher than the leaf).
const SIZE = 1024;
const MARK_W = 134;
const MARK_H = 138;
const scale = 650 / MARK_W;
const x = (SIZE - MARK_W * scale) / 2;
const y = (SIZE - MARK_H * scale) / 2 + 8;

const icon = (bg) => `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>${bg.defs}</defs>
  <rect width="${SIZE}" height="${SIZE}" fill="${bg.fill}"/>
  <g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scale.toFixed(4)})">${inner}</g>
</svg>
`;

const LIGHT = {
  // White with a faint warm glow behind the sun, so it is not a flat sticker on a white home screen
  defs: '<radialGradient id="bg" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="#FFF7E8"/><stop offset="1" stop-color="#FFFFFF"/></radialGradient>',
  fill: 'url(#bg)',
};
const DARK = {
  // Near-black, the app's dark canvas, lifted slightly at the top like the iOS dark icon style
  defs: '<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1C1C1F"/><stop offset="1" stop-color="#050506"/></linearGradient>',
  fill: 'url(#bg)',
};

const out = (name) => new URL(`public/${name}`, root);
const svgLight = icon(LIGHT);
const svgDark = icon(DARK);
writeFileSync(out('app-icon.svg'), svgLight);
writeFileSync(out('app-icon-dark.svg'), svgDark);

const b = await chromium.launch();
const p = await b.newPage({ deviceScaleFactor: 1 });
for (const [file, px, svg] of [
  ['apple-touch-icon.png', 180, svgLight],
  ['icon-192.png', 192, svgLight],
  ['icon-512.png', 512, svgLight],
  ['icon-1024.png', 1024, svgLight],
  ['icon-1024-dark.png', 1024, svgDark],
]) {
  await p.setViewportSize({ width: px, height: px });
  await p.setContent(`<body style="margin:0">${svg.replace(`width="${SIZE}" height="${SIZE}"`, `width="${px}" height="${px}"`)}</body>`);
  await p.screenshot({ path: new URL(`public/${file}`, root).pathname.replace(/^\/([A-Z]:)/, '$1'), clip: { x: 0, y: 0, width: px, height: px } });
  console.log('✓', file);
}
await b.close();

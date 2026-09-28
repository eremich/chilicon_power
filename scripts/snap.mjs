// Dev helper: puts several Storybook stories or app screens side by side on one contact sheet for quick review.
// Usage: node scripts/snap.mjs out.png theme item [item ...]
//   item = a story id (Storybook on 6007) or an app path starting with "/" (Vite on 5174)
import { chromium } from 'playwright';

const [out, theme, ...items] = process.argv.slice(2);
const W = 390;
const H = 844;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: (W + 10) * items.length, height: H }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const src = (it) =>
  it.startsWith('/')
    ? `http://localhost:5174${it}${it.includes('?') ? '&' : '?'}theme=${theme}`
    : `http://localhost:6007/iframe.html?id=${it}&globals=theme:${theme}&viewMode=story`;
const frames = items.map((it) => `<iframe src="${src(it)}" style="width:${W}px;height:${H}px;border:0;margin-right:10px"></iframe>`).join('');
await page.setContent(`<body style="margin:0;display:flex;background:#888">${frames}</body>`);
await page.waitForTimeout(5000);
await page.screenshot({ path: out });
await browser.close();

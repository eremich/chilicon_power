// npm run shots — the 20 portfolio screenshots from the brief (§11) into shots/, and the same set in dark into shots/dark/.
// 390 × 844 at 3×, reduced motion. Starts its own Vite server, so there are no manual steps.
// Options: SHOTS_OUT=dir (default shots/), SHOTS_SCALE=2, SHOTS_EXTRA=1 adds case-study-only screens.
import { mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const PORT = 5199;
const OUT = process.env.SHOTS_OUT ? pathToFileURL(`${process.env.SHOTS_OUT}/`) : new URL('../shots/', import.meta.url);
mkdirSync(new URL('dark/', OUT), { recursive: true });
let theme = 'light';

const server = await createServer({ server: { port: PORT, strictPort: true }, logLevel: 'error' });
await server.listen();
const base = `http://localhost:${PORT}`;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: Number(process.env.SHOTS_SCALE ?? 3), reducedMotion: 'reduce' });
const page = await context.newPage();

const open = async (path, forceTheme) => {
  await page.goto(`${base}${path}${path.includes('?') ? '&' : '?'}theme=${forceTheme ?? theme}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800); // loading skeletons are 600 ms
};
const btn = (name) => page.getByRole('button', { name }).first();
/** Move inside the app without a reload, so store state set by a script survives */
const go = async (path) => {
  await page.evaluate((to) => {
    window.history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, path);
  await page.waitForTimeout(400);
};
/** State the owner reaches by sending the report, set directly */
const ownerReported = async () =>
  page.evaluate(() => {
    const st = window.__store.getState();
    st.reportIssue();
    st.setRole('installer');
    st.showBanner(null);
    ['sites', 'alerts', 'site-maya'].forEach(st.markLoaded);
  });
const shot = async (name) => {
  await page.waitForTimeout(300);
  const dir = theme === 'dark' ? new URL('dark/', OUT) : OUT;
  await page.locator('#phone').screenshot({ path: fileURLToPath(new URL(name, dir)) });
  console.log('  ✓', theme, name);
};

const steps = [
  ['01-welcome.png', () => open('/start')],
  ['02-scan-qr.png', () => open('/setup/scan')],
  [
    '03-manual-code.png',
    async () => {
      await open('/setup/manual');
      await page.getByLabel('Gateway ID').fill('GW-7F3A21');
      await page.getByLabel('Authentication code').focus();
    },
  ],
  [
    '04-connecting-offline.png',
    async () => {
      await open('/setup/connecting?result=offline');
      await page.getByText('We can’t reach your gateway').waitFor();
    },
  ],
  ['05-home-ok.png', () => open('/o?scenario=default')],
  ['06-home-ok-dark.png', () => open('/o?scenario=default', 'dark')],
  ['07-home-issue.png', () => open('/o?scenario=issue')],
  ['08-home-night.png', () => open('/o?scenario=night')],
  ['09-energy-day.png', () => open('/o/energy?scenario=default')],
  [
    '10-energy-month.png',
    async () => {
      await open('/o/energy?scenario=default');
      await page.getByRole('tab', { name: 'Month' }).click();
    },
  ],
  [
    '11-energy-bar-sheet.png',
    async () => {
      await open('/o/energy?scenario=default');
      await page.getByRole('button', { name: /^12 pm: produced/ }).click();
      await page.waitForTimeout(400);
    },
  ],
  ['12-panels-roof.png', () => open('/o/panels?scenario=issue')],
  ['13-panel-detail-cause.png', () => open('/o/panels/4?scenario=issue')],
  [
    '14-contact-installer.png',
    async () => {
      await open('/o/panels/4?scenario=issue');
      await btn('Contact installer').click();
      await page.waitForTimeout(400);
    },
  ],
  ['15-profile.png', () => open('/o/profile?scenario=default')],
  ['16-installer-sites.png', () => open('/i?scenario=issue&role=installer')],
  [
    '17-installer-alerts.png',
    async () => {
      await open('/o?scenario=issue');
      await ownerReported();
      await go('/i/alerts');
    },
  ],
  [
    '18-installer-technical.png',
    async () => {
      await open('/o?scenario=issue');
      await ownerReported();
      await go('/i/sites/maya?tab=technical');
    },
  ],
  [
    '19-installer-restart.png',
    async () => {
      await open('/o?scenario=issue');
      await ownerReported();
      await go('/i/sites/maya/devices/4');
      await btn('Restart device').click();
      await btn('Restart now').click();
      await page.waitForTimeout(1400);
    },
  ],
  ['20-home-resolved.png', () => open('/o?scenario=resolved')],
];

// Extra screens for the portfolio case study, beyond the brief's 20
if (process.env.SHOTS_EXTRA)
  steps.push(
    ['21-signup.png', async () => {
      await open('/start/signup');
      await page.getByLabel('Full name').fill('Maya Chen');
      await page.getByLabel('Email').fill('maya.chen@example.com');
      await page.getByRole('textbox', { name: 'Password' }).fill('sunnyroof');
    }],
    ['22-who-are-you.png', () => open('/start/role')],
    ['23-home-cloudy.png', () => open('/o?scenario=cloudy')],
    ['24-home-offline.png', () => open('/o?scenario=offline')],
    ['25-home-first-data.png', async () => {
      await open('/o?scenario=first-data');
    }],
    ['26-energy-no-tariff.png', () => open('/o/energy?scenario=no-tariff')],
    ['27-installer-site-overview.png', () => open('/i/sites/maya?scenario=issue&role=installer')],
    ['28-installer-add-layout.png', () => open('/i/add/layout?role=installer')],
    ['29-installer-offline-device.png', () => open('/i/sites/okafor/devices/1?role=installer')],
    ['30-invite.png', () => open('/setup/invite')],
  );

let failed = 0;
for (theme of ['light', 'dark'])
  for (const [name, run] of steps) {
    if (theme === 'dark' && name.includes('-dark')) continue;
    try {
      await run();
      await shot(name);
    } catch (e) {
      failed++;
      console.error('  ✗', theme, name, e.message.split('\n')[0]);
    }
  }

await browser.close();
await server.close();
console.log(failed ? `${failed} screenshot(s) failed` : 'All screenshots saved to shots/ (brief set) and shots/dark/');
process.exit(failed ? 1 : 0);

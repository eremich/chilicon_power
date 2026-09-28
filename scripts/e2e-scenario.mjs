// Brief §5.4 end to end, by clicking: owner reports panel 7 → installer gets it in Alerts → Technical → restart
// → back online → resolve with a note → owner sees "All 24 panels producing". Needs the app on 5174.
import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:5174';
const b = await chromium.launch();
// Desktop width so the role switcher next to the phone is visible
const p = await b.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 200)));
const phone = p.locator('#phone');
const btn = (n) => phone.getByRole('button', { name: n }).first();
const ok = (label, v) => console.log(v ? '✓' : '✗', label);
const status = async () => (await phone.locator('main').innerText()).split('\n').slice(0, 5).join(' | ');

await p.goto(`${BASE}/o?scenario=issue&theme=light`);
await p.waitForTimeout(900);
ok(`owner sees the issue: ${await status()}`, (await status()).includes('Panel 7 is producing 40% less'));
await btn(/Panel 7 is producing/).click();
ok('cause: microinverter not reporting', await phone.getByText('Microinverter not reporting').isVisible());
await btn('Contact installer').click();
await btn('Send report').click();
ok('report sent', await phone.getByText(/Reported to Sunline Solar/).isVisible());

await p.getByRole('button', { name: /Installer · Marco Ruiz/ }).click();
ok('installer gets a push', await phone.getByText('Maya Chen reported panel 7').isVisible());
await btn(/Alerts$/).click();
await phone.getByText('Reported by owner').waitFor({ timeout: 3000 }).catch(() => {});
ok('alert tagged "Reported by owner"', await phone.getByText('Reported by owner').isVisible());
await btn(/Panel 7 producing 40% less/).click();
await phone.getByRole('tab', { name: 'Technical' }).click();
await phone.getByRole('button', { name: /C130085D/ }).first().waitFor({ timeout: 3000 });
await btn(/C130085D/).click();
await btn('Restart device').click();
await btn('Restart now').click();
ok('restarting', await phone.getByText(/Restarting C130085D/).first().isVisible());
await p.waitForTimeout(3600);
ok('back online', await phone.getByText('C130085D is back online').isVisible());
await btn('Resolve issue').click();
await btn('Resolve and notify owner').click();
await p.waitForTimeout(300);
ok('site is OK for the installer', await phone.getByText('All 24 panels producing').isVisible());

await p.getByRole('button', { name: /Homeowner · Maya Chen/ }).click();
ok('owner gets a push', await phone.getByText(/Sunline Solar fixed panel 7/).isVisible());
ok(`owner status: ${await status()}`, (await status()).includes('All 24 panels producing'));
await btn(/^Panels$/).click();
ok('history has the fix', await phone.getByText(/May 21 · Restarted microinverter C130085D/).isVisible());

console.log(errs.length ? `✗ console errors: ${errs.join(' / ')}` : '✓ no console errors');
await b.close();
process.exit(errs.length ? 1 : 0);

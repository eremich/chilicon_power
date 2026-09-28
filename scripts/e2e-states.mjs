// Every scenario from the brief on every main screen: reads the page text and checks units, broken values,
// scenario logic and console errors. Also checks ?role=&scenario=&theme= deep links. Needs the app on 5174.
import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:5174';
const SCENARIOS = ['default', 'issue', 'offline', 'night', 'cloudy', 'no-battery', 'no-tariff', 'first-data', 'empty-installer', 'resolved'];
const OWNER = ['/o', '/o/energy', '/o/panels', '/o/panels/4', '/o/profile'];
const INSTALLER = ['/i', '/i/alerts', '/i/sites/maya?tab=technical', '/i/sites/okafor', '/i/sites/maya/devices/4', '/i/profile'];

// Units are sacred: wrong capitalisation, broken numbers, negative zero
const BAD = [/\bKw\b/, /\bKW\b/, /\bkwh\b/, /\bKWh\b/, /NaN/, /undefined/, /Infinity/, /\bnull\b/, /[-−]0\.0\b/, /\$-/];

/** What must (or must not) be on a screen for a scenario */
const RULES = {
  '/o': {
    default: { has: ['All 24 panels producing', 'Exporting', 'Saved today', 'Charging'] },
    issue: { has: ['Panel 7 is producing 40% less'] },
    offline: { has: ['Gateway offline since 9:14 am', 'No data'] },
    night: { has: ['Night. Panels start around 6:12 am', 'Running on battery'] },
    cloudy: { has: ['Cloudy day'], not: ['Needs attention'] },
    'no-battery': { not: ['Battery'] },
    'no-tariff': { has: ['Add your electricity rate to see savings'], not: ['Saved today'] },
    'first-data': { has: ['Waiting for first data'] },
    resolved: { has: ['All 24 panels producing'] },
  },
  '/o/energy': { 'no-tariff': { has: ['Add your electricity rate'] }, default: { has: ['Saved'] } },
  '/o/panels': { resolved: { has: ['restarted remotely by Sunline Solar'] }, offline: { has: ['No microinverters reporting'] } },
  '/i': { 'empty-installer': { has: ['No sites yet'] }, default: { has: ['Daniel Okafor', 'Issues'] } },
  '/i/alerts': { issue: { has: ['Panel 7 producing 40% less'] }, resolved: { has: ['Router replaced'] }, 'empty-installer': { has: ['All clear'] } },
};

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
let errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 160)));

const problems = [];
let checks = 0;
for (const scenario of SCENARIOS) {
  const paths = scenario === 'empty-installer' ? INSTALLER.slice(0, 2) : [...OWNER, ...INSTALLER];
  for (const path of paths) {
    errs = [];
    const role = path.startsWith('/i') ? 'installer' : 'owner';
    await p.goto(`${BASE}${path}${path.includes('?') ? '&' : '?'}scenario=${scenario}&role=${role}&theme=light`);
    await p.waitForTimeout(800);
    const text = await p.locator('#phone').innerText();
    const where = `${scenario} ${path}`;
    for (const re of BAD) if (re.test(text)) problems.push(`${where}: bad text ${re} → “${text.match(re)[0]}”`);
    const rule = RULES[path.split('?')[0]]?.[scenario];
    for (const s of rule?.has ?? []) if (!text.includes(s)) problems.push(`${where}: missing “${s}”`);
    for (const s of rule?.not ?? []) if (text.includes(s)) problems.push(`${where}: should not show “${s}”`);
    if (errs.length) problems.push(`${where}: console ${errs[0]}`);
    checks++;
  }
}

// Deep links
await p.goto(`${BASE}/?role=installer&scenario=issue&theme=dark`);
await p.waitForTimeout(600);
const theme = await p.evaluate(() => document.documentElement.dataset.theme);
if (!new URL(p.url()).pathname.startsWith('/i')) problems.push(`deep link: role=installer landed on ${new URL(p.url()).pathname}`);
if (theme !== 'dark') problems.push(`deep link: theme=dark gave ${theme}`);
checks++;

await b.close();
console.log(`${checks} screen checks, ${problems.length} problems`);
problems.forEach((x) => console.log('✗', x));
process.exit(problems.length ? 1 : 0);

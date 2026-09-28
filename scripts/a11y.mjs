// WCAG 2.1 AA check with axe-core on the key screens, light and dark. Needs the app on 5174.
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:5174';
const AXE = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const SCREENS = [
  '/start',
  '/start/signup',
  '/setup/scan',
  '/setup/manual',
  '/o?scenario=default',
  '/o?scenario=issue',
  '/o/energy?scenario=default',
  '/o/panels?scenario=issue',
  '/o/panels/4?scenario=issue',
  '/o/profile?scenario=default',
  '/i?scenario=issue&role=installer',
  '/i/alerts?scenario=issue&role=installer',
  '/i/sites/maya?scenario=issue&role=installer&tab=technical',
  '/i/sites/maya/devices/4?scenario=issue&role=installer',
];

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const found = new Map();
for (const theme of ['light', 'dark'])
  for (const path of SCREENS) {
    await p.goto(`${BASE}${path}${path.includes('?') ? '&' : '?'}theme=${theme}`);
    await p.waitForTimeout(900);
    await p.addScriptTag({ content: AXE });
    const res = await p.evaluate(async () => {
      // eslint-disable-next-line no-undef
      const r = await axe.run('#phone', { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } });
      return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 3).map((n) => `${n.target.join(' ')} ${n.failureSummary?.split('\n')[1] ?? ''}`.slice(0, 180)) }));
    });
    for (const v of res) {
      const key = `${v.id}`;
      if (!found.has(key)) found.set(key, { ...v, where: [] });
      found.get(key).where.push(`${theme} ${path}`);
    }
  }
await b.close();
console.log(`${SCREENS.length * 2} screens checked, ${found.size} rule(s) violated`);
for (const v of found.values()) {
  console.log(`\n✗ [${v.impact}] ${v.id}: ${v.help}\n  on ${v.where.length}: ${v.where.slice(0, 4).join(', ')}`);
  v.nodes.forEach((n) => console.log('   ·', n));
}
process.exit(found.size ? 1 : 0);

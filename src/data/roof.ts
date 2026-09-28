import type { PanelInfo, PanelState } from '../components/PanelPairTile';
import { W } from '../lib/format';

/** Home, Sacramento: 24 panels, 3 rows of 4 pairs = 12 microinverters. Deterministic spread per panel. */
export const PAIRS_PER_ROW = 4;
export const PANEL_PEAK_W = 340;
const SPREAD = [0.97, 0.95, 0.99, 1, 0.96, 0.98, 0.97, 0.99, 0.94, 0.96, 1, 0.98, 0.93, 0.95, 0.97, 0.96, 0.92, 0.94, 0.95, 0.97, 0.9, 0.93, 0.94, 0.92];

export type RoofCase = 'normal' | 'issue' | 'device-offline' | 'gateway-offline' | 'night';

/** Panels for the roof map. `share` = system output right now as a share of peak (0..1) */
export const roofPanels = (roof: RoofCase, share = 0.78, count = 24): (PanelInfo & { value: string; watts: number })[] =>
  Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    let state: PanelState = 'ok';
    let f = SPREAD[i % SPREAD.length];
    if (roof === 'issue' && n === 7) (state = 'low'), (f *= 0.6);
    if (roof === 'device-offline' && (n === 7 || n === 8)) state = 'offline';
    if (roof === 'gateway-offline') state = 'offline';
    if (roof === 'night') f = 0;
    const watts = state === 'offline' ? 0 : PANEL_PEAK_W * share * f;
    return { n, state, level: watts / PANEL_PEAK_W, watts, value: W(watts) };
  });

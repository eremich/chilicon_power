import { PanelPairTile, type PanelInfo } from './PanelPairTile';

export interface RoofMapProps {
  /** Panels in reading order; consecutive panels form a pair (1–2, 3–4, …) */
  panels: (PanelInfo & { value: string })[];
  /** Panel pairs per row, matching the real roof layout */
  pairsPerRow: number;
  selectedPair?: number;
  onSelectPair?: (pair: number) => void;
  /** Legend ends: "0 W" and "340 W", or "0 kWh" and "2.1 kWh" */
  legend: [string, string];
}

const STEPS = ['bg-out-0', 'bg-out-1', 'bg-out-2', 'bg-out-3', 'bg-out-4'];

/**
 * The roof as a health view: panels colored on one sequential scale by output, pairs outlined because one
 * microinverter serves two panels. A weak panel reads as a lighter tile with a warning mark, without a chart.
 */
export const RoofMap = ({ panels, pairsPerRow, selectedPair, onSelectPair, legend }: RoofMapProps) => {
  const pairs = Array.from({ length: Math.ceil(panels.length / 2) }, (_, i) => [panels[i * 2], panels[i * 2 + 1]] as const);
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${pairsPerRow}, minmax(0, 1fr))` }}>
        {pairs.map(([a, b], i) => (
          <PanelPairTile
            key={i}
            panels={[a, b]}
            selected={selectedPair === i + 1}
            onClick={onSelectPair && (() => onSelectPair(i + 1))}
            label={`Panels ${a.n} and ${b.n}: ${a.state === 'offline' ? 'no data' : a.value} and ${b.state === 'offline' ? 'no data' : b.value}${a.state === 'low' || b.state === 'low' ? ', needs attention' : ''}${a.state === 'offline' ? ', not reporting' : ''}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 text-footnote text-muted" aria-hidden>
        <span className="tnum">{legend[0]}</span>
        <span className="flex h-2 flex-1 overflow-hidden rounded-chip">
          {STEPS.map((s) => (
            <span key={s} className={`flex-1 ${s}`} />
          ))}
        </span>
        <span className="tnum">{legend[1]}</span>
      </div>
    </div>
  );
};

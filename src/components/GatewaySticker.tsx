import { cx } from '../lib/cx';

export interface GatewayStickerProps {
  /** Which line to point at while that field is focused */
  highlight?: 'id' | 'code';
}

/** "Where to find it" help: the sticker under the gateway, with the field being typed highlighted. */
export const GatewaySticker = ({ highlight }: GatewayStickerProps) => {
  const row = (key: 'id' | 'code', label: string, value: string) => (
    <div className={cx('flex items-baseline justify-between gap-3 rounded-[6px] px-2 py-1 transition-colors duration-150', highlight === key ? 'bg-brand/20 ring-2 ring-brand' : undefined)}>
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</span>
      <span className="font-mono text-subheadline font-semibold text-ink">{value}</span>
    </div>
  );
  return (
    <figure className="m-0 flex items-center gap-4 rounded-card bg-surface p-4">
      <div aria-hidden className="flex size-16 shrink-0 items-center justify-center rounded-[8px] bg-raised">
        <div className="grid size-12 grid-cols-5 gap-px">
          {Array.from({ length: 25 }, (_, i) => (
            <span key={i} className={(i * 7) % 3 === 0 || [0, 4, 20].includes(i) ? 'bg-ink' : undefined} />
          ))}
        </div>
      </div>
      <figcaption className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-footnote text-muted">On the sticker under the gateway</span>
        {row('id', 'Gateway ID', 'GW-7F3A21')}
        {row('code', 'Auth code', '4827 1936')}
      </figcaption>
    </figure>
  );
};

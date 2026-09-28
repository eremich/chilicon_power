import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History } from 'lucide-react';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Segmented } from '../../components/Segmented';
import { Card } from '../../components/Card';
import { RoofMap } from '../../components/RoofMap';
import { StatusCard } from '../../components/StatusCard';
import { ListGroup, ListRow } from '../../components/ListRow';
import { Skeleton } from '../../components/Skeleton';
import { PANEL_PEAK_W, roofPanels } from '../../data/roof';
import { useStore } from '../../store/useStore';
import { useFirstLoad, useLive, useSystem } from '../../app/hooks';
import { kWh, W } from '../../lib/format';

/** Best-case energy of one panel on a clear May day, for the Today scale */
const PANEL_DAY_KWH = 1.75;

export const Panels = () => {
  const navigate = useNavigate();
  const loading = useFirstLoad('panels');
  const system = useSystem();
  const l = useLive();
  const issue = useStore((s) => s.issue);
  const history = useStore((s) => s.history);
  const [mode, setMode] = useState<'now' | 'today'>('now');

  const now = roofPanels(l.roof, l.share, system.panels);
  const dayShare = (l.today.produced / system.scale / 24) / PANEL_DAY_KWH;
  const panels =
    mode === 'now'
      ? now
      : roofPanels(l.roof === 'night' ? 'normal' : l.roof, 1, system.panels).map((p) => {
          const e = p.state === 'offline' ? 0 : (p.watts / PANEL_PEAK_W) * PANEL_DAY_KWH * Math.min(1, dayShare);
          return { ...p, level: e / PANEL_DAY_KWH, value: kWh(e) };
        });
  const reporting = system.panels / 2 - (l.roof === 'gateway-offline' ? system.panels / 2 : 0);

  return (
    <div className="screen-enter flex flex-col pb-6">
      <ScreenHeader title="Panels" large subtitle={`${system.panels} panels · ${system.panels / 2} microinverters`} />
      <div className="flex flex-col gap-3 px-4">
        {l.tone === 'warn' && system.id === 'home' && <StatusCard tone="warn" title={l.status} detail="Tap to see the likely cause" onClick={() => navigate(`/o/panels/${issue.pair}`)} />}
        {l.offline && <StatusCard tone="offline" title={l.status} detail="The map shows the last known state" />}
        <Segmented label="Roof map shows" value={mode} onChange={setMode} options={[{ key: 'now', label: 'Output now' }, { key: 'today', label: 'Energy today' }]} />
        {loading ? (
          <Skeleton className="h-60 rounded-card" />
        ) : (
          <Card>
            <RoofMap
              panels={panels}
              pairsPerRow={system.pairsPerRow}
              onSelectPair={(p) => navigate(`/o/panels/${p}`)}
              legend={mode === 'now' ? ['0 W', W(PANEL_PEAK_W)] : ['0 kWh', kWh(PANEL_DAY_KWH)]}
            />
            <p className="tnum mt-3 text-footnote text-muted">
              {l.offline ? 'No microinverters reporting' : `${reporting} of ${system.panels / 2} microinverters reporting`} · Tap a pair for details
            </p>
          </Card>
        )}
        <ListGroup header="Issue history">
          {history.map((h) => (
            <ListRow key={h.title + h.date} leading={<History aria-hidden className="size-[22px]" strokeWidth={1.75} />} title={h.title} subtitle={`${h.date} · ${h.note}`} />
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

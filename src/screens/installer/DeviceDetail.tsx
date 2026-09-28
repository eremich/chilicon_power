import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarClock, RotateCw } from 'lucide-react';
import { ScreenHeader } from '../../components/ScreenHeader';
import { StatusCard } from '../../components/StatusCard';
import { Card } from '../../components/Card';
import { PowerCurve } from '../../components/PowerCurve';
import { ValueList } from '../../components/ValueList';
import { Button } from '../../components/Button';
import { Sheet } from '../../components/Sheet';
import { ActionProgress } from '../../components/ActionProgress';
import { FIRMWARE, MAYA_SITE } from '../../data/fleet';
import { samples, solarKw, NOW_MIN } from '../../data/solar';
import { useStore, RESTART_MS } from '../../store/useStore';
import { W } from '../../lib/format';
import { ResolveSheet, VisitSheet, useDevices, useSite } from './shared';

export const DeviceDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const site = useSite(params.id);
  const pair = Number(params.pair);
  const issue = useStore((s) => s.issue);
  const restartDevice = useStore((s) => s.restartDevice);
  const wasRestarted = useStore((s) => (site ? (s.restarted[site.id] ?? []).includes(pair) : false));
  const toast = useStore((s) => s.toast);
  const [sheet, setSheet] = useState<'restart' | 'visit' | 'resolve' | null>(null);
  const devices = useDevices(site);
  const d = devices.find((x) => x.pair === pair);
  if (!site || !d) return null;

  const offline = site.problem?.tone === 'offline';
  const mayaIssue = site.id === MAYA_SITE && pair === issue.pair && ['open', 'reported', 'visit'].includes(issue.status);
  const perPanel = (m: number) => (solarKw(m) * (site.sizeKw / 8.8) * 1000) / site.panels;
  const cut = offline ? 9 * 60 + 14 : NOW_MIN;
  const neighbors = samples((m) => perPanel(m) * 2, cut).map((s) => s.kw);
  const factor = d.state === 'low' ? (site.id === MAYA_SITE ? 0.8 : 0.85) : 0.98;
  const mine = samples((m) => perPanel(m) * 2 * factor, cut).map((s) => s.kw);

  const statusTone = d.restarting ? 'pending' : d.state === 'offline' ? 'offline' : d.state === 'low' ? 'warn' : 'ok';
  const statusTitle = d.restarting ? 'Restarting' : offline ? 'No data: the gateway is offline' : d.state === 'low' ? (site.id === MAYA_SITE ? 'Dropping out several times today' : 'Producing 15% less than neighbors') : 'Producing normally';

  return (
    <div className="screen-enter flex flex-col pb-8">
      <ScreenHeader title={d.id} onBack={() => navigate(`/i/sites/${site.id}`)} backLabel={site.customer.split(' ')[0]} />
      <div className="flex flex-col gap-3 px-4">
        <StatusCard tone={statusTone} title={statusTitle} detail={`Panels ${d.panels[0]}–${d.panels[1]} · ${site.customer}`} />
        {(d.restarting || wasRestarted) && <ActionProgress label={`Restarting ${d.id}`} doneLabel={`${d.id} is back online`} running={d.restarting} durationMs={RESTART_MS} />}

        <Card title="Today vs neighbors">
          <PowerCurve
            unit="W"
            ariaLabel={`Output of ${d.id} compared with the average microinverter on this roof`}
            series={[
              { values: neighbors, tone: 'muted', kind: 'dashed', label: 'Average of this roof' },
              { values: mine, tone: 'solar', kind: 'area', label: d.id },
            ]}
          />
        </Card>

        <Card title="Device">
          <ValueList
            rows={[
              { label: 'Output now', value: d.state === 'offline' ? '—' : W(d.watts), tone: 'solar' },
              { label: 'Panels', value: `${d.panels[0]} and ${d.panels[1]}` },
              { label: 'Firmware', value: d.firmware === FIRMWARE ? d.firmware : `${d.firmware} · update available` },
              { label: 'Last seen', value: d.lastSeen },
              { label: 'Status', value: d.restarting ? 'Restarting' : d.state === 'offline' ? 'No data' : d.state === 'low' ? 'Needs attention' : 'Producing', tone: d.state === 'offline' ? 'fault' : d.state === 'low' ? 'warn' : 'ok' },
            ]}
          />
        </Card>

        <div className="mt-1 flex flex-col gap-2">
          {offline ? (
            <>
              <p className="px-1 text-footnote text-muted">Remote restart needs the gateway online. Ask the owner to check its power and Wi-Fi, or visit the site.</p>
              <Button block icon={<CalendarClock aria-hidden className="size-5" />} onClick={() => setSheet('visit')}>
                Schedule visit
              </Button>
            </>
          ) : (
            <>
              <Button block variant={d.state === 'ok' ? 'secondary' : 'primary'} disabled={d.restarting} icon={<RotateCw aria-hidden className="size-5" />} onClick={() => setSheet('restart')}>
                Restart device
              </Button>
              {mayaIssue && wasRestarted && !d.restarting && (
                <Button block variant="secondary" onClick={() => setSheet('resolve')}>
                  Resolve issue
                </Button>
              )}
              {d.state !== 'ok' && (
                <Button block variant="plain" onClick={() => setSheet('visit')}>
                  Schedule visit instead
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <Sheet
        open={sheet === 'restart'}
        onClose={() => setSheet(null)}
        title={`Restart ${d.id}?`}
        description={`Panels ${d.panels[0]}–${d.panels[1]} stop producing for about a minute. The owner is not notified.`}
        footer={
          <Button
            block
            icon={<RotateCw aria-hidden className="size-5" />}
            onClick={() => {
              restartDevice(site.id, pair);
              setSheet(null);
            }}
          >
            Restart now
          </Button>
        }
      >
        <p className="text-subheadline text-muted">Restarting clears most “not reporting” faults. If it drops out again after the restart, schedule a visit.</p>
      </Sheet>
      <VisitSheet site={site} open={sheet === 'visit'} onClose={() => setSheet(null)} />
      <ResolveSheet
        open={sheet === 'resolve'}
        onClose={() => setSheet(null)}
        deviceId={d.id}
        onDone={() => {
          toast('Resolved. Maya was notified');
          navigate(`/i/sites/${site.id}`);
        }}
      />
    </div>
  );
};

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import { ScreenHeader } from '../../components/ScreenHeader';
import { StatusCard } from '../../components/StatusCard';
import { CauseCard } from '../../components/CauseCard';
import { Card } from '../../components/Card';
import { PowerCurve } from '../../components/PowerCurve';
import { ValueList } from '../../components/ValueList';
import { Button } from '../../components/Button';
import { Sheet } from '../../components/Sheet';
import { INSTALLER_CO, deviceId } from '../../data/systems';
import { roofPanels } from '../../data/roof';
import { samples, solarKw } from '../../data/solar';
import { useStore } from '../../store/useStore';
import { FindInstallerSheet } from './FindInstallerSheet';
import { useLive, useSystem } from '../../app/hooks';
import { clock, W } from '../../lib/format';

export const PanelDetail = () => {
  const navigate = useNavigate();
  const pair = Number(useParams().pair);
  const system = useSystem();
  const l = useLive();
  const issue = useStore((s) => s.issue);
  const reportIssue = useStore((s) => s.reportIssue);
  const remindLater = useStore((s) => s.remindLater);
  const toast = useStore((s) => s.toast);
  const [reporting, setReporting] = useState(false);
  const [finding, setFinding] = useState(false);
  const installerLinked = useStore((s) => s.installerLinked);

  const a = pair * 2 - 1;
  const b = pair * 2;
  const panels = roofPanels(l.roof, l.share, system.panels);
  const [pa, pb] = [panels[a - 1], panels[b - 1]];
  const hasIssue = system.id === 'home' && pair === issue.pair && ['open', 'reported', 'visit'].includes(issue.status);
  const weak = hasIssue ? issue.panel : undefined;
  const id = deviceId(system, pair);
  const perPanel = (m: number) => (solarKw(m, l.weather) * system.scale * 1000) / system.panels;
  const cut = l.offline ? 9 * 60 + 14 : l.now;
  const neighbors = samples(perPanel, cut).map((s) => s.kw);
  const mine = samples((m) => perPanel(m) * (weak ? 0.6 : 0.98), cut).map((s) => s.kw);

  const tone = l.offline ? 'offline' : hasIssue ? 'warn' : l.night ? 'night' : 'ok';
  const title = l.offline ? 'No data. The gateway is offline' : hasIssue ? `Panel ${weak} is producing 40% less` : l.night ? 'Resting until sunrise' : 'Both panels producing normally';
  const detail = hasIssue
    ? issue.status === 'reported'
      ? `Reported to ${INSTALLER_CO.company} at ${issue.reportedAt}. They usually reply within a day.`
      : issue.status === 'visit'
        ? `${INSTALLER_CO.company} will visit on May 23, 9–11 am`
        : `Since ${issue.since}, compared with neighbors`
    : `Microinverter ${id}`;

  const send = () => {
    reportIssue();
    setReporting(false);
    toast(`Report sent to ${INSTALLER_CO.company}`);
  };

  return (
    <div className="screen-enter flex flex-col pb-8">
      <ScreenHeader title={`Panels ${a}–${b}`} onBack={() => navigate('/o/panels')} backLabel="Panels" />
      <div className="flex flex-col gap-3 px-4">
        <StatusCard tone={tone} title={title} detail={detail} />

        {hasIssue && issue.status === 'open' && (
          <CauseCard
            cause={issue.cause}
            reason={`The microinverter behind panels ${a} and ${b} stopped reporting several times today. Its neighbors are fine, so this is the device, not the weather or shade.`}
            actions={
              <>
                {installerLinked ? (
                  <Button block onClick={() => setReporting(true)}>
                    Contact installer
                  </Button>
                ) : (
                  <Button block onClick={() => setFinding(true)}>
                    Find an installer nearby
                  </Button>
                )}
                <Button
                  block
                  variant="plain"
                  onClick={() => {
                    remindLater();
                    toast('We’ll remind you on May 24');
                  }}
                >
                  {issue.remindIn ? 'Reminder set for May 24' : 'Remind me in 3 days'}
                </Button>
              </>
            }
          />
        )}

        <Card title="Today vs neighbors">
          <PowerCurve
            unit="W"
            ariaLabel={weak ? `Panel ${weak} made about 40% less than the average of its neighbors today` : 'This pair tracks the average of its neighbors'}
            series={[
              { values: neighbors, tone: 'muted', kind: 'dashed', label: 'Neighbors average' },
              { values: mine, tone: 'solar', kind: 'area', label: weak ? `Panel ${weak}` : `Panels ${a}–${b}` },
            ]}
          />
        </Card>

        <Card title="Microinverter">
          <ValueList
            rows={[
              { label: 'Device ID', value: <span className="font-mono">{id}</span> },
              { label: `Panel ${a} now`, value: pa.state === 'offline' ? '—' : W(pa.watts), tone: 'solar' },
              { label: `Panel ${b} now`, value: pb.state === 'offline' ? '—' : W(pb.watts), tone: 'solar' },
              { label: 'Firmware', value: '2.4.1' },
              { label: 'Last seen', value: l.offline ? clock(9 * 60 + 14) : hasIssue ? '11:40 am' : '1 min ago' },
              { label: 'Status', value: l.offline ? 'No data' : hasIssue ? 'Dropping out' : 'Producing', tone: l.offline ? 'fault' : hasIssue ? 'warn' : 'ok' },
            ]}
          />
        </Card>
      </div>

      <FindInstallerSheet open={finding} onClose={() => setFinding(false)} />
      <Sheet
        open={reporting}
        onClose={() => setReporting(false)}
        detent="large"
        title={`Report to ${INSTALLER_CO.company}`}
        description={`${INSTALLER_CO.name} will see this with full technical detail`}
        footer={
          <Button block icon={<Send aria-hidden className="size-5" />} onClick={send}>
            Send report
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <ValueList
            rows={[
              { label: 'System', value: `${system.name}, ${system.city}` },
              { label: 'Panel', value: `${weak} (pair ${a}–${b})` },
              { label: 'Microinverter', value: <span className="font-mono">{id}</span> },
              { label: 'Since', value: `${issue.since}, 2026` },
              { label: 'Likely cause', value: 'Not reporting' },
            ]}
          />
          <div className="rounded-card bg-canvas p-3">
            <p className="mb-2 text-footnote font-semibold text-muted">Chart attached</p>
            <PowerCurve unit="W" height={120} ariaLabel="Chart snapshot" series={[{ values: neighbors, tone: 'muted', kind: 'dashed', label: 'Neighbors' }, { values: mine, tone: 'solar', kind: 'area', label: `Panel ${weak}` }]} />
          </div>
        </div>
      </Sheet>
    </div>
  );
};

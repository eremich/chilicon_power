import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CalendarClock, Download, Lock, Mail, Phone, Router, ShieldCheck } from 'lucide-react';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Segmented } from '../../components/Segmented';
import { StatusCard } from '../../components/StatusCard';
import { Card } from '../../components/Card';
import { EnergyFlow } from '../../components/EnergyFlow';
import { HeroStat } from '../../components/HeroStat';
import { ListGroup, ListRow } from '../../components/ListRow';
import { DeviceRow } from '../../components/DeviceRow';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { ActionProgress } from '../../components/ActionProgress';
import { FIRMWARE, MAYA_SITE, ago, siteIssueText, siteTone } from '../../data/fleet';
import { useStore } from '../../store/useStore';
import { W, num } from '../../lib/format';
import { useFirstLoad } from '../../app/hooks';
import { Skeleton } from '../../components/Skeleton';
import { ResolveSheet, VisitSheet, siteLive, useDevices, useSite } from './shared';

const FIRMWARE_MS = 3000;

export const SiteDetail = () => {
  const navigate = useNavigate();
  const site = useSite(useParams().id);
  const issue = useStore((s) => s.issue);
  const battery = useStore((s) => s.battery);
  const access = useStore((s) => s.installerAccess);
  const visit = useStore((s) => s.visit);
  const firmwareDone = useStore((s) => (site ? !!s.firmwareUpdated[site.id] : false));
  const updateFirmware = useStore((s) => s.updateFirmware);
  const toast = useStore((s) => s.toast);
  const [params] = useSearchParams();
  const [tab, setTab] = useState<'overview' | 'technical'>(params.get('tab') === 'technical' ? 'technical' : 'overview');
  const [sheet, setSheet] = useState<'visit' | 'resolve' | null>(null);
  const [updating, setUpdating] = useState(false);
  const devices = useDevices(site);
  const loading = useFirstLoad(`site-${site?.id}`);
  if (!site) return null;

  const l = siteLive(site, issue, battery);
  const tone = siteTone(site, issue);
  const issueText = siteIssueText(site, issue);
  const offline = tone === 'offline';
  const locked = site.id === MAYA_SITE && access === 'owner';
  const mayaOpen = site.id === MAYA_SITE && ['open', 'reported', 'visit'].includes(issue.status);
  const siteVisit = visit?.siteId === site.id ? visit : null;
  const oldCount = devices.filter((d) => d.firmware !== FIRMWARE).length;

  const statusTitle = offline ? site.problem!.text : issueText ?? `All ${site.panels} panels producing`;
  const statusDetail = siteVisit ? `Visit booked ${siteVisit.day}, ${siteVisit.slot}` : offline ? 'Remote actions need the gateway online' : `Updated ${ago(site.updatedMin)}`;

  return (
    <div className="screen-enter flex flex-col pb-8">
      <ScreenHeader title={site.customer} onBack={() => navigate('/i')} backLabel="Sites" />
      <div className="flex flex-col gap-3 px-4">
        <p className="tnum -mt-1 text-center text-footnote text-muted">
          {site.city} · {site.sizeKw.toFixed(1)} kW · {site.panels} panels{site.battery ? ` · ${site.battery} kWh battery` : ''}
        </p>
        <Segmented label="Site view" value={tab} onChange={setTab} options={[{ key: 'overview', label: 'Overview' }, { key: 'technical', label: 'Technical' }]} />
        <StatusCard tone={tone === 'warn' ? 'warn' : tone === 'offline' ? 'offline' : 'ok'} title={statusTitle} detail={statusDetail} />

        {loading ? (
          <Skeleton className="h-96 rounded-card" />
        ) : tab === 'overview' ? (
          <>
            <Card className="px-0 pb-2 pt-1">
              <EnergyFlow solarKw={l.solarKw} homeKw={l.homeKw} battery={l.battery} gridKw={l.gridKw} offline={l.offline} />
            </Card>
            <Card>
              <div className="grid grid-cols-3 gap-3">
                <HeroStat size="compact" label="Produced today" value={num(l.today.produced)} unit="kWh" />
                <HeroStat size="compact" label="Self-powered" value={String(Math.round(l.selfPct))} unit="%" />
                <HeroStat size="compact" label="Exported" value={num(l.today.exported)} unit="kWh" />
              </div>
            </Card>
            <ListGroup header="Owner">
              <ListRow leading={<Phone aria-hidden className="size-[22px]" strokeWidth={1.75} />} title={site.phone} subtitle={site.customer} onClick={() => toast(`Calling ${site.customer.split(' ')[0]}…`)} />
              <ListRow leading={<Mail aria-hidden className="size-[22px]" strokeWidth={1.75} />} title={site.email} onClick={() => toast('Opening Mail…')} />
            </ListGroup>
            <ListGroup header="System">
              <ListRow leading={<Router aria-hidden className="size-[22px]" strokeWidth={1.75} />} title="Gateway" trailing={<span className="font-mono">{site.gatewayId}</span>} />
              <ListRow leading={<CalendarClock aria-hidden className="size-[22px]" strokeWidth={1.75} />} title="Installed" trailing={site.installedOn} />
              <ListRow leading={<ShieldCheck aria-hidden className="size-[22px]" strokeWidth={1.75} />} title="Your access" trailing={locked ? 'Owner view' : 'Full technical view'} />
            </ListGroup>
          </>
        ) : locked ? (
          <Card>
            <EmptyState
              icon={Lock}
              title="Technical view is off"
              body={`${site.customer.split(' ')[0]} shares the owner view only. Device IDs, per-panel data and remote restart need full access.`}
              action={
                <Button block variant="secondary" onClick={() => toast(`Access request sent to ${site.customer.split(' ')[0]}`)}>
                  Ask for full access
                </Button>
              }
            />
          </Card>
        ) : (
          <>
            {oldCount > 0 && !offline && !updating && (
              <Card>
                <div className="flex items-center gap-3">
                  <Download aria-hidden className="size-5 shrink-0 text-brand-ink" />
                  <p className="flex-1 text-subheadline text-ink">
                    {oldCount} {oldCount === 1 ? 'device is' : 'devices are'} on firmware {devices.find((d) => d.firmware !== FIRMWARE)?.firmware}. Latest is {FIRMWARE}.
                  </p>
                </div>
                <Button
                  block
                  variant="secondary"
                  size="md"
                  className="mt-3"
                  onClick={() => {
                    setUpdating(true);
                    setTimeout(() => {
                      updateFirmware(site.id);
                      setUpdating(false);
                    }, FIRMWARE_MS);
                  }}
                >
                  Update {oldCount} {oldCount === 1 ? 'device' : 'devices'}
                </Button>
              </Card>
            )}
            {(updating || firmwareDone) && <ActionProgress label={`Updating firmware to ${FIRMWARE}`} doneLabel={`All devices on ${FIRMWARE}`} running={updating} durationMs={FIRMWARE_MS} />}
            <section className="flex flex-col gap-1.5">
              <h2 className="px-4 text-footnote uppercase tracking-wide text-muted">{site.panels / 2} microinverters</h2>
              <ul className="overflow-hidden rounded-card bg-surface">
                {devices.map((d) => (
                  <DeviceRow
                    key={d.id}
                    deviceId={d.id}
                    panels={`Panels ${d.panels[0]}–${d.panels[1]}`}
                    output={W(d.watts)}
                    firmware={d.firmware}
                    lastSeen={d.lastSeen}
                    state={d.state}
                    onClick={() => navigate(`/i/sites/${site.id}/devices/${d.pair}`)}
                  />
                ))}
              </ul>
            </section>
          </>
        )}

        {(tone !== 'ok' || siteVisit) && (
          <div className="mt-2 flex flex-col gap-2">
            {!siteVisit && (
              <Button block variant={offline ? 'primary' : 'secondary'} icon={<CalendarClock aria-hidden className="size-5" />} onClick={() => setSheet('visit')}>
                Schedule visit
              </Button>
            )}
            {mayaOpen && (
              <Button block variant="plain" onClick={() => setSheet('resolve')}>
                Resolve issue
              </Button>
            )}
          </div>
        )}
      </div>
      <VisitSheet site={site} open={sheet === 'visit'} onClose={() => setSheet(null)} />
      <ResolveSheet open={sheet === 'resolve'} onClose={() => setSheet(null)} deviceId={devices.find((d) => d.pair === issue.pair)?.id ?? ''} onDone={() => toast('Resolved. Maya was notified')} />
    </div>
  );
};

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellOff } from 'lucide-react';
import { ScreenHeader } from '../../components/ScreenHeader';
import { AlertRow } from '../../components/AlertRow';
import { EmptyState } from '../../components/EmptyState';
import { alertsFor, ago } from '../../data/fleet';
import { useStore } from '../../store/useStore';
import { useFirstLoad } from '../../app/hooks';
import { Skeleton } from '../../components/Skeleton';

export const Alerts = () => {
  const navigate = useNavigate();
  const issue = useStore((s) => s.issue);
  const hasFleet = useStore((s) => s.hasFleet);
  const unseen = useStore((s) => s.unseenAlerts);
  const seeAlerts = useStore((s) => s.seeAlerts);
  const loading = useFirstLoad('alerts');
  const { active, earlier } = alertsFor(issue, hasFleet);

  // Opening the feed marks alerts as seen; the dots stay for this visit so you can still spot what was new
  useEffect(() => {
    const t = setTimeout(seeAlerts, 1500);
    return () => clearTimeout(t);
  }, [seeAlerts]);

  const section = (title: string, list: typeof active, fresh: boolean) =>
    list.length > 0 && (
      <section className="flex flex-col gap-1.5">
        <h2 className="px-4 text-footnote uppercase tracking-wide text-muted">{title}</h2>
        <ul className="overflow-hidden rounded-card bg-surface">
          {list.map((a, i) => (
            <AlertRow
              key={a.id}
              customer={a.customer}
              city={a.city}
              title={a.title}
              cause={a.cause}
              age={ago(a.ageMin)}
              tone={a.tone}
              fromOwner={a.fromOwner}
              unread={fresh && i < unseen}
              onClick={() => navigate(`/i/sites/${a.siteId}`)}
            />
          ))}
        </ul>
      </section>
    );

  return (
    <div className="screen-enter flex flex-col pb-6">
      <ScreenHeader title="Alerts" large subtitle={active.length ? `${active.length} need attention` : 'All sites'} />
      <div className="flex flex-col gap-6 px-4">
        {loading && <Skeleton className="h-80 rounded-card" />}
        {!loading && active.length === 0 && <EmptyState icon={BellOff} title="All clear" body="No site needs attention right now. We’ll tell you when one does." />}
        {!loading && section('Needs attention', active, true)}
        {!loading && section('Resolved', earlier, false)}
      </div>
    </div>
  );
};

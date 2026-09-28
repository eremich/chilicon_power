import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinned, Plus, SearchX } from 'lucide-react';
import { ScreenHeader } from '../../components/ScreenHeader';
import { IconButton } from '../../components/IconButton';
import { FleetSummary, type FleetFilter } from '../../components/FleetSummary';
import { SearchField } from '../../components/SearchField';
import { SiteRow } from '../../components/SiteRow';
import { EmptyState } from '../../components/EmptyState';
import { Button } from '../../components/Button';
import { Skeleton } from '../../components/Skeleton';
import { FLEET, ago, siteIssueText, siteTone, sortSites } from '../../data/fleet';
import { INSTALLER_CO } from '../../data/systems';
import { useStore } from '../../store/useStore';
import { useFirstLoad } from '../../app/hooks';

export const Sites = () => {
  const navigate = useNavigate();
  const loading = useFirstLoad('sites');
  const issue = useStore((s) => s.issue);
  const hasFleet = useStore((s) => s.hasFleet);
  const [filter, setFilter] = useState<FleetFilter>('all');
  const [query, setQuery] = useState('');

  const sites = hasFleet ? FLEET : [];
  const counts = useMemo(() => {
    const c = { offline: 0, warn: 0, ok: 0 };
    sites.forEach((s) => c[siteTone(s, issue)]++);
    return c;
  }, [sites, issue]);
  const q = query.trim().toLowerCase();
  const shown = sortSites(sites, issue).filter((s) => (filter === 'all' || siteTone(s, issue) === filter) && (!q || s.customer.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)));

  return (
    <div className="screen-enter flex flex-col pb-6">
      <ScreenHeader title="Sites" large subtitle={`${INSTALLER_CO.company} · ${sites.length} sites`} trailing={<IconButton label="Add a site" icon={Plus} onClick={() => navigate('/i/add')} />} />
      {!hasFleet ? (
        <EmptyState
          icon={MapPinned}
          title="No sites yet"
          body="Add your first customer’s system. You’ll scan its gateway, map the roof and invite the owner."
          action={
            <Button block onClick={() => navigate('/i/add')}>
              Add a site
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3 px-4">
          <FleetSummary counts={counts} value={filter} onChange={setFilter} />
          <SearchField value={query} onChange={setQuery} placeholder="Search customers or cities" />
          {loading ? (
            <Skeleton className="h-96 rounded-card" />
          ) : shown.length ? (
            <ul className="overflow-hidden rounded-card bg-surface [&>li:last-child_span]:border-b-0" aria-label="Sites">
              {shown.map((s) => (
                <SiteRow
                  key={s.id}
                  customer={s.customer}
                  city={s.city}
                  sizeKw={s.sizeKw}
                  tone={siteTone(s, issue) === 'warn' ? 'warn' : siteTone(s, issue)}
                  issue={siteIssueText(s, issue)}
                  updated={s.problem?.tone === 'offline' ? ago(s.updatedMin) : ago(s.updatedMin)}
                  onClick={() => navigate(`/i/sites/${s.id}`)}
                />
              ))}
            </ul>
          ) : (
            <EmptyState icon={SearchX} title="No matches" body={`No sites match “${query}”${filter !== 'all' ? ' with this filter' : ''}. Check the spelling or clear the filter.`} />
          )}
        </div>
      )}
    </div>
  );
};

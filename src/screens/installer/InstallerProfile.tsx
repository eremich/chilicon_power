import { useState } from 'react';
import { Building2, LogOut, Users } from 'lucide-react';
import { ScreenHeader } from '../../components/ScreenHeader';
import { ListGroup, ListRow } from '../../components/ListRow';
import { Switch } from '../../components/Switch';
import { Segmented } from '../../components/Segmented';
import { INSTALLER_CO } from '../../data/systems';
import { useStore } from '../../store/useStore';
import type { ThemeChoice } from '../../lib/theme';

export const InstallerProfile = () => {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const toast = useStore((s) => s.toast);
  const [notify, setNotify] = useState({ offline: true, reports: true, daily: false });
  return (
    <div className="screen-enter flex flex-col pb-8">
      <ScreenHeader title="Profile" large />
      <div className="flex flex-col gap-6 px-4">
        <div className="flex items-center gap-3 rounded-card bg-surface p-4">
          <span aria-hidden className="flex size-12 items-center justify-center rounded-chip bg-brand/15 text-headline text-brand-ink">
            MR
          </span>
          <div className="flex flex-col">
            <span className="text-headline text-ink">{INSTALLER_CO.name}</span>
            <span className="text-subheadline text-muted">Technician · {INSTALLER_CO.company}</span>
          </div>
        </div>
        <ListGroup header="Company">
          <ListRow leading={<Building2 aria-hidden className="size-[22px]" strokeWidth={1.75} />} title={INSTALLER_CO.company} subtitle={`${INSTALLER_CO.phone} · ${INSTALLER_CO.email}`} />
          <ListRow leading={<Users aria-hidden className="size-[22px]" strokeWidth={1.75} />} title="Team" trailing="4 people" onClick={() => toast('Team management is out of scope for the prototype')} />
        </ListGroup>
        <ListGroup header="Notify me" footer="Owner reports always come through. They are the fastest way to catch a fault.">
          <ListRow title="Site goes offline" trailing={<Switch checked={notify.offline} onChange={(v) => setNotify({ ...notify, offline: v })} label="Site goes offline" />} />
          <ListRow title="Owner reports an issue" trailing={<Switch checked={notify.reports} onChange={(v) => setNotify({ ...notify, reports: v })} label="Owner reports an issue" />} />
          <ListRow title="Daily fleet summary" trailing={<Switch checked={notify.daily} onChange={(v) => setNotify({ ...notify, daily: v })} label="Daily fleet summary" />} />
        </ListGroup>
        <ListGroup header="Appearance">
          <li className="p-3">
            <Segmented<ThemeChoice> label="Appearance" value={theme} onChange={setTheme} options={[{ key: 'light', label: 'Light' }, { key: 'dark', label: 'Dark' }, { key: 'system', label: 'System' }]} />
          </li>
        </ListGroup>
        <ListGroup>
          <ListRow leading={<LogOut aria-hidden className="size-[22px] text-fault" strokeWidth={1.75} />} title="Log out" destructive onClick={() => toast('Logged out (prototype)')} />
        </ListGroup>
      </div>
    </div>
  );
};

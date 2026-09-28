import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BadgeCheck, CircleDollarSign, House, LogOut, Mail, Plus, ShieldCheck, Unlink, Wrench } from 'lucide-react';
import { ScreenHeader } from '../../components/ScreenHeader';
import { ListGroup, ListRow } from '../../components/ListRow';
import { Switch } from '../../components/Switch';
import { Segmented } from '../../components/Segmented';
import { Sheet } from '../../components/Sheet';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { DEFAULT_TARIFF, INSTALLER_CO, OWNER, SYSTEMS } from '../../data/systems';
import { useStore } from '../../store/useStore';
import type { ThemeChoice } from '../../lib/theme';
import { ValueList } from '../../components/ValueList';
import { FindInstallerSheet } from './FindInstallerSheet';
import type { SystemId } from '../../data/types';

const icon = (I: typeof House) => <I aria-hidden className="size-[22px]" strokeWidth={1.75} />;

const TariffSheet = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const tariff = useStore((s) => s.tariff);
  const setTariff = useStore((s) => s.setTariff);
  const toast = useStore((s) => s.toast);
  const [rate, setRate] = useState('');
  const [credit, setCredit] = useState('');
  useEffect(() => {
    if (!open) return;
    setRate((tariff ?? DEFAULT_TARIFF).rate.toFixed(2));
    setCredit((tariff ?? DEFAULT_TARIFF).exportCredit.toFixed(2));
  }, [open, tariff]);
  const r = Number(rate);
  const c = Number(credit);
  const rateError = rate && (!(r > 0) || r > 2) ? 'Enter the price per kWh from your bill, for example 0.32' : undefined;
  const creditError = credit && (!(c >= 0) || c > 2) ? 'Enter your export credit per kWh, or 0 if you get none' : undefined;
  return (
    <Sheet
      open={open}
      onClose={onClose}
      detent="large"
      title="Electricity rate"
      description="Used to show what your solar saves you"
      footer={
        <Button
          block
          disabled={!rate || !credit || !!rateError || !!creditError}
          onClick={() => {
            setTariff({ rate: r, exportCredit: c });
            onClose();
            toast('Rate saved. Savings updated');
          }}
        >
          Save rate
        </Button>
      }
    >
      <div className="flex flex-col gap-4 pt-1">
        <TextField label="What you pay" prefix="$" suffix="/kWh" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} error={rateError} hint="On your utility bill, next to “energy charge”" />
        <TextField label="What you earn for export" prefix="$" suffix="/kWh" inputMode="decimal" value={credit} onChange={(e) => setCredit(e.target.value)} error={creditError} hint="Your net billing export credit" />
      </div>
    </Sheet>
  );
};

export const Profile = () => {
  const [params, setParams] = useSearchParams();
  const tariff = useStore((s) => s.tariff);
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const notifications = useStore((s) => s.notifications);
  const emailReports = useStore((s) => s.emailReports);
  const installerAccess = useStore((s) => s.installerAccess);
  const setPrefs = useStore((s) => s.setPrefs);
  const toast = useStore((s) => s.toast);
  const navigate = useNavigate();
  const installerLinked = useStore((s) => s.installerLinked);
  const [sheet, setSheet] = useState<'rate' | 'installer' | 'find' | null>(params.get('edit') === 'rate' ? 'rate' : null);
  const [systemSheet, setSystemSheet] = useState<SystemId | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const sys = systemSheet ? SYSTEMS[systemSheet] : null;

  const close = () => {
    setSheet(null);
    if (params.get('edit')) setParams({}, { replace: true });
  };
  const note = (key: keyof typeof notifications) => (on: boolean) => setPrefs({ notifications: { ...notifications, [key]: on } });

  return (
    <div className="screen-enter flex flex-col pb-8">
      <ScreenHeader title="Profile" large />
      <div className="flex flex-col gap-6 px-4">
        <div className="flex items-center gap-3 rounded-card bg-surface p-4">
          <span aria-hidden className="flex size-12 items-center justify-center rounded-chip bg-brand/15 text-headline text-brand-ink">
            {OWNER.initials}
          </span>
          <div className="flex flex-col">
            <span className="text-headline text-ink">{OWNER.name}</span>
            <span className="text-subheadline text-muted">{OWNER.email}</span>
          </div>
        </div>

        <ListGroup header="My systems">
          {Object.values(SYSTEMS).map((s) => (
            <ListRow key={s.id} leading={icon(House)} title={`${s.name}, ${s.city}`} subtitle={`${s.sizeKw.toFixed(1)} kW · ${s.panels} panels · since ${s.installedOn}`} onClick={() => setSystemSheet(s.id)} />
          ))}
          <ListRow leading={<Plus aria-hidden className="size-[22px] text-brand-ink" strokeWidth={2} />} title={<span className="text-brand-ink">Add a system</span>} onClick={() => navigate('/setup')} />
        </ListGroup>

        <ListGroup header="Savings" footer={tariff ? undefined : 'Add your rate to see how much solar saves you.'}>
          <ListRow leading={icon(CircleDollarSign)} title="Electricity rate" trailing={tariff ? `$${tariff.rate.toFixed(2)}/kWh` : 'Not set'} onClick={() => setSheet('rate')} />
          <ListRow leading={icon(CircleDollarSign)} title="Export credit" trailing={tariff ? `$${tariff.exportCredit.toFixed(2)}/kWh` : 'Not set'} onClick={() => setSheet('rate')} />
        </ListGroup>

        <ListGroup header="Notifications" footer="We only notify you when there is something to do. A cloudy day is never an alert.">
          <ListRow title="Issues with panels or gateway" trailing={<Switch checked={notifications.issues} onChange={note('issues')} label="Issues with panels or gateway" />} />
          <ListRow title="Daily summary" trailing={<Switch checked={notifications.daily} onChange={note('daily')} label="Daily summary" />} />
          <ListRow title="Monthly report" trailing={<Switch checked={notifications.monthly} onChange={note('monthly')} label="Monthly report" />} />
        </ListGroup>

        <ListGroup header="Email reports">
          <li className="p-3">
            <Segmented label="Email reports" value={emailReports} onChange={(v) => setPrefs({ emailReports: v })} options={[{ key: 'off', label: 'Off' }, { key: 'daily', label: 'Daily' }, { key: 'monthly', label: 'Monthly' }]} />
          </li>
          <ListRow leading={icon(Mail)} title="Send to" trailing={OWNER.email.split('@')[0] + '@…'} />
        </ListGroup>

        <ListGroup header="My installer">
          {installerLinked ? (
            <>
              <ListRow leading={icon(Wrench)} title={INSTALLER_CO.company} subtitle={`${INSTALLER_CO.name} · ${INSTALLER_CO.phone}`} onClick={() => toast(`Calling ${INSTALLER_CO.name}…`)} />
              <ListRow leading={icon(ShieldCheck)} title="Access" trailing={installerAccess === 'full' ? 'Full technical view' : 'Owner view'} onClick={() => setSheet('installer')} />
              <ListRow
                leading={<Unlink aria-hidden className="size-[22px] text-fault" strokeWidth={1.75} />}
                title="Unlink installer"
                destructive
                onClick={() => {
                  setPrefs({ installerLinked: false });
                  toast(`${INSTALLER_CO.company} unlinked`);
                }}
              />
            </>
          ) : (
            <ListRow leading={<BadgeCheck aria-hidden className="size-[22px] text-ok" strokeWidth={1.75} />} title={<span className="text-brand-ink">Find a certified installer</span>} subtitle="They can see issues and fix many remotely" onClick={() => setSheet('find')} />
          )}
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

      <TariffSheet open={sheet === 'rate'} onClose={close} />
      <FindInstallerSheet
        open={sheet === 'find'}
        onClose={() => {
          close();
          setPrefs({ installerLinked: true });
        }}
      />
      <Sheet
        open={!!sys}
        onClose={() => {
          setSystemSheet(null);
          setConfirmRemove(false);
        }}
        title={sys ? `${sys.name}, ${sys.city}` : ''}
        description={sys ? `Since ${sys.installedOn}` : undefined}
        footer={
          <Button
            block
            variant="destructive"
            onClick={() => {
              if (!confirmRemove) return setConfirmRemove(true);
              setSystemSheet(null);
              setConfirmRemove(false);
              toast(`${sys?.name} removed from your account`);
            }}
          >
            {confirmRemove ? 'Tap again to remove. History is kept 30 days' : 'Remove from my account'}
          </Button>
        }
      >
        {sys && (
          <ValueList
            rows={[
              { label: 'Size', value: `${sys.sizeKw.toFixed(1)} kW` },
              { label: 'Panels', value: `${sys.panels} on ${sys.panels / 2} microinverters` },
              { label: 'Battery', value: sys.batteryKwh ? `${sys.batteryKwh} kWh` : 'None' },
              { label: 'Gateway', value: <span className="font-mono">{sys.gatewayId}</span> },
            ]}
          />
        )}
      </Sheet>
      <Sheet open={sheet === 'installer'} onClose={close} title="Installer access" description={`What ${INSTALLER_CO.company} can see`}>
        <ListGroup>
          {(['full', 'owner'] as const).map((k) => (
            <ListRow
              key={k}
              title={k === 'full' ? 'Full technical view' : 'Owner view only'}
              subtitle={k === 'full' ? 'Device IDs, per-panel data, remote restart' : 'Status and totals, like you see them'}
              trailing={installerAccess === k ? <span className="text-subheadline font-semibold text-brand-ink">Selected</span> : undefined}
              onClick={() => {
                setPrefs({ installerAccess: k });
                close();
              }}
            />
          ))}
        </ListGroup>
      </Sheet>
    </div>
  );
};

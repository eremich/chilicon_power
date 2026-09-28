import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, LoaderCircle, LocateFixed, MailOpen, MapPin, Plus, QrCode, Sun } from 'lucide-react';
import { StepScreen } from '../../components/StepScreen';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { ChoiceCard } from '../../components/ChoiceCard';
import { QrScanner, type ScanState } from '../../components/QrScanner';
import { GatewaySticker } from '../../components/GatewaySticker';
import { ConnectionStatus, type ConnectionState } from '../../components/ConnectionStatus';
import { Segmented } from '../../components/Segmented';
import { ListGroup, ListRow } from '../../components/ListRow';
import { Card } from '../../components/Card';
import { ValueList } from '../../components/ValueList';
import { INSTALLER_CO, SYSTEMS } from '../../data/systems';
import { useStore } from '../../store/useStore';
import { cx } from '../../lib/cx';

const STEPS = 4;
const FOUND_ID = 'GW-7F3A21';
const SECOND_ID = 'GW-7F3A48';
const ID_RE = /^GW-[0-9A-F]{6}$/;
const CODE_RE = /^\d{4} ?\d{4}$/;

const ADDRESSES = [
  '2148 Alder Creek Way, Sacramento, CA 95816',
  '2148 Alder Street, Sacramento, CA 95818',
  '214 Alder Glen Court, Folsom, CA 95630',
  '2148 Alderwood Drive, Elk Grove, CA 95758',
];

export const AddSystem = () => {
  const navigate = useNavigate();
  const [choice, setChoice] = useState<'new' | 'invite'>('new');
  return (
    <StepScreen
      title="Add your system"
      lead="Set it up yourself with the gateway, or join the system your installer already set up."
      footer={
        <Button block onClick={() => navigate(choice === 'new' ? '/setup/scan' : '/setup/invite')}>
          Continue
        </Button>
      }
    >
      <div role="radiogroup" aria-label="How to add your system" className="flex flex-col gap-3">
        <ChoiceCard icon={QrCode} title="Set up a new system" description="Scan the QR code on your gateway. Takes about 3 minutes." selected={choice === 'new'} onSelect={() => setChoice('new')} />
        <ChoiceCard icon={MailOpen} title="I was invited by my installer" description="Your installer already connected it. Just accept." selected={choice === 'invite'} onSelect={() => setChoice('invite')} />
      </div>
    </StepScreen>
  );
};

export const AcceptInvite = () => {
  const navigate = useNavigate();
  const loadScenario = useStore((s) => s.loadScenario);
  const toast = useStore((s) => s.toast);
  const home = SYSTEMS.home;
  return (
    <StepScreen
      title="You’re invited"
      lead={`${INSTALLER_CO.company} set up your system and invited you to follow it.`}
      onBack={() => navigate('/setup')}
      footer={
        <>
          <Button
            block
            onClick={() => {
              loadScenario('default');
              navigate('/o');
              toast(`You’re connected to ${home.name}, ${home.city}`);
            }}
          >
            Accept invite
          </Button>
          <Button block variant="plain" onClick={() => navigate('/setup')}>
            Not my system
          </Button>
        </>
      }
    >
      <Card>
        <div className="mb-2 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-chip bg-brand/15 text-brand-ink">
            <Sun aria-hidden className="size-6" />
          </span>
          <div className="flex flex-col">
            <span className="text-headline text-ink">
              {home.name}, {home.city}
            </span>
            <span className="text-footnote text-muted">From {INSTALLER_CO.name}, {INSTALLER_CO.company}</span>
          </div>
        </div>
        <ValueList
          rows={[
            { label: 'System size', value: `${home.sizeKw.toFixed(1)} kW` },
            { label: 'Panels', value: `${home.panels} on ${home.panels / 2} microinverters` },
            { label: 'Battery', value: `${home.batteryKwh} kWh` },
            { label: 'Installer access', value: 'Full technical view' },
          ]}
        />
      </Card>
      <p className="mt-3 px-1 text-footnote text-muted">You can change what your installer sees later in Profile.</p>
    </StepScreen>
  );
};

export const ScanGateway = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const gateways = useStore((s) => s.onboarding.gateways);
  const setOnboarding = useStore((s) => s.setOnboarding);
  const denied = params.get('camera') === 'denied';
  const [state, setState] = useState<ScanState>(denied ? 'denied' : 'ready');
  const [failOnce, setFailOnce] = useState(params.get('result') === 'error');
  const [found, setFound] = useState<string>();

  const scan = () => {
    setState('scanning');
    setTimeout(() => {
      if (failOnce) {
        setFailOnce(false);
        setState('error');
        return;
      }
      const id = gateways.includes(FOUND_ID) ? SECOND_ID : FOUND_ID;
      setFound(id);
      setOnboarding({ gateways: gateways.includes(id) ? gateways : [...gateways, id] });
      setState('found');
    }, 1200);
  };

  return (
    <StepScreen
      title="Scan your gateway"
      lead="The QR code is on the sticker under the gateway, the small box your installer mounted near the meter."
      step={[1, STEPS]}
      onBack={() => navigate('/setup')}
      footer={
        state === 'found' ? (
          <>
            <Button block onClick={() => navigate('/setup/address')}>
              Continue
            </Button>
            <Button
              block
              variant="plain"
              icon={<Plus aria-hidden className="size-5" />}
              onClick={() => {
                setFound(undefined);
                setState('ready');
              }}
            >
              Add another gateway
            </Button>
          </>
        ) : (
          <Button block variant={denied ? 'primary' : 'secondary'} onClick={() => navigate('/setup/manual')}>
            Enter code manually
          </Button>
        )
      }
    >
      <QrScanner state={state} onScan={state === 'ready' || state === 'error' ? scan : undefined} />
      {state === 'found' && found && (
        <div className="banner-enter mt-3 flex items-center gap-3 rounded-card bg-surface p-3">
          <span className="flex size-9 items-center justify-center rounded-chip bg-ok/15 text-ok">
            <Check aria-hidden className="size-5" strokeWidth={2.5} />
          </span>
          <span className="flex flex-col">
            <span className="font-mono text-headline text-ink">{found}</span>
            <span className="text-footnote text-muted">
              {found === FOUND_ID ? '12 microinverters, 24 panels detected' : '6 microinverters, 12 panels detected'}
              {gateways.length > 1 && ` · ${gateways.length} gateways added`}
            </span>
          </span>
        </div>
      )}
    </StepScreen>
  );
};

export const ManualCode = () => {
  const navigate = useNavigate();
  const gateways = useStore((s) => s.onboarding.gateways);
  const setOnboarding = useStore((s) => s.setOnboarding);
  const [id, setId] = useState('');
  const [code, setCode] = useState('');
  const [focus, setFocus] = useState<'id' | 'code'>();
  const [tried, setTried] = useState(false);
  const idOk = ID_RE.test(id.trim().toUpperCase());
  const codeOk = CODE_RE.test(code.trim());
  return (
    <StepScreen
      title="Enter the gateway code"
      lead="Copy both lines from the sticker under the gateway."
      step={[1, STEPS]}
      onBack={() => navigate('/setup/scan')}
      footer={
        <Button
          block
          onClick={() => {
            setTried(true);
            if (!idOk || !codeOk) return;
            const gid = id.trim().toUpperCase();
            setOnboarding({ gateways: gateways.includes(gid) ? gateways : [...gateways, gid] });
            navigate('/setup/address');
          }}
        >
          Continue
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <GatewaySticker highlight={focus} />
        <TextField
          label="Gateway ID"
          placeholder="GW-XXXXXX"
          autoCapitalize="characters"
          value={id}
          onFocus={() => setFocus('id')}
          onChange={(e) => setId(e.target.value)}
          error={tried && !idOk ? 'Gateway IDs look like GW-7F3A21: GW, a dash, then 6 letters or digits' : undefined}
        />
        <TextField
          label="Authentication code"
          placeholder="0000 0000"
          inputMode="numeric"
          value={code}
          onFocus={() => setFocus('code')}
          onChange={(e) => setCode(e.target.value)}
          error={tried && !codeOk ? 'The code has 8 digits. Check the second line of the sticker.' : undefined}
        />
      </div>
    </StepScreen>
  );
};

export const Address = () => {
  const navigate = useNavigate();
  const address = useStore((s) => s.onboarding.address);
  const setOnboarding = useStore((s) => s.setOnboarding);
  const [query, setQuery] = useState(address);
  const [locating, setLocating] = useState(false);
  const matches = query.trim().length >= 3 && query !== address ? ADDRESSES.filter((a) => a.toLowerCase().includes(query.trim().toLowerCase().slice(0, 8))) : [];
  const pick = (a: string) => {
    setOnboarding({ address: a });
    setQuery(a);
  };
  return (
    <StepScreen
      title="Where is the system?"
      lead="We use it for your local sunrise, weather and rates."
      step={[2, STEPS]}
      onBack={() => navigate('/setup/scan')}
      footer={
        <Button block disabled={!address} onClick={() => navigate('/setup/details')}>
          Continue
        </Button>
      }
    >
      <TextField label="Address" placeholder="Start typing your street" autoComplete="street-address" value={query} onChange={(e) => setQuery(e.target.value)} role="combobox" aria-expanded={matches.length > 0} />
      <div className="mt-3">
        <ListGroup>
          {matches.map((a) => (
            <ListRow key={a} leading={<MapPin aria-hidden className="size-[22px]" strokeWidth={1.75} />} title={a.split(', ')[0]} subtitle={a.split(', ').slice(1).join(', ')} onClick={() => pick(a)} />
          ))}
          <ListRow
            leading={locating ? <LoaderCircle aria-hidden className="size-[22px] animate-spin text-brand-ink" /> : <LocateFixed aria-hidden className="size-[22px] text-brand-ink" strokeWidth={1.75} />}
            title={<span className="text-brand-ink">{locating ? 'Finding you…' : 'Use current location'}</span>}
            onClick={() => {
              setLocating(true);
              setTimeout(() => {
                setLocating(false);
                pick(ADDRESSES[0]);
              }, 800);
            }}
          />
        </ListGroup>
      </div>
      {address && query === address && (
        <div className="banner-enter mt-3 flex items-center gap-3 rounded-card bg-surface p-3">
          <MapPin aria-hidden className="size-5 text-ok" />
          <span className="text-subheadline text-ink">{address}</span>
        </div>
      )}
    </StepScreen>
  );
};

export const SystemDetails = () => {
  const navigate = useNavigate();
  const { sizeKw, battery, gateways } = useStore((s) => s.onboarding);
  const setOnboarding = useStore((s) => s.setOnboarding);
  const n = Number(sizeKw);
  const error = !(n > 0.5 && n < 100) ? 'Enter the size in kW from your installer’s paperwork, for example 8.8' : undefined;
  const panels = 24 + (gateways.length > 1 ? 12 : 0);
  return (
    <StepScreen
      title="Check the details"
      lead="We read these from the gateway. Change them if your paperwork says otherwise."
      step={[3, STEPS]}
      onBack={() => navigate('/setup/address')}
      footer={
        <Button block disabled={!!error} onClick={() => navigate('/setup/connecting')}>
          Continue
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3 rounded-card bg-ok/10 p-3">
          <Check aria-hidden className="size-5 shrink-0 text-ok" strokeWidth={2.5} />
          <span className="tnum text-subheadline text-ink">
            {(panels * 0.3667).toFixed(1)} kW, {panels} panels detected
          </span>
        </div>
        <TextField label="System size" suffix="kW" inputMode="decimal" value={sizeKw} onChange={(e) => setOnboarding({ sizeKw: e.target.value })} error={sizeKw ? error : 'Enter the system size in kW'} />
        <div className="flex flex-col gap-2">
          <span className="text-footnote font-semibold text-muted">Home battery</span>
          <Segmented label="Home battery" value={battery ? 'yes' : 'no'} onChange={(v) => setOnboarding({ battery: v === 'yes' })} options={[{ key: 'yes', label: 'Yes' }, { key: 'no', label: 'No' }]} />
          <p className={cx('text-footnote text-muted')}>{battery ? 'We’ll show charge level and when it powers your home.' : 'You can add one later in Profile.'}</p>
        </div>
      </div>
    </StepScreen>
  );
};

export const Connecting = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const gateways = useStore((s) => s.onboarding.gateways);
  const [failOnce, setFailOnce] = useState(params.get('result') === 'offline');
  const [state, setState] = useState<ConnectionState>('searching');
  const id = gateways[0] ?? FOUND_ID;

  useEffect(() => {
    if (state !== 'searching') return;
    const t = setTimeout(() => {
      setState(failOnce ? 'offline' : 'online');
      setFailOnce(false);
    }, 2000);
    return () => clearTimeout(t);
  }, [state, failOnce]);

  return (
    <StepScreen
      title="Connecting"
      step={[4, STEPS]}
      onBack={() => navigate('/setup/details')}
      footer={
        state === 'online' ? (
          <Button block onClick={() => navigate('/setup/waiting')}>
            Continue
          </Button>
        ) : state === 'offline' ? (
          <>
            <Button block onClick={() => setState('searching')}>
              Try again
            </Button>
            <Button block variant="plain" onClick={() => navigate('/setup/manual')}>
              Check the gateway code
            </Button>
          </>
        ) : undefined
      }
    >
      <div className="flex flex-1 flex-col justify-center pb-10">
        <ConnectionStatus state={state} gatewayId={id} />
      </div>
    </StepScreen>
  );
};

export const WaitingForData = () => {
  const navigate = useNavigate();
  const finishSetup = useStore((s) => s.finishSetup);
  const steps = [
    { label: 'Gateway online', done: true },
    { label: '12 microinverters found', done: true },
    { label: 'First numbers from your roof', done: false },
  ];
  return (
    <StepScreen
      title="Almost there"
      lead="Your first numbers usually arrive in a few minutes. We’ll notify you when they do."
      footer={
        <Button
          block
          onClick={() => {
            finishSetup();
            navigate('/o');
          }}
        >
          Go to Home
        </Button>
      }
    >
      <ul className="flex flex-col gap-1 rounded-card bg-surface p-2">
        {steps.map((s) => (
          <li key={s.label} className="flex min-h-12 items-center gap-3 px-2">
            {s.done ? (
              <span className="flex size-7 items-center justify-center rounded-chip bg-ok/15 text-ok">
                <Check aria-hidden className="size-4" strokeWidth={3} />
              </span>
            ) : (
              <LoaderCircle aria-hidden className="size-7 animate-spin p-1 text-muted" />
            )}
            <span className={cx('text-body', s.done ? 'text-ink' : 'text-muted')}>{s.label}</span>
          </li>
        ))}
      </ul>
    </StepScreen>
  );
};

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, MailCheck } from 'lucide-react';
import { StepScreen } from '../../components/StepScreen';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { QrScanner, type ScanState } from '../../components/QrScanner';
import { Stepper } from '../../components/Stepper';
import { RoofMap } from '../../components/RoofMap';
import { Card } from '../../components/Card';
import { roofPanels } from '../../data/roof';
import { useStore } from '../../store/useStore';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const STEPS = 3;

/** The draft lives in the component tree above the steps, so Back keeps what was typed */
interface Draft {
  name: string;
  email: string;
  rows: number;
  pairs: number;
}

let draft: Draft = { name: '', email: '', rows: 3, pairs: 4 };

export const AddCustomer = () => {
  const navigate = useNavigate();
  const [d, setD] = useState(draft);
  const [tried, setTried] = useState(false);
  const nameOk = d.name.trim().length > 1;
  const emailOk = EMAIL.test(d.email);
  return (
    <StepScreen
      title="New site"
      lead="Who owns the system? They get an invite to follow it in the app."
      step={[1, STEPS]}
      onBack={() => navigate('/i')}
      footer={
        <Button
          block
          onClick={() => {
            setTried(true);
            if (!nameOk || !emailOk) return;
            draft = d;
            navigate('/i/add/scan');
          }}
        >
          Continue
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <TextField label="Customer name" autoComplete="off" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} error={tried && !nameOk ? 'Enter the owner’s full name' : undefined} />
        <TextField label="Customer email" type="email" value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} error={tried && !emailOk ? 'Enter a valid email. The invite goes there.' : undefined} />
      </div>
    </StepScreen>
  );
};

export const AddScan = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<ScanState>('ready');
  return (
    <StepScreen
      title="Scan the gateway"
      lead="Commission the gateway on site. We’ll find its microinverters."
      step={[2, STEPS]}
      onBack={() => navigate('/i/add')}
      footer={
        state === 'found' ? (
          <Button block onClick={() => navigate('/i/add/layout')}>
            Continue
          </Button>
        ) : undefined
      }
    >
      <QrScanner
        state={state}
        onScan={
          state === 'ready'
            ? () => {
                setState('scanning');
                setTimeout(() => setState('found'), 1200);
              }
            : undefined
        }
      />
      {state === 'found' && (
        <div className="banner-enter mt-3 flex items-center gap-3 rounded-card bg-surface p-3">
          <span className="flex size-9 items-center justify-center rounded-chip bg-ok/15 text-ok">
            <Check aria-hidden className="size-5" strokeWidth={2.5} />
          </span>
          <span className="flex flex-col">
            <span className="font-mono text-headline text-ink">GW-5B20E4</span>
            <span className="text-footnote text-muted">12 microinverters found</span>
          </span>
        </div>
      )}
    </StepScreen>
  );
};

export const AddLayout = () => {
  const navigate = useNavigate();
  const [d, setD] = useState(draft);
  const panels = d.rows * d.pairs * 2;
  return (
    <StepScreen
      title="Map the roof"
      lead="Match the layout on the roof, so the owner’s map shows panels where they really are."
      step={[3, STEPS]}
      onBack={() => navigate('/i/add/scan')}
      footer={
        <Button
          block
          onClick={() => {
            draft = d;
            navigate('/i/add/done');
          }}
        >
          Invite owner
        </Button>
      }
    >
      <Card>
        <Stepper label="Rows" unit={d.rows === 1 ? 'row' : 'rows'} value={d.rows} min={1} max={5} onChange={(rows) => setD({ ...d, rows })} />
        <div className="my-1 h-px bg-line" />
        <Stepper label="Pairs per row" unit={d.pairs === 1 ? 'pair' : 'pairs'} value={d.pairs} min={1} max={6} onChange={(pairs) => setD({ ...d, pairs })} />
      </Card>
      <Card className="mt-3">
        <p className="tnum mb-3 text-subheadline text-ink">
          {panels} panels · {panels / 2} microinverters{panels / 2 !== 12 && <span className="text-warn-ink"> · the gateway found 12</span>}
        </p>
        <RoofMap panels={roofPanels('normal', 0.78, panels)} pairsPerRow={d.pairs} legend={['0 W', '340 W']} />
      </Card>
    </StepScreen>
  );
};

export const AddDone = () => {
  const navigate = useNavigate();
  const toast = useStore((s) => s.toast);
  return (
    <StepScreen
      title="Invite sent"
      footer={
        <>
          <Button
            block
            onClick={() => {
              draft = { name: '', email: '', rows: 3, pairs: 4 };
              navigate('/i');
            }}
          >
            Back to sites
          </Button>
          <Button block variant="plain" onClick={() => toast('Invite sent again')}>
            Resend invite
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 pt-6 text-center">
        <span className="flex size-20 items-center justify-center rounded-chip bg-ok/15 text-ok">
          <MailCheck aria-hidden className="size-9" strokeWidth={1.75} />
        </span>
        <p className="text-body text-ink">
          <strong className="font-semibold">{draft.name || 'The owner'}</strong> gets an email at {draft.email || 'their address'}. When they accept, they see the system on Home.
        </p>
        <p className="text-subheadline text-muted">The site appears in your list as soon as the first data arrives.</p>
      </div>
    </StepScreen>
  );
};

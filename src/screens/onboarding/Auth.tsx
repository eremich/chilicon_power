import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { House, MailCheck, Wrench } from 'lucide-react';
import { StepScreen } from '../../components/StepScreen';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { ChoiceCard } from '../../components/ChoiceCard';
import { PasswordRules, passwordChecks } from '../../components/PasswordRules';
import { EnergyFlow } from '../../components/EnergyFlow';
import { Logo } from '../../components/Logo';
import { useStore } from '../../store/useStore';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LinkButton = ({ children, onClick }: { children: string; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="press h-11 rounded-control px-3 text-body text-brand-ink hover:bg-brand/10">
    {children}
  </button>
);

export const Welcome = () => {
  const navigate = useNavigate();
  return (
    <div className="screen-enter flex flex-1 flex-col">
      <div className="flex items-center gap-2 px-4 pt-2">
        <Logo className="size-8" />
        <Logo variant="wordmark" className="h-4" />
      </div>
      <div className="flex flex-1 flex-col justify-center px-2">
        <EnergyFlow solarKw={4.9} homeKw={1.2} battery={{ kw: 2, pct: 67 }} gridKw={1.6} callouts={false} />
      </div>
      <div className="px-4">
        <h1 className="text-largeTitle text-ink">See every panel, every day</h1>
        <p className="mt-2 text-body text-muted">Know in one second that your system is fine, what it made today, and which panel needs attention.</p>
      </div>
      <div className="flex flex-col gap-2 px-4 pb-8 pt-6">
        <Button block onClick={() => navigate('/start/signup')}>
          Sign up
        </Button>
        <Button block variant="secondary" onClick={() => navigate('/start/login')}>
          Log in
        </Button>
      </div>
    </div>
  );
};

export const Login = () => {
  const navigate = useNavigate();
  const loadScenario = useStore((s) => s.loadScenario);
  const [email, setEmail] = useState('maya.chen@example.com');
  const [password, setPassword] = useState('');
  const [tried, setTried] = useState(false);
  const emailError = tried && !EMAIL.test(email) ? 'Enter the email you signed up with, like name@example.com' : undefined;
  const passError = tried && !password ? 'Enter your password' : undefined;
  const submit = () => {
    setTried(true);
    if (!EMAIL.test(email) || !password) return;
    loadScenario('default');
    navigate('/o');
  };
  return (
    <StepScreen
      title="Log in"
      onBack={() => navigate('/start')}
      footer={
        <Button block onClick={submit}>
          Log in
        </Button>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={(e) => (e.preventDefault(), submit())}>
        <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} />
        <TextField label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={passError} />
        <div className="-ml-3">
          <LinkButton onClick={() => navigate('/start/reset')}>Forgot password?</LinkButton>
        </div>
      </form>
    </StepScreen>
  );
};

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('maya.chen@example.com');
  const [sent, setSent] = useState(false);
  const [tried, setTried] = useState(false);
  const error = tried && !EMAIL.test(email) ? 'Enter a valid email, like name@example.com' : undefined;
  if (sent)
    return (
      <StepScreen title="Check your inbox" onBack={() => navigate('/start/login')} footer={<Button block onClick={() => navigate('/start/login')}>Back to log in</Button>}>
        <div className="flex flex-col items-center gap-4 pt-6 text-center">
          <span className="flex size-20 items-center justify-center rounded-chip bg-ok/15 text-ok">
            <MailCheck aria-hidden className="size-9" strokeWidth={1.75} />
          </span>
          <p className="text-body text-ink">
            We sent a reset link to <strong className="font-semibold">{email}</strong>. It works for 1 hour.
          </p>
          <p className="text-subheadline text-muted">Nothing there? Check spam, or wait a minute and send it again.</p>
          <LinkButton onClick={() => setSent(false)}>Send it again</LinkButton>
        </div>
      </StepScreen>
    );
  return (
    <StepScreen
      title="Reset password"
      lead="Enter your email and we’ll send you a link to set a new password."
      onBack={() => navigate('/start/login')}
      footer={
        <Button
          block
          onClick={() => {
            setTried(true);
            if (EMAIL.test(email)) setSent(true);
          }}
        >
          Send reset link
        </Button>
      }
    >
      <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
    </StepScreen>
  );
};

export const SignUp = () => {
  const navigate = useNavigate();
  const onboarding = useStore((s) => s.onboarding);
  const setOnboarding = useStore((s) => s.setOnboarding);
  const [password, setPassword] = useState('');
  const [tried, setTried] = useState(false);
  const { name, email } = onboarding;
  const valid = name.trim().length > 1 && EMAIL.test(email) && passwordChecks(password, email).every((c) => c.ok);
  return (
    <StepScreen
      title="Create your account"
      onBack={() => navigate('/start')}
      trailing={<LinkButton onClick={() => navigate('/start/login')}>Log in</LinkButton>}
      footer={
        <Button
          block
          onClick={() => {
            setTried(true);
            if (valid) navigate('/start/role');
          }}
        >
          Continue
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <TextField label="Full name" autoComplete="name" value={name} onChange={(e) => setOnboarding({ name: e.target.value })} error={tried && name.trim().length < 2 ? 'Enter your name so your installer knows who you are' : undefined} />
        <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setOnboarding({ email: e.target.value })} error={tried && !EMAIL.test(email) ? 'Enter a valid email, like name@example.com' : undefined} />
        <TextField label="Password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={tried && !passwordChecks(password, email).every((c) => c.ok) ? 'Your password needs all three below' : undefined} />
        <PasswordRules password={password} email={email} />
      </div>
    </StepScreen>
  );
};

export const WhoAreYou = () => {
  const navigate = useNavigate();
  const { role, company } = useStore((s) => s.onboarding);
  const setOnboarding = useStore((s) => s.setOnboarding);
  const [tried, setTried] = useState(false);
  return (
    <StepScreen
      title="Who are you?"
      lead="This sets up the app for how you’ll use it. You can’t change it later."
      onBack={() => navigate('/start/signup')}
      footer={
        <Button
          block
          onClick={() => {
            setTried(true);
            if (role === 'owner' || company.trim()) navigate('/start/verify');
          }}
        >
          Continue
        </Button>
      }
    >
      <div role="radiogroup" aria-label="Who are you?" className="flex flex-col gap-3">
        <ChoiceCard icon={House} title="Homeowner" description="I have solar panels at home" selected={role === 'owner'} onSelect={() => setOnboarding({ role: 'owner' })} />
        <ChoiceCard icon={Wrench} title="Installer" description="I install and service systems for customers" selected={role === 'installer'} onSelect={() => setOnboarding({ role: 'installer' })} />
      </div>
      {role === 'installer' && (
        <div className="banner-enter mt-5">
          <TextField label="Company name" autoComplete="organization" value={company} onChange={(e) => setOnboarding({ company: e.target.value })} error={tried && !company.trim() ? 'Enter your company name. Customers see it on their invite.' : undefined} />
        </div>
      )}
    </StepScreen>
  );
};

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const { email, role } = useStore((s) => s.onboarding);
  const toast = useStore((s) => s.toast);
  return (
    <StepScreen
      title="Check your inbox"
      onBack={() => navigate('/start/role')}
      footer={
        <>
          <Button block onClick={() => navigate(role === 'installer' ? '/i' : '/setup')}>
            I’ve confirmed my email
          </Button>
          <Button block variant="plain" onClick={() => toast('Email sent again')}>
            Resend email
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 pt-6 text-center">
        <span className="flex size-20 items-center justify-center rounded-chip bg-brand/15 text-brand-ink">
          <MailCheck aria-hidden className="size-9" strokeWidth={1.75} />
        </span>
        <p className="text-body text-ink">
          Tap the link we sent to <strong className="font-semibold">{email || 'your email'}</strong> to confirm it’s you.
        </p>
        <p className="text-subheadline text-muted">Then come back here. The link works for 24 hours.</p>
      </div>
    </StepScreen>
  );
};

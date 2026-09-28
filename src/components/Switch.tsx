import { cx } from '../lib/cx';

export interface SwitchProps {
  checked: boolean;
  onChange: (on: boolean) => void;
  label: string;
}

/** iOS switch. On is ok-green like the platform; the label is spoken, the visual label sits in the row. */
export const Switch = ({ checked, onChange, label }: SwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={cx('relative h-[31px] w-[51px] shrink-0 rounded-chip transition-colors duration-200', checked ? 'bg-ok' : 'bg-line')}
  >
    <span className={cx('absolute left-0.5 top-0.5 size-[27px] rounded-chip bg-knob shadow-thumb transition-transform duration-200 ease-out', checked && 'translate-x-5')} />
  </button>
);

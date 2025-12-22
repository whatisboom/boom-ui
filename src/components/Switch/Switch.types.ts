import { InputHTMLAttributes } from 'react';
import { Size } from '@/types';

type SwitchHTMLProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'onChange' | 'checked'
>;

export interface SwitchProps extends SwitchHTMLProps {
  /** Current checked state */
  checked: boolean;
  /** Callback fired when the switch state changes */
  onChange: (checked: boolean) => void;
  /** Optional label text */
  label?: string;
  /** Position of the label relative to the switch */
  labelPosition?: 'left' | 'right';
  /** Size variant */
  size?: Size;
  /** Takes full width of container */
  fullWidth?: boolean;
  /** Error message - takes precedence over helperText */
  error?: string;
  /** Helper text shown below the switch */
  helperText?: string;
  /** Custom wrapper class name */
  className?: string;
}

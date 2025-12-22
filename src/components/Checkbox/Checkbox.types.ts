import { InputHTMLAttributes } from 'react';
import { Size } from '@/types';

type CheckboxHTMLProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'onChange'
>;

export interface CheckboxProps extends CheckboxHTMLProps {
  /**
   * Checked state
   */
  checked: boolean;

  /**
   * Change handler
   */
  onChange: (checked: boolean) => void;

  /**
   * Checkbox label text
   */
  label?: string;

  /**
   * Label position relative to checkbox
   */
  labelPosition?: 'left' | 'right';

  /**
   * Size variant
   */
  size?: Size;

  /**
   * Full width checkbox (100%)
   */
  fullWidth?: boolean;

  /**
   * Error message (shows error state when present)
   */
  error?: string;

  /**
   * Helper text below checkbox (hidden when error present)
   */
  helperText?: string;

  /**
   * Unique ID (auto-generated if not provided)
   */
  id?: string;

  /**
   * Custom className for wrapper
   */
  className?: string;
}

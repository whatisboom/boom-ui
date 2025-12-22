import { Size } from '@/types';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /**
   * Selected value
   */
  value: string;

  /**
   * Change handler
   */
  onChange: (value: string) => void;

  /**
   * Radio button options
   */
  options: RadioOption[];

  /**
   * Name attribute for radio inputs (auto-generated if not provided)
   */
  name?: string;

  /**
   * Group label text
   */
  label?: string;

  /**
   * Layout orientation
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Size variant
   */
  size?: Size;

  /**
   * Error message (shows error state when present)
   */
  error?: string;

  /**
   * Helper text below radio group (hidden when error present)
   */
  helperText?: string;

  /**
   * Required field indicator
   */
  required?: boolean;

  /**
   * Disabled state (all options)
   */
  disabled?: boolean;

  /**
   * Full width radio group (100%)
   */
  fullWidth?: boolean;

  /**
   * Unique ID (auto-generated if not provided)
   */
  id?: string;

  /**
   * Custom className for wrapper
   */
  className?: string;
}

import { SelectHTMLAttributes } from 'react';
import { Size } from '@/types';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

type SelectHTMLProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'size' | 'onChange'
>;

export interface SelectProps extends SelectHTMLProps {
  /**
   * Selected value
   */
  value: string;

  /**
   * Change handler
   */
  onChange: (value: string) => void;

  /**
   * Select options
   */
  options: SelectOption[];

  /**
   * Select label text
   */
  label?: string;

  /**
   * Size variant
   */
  size?: Size;

  /**
   * Error message (shows error state when present)
   */
  error?: string;

  /**
   * Helper text below select (hidden when error present)
   */
  helperText?: string;

  /**
   * Full width select (100%)
   */
  fullWidth?: boolean;

  /**
   * Placeholder text (renders as disabled first option)
   */
  placeholder?: string;

  /**
   * Unique ID (auto-generated if not provided)
   */
  id?: string;

  /**
   * Custom className for wrapper
   */
  className?: string;

  /**
   * Custom className for select element
   */
  selectClassName?: string;
}

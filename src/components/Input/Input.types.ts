import { InputHTMLAttributes, ReactNode } from 'react';
import { Size } from '@/types';

type InputHTMLProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

export interface InputProps extends InputHTMLProps {
  /**
   * Input label text
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
   * Helper text below input (hidden when error present)
   */
  helperText?: string;

  /**
   * Icon before input value
   */
  leftIcon?: ReactNode;

  /**
   * Icon after input value
   */
  rightIcon?: ReactNode;

  /**
   * Full width input (100%)
   */
  fullWidth?: boolean;

  /**
   * Input type
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

  /**
   * Unique ID (auto-generated if not provided)
   */
  id?: string;

  /**
   * Custom className for wrapper
   */
  className?: string;

  /**
   * Custom className for input element
   */
  inputClassName?: string;
}

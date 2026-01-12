import type { TextareaHTMLAttributes } from 'react';
import type { Size } from '@/types';

type TextareaHTMLProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size' | 'onChange'
>;

export interface TextareaProps extends TextareaHTMLProps {
  /**
   * Textarea value
   */
  value: string;

  /**
   * Change handler
   */
  onChange: (value: string) => void;

  /**
   * Textarea label text
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
   * Helper text below textarea (hidden when error present)
   */
  helperText?: string;

  /**
   * Full width textarea (100%)
   */
  fullWidth?: boolean;

  /**
   * Resize behavior
   */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both' | 'auto';

  /**
   * Minimum number of rows
   */
  minRows?: number;

  /**
   * Maximum number of rows (for auto-resize)
   */
  maxRows?: number;

  /**
   * Unique ID (auto-generated if not provided)
   */
  id?: string;

  /**
   * Custom className for wrapper
   */
  className?: string;

  /**
   * Custom className for textarea element
   */
  textareaClassName?: string;
}

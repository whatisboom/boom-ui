/**
 * Field component type
 */
export type FieldComponent = 'input' | 'textarea' | 'select' | 'checkbox' | 'switch';

/**
 * Field component props
 */
export interface FieldProps {
  /**
   * Field name - must match schema key
   */
  name: string;

  /**
   * Field label
   */
  label: string;

  /**
   * Component type to render
   * @default 'input'
   */
  component?: FieldComponent;

  /**
   * Input type (for component='input')
   * @default 'text'
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Helper text below field
   */
  helperText?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Select options (for component='select')
   */
  options?: Array<{ value: string; label: string }>;

  /**
   * Additional CSS class
   */
  className?: string;
}

import { forwardRef, useId } from 'react';
import { cn } from '@/utils/classnames';
import { CheckboxProps } from './Checkbox.types';
import styles from './Checkbox.module.css';

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      onChange,
      label,
      labelPosition = 'right',
      size = 'md',
      fullWidth = false,
      error,
      helperText,
      disabled = false,
      required = false,
      id: providedId,
      name,
      className,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const autoId = useId();
    const id = providedId || autoId;
    const errorId = `${id}-error`;
    const helperTextId = `${id}-helper`;

    const wrapperClassNames = cn(
      styles.wrapper,
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
      error && styles.hasError,
      className
    );

    const labelClassNames = cn(
      styles.checkboxLabel,
      styles[size],
      labelPosition === 'left' && styles.labelLeft
    );

    const checkboxVisualClassNames = cn(
      styles.checkboxVisual,
      styles[size],
      checked && styles.checked,
      error && styles.error
    );

    return (
      <div className={wrapperClassNames}>
        <label className={labelClassNames}>
          {labelPosition === 'left' && label && (
            <span className={styles.labelText}>
              {label}
              {required && (
                <span className={styles.required} aria-label="required">
                  *
                </span>
              )}
            </span>
          )}

          <input
            ref={ref}
            type="checkbox"
            id={id}
            name={name}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? errorId : helperText ? helperTextId : undefined
            }
            className={styles.checkbox}
            {...props}
          />

          <span className={checkboxVisualClassNames} aria-hidden="true">
            {checked && (
              <svg
                width="12"
                height="10"
                viewBox="0 0 12 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.checkmark}
              >
                <path
                  d="M1 5L4.5 8.5L11 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>

          {labelPosition === 'right' && label && (
            <span className={styles.labelText}>
              {label}
              {required && (
                <span className={styles.required} aria-label="required">
                  *
                </span>
              )}
            </span>
          )}
        </label>

        {error && (
          <span id={errorId} className={styles.errorText} role="alert">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={helperTextId} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

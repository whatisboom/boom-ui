import { forwardRef, useId } from 'react';
import { cn } from '@/utils/classnames';
import { SwitchProps } from './Switch.types';
import styles from './Switch.module.css';

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
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
      styles.switchLabel,
      styles[size],
      labelPosition === 'left' && styles.labelLeft
    );

    const trackClassNames = cn(
      styles.track,
      styles[size],
      checked && styles.checked,
      error && styles.error
    );

    const thumbClassNames = cn(
      styles.thumb,
      styles[size],
      checked && styles.checked
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
            role="switch"
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
            className={styles.input}
            {...props}
          />

          <span className={trackClassNames} aria-hidden="true">
            <span className={thumbClassNames} />
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

Switch.displayName = 'Switch';

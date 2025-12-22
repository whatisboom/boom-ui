import { forwardRef, useId } from 'react';
import { cn } from '@/utils/classnames';
import { SelectProps } from './Select.types';
import styles from './Select.module.css';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      value,
      onChange,
      options,
      label,
      size = 'md',
      error,
      helperText,
      fullWidth = false,
      placeholder,
      id: providedId,
      required = false,
      disabled = false,
      className,
      selectClassName,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const id = providedId || autoId;
    const errorId = `${id}-error`;
    const helperTextId = `${id}-helper`;

    const selectClassNames = cn(
      styles.select,
      styles[size],
      error && styles.error,
      selectClassName
    );

    const wrapperClassNames = cn(
      styles.wrapper,
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
      className
    );

    return (
      <div className={wrapperClassNames}>
        {label && (
          <label
            htmlFor={id}
            className={cn(styles.label, disabled && styles.disabled)}
          >
            {label}
            {required && (
              <span className={styles.required} aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        <div className={styles.selectContainer}>
          <select
            ref={ref}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            disabled={disabled}
            className={selectClassNames}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? errorId : helperText ? helperTextId : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <svg
            className={styles.arrow}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>

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

Select.displayName = 'Select';

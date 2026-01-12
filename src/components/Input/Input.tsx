import { forwardRef, useId } from 'react';
import { cn } from '@/utils/classnames';
import type { InputProps } from './Input.types';
import styles from './Input.module.css';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      size = 'md',
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      type = 'text',
      id: providedId,
      name,
      placeholder,
      required = false,
      disabled = false,
      readOnly = false,
      className,
      inputClassName,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const autoId = useId();
    const id = providedId || autoId;
    const errorId = `${id}-error`;
    const helperTextId = `${id}-helper`;

    const inputClassNames = cn(
      styles.input,
      styles[size],
      leftIcon && styles.hasLeftIcon,
      rightIcon && styles.hasRightIcon,
      error && styles.error,
      inputClassName
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

        <div className={styles.inputContainer}>
          {leftIcon && (
            <span
              className={cn(styles.leftIcon, styles[size])}
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            className={inputClassNames}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? errorId : helperText ? helperTextId : undefined
            }
            {...props}
          />

          {rightIcon && (
            <span
              className={cn(styles.rightIcon, styles[size])}
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
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

Input.displayName = 'Input';

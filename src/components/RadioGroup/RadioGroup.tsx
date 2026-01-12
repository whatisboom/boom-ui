import { forwardRef, useId } from 'react';
import { cn } from '@/utils/classnames';
import type { RadioGroupProps } from './RadioGroup.types';
import styles from './RadioGroup.module.css';

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value,
      onChange,
      options,
      name,
      label,
      orientation = 'vertical',
      size = 'md',
      error,
      helperText,
      required = false,
      disabled = false,
      fullWidth = false,
      id: providedId,
      className,
    },
    ref
  ) => {
    const autoId = useId();
    const id = providedId || autoId;
    const errorId = `${id}-error`;
    const helperTextId = `${id}-helper`;
    const labelId = `${id}-label`;

    const wrapperClassNames = cn(
      styles.wrapper,
      fullWidth && styles.fullWidth,
      className
    );

    const radioGroupClassNames = cn(
      styles.radioGroup,
      styles[orientation],
      disabled && styles.disabled
    );

    return (
      <div ref={ref} className={wrapperClassNames}>
        {label && (
          <div id={labelId} className={cn(styles.label, disabled && styles.disabled)}>
            {label}
            {required && (
              <span className={styles.required} aria-label="required">
                *
              </span>
            )}
          </div>
        )}

        <div
          role="radiogroup"
          aria-labelledby={label ? labelId : undefined}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : helperText ? helperTextId : undefined}
          className={radioGroupClassNames}
        >
          {options.map((option) => {
            const optionId = `${id}-${option.value}`;
            const isDisabled = disabled || option.disabled;
            const isChecked = value === option.value;

            return (
              <label
                key={option.value}
                htmlFor={optionId}
                className={cn(
                  styles.radioOption,
                  styles[size],
                  isDisabled && styles.disabled
                )}
              >
                <input
                  type="radio"
                  id={optionId}
                  name={name || id}
                  value={option.value}
                  checked={isChecked}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={isDisabled}
                  className={styles.radio}
                />
                <span
                  className={styles.radioVisual}
                  aria-hidden="true"
                />
                <span className={styles.radioLabel}>{option.label}</span>
              </label>
            );
          })}
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

RadioGroup.displayName = 'RadioGroup';

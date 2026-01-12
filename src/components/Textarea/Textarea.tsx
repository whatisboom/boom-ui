import { forwardRef, useId, useEffect, useRef } from 'react';
import { cn } from '@/utils/classnames';
import type { TextareaProps } from './Textarea.types';
import styles from './Textarea.module.css';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      value,
      onChange,
      label,
      size = 'md',
      error,
      helperText,
      fullWidth = false,
      resize = 'vertical',
      minRows = 3,
      maxRows,
      id: providedId,
      required = false,
      disabled = false,
      readOnly = false,
      className,
      textareaClassName,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const id = providedId || autoId;
    const errorId = `${id}-error`;
    const helperTextId = `${id}-helper`;

    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = ref ? (ref as React.RefObject<HTMLTextAreaElement>) : internalRef;

    // Auto-resize functionality
    useEffect(() => {
      if (resize !== 'auto' || !textareaRef.current) {return;}

      const textarea = textareaRef.current;
      const updateHeight = () => {
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);

        let newHeight = scrollHeight;
        if (maxRows) {
          const maxHeight = lineHeight * maxRows;
          newHeight = Math.min(scrollHeight, maxHeight);
        }

        textarea.style.height = `${newHeight}px`;
      };

      updateHeight();
      textarea.addEventListener('input', updateHeight);

      return () => {
        textarea.removeEventListener('input', updateHeight);
      };
    }, [value, resize, maxRows, textareaRef]);

    const textareaClassNames = cn(
      styles.textarea,
      styles[size],
      styles[`resize${resize.charAt(0).toUpperCase() + resize.slice(1)}`],
      error && styles.error,
      textareaClassName
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

        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={minRows}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          className={textareaClassNames}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? errorId : helperText ? helperTextId : undefined
          }
          {...props}
        />

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

Textarea.displayName = 'Textarea';

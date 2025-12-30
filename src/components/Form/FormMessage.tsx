import { cn } from '@/utils/classnames';
import { FormMessageProps } from './FormMessage.types';
import styles from './Form.module.css';

export const FormMessage: React.FC<FormMessageProps> = ({
  type,
  children,
  onDismiss,
  className,
}) => {
  const typeClass = {
    success: styles.formMessageSuccess,
    error: styles.formMessageError,
    warning: styles.formMessageWarning,
    info: styles.formMessageInfo,
  }[type];

  return (
    <div
      className={cn(styles.formMessage, typeClass, className)}
      role="alert"
      aria-live="polite"
    >
      <div>{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ×
        </button>
      )}
    </div>
  );
};

FormMessage.displayName = 'FormMessage';

import { cn } from '@/utils/classnames';
import { FormActionsProps } from './FormActions.types';
import styles from './Form.module.css';

export const FormActions: React.FC<FormActionsProps> = ({
  align = 'right',
  children,
  className,
}) => {
  const alignmentClass = {
    left: styles.formActionsLeft,
    right: styles.formActionsRight,
    center: styles.formActionsCenter,
    'space-between': styles.formActionsSpaceBetween,
  }[align];

  return (
    <div className={cn(styles.formActions, alignmentClass, className)}>
      {children}
    </div>
  );
};

FormActions.displayName = 'FormActions';

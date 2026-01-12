import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/classnames';
import type { ButtonProps } from './Button.types';
import styles from './Button.module.css';

type MotionButtonProps = ComponentPropsWithoutRef<typeof motion.button>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      disableAnimation = false,
      ...props
    },
    ref
  ) => {
    const buttonClassName = cn(
      styles.button,
      styles[variant],
      styles[size],
      loading && styles.loading,
      className
    );

    const content = (
      <>
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
        {children}
        {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
      </>
    );

    const commonProps = {
      ref,
      className: buttonClassName,
      disabled: disabled || loading,
      'aria-busy': loading,
      'aria-label': loading && typeof children === 'string'
        ? `${children} - Loading`
        : props['aria-label'],
      ...props,
    };

    if (disableAnimation) {
      return <button {...commonProps}>{content}</button>;
    }

    const motionButtonProps: MotionButtonProps = {
      ...commonProps,
      whileTap: disabled || loading ? undefined : { scale: 0.98 },
      transition: { duration: 0.1 },
    };

    return <motion.button {...motionButtonProps}>{content}</motion.button>;
  }
);

Button.displayName = 'Button';

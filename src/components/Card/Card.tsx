import { ElementType } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/classnames';
import { CardProps } from './Card.types';
import styles from './Card.module.css';

export function Card<E extends ElementType = 'div'>({
  as,
  variant = 'raised',
  padding = 4,
  hoverable = false,
  disableAnimation = false,
  className,
  style,
  children,
  ...props
}: CardProps<E>) {
  const Component = as || 'div';

  // Build inline styles with padding
  const cardStyle = {
    ...(padding !== undefined && {
      padding: `var(--boom-spacing-${padding})`,
    }),
    ...style,
  };

  // Build className
  const cardClassName = cn(
    styles.card,
    styles[variant],
    hoverable && styles.hoverable,
    className
  );

  // Use Framer Motion for hover animations when enabled
  const shouldAnimate = hoverable && !disableAnimation;

  if (shouldAnimate) {
    // Cast Component to motion component
    const MotionComponent = motion[Component as keyof typeof motion] || motion.div;

    return (
      <MotionComponent
        className={cardClassName}
        style={cardStyle}
        whileHover={{
          y: -4,
        }}
        transition={{
          duration: 0.2,
          ease: 'easeOut',
        }}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }

  // Static component without animations
  return (
    <Component className={cardClassName} style={cardStyle} {...props}>
      {children}
    </Component>
  );
}

Card.displayName = 'Card';

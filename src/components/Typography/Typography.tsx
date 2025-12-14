import { ElementType } from 'react';
import { cn } from '@/utils/classnames';
import { TypographyProps } from './Typography.types';
import styles from './Typography.module.css';

const variantToElement = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  caption: 'span',
  label: 'label',
} as const;

export function Typography<E extends ElementType = 'p'>({
  variant = 'body',
  align = 'left',
  weight,
  className,
  as,
  children,
  ...props
}: TypographyProps<E>) {
  const Component = as || (variantToElement[variant] as ElementType);

  const classNames = cn(
    styles.typography,
    styles[variant],
    styles[align],
    weight && styles[weight],
    className
  );

  return (
    <Component className={classNames} {...props}>
      {children}
    </Component>
  );
}

Typography.displayName = 'Typography';

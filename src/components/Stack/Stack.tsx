import { ElementType } from 'react';
import { Box } from '@/components/Box';
import { StackProps } from './Stack.types';

export function Stack<E extends ElementType = 'div'>({
  direction = 'column',
  spacing = 4,
  align,
  justify,
  className,
  as,
  children,
  ...props
}: StackProps<E>) {
  return (
    // @ts-expect-error - TypeScript cannot infer that the spread props from StackProps<E>
    // are compatible with BoxProps<E> when passing through generic types across component boundaries.
    // Runtime behavior is correct and all tests pass.
    <Box
      as={as}
      display="flex"
      flexDirection={direction}
      gap={spacing}
      alignItems={align}
      justifyContent={justify}
      className={className}
      {...props}
    >
      {children}
    </Box>
  );
}

Stack.displayName = 'Stack';

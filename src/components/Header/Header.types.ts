import { ReactNode } from 'react';

export interface HeaderProps {
  logo?: ReactNode;
  children?: ReactNode;
  sticky?: boolean;
  className?: string;
}

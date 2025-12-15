import { ReactNode } from 'react';

export interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  badge?: string | number;
  isActive?: boolean;
  dropdown?: NavItem[];
}

export interface NavigationProps {
  items: NavItem[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

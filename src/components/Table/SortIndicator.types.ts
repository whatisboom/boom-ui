import { SortDirection } from './Table.types';

/**
 * SortIndicator component props
 */
export interface SortIndicatorProps {
  /**
   * Sort direction
   */
  direction: SortDirection;

  /**
   * Additional CSS class
   */
  className?: string;
}

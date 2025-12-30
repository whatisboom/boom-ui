export interface SpinnerProps {
  /**
   * Size of the spinner
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Render with overlay backdrop (fullscreen)
   * @default false
   */
  overlay?: boolean;

  /**
   * Accessible label for screen readers
   * @default 'Loading'
   */
  label?: string;

  /**
   * Disable rotation animation
   * @default false
   */
  disableAnimation?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;
}

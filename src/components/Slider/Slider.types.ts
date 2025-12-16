import { Size } from '@/types';

export interface BaseSliderProps {
  /** Label text */
  label?: string;

  /** Size variant */
  size?: Size;

  /** Error message */
  error?: string;

  /** Helper text */
  helperText?: string;

  /** Full width slider */
  fullWidth?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Read-only state */
  readOnly?: boolean;

  /** Minimum value */
  min?: number;

  /** Maximum value */
  max?: number;

  /** Step increment */
  step?: number;

  /** Show tick markers */
  showMarkers?: boolean;

  /** Custom marker positions */
  markers?: number[];

  /** Format value for display */
  formatValue?: (value: number) => string;

  /** Custom wrapper className */
  className?: string;

  /** Unique ID */
  id?: string;
}

export interface SingleSliderProps extends BaseSliderProps {
  /** Single value mode */
  mode?: 'single';

  /** Current value */
  value: number;

  /** Value change handler */
  onChange: (value: number) => void;

  /** Default value (uncontrolled) */
  defaultValue?: number;
}

export interface RangeSliderProps extends BaseSliderProps {
  /** Range mode (two handles) */
  mode: 'range';

  /** Current range [start, end] */
  value: [number, number];

  /** Range change handler */
  onChange: (value: [number, number]) => void;

  /** Default range (uncontrolled) */
  defaultValue?: [number, number];
}

export type SliderProps = SingleSliderProps | RangeSliderProps;

import type { ReactNode } from 'react';
import type { Payload } from 'recharts/types/component/DefaultTooltipContent';
import type { MotionProps } from '@/types';

/**
 * Supported chart types
 */
export type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'radar';

/**
 * Data point structure - flexible to support various chart types
 * Keys other than 'name' are data series
 */
export interface ChartDataPoint {
  name: string | number;
  [key: string]: string | number;
}

/**
 * Color configuration for chart
 */
export interface ChartColors {
  /**
   * Array of colors for data series
   * If not provided, generates from theme
   */
  colors?: string[];

  /**
   * Override specific series colors by key
   * Example: { revenue: '#ff0000', expenses: '#00ff00' }
   */
  seriesColors?: Record<string, string>;
}

/**
 * Axis configuration
 */
export interface ChartAxisConfig {
  /**
   * Show X axis
   * @default true
   */
  showXAxis?: boolean;

  /**
   * Show Y axis
   * @default true
   */
  showYAxis?: boolean;

  /**
   * X axis label
   */
  xAxisLabel?: string;

  /**
   * Y axis label
   */
  yAxisLabel?: string;

  /**
   * Custom X axis data key (defaults to 'name')
   */
  xAxisKey?: string;
}

/**
 * Legend configuration
 */
export interface ChartLegendConfig {
  /**
   * Show legend
   * @default true
   */
  show?: boolean;

  /**
   * Legend position
   * @default 'bottom'
   */
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Tooltip configuration
 */
export interface ChartTooltipConfig {
  /**
   * Show tooltip on hover
   * @default true
   */
  show?: boolean;

  /**
   * Custom tooltip formatter matching Recharts Formatter signature
   */
  formatter?: (
    value: number | string | undefined,
    name: string | undefined,
    item: Payload<number | string, string>,
    index: number,
    payload: ReadonlyArray<Payload<number | string, string>>
  ) => ReactNode | [ReactNode, string];
}

/**
 * Grid configuration
 */
export interface ChartGridConfig {
  /**
   * Show grid lines
   * @default true
   */
  show?: boolean;

  /**
   * Show horizontal grid lines
   * @default true
   */
  horizontal?: boolean;

  /**
   * Show vertical grid lines
   * @default false
   */
  vertical?: boolean;
}

/**
 * Pie/Donut specific configuration
 */
export interface PieChartConfig {
  /**
   * Inner radius for donut chart (0-100)
   * @default 0 (full pie)
   */
  innerRadius?: number;

  /**
   * Outer radius (0-100)
   * @default 80
   */
  outerRadius?: number;

  /**
   * Show labels on slices
   * @default true
   */
  showLabels?: boolean;
}

/**
 * Base chart props (shared across all chart types)
 */
export interface BaseChartProps extends MotionProps {
  /**
   * Chart data array
   */
  data: ChartDataPoint[];

  /**
   * Chart type
   */
  type: ChartType;

  /**
   * Width of chart (number for pixels, string for percentage like '100%')
   * @default '100%'
   */
  width?: number | `${number}%`;

  /**
   * Height of chart in pixels
   * @default 300
   */
  height?: number;

  /**
   * Color configuration
   */
  colors?: ChartColors;

  /**
   * Axis configuration
   */
  axis?: ChartAxisConfig;

  /**
   * Legend configuration
   */
  legend?: ChartLegendConfig;

  /**
   * Tooltip configuration
   */
  tooltip?: ChartTooltipConfig;

  /**
   * Grid configuration
   */
  grid?: ChartGridConfig;

  /**
   * Pie/Donut specific config
   */
  pieConfig?: PieChartConfig;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;

  /**
   * Detailed description for screen readers
   */
  ariaDescription?: string;
}

/**
 * Public Chart component props
 */
export type ChartProps = BaseChartProps;

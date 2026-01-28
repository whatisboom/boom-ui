import { forwardRef, useMemo } from 'react';
// import { useTheme } from '@/components/ThemeProvider';
import { ResponsiveContainer } from 'recharts';
import { cn } from '@/utils/classnames';
import type { ChartProps } from './Chart.types';
import { extractDataKeys } from './utils/colorPalette';
import styles from './Chart.module.css';

export const Chart = forwardRef<HTMLDivElement, ChartProps>(
  (
    {
      data,
      type,
      width = '100%',
      height = 300,
      colors,
      axis = {},
      legend = { show: true, position: 'bottom' },
      tooltip = { show: true },
      grid = { show: true, horizontal: true, vertical: false },
      pieConfig = {},
      className,
      ariaLabel,
      ariaDescription,
      disableAnimation = false,
      ...props
    },
    ref
  ) => {
    // Theme colors will be used when chart types are implemented
    // const { colors: themeColors } = useTheme();

    // Generate color palette from theme (will be used when chart types are implemented)
    // const defaultPalette = useMemo(
    //   () => generateChartPalette(themeColors),
    //   [themeColors]
    // );

    // Extract data series keys
    const dataKeys = useMemo(() => extractDataKeys(data), [data]);

    // Map series to colors (will be used when chart types are implemented)
    // const seriesColors = useMemo(
    //   () => mapSeriesToColors(dataKeys, colors, defaultPalette),
    //   [dataKeys, colors, defaultPalette]
    // );

    // Build ARIA description from data
    const description = useMemo(() => {
      if (ariaDescription) return ariaDescription;

      const seriesCount = dataKeys.length;
      const pointCount = data.length;

      return `${type} chart with ${seriesCount} data series and ${pointCount} data points`;
    }, [ariaDescription, type, dataKeys.length, data.length]);

    // Determine numeric height for Recharts
    const numericHeight: number = typeof height === 'string' ? 300 : height;

    return (
      <div
        ref={ref}
        className={cn(styles.chartContainer, className)}
        role="img"
        aria-label={ariaLabel || `${type} chart`}
        aria-description={description}
        {...props}
      >
        <ResponsiveContainer width={width} height={numericHeight}>
          <div>Chart type: {type}</div>
        </ResponsiveContainer>
      </div>
    );
  }
);

Chart.displayName = 'Chart';

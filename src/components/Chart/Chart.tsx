import { forwardRef, useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { cn } from '@/utils/classnames';
import type { ChartProps } from './Chart.types';
import { generateChartPalette, extractDataKeys, mapSeriesToColors } from './utils/colorPalette';
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
    const { colors: themeColors } = useTheme();

    // Generate color palette from theme
    const defaultPalette = useMemo(
      () => generateChartPalette(themeColors),
      [themeColors]
    );

    // Extract data series keys
    const dataKeys = useMemo(() => extractDataKeys(data), [data]);

    // Map series to colors
    const seriesColors = useMemo(
      () => mapSeriesToColors(dataKeys, colors, defaultPalette),
      [dataKeys, colors, defaultPalette]
    );

    // Build ARIA description from data
    const description = useMemo(() => {
      if (ariaDescription) {
        return ariaDescription;
      }

      const seriesCount = dataKeys.length;
      const pointCount = data.length;

      return `${type} chart with ${seriesCount} data series and ${pointCount} data points`;
    }, [ariaDescription, type, dataKeys.length, data.length]);

    // Determine numeric height for Recharts
    const numericHeight: number = typeof height === 'string'
      ? height.endsWith('%')
        ? parseInt(height)
        : 300
      : height;

    // Axis defaults
    const {
      showXAxis = true,
      showYAxis = true,
      xAxisLabel,
      yAxisLabel,
      xAxisKey = 'name',
    } = axis;

    // Common props for all chart types
    const commonChartProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    // Map legend position to Recharts props
    const legendProps = (() => {
      const pos = legend.position || 'bottom';
      if (pos === 'left' || pos === 'right') {
        return { verticalAlign: 'middle' as const, align: pos };
      }
      // pos is now 'top' | 'bottom'
      return { verticalAlign: pos };
    })();

    // Render chart based on type
    const renderChart = () => {
      if (type === 'line') {
        return (
          <LineChart {...commonChartProps}>
            {grid.show && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={themeColors.border.subtle}
                horizontal={grid.horizontal}
                vertical={grid.vertical}
              />
            )}
            {showXAxis && (
              <XAxis
                dataKey={xAxisKey}
                stroke={themeColors.text.secondary}
                label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom' } : undefined}
              />
            )}
            {showYAxis && (
              <YAxis
                stroke={themeColors.text.secondary}
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
              />
            )}
            {tooltip.show && (
              <Tooltip
                contentStyle={{
                  backgroundColor: themeColors.bg.elevated,
                  border: `1px solid ${themeColors.border.default}`,
                  color: themeColors.text.primary,
                }}
              />
            )}
            {legend.show && <Legend {...legendProps} />}
            {dataKeys.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={seriesColors[key]}
                strokeWidth={2}
                dot={{ fill: seriesColors[key] }}
                isAnimationActive={!disableAnimation}
              />
            ))}
          </LineChart>
        );
      }

      if (type === 'bar') {
        return (
          <BarChart {...commonChartProps}>
            {grid.show && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={themeColors.border.subtle}
                horizontal={grid.horizontal}
                vertical={grid.vertical}
              />
            )}
            {showXAxis && (
              <XAxis
                dataKey={xAxisKey}
                stroke={themeColors.text.secondary}
                label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom' } : undefined}
              />
            )}
            {showYAxis && (
              <YAxis
                stroke={themeColors.text.secondary}
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
              />
            )}
            {tooltip.show && (
              <Tooltip
                contentStyle={{
                  backgroundColor: themeColors.bg.elevated,
                  border: `1px solid ${themeColors.border.default}`,
                  color: themeColors.text.primary,
                }}
              />
            )}
            {legend.show && <Legend {...legendProps} />}
            {dataKeys.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={seriesColors[key]}
                isAnimationActive={!disableAnimation}
              />
            ))}
          </BarChart>
        );
      }

      if (type === 'area') {
        return (
          <AreaChart {...commonChartProps}>
            {grid.show && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={themeColors.border.subtle}
                horizontal={grid.horizontal}
                vertical={grid.vertical}
              />
            )}
            {showXAxis && (
              <XAxis
                dataKey={xAxisKey}
                stroke={themeColors.text.secondary}
                label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom' } : undefined}
              />
            )}
            {showYAxis && (
              <YAxis
                stroke={themeColors.text.secondary}
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
              />
            )}
            {tooltip.show && (
              <Tooltip
                contentStyle={{
                  backgroundColor: themeColors.bg.elevated,
                  border: `1px solid ${themeColors.border.default}`,
                  color: themeColors.text.primary,
                }}
              />
            )}
            {legend.show && <Legend {...legendProps} />}
            {dataKeys.map((key) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={seriesColors[key]}
                fill={seriesColors[key]}
                fillOpacity={0.6}
                isAnimationActive={!disableAnimation}
              />
            ))}
          </AreaChart>
        );
      }

      if (type === 'pie') {
        // Pie config defaults
        const {
          innerRadius = 0,
          outerRadius = 80,
          showLabels = true,
        } = pieConfig;

        // For pie charts, transform data - each data point becomes a slice
        const pieData = data.map((item) => ({
          name: item.name,
          value: item[dataKeys[0]] as number, // Use first data key as value
        }));

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={`${innerRadius}%`}
              outerRadius={`${outerRadius}%`}
              fill="#8884d8"
              dataKey="value"
              label={showLabels}
              isAnimationActive={!disableAnimation}
            >
              {pieData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={defaultPalette[index % defaultPalette.length]} />
              ))}
            </Pie>
            {tooltip.show && (
              <Tooltip
                contentStyle={{
                  backgroundColor: themeColors.bg.elevated,
                  border: `1px solid ${themeColors.border.default}`,
                  color: themeColors.text.primary,
                }}
              />
            )}
            {legend.show && <Legend {...legendProps} />}
          </PieChart>
        );
      }

      // type === 'radar'
      return (
          <RadarChart {...commonChartProps}>
            <PolarGrid stroke={themeColors.border.subtle} />
            <PolarAngleAxis dataKey={xAxisKey} stroke={themeColors.text.secondary} />
            <PolarRadiusAxis stroke={themeColors.text.secondary} />
            {tooltip.show && (
              <Tooltip
                contentStyle={{
                  backgroundColor: themeColors.bg.elevated,
                  border: `1px solid ${themeColors.border.default}`,
                  color: themeColors.text.primary,
                }}
              />
            )}
            {legend.show && <Legend {...legendProps} />}
            {dataKeys.map((key) => (
              <Radar
                key={key}
                name={key}
                dataKey={key}
                stroke={seriesColors[key]}
                fill={seriesColors[key]}
                fillOpacity={0.6}
                isAnimationActive={!disableAnimation}
              />
            ))}
          </RadarChart>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(styles.chartContainer, className)}
        role="img"
        aria-label={ariaLabel || `${type} chart`}
        title={description}
        {...props}
      >
        <ResponsiveContainer width={width} height={numericHeight}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    );
  }
);

Chart.displayName = 'Chart';

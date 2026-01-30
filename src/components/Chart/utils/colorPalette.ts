import type { ThemeColors } from '@/components/ThemeProvider';
import type { ChartDataPoint, ChartColors } from '../Chart.types';

/**
 * Parses an HSL color string to HSL values
 * Example: "hsl(210 47% 28%)" -> { h: 210, s: 47, l: 28 }
 */
function parseHSL(hslString: string): { h: number; s: number; l: number } | null {
  const match = hslString.match(/hsl\(\s*(\d+)\s+(\d+)%\s+(\d+)%\s*\)/);
  if (!match) {
    return null;
  }
  return {
    h: parseInt(match[1]),
    s: parseInt(match[2]),
    l: parseInt(match[3]),
  };
}

/**
 * Generates a palette of distinct colors for charts
 *
 * Strategy:
 * 1. Start with accent color (primary brand color)
 * 2. Use semantic colors (success, warning, error, info) for variety
 * 3. Generate additional colors by rotating hue
 * 4. Return array of 8 HSL color strings
 *
 * @param themeColors - Colors from useTheme()
 * @returns Array of 8 HSL color strings
 */
export function generateChartPalette(themeColors: ThemeColors): string[] {
  const palette: string[] = [];

  // Parse accent color as base
  const accentHSL = parseHSL(themeColors.accent);
  if (!accentHSL) {
    // Fallback if parsing fails
    return [
      'hsl(210 60% 50%)', // blue
      'hsl(142 60% 50%)', // green
      'hsl(38 90% 50%)',  // orange
      'hsl(0 84% 60%)',   // red
      'hsl(280 60% 50%)', // purple
      'hsl(170 60% 50%)', // cyan
      'hsl(45 90% 50%)',  // yellow
      'hsl(320 60% 50%)', // pink
    ];
  }

  const { h: baseHue, s: baseSat, l: baseLightness } = accentHSL;

  // Color 1: Accent color itself
  palette.push(themeColors.accent);

  // Color 2: Success color (green)
  palette.push(themeColors.success.text);

  // Color 3: Rotate hue by 60° (analogous)
  palette.push(`hsl(${(baseHue + 60) % 360} ${baseSat}% ${baseLightness}%)`);

  // Color 4: Warning color (amber/orange)
  palette.push(themeColors.warning.text);

  // Color 5: Rotate hue by 180° (complementary)
  palette.push(`hsl(${(baseHue + 180) % 360} ${baseSat}% ${baseLightness}%)`);

  // Color 6: Error color (red)
  palette.push(themeColors.error.text);

  // Color 7: Rotate hue by 240° (triadic)
  palette.push(`hsl(${(baseHue + 240) % 360} ${baseSat}% ${baseLightness}%)`);

  // Color 8: Info color (teal/blue)
  palette.push(themeColors.info.text);

  return palette;
}

/**
 * Extracts data series keys from chart data
 * (Excludes 'name' key which is typically the X-axis)
 */
export function extractDataKeys(data: ChartDataPoint[]): string[] {
  if (data.length === 0) {
    return [];
  }

  const firstItem = data[0];
  return Object.keys(firstItem).filter(key => key !== 'name');
}

/**
 * Applies custom colors to data series
 *
 * @param dataKeys - Array of series keys from data
 * @param customColors - Optional custom color configuration
 * @param defaultPalette - Generated palette from theme
 * @returns Map of series key to color
 */
export function mapSeriesToColors(
  dataKeys: string[],
  customColors: ChartColors | undefined,
  defaultPalette: string[]
): Record<string, string> {
  const colorMap: Record<string, string> = {};

  // Priority 1: Specific series colors
  if (customColors?.seriesColors) {
    Object.assign(colorMap, customColors.seriesColors);
  }

  // Priority 2: Custom colors array
  const colorsToUse = customColors?.colors || defaultPalette;

  // Assign colors to remaining series
  let colorIndex = 0;
  dataKeys.forEach((key) => {
    if (!colorMap[key]) {
      colorMap[key] = colorsToUse[colorIndex % colorsToUse.length];
      colorIndex++;
    }
  });

  return colorMap;
}

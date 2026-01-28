import { describe, it, expect } from 'vitest';
import { generateChartPalette, extractDataKeys, mapSeriesToColors } from './colorPalette';
import type { ThemeColors } from '@/components/ThemeProvider';

describe('colorPalette', () => {
  const mockThemeColors: ThemeColors = {
    bg: {
      base: 'hsl(0 0% 0%)',
      primary: 'hsl(0 0% 0%)',
      elevated: 'hsl(0 0% 10%)',
      secondary: 'hsl(0 0% 10%)',
      tertiary: 'hsl(0 0% 20%)',
      overlay: 'hsl(0 0% 10%)',
      inverse: 'hsl(0 0% 100%)',
    },
    text: {
      primary: 'hsl(0 0% 100%)',
      secondary: 'hsl(0 0% 70%)',
      tertiary: 'hsl(0 0% 50%)',
      disabled: 'hsl(0 0% 40%)',
      inverse: 'hsl(0 0% 0%)',
      onPrimary: 'hsl(0 0% 100%)',
    },
    border: {
      default: 'hsl(0 0% 30%)',
      subtle: 'hsl(0 0% 20%)',
      focus: 'hsl(210 60% 50%)',
      error: 'hsl(0 84% 60%)',
    },
    primary: 'hsl(210 60% 50%)',
    primaryHover: 'hsl(210 60% 40%)',
    primaryActive: 'hsl(210 60% 60%)',
    primaryDisabled: 'hsl(0 0% 30%)',
    primaryText: 'hsl(210 60% 70%)',
    secondary: 'hsl(0 0% 20%)',
    secondaryHover: 'hsl(0 0% 30%)',
    secondaryActive: 'hsl(0 0% 40%)',
    success: {
      bg: 'hsl(142 60% 50%)',
      text: 'hsl(142 60% 40%)',
      border: 'hsl(142 60% 50%)',
    },
    warning: {
      bg: 'hsl(38 90% 50%)',
      text: 'hsl(38 90% 40%)',
      border: 'hsl(38 90% 50%)',
    },
    error: {
      bg: 'hsl(0 84% 60%)',
      text: 'hsl(0 84% 40%)',
      border: 'hsl(0 84% 60%)',
    },
    info: {
      bg: 'hsl(170 60% 50%)',
      text: 'hsl(170 60% 40%)',
      border: 'hsl(170 60% 50%)',
    },
    accent: 'hsl(280 60% 50%)',
    accentSubtle: 'hsl(280 60% 50% / 0.15)',
    focusRing: 'hsl(210 60% 50%)',
    focusRingOffset: 'hsl(0 0% 0%)',
  };

  describe('generateChartPalette', () => {
    it('should generate 8 colors from theme', () => {
      const palette = generateChartPalette(mockThemeColors);
      expect(palette).toHaveLength(8);
    });

    it('should include accent color as first color', () => {
      const palette = generateChartPalette(mockThemeColors);
      expect(palette[0]).toBe(mockThemeColors.accent);
    });

    it('should include semantic colors', () => {
      const palette = generateChartPalette(mockThemeColors);
      expect(palette).toContain(mockThemeColors.success.text);
      expect(palette).toContain(mockThemeColors.warning.text);
      expect(palette).toContain(mockThemeColors.error.text);
      expect(palette).toContain(mockThemeColors.info.text);
    });

    it('should return valid HSL color strings', () => {
      const palette = generateChartPalette(mockThemeColors);
      palette.forEach((color) => {
        expect(color).toMatch(/^hsl\(\d+\s+\d+%\s+\d+%\)$/);
      });
    });
  });

  describe('extractDataKeys', () => {
    it('should extract data keys excluding name', () => {
      const data = [
        { name: 'Jan', sales: 100, revenue: 200 },
        { name: 'Feb', sales: 150, revenue: 250 },
      ];
      const keys = extractDataKeys(data);
      expect(keys).toEqual(['sales', 'revenue']);
    });

    it('should return empty array for empty data', () => {
      const keys = extractDataKeys([]);
      expect(keys).toEqual([]);
    });

    it('should handle single data point', () => {
      const data = [{ name: 'Single', value: 100 }];
      const keys = extractDataKeys(data);
      expect(keys).toEqual(['value']);
    });
  });

  describe('mapSeriesToColors', () => {
    const defaultPalette = [
      'hsl(210 60% 50%)',
      'hsl(142 60% 50%)',
      'hsl(38 90% 50%)',
    ];

    it('should map series to default palette colors', () => {
      const dataKeys = ['sales', 'revenue'];
      const colorMap = mapSeriesToColors(dataKeys, undefined, defaultPalette);
      expect(colorMap).toEqual({
        sales: 'hsl(210 60% 50%)',
        revenue: 'hsl(142 60% 50%)',
      });
    });

    it('should use custom colors array when provided', () => {
      const dataKeys = ['sales', 'revenue'];
      const customColors = { colors: ['#ff0000', '#00ff00'] };
      const colorMap = mapSeriesToColors(dataKeys, customColors, defaultPalette);
      expect(colorMap).toEqual({
        sales: '#ff0000',
        revenue: '#00ff00',
      });
    });

    it('should prioritize seriesColors over colors array', () => {
      const dataKeys = ['sales', 'revenue'];
      const customColors = {
        colors: ['#ff0000', '#00ff00'],
        seriesColors: { sales: '#0000ff' },
      };
      const colorMap = mapSeriesToColors(dataKeys, customColors, defaultPalette);
      expect(colorMap).toEqual({
        sales: '#0000ff',
        revenue: '#ff0000',
      });
    });

    it('should cycle through colors for more series than colors', () => {
      const dataKeys = ['a', 'b', 'c', 'd', 'e'];
      const shortPalette = ['#ff0000', '#00ff00'];
      const colorMap = mapSeriesToColors(dataKeys, undefined, shortPalette);
      expect(colorMap.a).toBe('#ff0000');
      expect(colorMap.b).toBe('#00ff00');
      expect(colorMap.c).toBe('#ff0000');
      expect(colorMap.d).toBe('#00ff00');
      expect(colorMap.e).toBe('#ff0000');
    });
  });
});

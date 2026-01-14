import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeProvider';

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset data-theme attribute
    document.documentElement.removeAttribute('data-theme');
  });

  describe('Basic functionality', () => {
    it('renders children', () => {
      render(
        <ThemeProvider>
          <div>Test Content</div>
        </ThemeProvider>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies default theme to document', () => {
      render(
        <ThemeProvider defaultTheme="dark">
          <div>Content</div>
        </ThemeProvider>
      );

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('applies light theme when specified', () => {
      render(
        <ThemeProvider defaultTheme="light">
          <div>Content</div>
        </ThemeProvider>
      );

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  describe('useTheme hook', () => {
    it('provides theme, resolvedTheme, setTheme, and colors', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.theme).toBe('dark');
      expect(result.current.resolvedTheme).toBe('dark');
      expect(typeof result.current.setTheme).toBe('function');
      expect(result.current.colors).toBeDefined();
    });

    it('exposes colors object with correct structure', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      // Check that colors object has expected structure
      expect(result.current.colors).toHaveProperty('bg');
      expect(result.current.colors).toHaveProperty('text');
      expect(result.current.colors).toHaveProperty('border');
      expect(result.current.colors).toHaveProperty('primary');
      expect(result.current.colors).toHaveProperty('secondary');
      expect(result.current.colors).toHaveProperty('success');
      expect(result.current.colors).toHaveProperty('warning');
      expect(result.current.colors).toHaveProperty('error');
      expect(result.current.colors).toHaveProperty('info');
      expect(result.current.colors).toHaveProperty('accent');
      expect(result.current.colors).toHaveProperty('focusRing');

      // Check nested structure
      expect(result.current.colors.bg).toHaveProperty('base');
      expect(result.current.colors.bg).toHaveProperty('primary');
      expect(result.current.colors.bg).toHaveProperty('elevated');

      expect(result.current.colors.text).toHaveProperty('primary');
      expect(result.current.colors.text).toHaveProperty('secondary');

      expect(result.current.colors.border).toHaveProperty('default');
      expect(result.current.colors.border).toHaveProperty('subtle');

      expect(result.current.colors.success).toHaveProperty('bg');
      expect(result.current.colors.success).toHaveProperty('text');
      expect(result.current.colors.success).toHaveProperty('border');
    });

    it('returns color values as strings', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      // Colors should be string values (either empty for SSR or actual color values)
      expect(typeof result.current.colors.primary).toBe('string');
      expect(typeof result.current.colors.bg.base).toBe('string');
      expect(typeof result.current.colors.text.primary).toBe('string');
      expect(typeof result.current.colors.border.default).toBe('string');
    });

    it('updates colors when theme changes', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      const darkColors = result.current.colors;

      // Change theme to light
      await act(async () => {
        result.current.setTheme('light');
        // Wait for requestAnimationFrame
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(result.current.resolvedTheme).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');

      // Colors should be updated (object reference should change)
      expect(result.current.colors).not.toBe(darkColors);
    });

    it('throws error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = () => {};

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');

      console.error = originalError;
    });
  });

  describe('Theme persistence', () => {
    it('saves theme to localStorage', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider storageKey="test-theme">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme('light');
      });

      expect(localStorage.getItem('test-theme')).toBe('light');
    });

    it('loads theme from localStorage on mount', () => {
      localStorage.setItem('test-theme', 'light');

      render(
        <ThemeProvider storageKey="test-theme" defaultTheme="dark">
          <div>Content</div>
        </ThemeProvider>
      );

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  describe('System theme', () => {
    it('uses system theme when theme is "system"', () => {
      // Mock matchMedia to return dark mode
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        }),
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.theme).toBe('system');
      expect(result.current.resolvedTheme).toBe('dark');
    });
  });
});

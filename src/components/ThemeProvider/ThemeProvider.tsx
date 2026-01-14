import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import type {
  Theme,
  ResolvedTheme,
  ThemeProviderProps,
  ThemeProviderContextValue,
  ThemeColors,
} from './ThemeProvider.types';

const ThemeProviderContext = createContext<ThemeProviderContextValue | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return 'dark';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Reads computed CSS custom properties from the document root
 * and returns them as a structured ThemeColors object
 */
function getThemeColors(): ThemeColors {
  if (typeof window === 'undefined') {
    // Return placeholder values for SSR
    return {
      bg: {
        base: '',
        primary: '',
        elevated: '',
        secondary: '',
        tertiary: '',
        overlay: '',
        inverse: '',
      },
      text: {
        primary: '',
        secondary: '',
        tertiary: '',
        disabled: '',
        inverse: '',
        onPrimary: '',
      },
      border: {
        default: '',
        subtle: '',
        focus: '',
        error: '',
      },
      primary: '',
      primaryHover: '',
      primaryActive: '',
      primaryDisabled: '',
      secondary: '',
      secondaryHover: '',
      secondaryActive: '',
      success: { bg: '', text: '', border: '' },
      warning: { bg: '', text: '', border: '' },
      error: { bg: '', text: '', border: '' },
      info: { bg: '', text: '', border: '' },
      accent: '',
      accentSubtle: '',
      focusRing: '',
      focusRingOffset: '',
    };
  }

  const styles = getComputedStyle(document.documentElement);
  const getVar = (name: string) => styles.getPropertyValue(name).trim();

  return {
    bg: {
      base: getVar('--boom-theme-bg-base'),
      primary: getVar('--boom-theme-bg-primary'),
      elevated: getVar('--boom-theme-bg-elevated'),
      secondary: getVar('--boom-theme-bg-secondary'),
      tertiary: getVar('--boom-theme-bg-tertiary'),
      overlay: getVar('--boom-theme-bg-overlay'),
      inverse: getVar('--boom-theme-bg-inverse'),
    },
    text: {
      primary: getVar('--boom-theme-text-primary'),
      secondary: getVar('--boom-theme-text-secondary'),
      tertiary: getVar('--boom-theme-text-tertiary'),
      disabled: getVar('--boom-theme-text-disabled'),
      inverse: getVar('--boom-theme-text-inverse'),
      onPrimary: getVar('--boom-theme-text-on-primary'),
    },
    border: {
      default: getVar('--boom-theme-border-default'),
      subtle: getVar('--boom-theme-border-subtle'),
      focus: getVar('--boom-theme-border-focus'),
      error: getVar('--boom-theme-border-error'),
    },
    primary: getVar('--boom-theme-primary'),
    primaryHover: getVar('--boom-theme-primary-hover'),
    primaryActive: getVar('--boom-theme-primary-active'),
    primaryDisabled: getVar('--boom-theme-primary-disabled'),
    secondary: getVar('--boom-theme-secondary'),
    secondaryHover: getVar('--boom-theme-secondary-hover'),
    secondaryActive: getVar('--boom-theme-secondary-active'),
    success: {
      bg: getVar('--boom-theme-success-bg'),
      text: getVar('--boom-theme-success-text'),
      border: getVar('--boom-theme-success-border'),
    },
    warning: {
      bg: getVar('--boom-theme-warning-bg'),
      text: getVar('--boom-theme-warning-text'),
      border: getVar('--boom-theme-warning-border'),
    },
    error: {
      bg: getVar('--boom-theme-error-bg'),
      text: getVar('--boom-theme-error-text'),
      border: getVar('--boom-theme-error-border'),
    },
    info: {
      bg: getVar('--boom-theme-info-bg'),
      text: getVar('--boom-theme-info-text'),
      border: getVar('--boom-theme-info-border'),
    },
    accent: getVar('--boom-theme-accent'),
    accentSubtle: getVar('--boom-theme-accent-subtle'),
    focusRing: getVar('--boom-theme-focus-ring'),
    focusRingOffset: getVar('--boom-theme-focus-ring-offset'),
  };
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'boom-ui-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return defaultTheme;
    }

    const stored = localStorage.getItem(storageKey);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return defaultTheme;
  });

  // Track system theme changes when in system mode
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme());

  // Derive resolved theme from current theme and system theme
  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  // Track theme colors (computed from CSS variables)
  const [colors, setColors] = useState<ThemeColors>(() => getThemeColors());

  useEffect(() => {
    // Update DOM and localStorage
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    localStorage.setItem(storageKey, theme);

    // Update colors after DOM is updated (use requestAnimationFrame to ensure paint)
    requestAnimationFrame(() => {
      setColors(getThemeColors());
    });
  }, [resolvedTheme, theme, storageKey]);

  useEffect(() => {
    if (theme !== 'system') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      setSystemTheme(getSystemTheme());
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const value: ThemeProviderContextValue = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      colors,
    }),
    [theme, resolvedTheme, setTheme, colors]
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeProviderContextValue {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

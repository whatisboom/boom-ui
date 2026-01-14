export type Theme = 'light' | 'dark' | 'system';

export type ResolvedTheme = 'light' | 'dark';

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

/**
 * Theme color tokens accessible from JavaScript/TypeScript
 * Maps to CSS variables defined in theme.css
 */
export interface ThemeColors {
  // Background colors
  bg: {
    base: string;
    primary: string;
    elevated: string;
    secondary: string;
    tertiary: string;
    overlay: string;
    inverse: string;
  };

  // Text colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
    onPrimary: string;
  };

  // Border colors
  border: {
    default: string;
    subtle: string;
    focus: string;
    error: string;
  };

  // Interactive colors
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryDisabled: string;

  secondary: string;
  secondaryHover: string;
  secondaryActive: string;

  // Semantic state colors
  success: {
    bg: string;
    text: string;
    border: string;
  };

  warning: {
    bg: string;
    text: string;
    border: string;
  };

  error: {
    bg: string;
    text: string;
    border: string;
  };

  info: {
    bg: string;
    text: string;
    border: string;
  };

  // Accent and focus
  accent: string;
  accentSubtle: string;
  focusRing: string;
  focusRingOffset: string;
}

export interface ThemeProviderContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  colors: ThemeColors;
}

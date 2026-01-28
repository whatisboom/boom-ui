import React, { useEffect } from 'react';
import type { Decorator } from '@storybook/react-vite';
import { useDarkMode } from '@storybook-community/storybook-dark-mode';
import { ThemeProvider } from '../../src/components/ThemeProvider';

export const ThemeDecorator: Decorator = (Story) => {
  const isDark = useDarkMode();
  const theme = isDark ? 'dark' : 'light';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.margin = '0';
  }, [theme]);

  return (
    <div style={{ padding: '1rem' }}>
      <ThemeProvider defaultTheme={theme}>
        <Story />
      </ThemeProvider>
    </div>
  );
};

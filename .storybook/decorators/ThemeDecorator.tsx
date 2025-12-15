import React, { useEffect } from 'react';
import type { Decorator } from '@storybook/react';
import { useDarkMode } from 'storybook-dark-mode';
import { ThemeProvider } from '../../src/components/ThemeProvider';

export const ThemeDecorator: Decorator = (Story) => {
  const isDark = useDarkMode();
  const theme = isDark ? 'dark' : 'light';
  const backgroundColor = isDark ? '#1e293b' : '#ffffff';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.margin = '0';
  }, [theme, backgroundColor]);

  return (
    <div style={{ backgroundColor, padding: '1rem' }}>
      <ThemeProvider defaultTheme={theme}>
        <Story />
      </ThemeProvider>
    </div>
  );
};

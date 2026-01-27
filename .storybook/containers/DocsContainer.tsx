import React, { useEffect, useState } from 'react';
import { DocsContainer as BaseContainer } from '@storybook/addon-docs/blocks';
import { addons } from 'storybook/preview-api';
import { DARK_MODE_EVENT_NAME } from '@storybook-community/storybook-dark-mode';

const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem('sb-addon-themes-3');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.current === 'dark';
    }
  } catch (e) {
    // Fallback to dark mode default
  }
  return true;
};

export const DocsContainer = ({ children, context }: any) => {
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    const channel = addons.getChannel();
    channel.on(DARK_MODE_EVENT_NAME, setIsDark);
    return () => channel.off(DARK_MODE_EVENT_NAME, setIsDark);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return <BaseContainer context={context}>{children}</BaseContainer>;
};

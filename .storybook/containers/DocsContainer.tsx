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
    const backgroundColor = isDark ? '#1e293b' : '#ffffff';
    const textColor = isDark ? '#e2e8f0' : '#1e293b';
    const secondaryBg = isDark ? '#334155' : '#f8fafc';
    const borderColor = isDark ? '#475569' : '#e2e8f0';

    document.body.style.backgroundColor = backgroundColor;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

    // Style all Storybook Docs elements
    const selectors = [
      '.sb-wrapper',
      '.sb-argstableBlock',
      '.sb-argstableBlock table',
      '.sb-argstableBlock thead',
      '.sb-argstableBlock tbody tr',
      '.sb-previewBlock',
      '.sb-heading',
    ];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        (el as HTMLElement).style.backgroundColor = backgroundColor;
        (el as HTMLElement).style.color = textColor;
        (el as HTMLElement).style.borderColor = borderColor;
      });
    });

    // Style headings specifically
    document.querySelectorAll('.sb-wrapper h1, .sb-wrapper h2, .sb-wrapper h3, .sb-wrapper h4, .sb-wrapper h5, .sb-wrapper h6').forEach(el => {
      (el as HTMLElement).style.color = textColor;
    });

    // Style table headers with secondary background
    document.querySelectorAll('.sb-argstableBlock th').forEach(el => {
      (el as HTMLElement).style.backgroundColor = secondaryBg;
      (el as HTMLElement).style.color = textColor;
      (el as HTMLElement).style.borderColor = borderColor;
    });

    // Style table cells
    document.querySelectorAll('.sb-argstableBlock td').forEach(el => {
      (el as HTMLElement).style.backgroundColor = backgroundColor;
      (el as HTMLElement).style.color = textColor;
      (el as HTMLElement).style.borderColor = borderColor;
    });

    // Style form controls (inputs, textareas, selects, buttons)
    const controlSelectors = [
      '.sb-argstableBlock input',
      '.sb-argstableBlock textarea',
      '.sb-argstableBlock select',
      '.sb-wrapper input',
      '.sb-wrapper textarea',
      '.sb-wrapper select',
    ];

    controlSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        (el as HTMLElement).style.backgroundColor = secondaryBg;
        (el as HTMLElement).style.color = textColor;
        (el as HTMLElement).style.borderColor = borderColor;
      });
    });

    // Style buttons
    document.querySelectorAll('.sb-argstableBlock button, .sb-wrapper button').forEach(el => {
      (el as HTMLElement).style.backgroundColor = secondaryBg;
      (el as HTMLElement).style.color = textColor;
      (el as HTMLElement).style.borderColor = borderColor;
    });

    // Style preview window titlebars
    document.querySelectorAll('.css-l1e2yg').forEach(el => {
      (el as HTMLElement).style.backgroundColor = secondaryBg;
      (el as HTMLElement).style.borderColor = borderColor;
    });

    // Style tag/pill elements for value options and defaults
    document.querySelectorAll('.css-o1d7ko').forEach(el => {
      (el as HTMLElement).style.backgroundColor = secondaryBg;
      (el as HTMLElement).style.color = textColor;
      (el as HTMLElement).style.borderColor = borderColor;
    });
  }, [isDark]);

  return <BaseContainer context={context}>{children}</BaseContainer>;
};

import type { Preview } from '@storybook/react-vite';
import { themes } from 'storybook/theming';
import '../src/styles/index.css';
import { ThemeDecorator } from './decorators/ThemeDecorator';
import { DocsContainer } from './containers/DocsContainer';

const preview: Preview = {
  decorators: [ThemeDecorator],

  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      options: {
        dark: {
          name: 'dark',
          value: '#1e293b',
        },

        light: {
          name: 'light',
          value: '#ffffff',
        }
      }
    },
    docs: {
      container: DocsContainer,
    },
    darkMode: {
      dark: { ...themes.dark, appBg: '#1e293b', appContentBg: '#1e293b' },
      light: { ...themes.light, appBg: '#ffffff', appContentBg: '#ffffff' },
      current: 'dark',
      stylePreview: true,
      darkClass: 'dark',
      lightClass: 'light',
      classTarget: 'html',
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },

      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'dark'
    }
  },

  tags: ['autodocs']
};

export default preview;

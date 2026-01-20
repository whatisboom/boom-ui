import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook-community/storybook-dark-mode',
    '@storybook/addon-docs',
    '@storybook/addon-vitest'
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  docs: {
    autodocs: 'tag',
    source: {
      // Show rendered JSX instead of story args object
      type: 'dynamic',
    },
  },

  typescript: {
    // Use TypeScript for type extraction instead of react-docgen
    reactDocgen: 'react-docgen-typescript',
    // Check types but don't fail on errors
    check: false,
  },
};

export default config;

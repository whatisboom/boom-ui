import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import { fixupPluginRules } from '@eslint/compat';
import storybookPlugin from 'eslint-plugin-storybook';

export default [
  // Global ignores
  {
    ignores: ['dist', 'node_modules', '.eslintrc.cjs'],
  },

  // Base ESLint recommended config
  js.configs.recommended,

  // TypeScript ESLint recommended config
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json'],
        ecmaVersion: 2020,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },

  // React plugin recommended config
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/no-unstable-nested-components': 'error',
      'react/jsx-no-constructed-context-values': 'warn',
      'react/jsx-no-useless-fragment': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  // React Hooks plugin
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },

  // JSX A11y plugin
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      ...jsxA11yPlugin.configs.recommended.rules,
    },
  },

  // Storybook plugin
  {
    files: ['**/*.stories.{js,jsx,ts,tsx}'],
    plugins: {
      storybook: storybookPlugin,
    },
    rules: {
      ...storybookPlugin.configs.recommended.overrides[0].rules,
    },
  },

  // React Refresh plugin
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // Custom configuration for all files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
        React: 'readonly',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off', // TypeScript provides type checking
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'smart'],
      'curly': ['error', 'all'],
    },
  },
];

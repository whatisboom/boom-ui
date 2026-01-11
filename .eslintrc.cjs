module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:jsx-a11y/recommended', 'plugin:storybook/recommended'],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'jsx-a11y'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off', // TypeScript provides type checking
    '@typescript-eslint/no-explicit-any': 'error',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'CallExpression[callee.property.name="addEventListener"]',
        message: 'Ensure addEventListener has corresponding removeEventListener in useEffect cleanup'
      },
      {
        selector: 'CallExpression[callee.name="setTimeout"]',
        message: 'setTimeout must be cleaned up in useEffect - store the timer ID and call clearTimeout in cleanup function'
      },
      {
        selector: 'CallExpression[callee.name="setInterval"]',
        message: 'setInterval must be cleaned up in useEffect - store the timer ID and call clearInterval in cleanup function'
      },
      {
        selector: 'CallExpression[callee.name="requestAnimationFrame"]',
        message: 'requestAnimationFrame must be cancelled in useEffect - store the frame ID and call cancelAnimationFrame in cleanup function'
      }
    ],
  },
};

# Technology Stack

**Analysis Date:** 2026-01-19

## Languages

**Primary:**
- TypeScript 5.3.3 - All source code (`src/**/*.ts`, `src/**/*.tsx`)
- CSS 3 - Styling via CSS Modules and design tokens

**Secondary:**
- JavaScript (ES2020) - Configuration files (`*.config.js`, `*.config.ts`)

## Runtime

**Environment:**
- Node.js 24 (specified in CI/CD workflows)
- npm 11+ (pinned to ^11.6.0 for OIDC provenance support)

**Package Manager:**
- npm (version 11+)
- Lockfile: `package-lock.json` (present)
- Package type: ES modules (`"type": "module"` in `package.json`)

## Frameworks

**Core:**
- React 19.2.3 - UI component library foundation
- Framer Motion 12.23.26 - Animation system for transitions and interactions

**Testing:**
- Vitest 4.0.17 - Unit testing framework with coverage
- @testing-library/react 16.3.1 - Component testing utilities
- @testing-library/user-event 14.5.1 - User interaction simulation
- vitest-axe 0.1.0 - Accessibility testing
- jsdom 23.0.1 - DOM environment for tests
- Playwright 1.57.0 - Browser automation (for Storybook tests when enabled)

**Build/Dev:**
- Vite 7.3.1 - Build tool and dev server
- @vitejs/plugin-react 5.1.2 - React fast refresh and JSX transform
- vite-plugin-dts 4.5.4 - TypeScript declaration generation
- TypeScript Compiler 5.3.3 - Type checking and declaration files

**Documentation:**
- Storybook 10.1.10 - Component documentation and visual testing
- @storybook/react-vite 10.1.10 - Vite integration for Storybook
- @storybook/addon-a11y 10.1.10 - Accessibility audit addon
- @storybook-community/storybook-dark-mode 7.1.0 - Theme switching in Storybook
- @storybook/addon-docs 10.1.10 - Auto-generated documentation
- @storybook/addon-vitest 10.1.10 - Test integration addon

**Linting/Quality:**
- ESLint 9.39.2 - JavaScript/TypeScript linting
- @typescript-eslint/eslint-plugin 8.52.0 - TypeScript-specific rules
- eslint-plugin-react 7.33.2 - React-specific rules
- eslint-plugin-react-hooks 7.0.1 - React Hooks rules
- eslint-plugin-jsx-a11y 6.8.0 - Accessibility linting
- eslint-plugin-react-refresh 0.4.24 - Fast refresh validation
- eslint-plugin-storybook 10.1.10 - Storybook-specific rules

**Forms (Peer Dependencies):**
- react-hook-form 7.49.0+ - Form state management
- @hookform/resolvers 5.0.0+ - Form validation resolvers
- zod 4.0.0+ - Schema validation

**Git Hooks:**
- Husky 9.1.7 - Git hook management
- Pre-push hook runs: typecheck, lint, tests, security audit

## Key Dependencies

**Critical:**
- framer-motion 12.23.26 - Animation engine for all interactive components (tap effects, transitions)

**Development Only:**
- All testing, linting, build tools are devDependencies
- React, react-dom, react-hook-form, zod are peer dependencies (not bundled)

## Configuration

**Environment:**
- No `.env` files detected - library has no runtime environment variables
- Build-time configuration via `NODE_OPTIONS: --max-old-space-size=4096` for large builds

**Build:**
- `vite.config.ts` - Main library build configuration
- `vitest.config.ts` - Test runner configuration
- `tsconfig.json` - TypeScript compiler options
- `tsconfig.node.json` - Node-specific TypeScript config (referenced)
- `eslint.config.js` - ESLint flat config format
- `.storybook/main.ts` - Storybook configuration
- `.storybook/preview.ts` - Storybook preview settings

**TypeScript:**
- Target: ES2020
- Module: ESNext
- JSX: react-jsx (new transform, React 17+ style)
- Strict mode: enabled
- Path alias: `@/*` → `src/*`

**CSS:**
- CSS Modules with scoped naming: `[name]__[local]___[hash:base64:5]`
- Design tokens in `src/styles/tokens/*.css`
- Global styles in `src/styles/index.css`

**Output:**
- Main entry: `./dist/index.js` (ES modules)
- Form entry: `./dist/form.js` (separate entry point)
- Types: `./dist/index.d.ts`, `./dist/form.d.ts`
- Styles: `./dist/boom-ui.css`
- Formats: ES modules only (no CommonJS/UMD)
- Sourcemaps: enabled

## Platform Requirements

**Development:**
- Node.js 24
- npm 11+
- 4GB+ memory available (due to `--max-old-space-size=4096`)

**Production:**
- Published to npm as `@whatisboom/boom-ui`
- Peer dependencies required: React 19.2.3+, react-dom 19.2.3+
- Optional peer dependencies: react-hook-form 7.49.0+, zod 4.0.0+, @hookform/resolvers 5.0.0+
- No runtime dependencies (framer-motion is the only production dependency)

**CI/CD:**
- GitHub Actions for PR checks, releases, Storybook deployment
- Playwright browsers installed for visual testing
- Automated publishing with npm OIDC provenance (no long-lived tokens)

**Module Federation:**
- Alternative build config exists: `vite.mf.config.ts`
- Uses `@originjs/vite-plugin-federation` 1.3.5
- For micro-frontend architectures (optional build mode)

---

*Stack analysis: 2026-01-19*

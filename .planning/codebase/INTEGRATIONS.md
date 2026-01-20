# External Integrations

**Analysis Date:** 2026-01-19

## APIs & External Services

**None:**
- This is a UI component library with no external API dependencies
- No third-party service integrations detected
- All functionality is client-side React components

## Data Storage

**Databases:**
- None - Component library has no database dependencies

**File Storage:**
- Local filesystem only (for Storybook static builds)

**Caching:**
- Browser localStorage - Used by `ThemeProvider` for theme persistence
  - Storage key: `boom-ui-theme` (configurable via `storageKey` prop)
  - Values: `'light'`, `'dark'`, or `'system'`
  - Implementation: `src/components/ThemeProvider/ThemeProvider.tsx`

**Session Storage:**
- Not used

## Authentication & Identity

**Auth Provider:**
- None - Component library does not handle authentication
- Consumers are responsible for implementing auth in their applications

## Monitoring & Observability

**Error Tracking:**
- None - No built-in error tracking services
- Includes `ErrorBoundary` component (`src/components/ErrorBoundary/`) for consumer use

**Logs:**
- Development console only
- No external logging services

**Analytics:**
- None - No analytics or telemetry

## CI/CD & Deployment

**Hosting:**
- npm registry - Published as `@whatisboom/boom-ui`
  - Registry: https://registry.npmjs.org
  - Publishing method: npm OIDC trusted publishing (provenance enabled)
  - Access: public
- GitHub Pages - Storybook documentation
  - Deployed from `main` branch via `.github/workflows/deploy-storybook.yml`
  - Static site in `storybook-static/` directory

**CI Pipeline:**
- GitHub Actions
  - PR checks: `.github/workflows/pr-checks.yml`
    - Type checking (Node 24, npm 11)
    - Linting (max warnings: 0)
    - Testing with Playwright browsers
    - Build verification
    - Storybook build
  - Auto-release: `.github/workflows/auto-release.yml`
    - Triggered on `main` branch pushes
    - Detects version changes in `package.json`
    - Creates git tags, publishes to npm, generates GitHub releases
    - Merges release branches back to `develop`
  - Storybook deployment: `.github/workflows/deploy-storybook.yml`
    - Builds and deploys to GitHub Pages on `main` pushes
  - Direct publish: `.github/workflows/publish.yml`
    - Triggered by version tags (`v*`)
    - Publishes to npm with provenance

**Version Control:**
- GitHub repository: `https://github.com/whatisboom/boom-ui.git`
- Git-flow branching model
  - `main` - Production releases
  - `develop` - Integration branch
  - `feature/*` - Feature development
  - `release/v*` - Release preparation
  - `hotfix/v*` - Emergency fixes

## Environment Configuration

**Required env vars:**
- None for library consumers
- CI/CD uses GitHub Actions secrets (OIDC authentication, no manual tokens)

**Build-time configuration:**
- `NODE_OPTIONS: --max-old-space-size=4096` - Memory allocation for builds/tests

**Secrets location:**
- No secrets required
- npm authentication via GitHub OIDC (ephemeral tokens)
- GitHub Actions uses built-in `GITHUB_TOKEN`

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Browser APIs

**Web Platform Features:**
- `window.matchMedia('(prefers-color-scheme: dark)')` - System theme detection in `ThemeProvider`
- `localStorage` - Theme preference persistence
- `document.documentElement` - CSS custom property reading and theme attribute setting
- `requestAnimationFrame` - Theme color updates after DOM paint
- Focus management APIs - `useFocusTrap` hook for modal/drawer components
- Scroll APIs - `useScrollLock` hook for preventing body scroll
- Click/keyboard event listeners - Various hooks (`useClickOutside`, `useKeyboardShortcut`)

**Media Query Listener:**
- System theme change detection
- Clean-up implemented for memory leak prevention

## Testing Infrastructure

**Testing Services:**
- Vitest (local test runner)
- Playwright (browser automation for Storybook tests when enabled)
- Coverage reports uploaded to GitHub Actions artifacts
  - Artifact name: `coverage-report`
  - Retention: 30 days
  - Includes HTML and JSON formats

**Accessibility Testing:**
- vitest-axe - Automated accessibility checks in unit tests
- Storybook a11y addon - Visual accessibility audit in Storybook
- wcag-contrast 3.0.0 - Color contrast validation

## Git Hooks

**Pre-push Hook:**
- Location: `.husky/pre-push`
- Checks run locally before push:
  1. Type checking (`npm run typecheck`)
  2. Linting in strict mode (`npm run lint`)
  3. Tests in strict mode (`npm run test:ci`)
  4. Security audit (`npm audit --audit-level=high`)
- Bypass: `git push --no-verify` (discouraged)

## Package Registry

**npm:**
- Registry: https://registry.npmjs.org
- Package name: `@whatisboom/boom-ui`
- Current version: 0.6.0
- Publishing:
  - Automated via GitHub Actions
  - Provenance attestation enabled
  - OIDC trusted publishing (no long-lived tokens)
  - Pre-publish checks enforced via `prepublishOnly` script

---

*Integration audit: 2026-01-19*

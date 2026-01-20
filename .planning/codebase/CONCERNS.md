# Codebase Concerns

**Analysis Date:** 2026-01-19

## Tech Debt

**Generic Type Assertions in Polymorphic Components:**
- Issue: Multiple components use type assertions to work around TypeScript's inability to properly infer generic type parameters across component boundaries
- Files: `src/components/Stack/Stack.tsx`, `src/components/Table/Table.tsx`, `src/components/Tooltip/Tooltip.tsx`, `src/components/Hero/Hero.tsx`, `src/components/Card/Card.tsx`
- Impact: Type safety is compromised with `@ts-expect-error` and `as unknown as` patterns. These are justified workarounds but represent TypeScript limitations that could mask real type errors if patterns are copied incorrectly.
- Fix approach: These are documented as necessary workarounds for React's polymorphic component patterns. Future TypeScript versions may improve generic inference. For now, ensure all usages are documented with clear comments explaining why the assertion is needed.

**ESLint Disable Comments Scattered Throughout Codebase:**
- Issue: 27+ ESLint disable comments across the codebase (react-hooks/exhaustive-deps, jsx-a11y rules, no-explicit-any, etc.)
- Files: `src/hooks/usePopoverPosition.ts`, `src/hooks/useStableCallback.ts`, `src/components/primitives/Overlay/Overlay.tsx`, `src/components/Hero/Hero.tsx`, `src/components/Card/Card.tsx`, `src/components/Stack/Stack.tsx`, `src/components/SearchCommand/SearchCommand.tsx`, `src/components/Toast/ToastProvider.tsx`, `src/components/Table/TableHeaderCell.test.tsx`, `src/components/Image/Image.tsx`, `src/components/NotificationMenu/NotificationMenu.tsx`, `src/components/ThemeProvider/ThemeProvider.tsx`, `src/components/Form/Form.test.tsx`, `src/components/Audio/Audio.tsx`, `src/components/Tooltip/Tooltip.tsx`, `src/components/Slider/Slider.tsx`, `src/vitest.d.ts`, `src/types/vitest-axe.d.ts`, `src/components/Video/Video.tsx`, `src/components/Tabs/TabList.tsx`, `src/components/Video/VideoControls.tsx`
- Impact: While most are well-justified with explanatory comments, they indicate areas where rules conflict with necessary patterns (e.g., React 19 ref handling, Framer Motion dynamic component creation, intentional setState in useEffect for prop syncing)
- Fix approach: All disables are documented. Review periodically as ESLint rules and React patterns evolve. Consider extracting common patterns (like polymorphic motion components) into reusable utilities to reduce repetition.

**motion.create() Pattern Creates Components on Every Render:**
- Issue: Hero and Card components use `useMemo(() => motion.create(Component), [Component])` which triggers ESLint rule `react-hooks/static-components`
- Files: `src/components/Hero/Hero.tsx`, `src/components/Card/Card.tsx`
- Impact: While memoized, this pattern is flagged by linting rules. The disable comment notes this is required for polymorphic motion components, but it's a potential performance consideration if Component identity changes frequently.
- Fix approach: Pattern is correct and necessary for Framer Motion with polymorphic `as` prop. Document this as an architectural decision. Consider creating a shared utility hook `useMotionComponent<E>(as: E)` to centralize the pattern.

**Complex Media Components with Low Test Coverage:**
- Issue: Video and Audio components have complex state management but coverage below 70%
- Files: `src/components/Video/Video.tsx` (62.76% statements, 50.61% branches), `src/components/Audio/Audio.tsx` (66% estimated), `src/components/Video/VideoControls.tsx` (74.15% statements, 83.92% branches, 69.44% functions)
- Impact: Complex state machines for playback, volume, captions, Picture-in-Picture, fullscreen are undertested. Bugs in edge cases (e.g., rapid user interactions, browser compatibility issues) may go undetected.
- Fix approach: Add browser-based tests using @vitest/browser-playwright (already installed) to test actual media playback scenarios. Increase coverage to 80% minimum to match project standards.

**Textarea Component Below Coverage Threshold:**
- Issue: Textarea has only 51.72% line coverage (threshold is 80%)
- Files: `src/components/Textarea/Textarea.tsx` (lines 41-60 untested)
- Impact: Auto-resize functionality and edge cases (maxRows, dynamically changing value) are not adequately tested
- Fix approach: Add tests for auto-resize behavior, maxRows constraints, and dynamic value changes. Test the resize cleanup on unmount.

## Known Bugs

**Keyboard Navigation in Portal Components Fails in jsdom:**
- Symptoms: Arrow key navigation doesn't move focus from body to button elements when component uses Portal in test environment
- Files: `src/components/SearchCommand/SearchCommand.motion-keyboard.test.tsx` (line 28)
- Trigger: Running keyboard navigation tests with jsdom environment. Portal-rendered elements don't receive focus correctly in jsdom.
- Workaround: Test is skipped with `.skip()`. Component works correctly in production and Storybook (verified manually).
- Fix approach: Investigate using @vitest/browser-playwright for Portal keyboard tests. This provides a real browser environment where focus behavior is correct. Alternatively, consider creating a custom test helper that manually manages focus for Portal elements in jsdom.

**Picture-in-Picture Request Silently Fails:**
- Symptoms: Video component logs warning but doesn't surface error to user
- Files: `src/components/Video/Video.tsx` (line 151: `console.warn('Picture-in-Picture request failed:', error)`)
- Trigger: Browser doesn't support PiP, or user gesture is missing, or PiP is blocked by policy
- Workaround: Error is only logged to console
- Fix approach: Add `onPictureInPictureError` callback prop to allow consumers to handle errors. Consider adding a toast notification or inline error message.

## Security Considerations

**No Security Vulnerabilities Detected:**
- Risk: npm audit shows 0 vulnerabilities as of analysis date
- Current mitigation: Pre-push hooks run `npm audit`, GitHub Actions run security checks
- Recommendations: Continue monitoring. Security policy (`SECURITY.md`) and checklist (`SECURITY_CHECKLIST.md`) are comprehensive and enforced. React's built-in XSS protections are used throughout. No usage of `dangerouslySetInnerHTML` detected.

**Media Component URL Validation:**
- Risk: Video and Audio components accept arbitrary `src` URLs without validation
- Files: `src/components/Video/Video.tsx`, `src/components/Audio/Audio.tsx`
- Current mitigation: React's attribute escaping prevents direct XSS, but `javascript:` protocol URLs could be exploited if passed from untrusted sources
- Recommendations: Add URL protocol validation (allow only `http:`, `https:`, `blob:`, `data:` schemes). Reject `javascript:` and other potentially dangerous protocols.

## Performance Bottlenecks

**Large Story Files May Slow Storybook:**
- Problem: Some Story files exceed 1000 lines (e.g., `src/components/Table/Table.stories.tsx` at 1117 lines)
- Files: `src/components/Table/Table.stories.tsx` (1117 lines), `src/components/Grid/Grid.stories.tsx` (638 lines), `src/components/ThemeProvider/Theme.stories.tsx` (637 lines)
- Cause: Comprehensive examples for complex components with many variations
- Improvement path: Stories are valuable for documentation, but consider code-splitting large stories into separate files (e.g., `Table.stories.tsx`, `Table.sorting.stories.tsx`, `Table.pagination.stories.tsx`). Storybook supports multiple story files per component.

**IntersectionObserver Used Without Cleanup Check:**
- Problem: Image component uses IntersectionObserver for lazy loading (28 usages across codebase)
- Files: `src/components/Image/Image.tsx` (lines 31-55)
- Cause: Observer is disconnected on unmount, but edge cases (rapid mount/unmount cycles) could accumulate observers briefly
- Improvement path: Pattern is correct. Consider adding a ref flag to prevent observer creation if component unmounts before observer callback fires.

**Console.warn() Calls in Production Code:**
- Problem: Grid and Divider components log warnings to console in production
- Files: `src/components/Grid/Grid.tsx` (lines 27, 31), `src/components/Divider/Divider.tsx` (line 31)
- Cause: Developer feedback for incorrect prop combinations
- Improvement path: Consider using development-only warnings (`if (process.env.NODE_ENV !== 'production')`) to avoid console pollution in production. Alternatively, throw errors for invalid prop combinations during development.

## Fragile Areas

**Polymorphic Component Type System:**
- Files: `src/components/Stack/Stack.tsx`, `src/components/Box/Box.tsx`, `src/components/Hero/Hero.tsx`, `src/components/Card/Card.tsx`, `src/components/Typography/Typography.tsx`, `src/components/Container/Container.tsx`
- Why fragile: Generic type inference across component boundaries requires type assertions. Changes to PolymorphicProps or BoxProps types could cascade failures.
- Safe modification: Always test polymorphic components with multiple `as` prop values (div, section, article, etc.). Run full type checking (`npm run typecheck`) before committing changes to shared types.
- Test coverage: Comprehensive tests exist, but focus on runtime behavior. Type-level testing would catch regressions earlier.

**FormStepper Type Guard:**
- Files: `src/components/Form/FormStepper.tsx` (lines 11-30)
- Why fragile: Custom type guard `isFormStepElement` relies on runtime inspection of React element structure (`element.type.name === 'FormStep'`). Minification or component name changes could break this.
- Safe modification: Do not rename FormStep component. If refactoring, ensure tests cover FormStepper with multiple FormStep children.
- Test coverage: 414 lines of tests in `FormStepper.test.tsx` cover this extensively.

**Table Generic Context Value:**
- Files: `src/components/Table/Table.tsx` (line 71: `as unknown as TableContextValue<unknown>`)
- Why fragile: Context value is coerced to generic type. Child components (TableHead, TableBody, TableRow) rely on this context having correct generic type.
- Safe modification: Never modify TableContext value structure without updating all consuming components. Run all Table tests (`npm test -- Table`) before changes.
- Test coverage: 400+ line test files for TableHeaderCell and Table cover most scenarios.

## Scaling Limits

**Peer Dependencies Versioning:**
- Current capacity: Peer dependencies use caret ranges (^19.2.3 for React, ^7.49.0 for react-hook-form, ^5.0.0 for @hookform/resolvers, ^4.0.0 for Zod)
- Limit: Major version bumps of peer deps require consumer projects to upgrade. React 19 was recently adopted (see commit 56a13e3), which may cause friction for consumers still on React 18.
- Scaling path: Document peer dependency requirements prominently in README. Consider maintaining a React 18 compatible version branch if significant users need it. Monitor React 19 adoption before requiring next major version.

**Bundle Size with Media Components:**
- Current capacity: Video and Audio components include complex controls (VideoControls.tsx is 388 lines)
- Limit: Consumers who don't use media components still bundle this code
- Scaling path: Consider extracting media components to separate export path (e.g., `@whatisboom/boom-ui/media`) similar to existing `/form` export. This enables tree-shaking for projects that don't need media components.

**Storybook Build Size:**
- Current capacity: Comprehensive stories (1117 lines for Table) result in large Storybook builds
- Limit: Storybook is deployed to GitHub Pages (see `.github/workflows/deploy-storybook.yml`). Large builds slow down deployment and increase hosting costs.
- Scaling path: Enable Storybook lazy compilation for faster dev builds. Consider Storybook's static generation optimizations or CDN hosting for production docs site.

## Dependencies at Risk

**React 19 Early Adoption:**
- Risk: Library uses React 19.2.3, which was just released. Ecosystem tooling may have compatibility issues.
- Impact: Consumers using React 18 cannot use this library without upgrading. Type definitions for React 19 are still stabilizing.
- Migration plan: Monitor React 19 adoption in the ecosystem. Be prepared to pin to stable React 19 LTS version when available. Document migration path from React 18 in CHANGELOG.

**Framer Motion Major Version Changes:**
- Risk: Currently on framer-motion 12.26.2 (production dependency). Major version updates can introduce breaking changes to animation APIs.
- Impact: All animated components (Hero, Card, Toast, Modal, Drawer, Overlay) depend on Framer Motion. Breaking changes require updates across many components.
- Migration plan: Pin to specific minor version range in package.json. Test thoroughly before accepting major version updates. Consider using Framer Motion's `MotionConfig` for global animation settings to centralize changes.

**Zod 4.x in Peer Dependencies:**
- Risk: Form components require Zod ^4.0.0, but many projects use Zod 3.x
- Impact: Consumers must upgrade Zod to use Form components with validation
- Migration plan: Consider supporting both Zod 3.x and 4.x if breaking changes are minimal. Alternatively, document Zod 4 requirement clearly and provide migration guide.

## Missing Critical Features

**Form Validation Error Translations:**
- Problem: Form components display validation errors in English only
- Blocks: Internationalized applications cannot use Form components without custom error formatting
- Priority: Medium - workarounds exist (custom error messages), but i18n support is expected in modern component libraries

**Media Component Accessibility Features:**
- Problem: Video component lacks caption track selection UI, Audio component lacks transcript support
- Blocks: Meeting WCAG 2.1 AA requirements for media content. Captions data structure exists but no UI for users to toggle tracks.
- Priority: High - accessibility is a stated core principle of the library

**Theme Customization API:**
- Problem: ThemeProvider supports light/dark/system modes but no easy way to customize token values (colors, spacing, shadows)
- Blocks: Projects with custom design systems must fork/override CSS variables manually
- Priority: Medium - CSS variable override works but isn't documented or type-safe

**Responsive Component Props:**
- Problem: Only Grid component supports responsive prop values (breakpoint-based). Other layout components (Stack, Box, Container) require manual responsive CSS or media queries.
- Blocks: Building responsive layouts without custom CSS
- Priority: Low - CSS and media queries provide workarounds, but responsive props would improve DX

## Test Coverage Gaps

**Media Components Interactive Features:**
- What's not tested: Picture-in-Picture toggle, fullscreen API, volume slider interactions, playback rate changes, caption track switching, keyboard shortcuts, touch gestures
- Files: `src/components/Video/Video.tsx` (lines 100-200, 213, 317, 379-381 uncovered), `src/components/Audio/Audio.tsx` (estimated 34% lines untested), `src/components/Video/VideoControls.tsx` (lines 190-197, 296, 312 uncovered)
- Risk: Browser API interactions (requestPictureInPicture, requestFullscreen) and complex event sequences are not validated. Regressions in user interactions may go undetected.
- Priority: High - these are user-facing features that are difficult to test manually across browsers

**Form Stepper Edge Cases:**
- What's not tested: Keyboard navigation with disabled steps, screen reader announcements, step validation before navigation, dynamic step addition/removal
- Files: `src/components/Form/FormStepper.tsx` (lines 105-122 keyboard handlers partially covered)
- Risk: Accessibility features may degrade without tests. Complex state transitions could break.
- Priority: Medium - component has 414 lines of tests but keyboard navigation and a11y need more coverage

**Textarea Auto-Resize:**
- What's not tested: Auto-resize with maxRows constraint, rapid value changes, resize on paste, initial render with pre-filled value, cleanup when switching from auto to fixed resize
- Files: `src/components/Textarea/Textarea.tsx` (lines 41-60 untested)
- Risk: Auto-resize is a complex feature depending on DOM measurements and browser rendering. Edge cases (long words, emoji, RTL text) may break layout.
- Priority: High - below 80% coverage threshold, user-facing feature

**Portal Focus Management:**
- What's not tested: Focus trap behavior, focus restoration on close, keyboard navigation within Portal content, screen reader announcements
- Files: `src/components/primitives/Portal/Portal.tsx` (75% coverage, line 14 untested), `src/components/SearchCommand/SearchCommand.motion-keyboard.test.tsx` (skipped test)
- Risk: Accessibility features in Modal, Drawer, Popover depend on Portal. Focus management bugs create poor UX for keyboard/screen reader users.
- Priority: High - accessibility is a core principle

**ThemeProvider System Mode Detection:**
- What's not tested: System theme change detection while app is running, theme persistence across page reloads, theme inheritance in nested providers, CSS variable injection timing
- Files: `src/components/ThemeProvider/ThemeProvider.tsx` (91.11% coverage, lines 14, 26, 136, 174 untested)
- Risk: Theme switching is a core feature. Race conditions or missing event listeners could cause flickering or incorrect themes.
- Priority: Medium - high coverage but critical feature

**useMediaQuery Hook:**
- What's not tested: Media query changes during component lifecycle, multiple simultaneous media queries, cleanup on unmount, SSR behavior (initial value)
- Files: `src/hooks/useMediaQuery.ts` (78.57% coverage, lines 11, 18, 23 untested)
- Risk: Used by responsive features. Incorrect behavior could cause layout thrashing or memory leaks.
- Priority: Medium - hook is used but not extensively tested

---

*Concerns audit: 2026-01-19*

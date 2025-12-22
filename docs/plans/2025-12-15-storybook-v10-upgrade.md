# Storybook v7 → v10 Upgrade Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade Storybook from v7.6.7 to v10.1.7 for improved performance, modern UI, and active maintenance.

**Architecture:** Use Storybook's automated migration tool (`npx storybook@latest upgrade`) to handle package updates and configuration changes, then manually fix any compatibility issues with custom decorators and the dark mode addon.

**Tech Stack:** Storybook v10, React, Vite, TypeScript, storybook-dark-mode addon

---

## Current State

**Packages:**
- `storybook: ^7.6.7`
- `@storybook/addon-essentials: ^7.6.7`
- `@storybook/addon-a11y: ^7.6.7`
- `@storybook/react: ^7.6.7`
- `@storybook/react-vite: ^7.6.7`
- `storybook-dark-mode: ^4.0.2`

**Custom Configuration:**
- `.storybook/main.ts` - Main config
- `.storybook/preview.ts` - Preview config with dark mode
- `.storybook/decorators/ThemeDecorator.tsx` - Uses `useDarkMode()` hook
- `.storybook/containers/DocsContainer.tsx` - Custom docs styling with dark mode

---

## Task 1: Pre-Upgrade Verification

**Files:**
- None (verification only)

**Step 1: Check git status**

Run: `git status`
Expected: Clean working directory (all changes committed)

**Step 2: Note current version**

Run: `npm list storybook`
Expected: `storybook@7.6.20` or similar

**Step 3: Create checkpoint**

```bash
git log -1 --oneline
```

Note the commit hash for potential rollback.

---

## Task 2: Run Automated Upgrade

**Files:**
- Modify: `package.json` (all @storybook/* versions)
- Modify: `.storybook/main.ts` (potential config changes)
- Modify: `.storybook/preview.ts` (potential API changes)

**Step 1: Run upgrade command**

Run: `npx storybook@latest upgrade`

Expected output:
- Detection of current version
- List of packages to upgrade
- Automatic migration of config files
- Warnings about breaking changes

**Step 2: Review migration output**

Read the terminal output carefully for:
- Any warnings about deprecated features
- Manual migration steps required
- Breaking changes that need attention

**Step 3: Install dependencies**

Run: `npm install`

Expected: Clean installation with no errors

**Step 4: Verify package versions**

Run: `npm list storybook @storybook/react @storybook/react-vite`

Expected: All packages at v10.x.x

---

## Task 3: Check storybook-dark-mode Compatibility

**Files:**
- Check: `package.json` (storybook-dark-mode version)
- Research: npm/GitHub for compatibility

**Step 1: Check current addon version**

Run: `npm list storybook-dark-mode`

Expected: `storybook-dark-mode@4.0.2`

**Step 2: Research v10 compatibility**

Search online:
1. Visit: https://www.npmjs.com/package/storybook-dark-mode
2. Check peer dependencies for Storybook v10 support
3. Check GitHub issues for compatibility reports

**Step 3: Test if upgrade is needed**

If addon doesn't declare v10 peer dependency but no breaking issues reported:
- Proceed with current version
- Test thoroughly in Task 6

If addon is incompatible:
- Run: `npm install storybook-dark-mode@latest`
- Check if newer version exists

---

## Task 4: Fix Import Paths

**Files:**
- Modify: `.storybook/containers/DocsContainer.tsx:3`
- Modify: `.storybook/decorators/ThemeDecorator.tsx` (if needed)

**Step 1: Read DocsContainer imports**

Run: `head -10 .storybook/containers/DocsContainer.tsx`

Check line 3: `import { addons } from '@storybook/preview-api';`

**Step 2: Start Storybook to test imports**

Run: `npm run storybook`

Watch for import errors in terminal.

**Step 3: Fix import if broken**

If error says `@storybook/preview-api` not found, try:

```typescript
// Common v10 import paths:
import { addons } from '@storybook/manager-api';
// OR
import { addons } from '@storybook/preview-api'; // may still work
```

Replace at `.storybook/containers/DocsContainer.tsx:3` with working import.

**Step 4: Verify ThemeDecorator imports**

Check `.storybook/decorators/ThemeDecorator.tsx:2-3`:

```typescript
import type { Decorator } from '@storybook/react';
import { useDarkMode } from 'storybook-dark-mode';
```

If errors, update import paths based on v10 docs.

**Step 5: Restart Storybook**

Run: `npm run storybook`

Expected: Server starts without import errors

---

## Task 5: Update Custom CSS Selectors

**Files:**
- Modify: `.storybook/containers/DocsContainer.tsx:38-113`

**Step 1: Open Storybook in browser**

Navigate to: http://localhost:6006/
Click on any component's "Docs" tab

**Step 2: Inspect docs page elements**

Open browser DevTools
Check if these classes exist:
- `.sbdocs-content`
- `.sbdocs-wrapper`
- `.docblock-argstable`

**Step 3: Update selectors if changed**

If classes don't exist, find new class names in DevTools.

Common v10 changes:
- `.sbdocs` might be `.sb-docs`
- `.docblock-argstable` might be `.docblock-args-table`

Update array at `.storybook/containers/DocsContainer.tsx:38-48`:

```typescript
const selectors = [
  '.sb-docs-content',  // Update if changed
  '.sb-docs-wrapper',   // Update if changed
  '.sb-docs',           // Update if changed
  // ... etc
];
```

**Step 4: Test dark mode styling**

In Storybook:
1. Toggle dark mode (toolbar icon)
2. Verify docs page background changes
3. Verify tables are styled correctly
4. Verify text is readable

**Step 5: Commit selector updates**

```bash
git add .storybook/containers/DocsContainer.tsx
git commit -m "fix: update Storybook v10 CSS selectors for dark mode"
```

---

## Task 6: Test All Stories

**Files:**
- None (testing only)

**Step 1: Test Theme stories**

Navigate in Storybook:
1. Theme/Showcase
2. Theme/CustomHues
3. Theme/AdvancedCustomization
4. Theme/ThemeCustomizer

Expected: All load without errors, dark mode toggle works

**Step 2: Test component stories**

Navigate to each:
- Components/Button (all variants)
- Components/Card (all variants)
- Components/Input (all variants)
- Components/Slider (all examples)
- Components/Typography
- Components/Box
- Components/Stack

Expected: All render correctly, controls work

**Step 3: Test ThemeCustomizer specifically**

Navigate to: Theme/ThemeCustomizer

Verify:
- 3-column layout displays correctly
- All 18 sliders work
- Live preview updates when sliders change
- Generated code updates
- Light/dark theme toggle works
- Examples render with correct colors

**Step 4: Test accessibility addon**

Navigate to any component story
Click "Accessibility" tab

Expected: a11y checks run, violations shown (if any)

**Step 5: Test controls addon**

Navigate to Button story
Modify controls (variant, size, disabled)

Expected: Button updates in preview

**Step 6: Check browser console**

Open DevTools Console
Look for errors or warnings

Expected: No critical errors (minor warnings acceptable)

---

## Task 7: Run Type Checking

**Files:**
- Fix: Any TypeScript errors in story files

**Step 1: Run TypeScript compiler**

Run: `npm run typecheck`

**Step 2: Fix story type errors**

Common v10 type changes:

```typescript
// Old v7:
export const MyStory: Story = { ... }

// New v10 (if changed):
export const MyStory: StoryObj<typeof Component> = { ... }
```

If errors in `.stories.tsx` files, update type annotations.

**Step 3: Fix args type errors**

If Storybook complains about args typing:

```typescript
// Ensure args property matches component props
export const Example: Story = {
  args: {
    // Must match component prop types exactly
    variant: 'primary',
  },
};
```

**Step 4: Re-run typecheck**

Run: `npm run typecheck`

Expected: No errors (existing non-Storybook errors are pre-existing)

**Step 5: Commit type fixes**

```bash
git add src/components/**/*.stories.tsx
git commit -m "fix: update Storybook story types for v10"
```

---

## Task 8: Test Static Build

**Files:**
- None (build verification only)

**Step 1: Build Storybook**

Run: `npm run build-storybook`

Expected output:
- Vite build starts
- All stories compile
- Build completes successfully
- Output directory: `storybook-static/`

**Step 2: Check build output**

Run: `ls -lh storybook-static/`

Expected: HTML, JS, CSS files present

**Step 3: Preview static build (optional)**

Run: `npx http-server storybook-static`

Open: http://localhost:8080

Verify: Static version works same as dev version

**Step 4: Clean up**

Run: `rm -rf storybook-static`

---

## Task 9: Test Full Workflow

**Files:**
- None (final verification only)

**Step 1: Full dev server test**

Run: `npm run storybook`

Navigate through:
1. All theme stories - toggle dark mode
2. ThemeCustomizer - adjust sliders, verify live updates
3. Component stories - test controls and interactions
4. Docs pages - verify styling and dark mode

Expected: Everything works smoothly

**Step 2: Test responsive layouts**

In Storybook, use viewport addon (toolbar)
Test at different screen sizes:
- Mobile (375px)
- Tablet (768px)
- Desktop (1280px)

Expected: ThemeCustomizer 3-column layout responds correctly

**Step 3: Stop server**

Press Ctrl+C in terminal

---

## Task 10: Final Commit

**Files:**
- Modify: `package.json`
- Modify: `.storybook/*` (any config changes)
- Modify: Any story files if updated

**Step 1: Check git status**

Run: `git status`

Review all modified files.

**Step 2: Stage changes**

```bash
git add package.json package-lock.json .storybook/
```

If story files were modified:
```bash
git add src/components/**/*.stories.tsx
```

**Step 3: Commit upgrade**

```bash
git commit -m "chore: upgrade Storybook from v7.6.7 to v10.1.7

- Updated all @storybook/* packages to v10
- Verified storybook-dark-mode compatibility
- Fixed custom DocsContainer CSS selectors
- Tested all stories and addons
- Verified static build works
- All functionality tested and working"
```

**Step 4: Verify commit**

Run: `git log -1 --stat`

Review the commit to ensure all files included.

---

## Rollback Plan

If critical issues occur:

**Step 1: Reset to previous commit**

```bash
git reset --hard <commit-hash-from-task-1>
```

**Step 2: Restore dependencies**

```bash
npm install
```

**Step 3: Document the issue**

Create a note in `docs/` explaining what broke and why we rolled back.

---

## Expected Outcomes

**Benefits Gained:**
- ✅ Better performance with Vite integration
- ✅ Modern Storybook UI (v10 design)
- ✅ Improved TypeScript support
- ✅ Active security patches and bug fixes
- ✅ Better autodocs generation

**Risks Mitigated:**
- ✅ storybook-dark-mode compatibility verified
- ✅ Custom DocsContainer CSS updated
- ✅ All stories tested thoroughly
- ✅ Type errors fixed
- ✅ Static build verified

---

## Testing Checklist

After completion, verify:

- [ ] `npm run storybook` starts without errors
- [ ] All component stories render correctly
- [ ] ThemeCustomizer 3-column layout works
- [ ] Dark/light mode toggle works everywhere
- [ ] All 18 sliders in ThemeCustomizer work
- [ ] Live preview updates in ThemeCustomizer
- [ ] Generated code tab works
- [ ] Accessibility addon works
- [ ] Controls addon works
- [ ] Actions addon works (if used)
- [ ] Docs pages render with correct styling
- [ ] Dark mode styling applies to docs
- [ ] `npm run build-storybook` completes
- [ ] `npm run typecheck` passes
- [ ] No console errors in browser
- [ ] Responsive layouts work
- [ ] All component examples function

---

## Notes

- Storybook v10 is a major version with significant changes
- Most work is handled by automated migration tool
- Main manual effort is testing and fixing custom code
- storybook-dark-mode at v4.0.2 should work, but verify
- Custom DocsContainer CSS selectors are most likely to need updates
- If any blocker found, rollback is safe and documented

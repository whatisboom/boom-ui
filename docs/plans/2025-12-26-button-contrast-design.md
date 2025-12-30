# Button Variant Contrast Improvements

**Date:** 2025-12-26
**Status:** Approved
**Target:** WCAG AA (4.5:1 contrast ratio for normal text)

## Problem

The outline, ghost, and link button variants have insufficient contrast in dark theme. All three variants currently use `--boom-theme-primary` (accent-500) which appears as dark blue on the dark background (base-900), resulting in poor readability and accessibility violations.

## Solution

Update the three problematic button variants to use lighter accent palette colors (accent-300/accent-200) in dark theme while maintaining the existing color system architecture.

### Approach Selection

**Chosen: Approach 1 - Use Lighter Accent Shades**

This approach modifies only the Button component CSS to reference lighter palette colors directly, avoiding changes to the global theme system.

**Alternatives considered:**
- **Approach 2 (Rejected):** Create new semantic tokens - More complex, affects multiple files
- **Approach 3 (Rejected):** Add backgrounds to variants - Changes visual design significantly

## Implementation

### Files Modified
- `src/components/Button/Button.module.css`

### Color Mappings

#### Outline Variant
- **Current:** `color: var(--boom-theme-primary)` → accent-500
- **New:** `color: var(--boom-palette-accent-300)`
- **Hover border:** `border-color: var(--boom-palette-accent-300)`

#### Ghost Variant
- **Current:** `color: var(--boom-theme-primary)` → accent-500
- **New:** `color: var(--boom-palette-accent-300)`
- **Hover:** `color: var(--boom-palette-accent-200)` (brighter on hover)

#### Link Variant
- **Current:** `color: var(--boom-theme-primary)` → accent-500
- **New:** `color: var(--boom-palette-accent-300)`
- **Hover:** `color: var(--boom-palette-accent-200)` (changed from primary-hover)

#### Spinner Colors
- **Current:** `border-color: var(--boom-theme-primary)`
- **New:** `border-color: var(--boom-palette-accent-300)`

### CSS Changes

```css
/* Outline variant */
.outline {
  background-color: transparent;
  color: var(--boom-palette-accent-300);
  border-color: var(--boom-theme-border-default);
}

.outline:hover:not(:disabled) {
  background-color: var(--boom-theme-bg-elevated);
  border-color: var(--boom-palette-accent-300);
}

/* Ghost variant */
.ghost {
  background-color: transparent;
  color: var(--boom-palette-accent-300);
}

.ghost:hover:not(:disabled) {
  background-color: var(--boom-theme-bg-elevated);
  color: var(--boom-palette-accent-200);
}

/* Link variant */
.link {
  background-color: transparent;
  color: var(--boom-palette-accent-300);
  height: auto;
  padding: 0;
  text-decoration: underline;
}

.link:hover:not(:disabled) {
  color: var(--boom-palette-accent-200);
}

/* Spinner colors */
.secondary .spinner,
.outline .spinner,
.ghost .spinner,
.link .spinner {
  border-color: var(--boom-palette-accent-300);
}
```

## Testing & Validation

### Automated Tests
- Run `npm test` - vitest-axe should pass with improved contrast
- Verify coverage remains ≥80%

### Manual Verification
1. Open Storybook: `npm run storybook`
2. Navigate to Components → Inputs → Button → All Variants
3. Check outline, ghost, link variants in dark theme
4. Toggle to light theme, verify no regressions
5. Optional: Use browser DevTools to verify contrast ratios

### Success Criteria
- Outline, ghost, and link variants clearly readable in dark theme
- No accessibility test failures
- Light theme unaffected
- Coverage threshold maintained
- No breaking changes to component API

## Impact

**Benefits:**
- WCAG AA compliance for all button variants
- Improved readability in dark theme
- Better user experience for vision-impaired users

**Risks:**
- Minimal - purely visual enhancement
- No API changes
- Isolated to Button component

**Light Theme:**
- Current implementation (accent-600) already compliant
- No changes needed for light theme

## Future Considerations

If other components need similar contrast improvements, consider creating semantic tokens like `--boom-theme-interactive-subtle` that map to appropriate contrasting colors across both themes.

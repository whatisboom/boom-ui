# HSL Color System Conversion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert boom-ui's color system from hex to HSL with full hue control, enabling dynamic theming and branding while fixing existing color variable issues.

**Architecture:** 2-tier color token system (palettes → themes) converted to HSL format with base hue variables per color family. All 58 hex colors become HSL with adjustable hues. Shadows, overlays, and focus rings become themeable via HSL tokens with alpha channels.

**Tech Stack:** CSS Custom Properties, HSL color space, CSS Color Level 4 (alpha in HSL), React (for testing components)

---

## Task 1: Add Hue Variables to Palettes

**Files:**
- Modify: `src/styles/tokens/palettes.css:1-15`

**Step 1: Add hue variables at top of :root**

Add after the header comment, before existing palette colors:

```css
:root {
  /* ==========================================================================
     HUE VARIABLES - Brand Customization Entry Points
     ========================================================================== */

  /* Neutral colors - slate blue tint */
  --boom-hue-slate: 215;

  /* Primary brand color */
  --boom-hue-blue: 213;

  /* Semantic state colors */
  --boom-hue-success: 142;   /* green */
  --boom-hue-warning: 38;    /* amber */
  --boom-hue-error: 0;       /* red */
  --boom-hue-info: 173;      /* teal */

  /* ==========================================================================
     DARK THEME (Default)
     ========================================================================== */
```

**Step 2: Verify no syntax errors**

Run: `npm run build`
Expected: SUCCESS (no CSS syntax errors)

**Step 3: Commit**

```bash
git add src/styles/tokens/palettes.css
git commit -m "feat: add hue variables for color customization"
```

---

## Task 2: Add New Theme Tokens

**Files:**
- Modify: `src/styles/tokens/theme.css:137`

**Step 1: Add new theme tokens before light theme section**

Add before line 137 (`:root[data-theme='light']`):

```css
  /* ==========================================================================
     ACCENT COLORS
     ========================================================================== */

  /* Accent color - for badges, notification dots, highlights */
  --boom-theme-accent: var(--boom-palette-blue-400);
  --boom-theme-accent-subtle: hsl(var(--boom-hue-blue) 94% 68% / 0.15);

  /* ==========================================================================
     BORDER ALIASES
     ========================================================================== */

  /* Border color alias (for clarity) */
  --boom-theme-border-color: var(--boom-theme-border-default);

  /* ==========================================================================
     SHADOW COLORS
     ========================================================================== */

  /* Shadow color tokens - themeable shadow tinting */
  --boom-theme-shadow-color: hsl(var(--boom-hue-slate) 39% 18% / 0.3);
  --boom-theme-shadow-color-subtle: hsl(var(--boom-hue-slate) 39% 18% / 0.1);
  --boom-theme-shadow-color-strong: hsl(var(--boom-hue-slate) 39% 18% / 0.5);

  /* ==========================================================================
     OVERLAY COLORS
     ========================================================================== */

  /* Overlay backdrop */
  --boom-theme-overlay-backdrop: hsl(var(--boom-hue-slate) 39% 18% / 0.7);

  /* ==========================================================================
     FOCUS RING COLORS
     ========================================================================== */

  /* Focus ring with opacity */
  --boom-theme-focus-ring-shadow: hsl(var(--boom-hue-blue) 94% 68% / 0.3);
}
```

**Step 2: Add light theme overrides**

Add to `:root[data-theme='light']` section after existing tokens:

```css
  /* Accent */
  --boom-theme-accent: var(--boom-palette-blue-600);
  --boom-theme-accent-subtle: hsl(var(--boom-hue-blue) 52% 24% / 0.1);

  /* Shadows - light theme uses darker shadows */
  --boom-theme-shadow-color: hsl(var(--boom-hue-slate) 61% 11% / 0.4);
  --boom-theme-shadow-color-subtle: hsl(var(--boom-hue-slate) 61% 11% / 0.15);
  --boom-theme-shadow-color-strong: hsl(var(--boom-hue-slate) 61% 11% / 0.6);

  /* Overlay */
  --boom-theme-overlay-backdrop: hsl(var(--boom-hue-slate) 61% 11% / 0.6);

  /* Focus ring */
  --boom-theme-focus-ring-shadow: hsl(var(--boom-hue-blue) 52% 24% / 0.25);
```

**Step 3: Verify tokens are defined**

Run: `npm run build`
Expected: SUCCESS

**Step 4: Commit**

```bash
git add src/styles/tokens/theme.css
git commit -m "feat: add missing theme tokens (accent, shadows, overlay)"
```

---

## Task 3: Fix Input Component Variables

**Files:**
- Modify: `src/components/Input/Input.module.css:104,108,109,113,114,119,124,128,129,139,153,158,185,189,201`

**Step 1: Replace undefined --boom-color-* variables**

Find and replace all instances:

Line 104:
```css
border-color: var(--boom-theme-border-default);
```

Line 108:
```css
border-color: var(--boom-theme-border-focus);
```

Line 109:
```css
box-shadow: 0 0 0 3px var(--boom-theme-focus-ring-shadow);
```

Line 113:
```css
background-color: var(--boom-theme-bg-secondary);
```

Line 114:
```css
color: var(--boom-theme-text-disabled);
```

Line 119:
```css
background-color: var(--boom-theme-bg-elevated);
```

Line 124:
```css
border-color: var(--boom-theme-error-border);
```

Line 128:
```css
border-color: var(--boom-theme-error-border);
```

Line 129:
```css
box-shadow: 0 0 0 3px hsl(var(--boom-hue-error) 84% 60% / 0.15);
```

Line 139:
```css
color: var(--boom-theme-text-secondary);
```

Line 153:
```css
color: var(--boom-theme-text-disabled);
```

Line 158:
```css
color: var(--boom-theme-error-text);
```

Line 185:
```css
color: var(--boom-theme-text-secondary);
```

Line 189:
```css
color: var(--boom-theme-error-text);
```

Line 201:
```css
outline: 2px solid var(--boom-theme-focus-ring);
```

**Step 2: Test Input component renders**

Run: `npm run storybook`
Navigate to: Components/Input
Expected: No console errors, input renders correctly in both light/dark themes

**Step 3: Commit**

```bash
git add src/components/Input/Input.module.css
git commit -m "fix: replace undefined color variables in Input component"
```

---

## Task 4: Fix Overlay Backdrop

**Files:**
- Modify: `src/components/primitives/Overlay/Overlay.module.css:19`

**Step 1: Replace hardcoded rgba with theme token**

Line 19:
```css
background-color: var(--boom-theme-overlay-backdrop);
```

**Step 2: Test overlay renders**

Run: `npm run storybook`
Navigate to: Primitives/Modal
Expected: Backdrop shows with correct opacity in both themes

**Step 3: Commit**

```bash
git add src/components/primitives/Overlay/Overlay.module.css
git commit -m "fix: use theme token for overlay backdrop"
```

---

## Task 5: Convert Shadows to HSL Tokens

**Files:**
- Modify: `src/styles/tokens/shadows.css:11-48`

**Step 1: Replace shadow definitions with theme tokens**

Replace entire :root section (lines 11-27):

```css
:root {
  /* Small shadow - subtle depth */
  --boom-shadow-sm: 0 1px 2px 0 var(--boom-theme-shadow-color-subtle);

  /* Medium shadow - cards, dropdowns */
  --boom-shadow-md:
    0 4px 6px -1px var(--boom-theme-shadow-color),
    0 2px 4px -1px var(--boom-theme-shadow-color-subtle);

  /* Large shadow - modals, popovers */
  --boom-shadow-lg:
    0 10px 15px -3px var(--boom-theme-shadow-color),
    0 4px 6px -2px var(--boom-theme-shadow-color-subtle);

  /* Extra large shadow - full-screen overlays */
  --boom-shadow-xl:
    0 20px 25px -5px var(--boom-theme-shadow-color),
    0 10px 10px -5px var(--boom-theme-shadow-color-subtle);

  /* Focus shadow - for focus rings */
  --boom-shadow-focus: 0 0 0 3px var(--boom-theme-focus-ring-shadow);

  /* Inner shadow - inset effects */
  --boom-shadow-inner: inset 0 2px 4px 0 var(--boom-theme-shadow-color-subtle);
}
```

**Step 2: Remove light theme overrides**

Delete lines 29-48 (entire `:root[data-theme='light']` section) - tokens handle it now

**Step 3: Test shadows render correctly**

Run: `npm run storybook`
Navigate to: Components/Card, Components/Modal
Expected: Shadows visible in both themes with appropriate intensity

**Step 4: Commit**

```bash
git add src/styles/tokens/shadows.css
git commit -m "feat: convert shadows to themeable HSL tokens"
```

---

## Task 6: Convert Slate Palette to HSL

**Files:**
- Modify: `src/styles/tokens/palettes.css:17-27`

**Step 1: Replace slate hex values with HSL**

Replace lines 17-27:

```css
  /* Slate Gray Backgrounds - For dark theme layering */
  --boom-palette-slate-950: hsl(var(--boom-hue-slate) 61% 11%);   /* was: #0f172a */
  --boom-palette-slate-900: hsl(var(--boom-hue-slate) 39% 18%);   /* was: #1e293b */
  --boom-palette-slate-800: hsl(var(--boom-hue-slate) 25% 27%);   /* was: #334155 */
  --boom-palette-slate-700: hsl(var(--boom-hue-slate) 17% 36%);   /* was: #475569 */
  --boom-palette-slate-600: hsl(var(--boom-hue-slate) 14% 47%);   /* was: #64748b */
  --boom-palette-slate-500: hsl(var(--boom-hue-slate) 13% 66%);   /* was: #94a3b8 */
  --boom-palette-slate-400: hsl(var(--boom-hue-slate) 26% 84%);   /* was: #cbd5e1 */
  --boom-palette-slate-300: hsl(var(--boom-hue-slate) 20% 91%);   /* was: #e2e8f0 */
  --boom-palette-slate-200: hsl(var(--boom-hue-slate) 18% 95%);   /* was: #f1f5f9 */
  --boom-palette-slate-100: hsl(var(--boom-hue-slate) 20% 98%);   /* was: #f8fafc */
  --boom-palette-slate-50: hsl(0 0% 100%);                         /* was: #ffffff */
```

**Step 2: Update light theme slate overrides**

Find and replace lines 88-98 in `:root[data-theme='light']`:

```css
  /* Neutral Backgrounds - Inverted from dark theme */
  --boom-palette-slate-50: hsl(0 0% 100%);
  --boom-palette-slate-100: hsl(var(--boom-hue-slate) 20% 98%);
  --boom-palette-slate-200: hsl(var(--boom-hue-slate) 18% 95%);
  --boom-palette-slate-300: hsl(var(--boom-hue-slate) 20% 91%);
  --boom-palette-slate-400: hsl(var(--boom-hue-slate) 26% 84%);
  --boom-palette-slate-500: hsl(var(--boom-hue-slate) 13% 66%);
  --boom-palette-slate-600: hsl(var(--boom-hue-slate) 14% 47%);
  --boom-palette-slate-700: hsl(var(--boom-hue-slate) 17% 36%);
  --boom-palette-slate-800: hsl(var(--boom-hue-slate) 25% 27%);
  --boom-palette-slate-900: hsl(var(--boom-hue-slate) 39% 18%);
  --boom-palette-slate-950: hsl(var(--boom-hue-slate) 61% 11%);
```

**Step 3: Test neutral colors render correctly**

Run: `npm run storybook`
Navigate to: Themes/Dark, Themes/Light
Expected: Backgrounds and text render identically to before

**Step 4: Commit**

```bash
git add src/styles/tokens/palettes.css
git commit -m "feat: convert slate palette to HSL"
```

---

## Task 7: Convert Blue Palette to HSL

**Files:**
- Modify: `src/styles/tokens/palettes.css:29-39`

**Step 1: Replace blue hex values with HSL**

Replace lines 29-39:

```css
  /* Muted Slate-Blue Primary - Moderately desaturated, sophisticated */
  --boom-palette-blue-900: hsl(var(--boom-hue-blue) 52% 24%);   /* was: #1e3a5f */
  --boom-palette-blue-800: hsl(var(--boom-hue-blue) 42% 30%);   /* was: #2e4a6f */
  --boom-palette-blue-700: hsl(var(--boom-hue-blue) 36% 36%);   /* was: #3e5a7f */
  --boom-palette-blue-600: hsl(var(--boom-hue-blue) 30% 43%);   /* was: #4e6a8f */
  --boom-palette-blue-500: hsl(var(--boom-hue-blue) 94% 68%);   /* was: #60a5fa */
  --boom-palette-blue-400: hsl(var(--boom-hue-blue) 96% 75%);   /* was: #7dbdfc */
  --boom-palette-blue-300: hsl(var(--boom-hue-blue) 96% 80%);   /* was: #93c5fd */
  --boom-palette-blue-200: hsl(var(--boom-hue-blue) 96% 87%);   /* was: #bfdbfe */
  --boom-palette-blue-100: hsl(var(--boom-hue-blue) 100% 93%);  /* was: #dbeafe */
  --boom-palette-blue-50: hsl(var(--boom-hue-blue) 100% 97%);   /* was: #eff6ff */
```

**Step 2: Test primary colors render correctly**

Run: `npm run storybook`
Navigate to: Components/Button (primary variant)
Expected: Blue buttons render identically in both themes

**Step 3: Commit**

```bash
git add src/styles/tokens/palettes.css
git commit -m "feat: convert blue palette to HSL"
```

---

## Task 8: Convert Success Palette to HSL

**Files:**
- Modify: `src/styles/tokens/palettes.css:41-49`

**Step 1: Replace success hex values with HSL**

Replace lines 41-49:

```css
  /* Success - Green (saturated for clarity) */
  --boom-palette-success-700: hsl(var(--boom-hue-success) 73% 29%);  /* was: #15803d */
  --boom-palette-success-600: hsl(var(--boom-hue-success) 72% 37%);  /* was: #16a34a */
  --boom-palette-success-500: hsl(var(--boom-hue-success) 71% 45%);  /* was: #22c55e */
  --boom-palette-success-400: hsl(var(--boom-hue-success) 69% 58%);  /* was: #4ade80 */
  --boom-palette-success-300: hsl(var(--boom-hue-success) 75% 73%);  /* was: #86efac */
  --boom-palette-success-200: hsl(var(--boom-hue-success) 73% 85%);  /* was: #bbf7d0 */
  --boom-palette-success-100: hsl(var(--boom-hue-success) 84% 93%);  /* was: #dcfce7 */
  --boom-palette-success-50: hsl(var(--boom-hue-success) 86% 97%);   /* was: #f0fdf4 */
```

**Step 2: Test success colors render correctly**

Run: `npm run storybook`
Navigate to: Components/Button (look for success usage if exists)
Expected: Green colors render identically

**Step 3: Commit**

```bash
git add src/styles/tokens/palettes.css
git commit -m "feat: convert success palette to HSL"
```

---

## Task 9: Convert Warning Palette to HSL

**Files:**
- Modify: `src/styles/tokens/palettes.css:51-59`

**Step 1: Replace warning hex values with HSL**

Replace lines 51-59:

```css
  /* Warning - Amber (saturated for clarity) */
  --boom-palette-warning-700: hsl(var(--boom-hue-warning) 91% 38%);  /* was: #b45309 */
  --boom-palette-warning-600: hsl(var(--boom-hue-warning) 95% 44%);  /* was: #d97706 */
  --boom-palette-warning-500: hsl(var(--boom-hue-warning) 96% 51%);  /* was: #f59e0b */
  --boom-palette-warning-400: hsl(var(--boom-hue-warning) 92% 57%);  /* was: #fbbf24 */
  --boom-palette-warning-300: hsl(var(--boom-hue-warning) 92% 65%);  /* was: #fcd34d */
  --boom-palette-warning-200: hsl(var(--boom-hue-warning) 93% 76%);  /* was: #fde68a */
  --boom-palette-warning-100: hsl(var(--boom-hue-warning) 91% 89%);  /* was: #fef3c7 */
  --boom-palette-warning-50: hsl(var(--boom-hue-warning) 80% 96%);   /* was: #fefce8 */
```

**Step 2: Test warning colors render correctly**

Run: `npm run storybook`
Navigate to: Look for any warning state components
Expected: Amber colors render identically

**Step 3: Commit**

```bash
git add src/styles/tokens/palettes.css
git commit -m "feat: convert warning palette to HSL"
```

---

## Task 10: Convert Error Palette to HSL

**Files:**
- Modify: `src/styles/tokens/palettes.css:61-69`

**Step 1: Replace error hex values with HSL**

Replace lines 61-69:

```css
  /* Error - Red (saturated for clarity) */
  --boom-palette-error-700: hsl(var(--boom-hue-error) 74% 42%);  /* was: #b91c1c */
  --boom-palette-error-600: hsl(var(--boom-hue-error) 72% 51%);  /* was: #dc2626 */
  --boom-palette-error-500: hsl(var(--boom-hue-error) 84% 60%);  /* was: #ef4444 */
  --boom-palette-error-400: hsl(var(--boom-hue-error) 91% 71%);  /* was: #f87171 */
  --boom-palette-error-300: hsl(var(--boom-hue-error) 96% 81%);  /* was: #fca5a5 */
  --boom-palette-error-200: hsl(var(--boom-hue-error) 93% 88%);  /* was: #fecaca */
  --boom-palette-error-100: hsl(var(--boom-hue-error) 93% 94%);  /* was: #fee2e2 */
  --boom-palette-error-50: hsl(var(--boom-hue-error) 86% 97%);   /* was: #fef2f2 */
```

**Step 2: Test error colors render correctly**

Run: `npm run storybook`
Navigate to: Components/Input (error state)
Expected: Red error colors render identically

**Step 3: Commit**

```bash
git add src/styles/tokens/palettes.css
git commit -m "feat: convert error palette to HSL"
```

---

## Task 11: Convert Info Palette to HSL

**Files:**
- Modify: `src/styles/tokens/palettes.css:71-79`

**Step 1: Replace info hex values with HSL**

Replace lines 71-79:

```css
  /* Info - Teal (saturated for clarity) */
  --boom-palette-info-700: hsl(var(--boom-hue-info) 78% 26%);  /* was: #0f766e */
  --boom-palette-info-600: hsl(var(--boom-hue-info) 84% 32%);  /* was: #0d9488 */
  --boom-palette-info-500: hsl(var(--boom-hue-info) 80% 39%);  /* was: #14b8a6 */
  --boom-palette-info-400: hsl(var(--boom-hue-info) 74% 50%);  /* was: #2dd4bf */
  --boom-palette-info-300: hsl(var(--boom-hue-info) 73% 65%);  /* was: #5eead4 */
  --boom-palette-info-200: hsl(var(--boom-hue-info) 76% 79%);  /* was: #99f6e4 */
  --boom-palette-info-100: hsl(var(--boom-hue-info) 84% 90%);  /* was: #ccfbf1 */
  --boom-palette-info-50: hsl(var(--boom-hue-info) 80% 97%);   /* was: #f0fdfa */
```

**Step 2: Test info colors render correctly**

Run: `npm run storybook`
Expected: Teal colors render identically

**Step 3: Commit**

```bash
git add src/styles/tokens/palettes.css
git commit -m "feat: convert info palette to HSL"
```

---

## Task 12: Full Visual Regression Test

**Files:**
- None (testing only)

**Step 1: Run full test suite**

Run: `npm test`
Expected: All tests PASS

**Step 2: Run type checking**

Run: `npm run typecheck`
Expected: No errors

**Step 3: Build project**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Visual regression test in Storybook**

Run: `npm run storybook`

Test checklist:
- [ ] Themes/Dark - all backgrounds, text, borders render correctly
- [ ] Themes/Light - all backgrounds, text, borders render correctly
- [ ] Components/Button - all variants (primary, secondary) both themes
- [ ] Components/Input - all states (default, focus, error, disabled, readonly) both themes
- [ ] Components/Card - shadows render correctly both themes
- [ ] Components/Modal - overlay backdrop and shadows both themes
- [ ] Components/Navigation - accent colors for badges both themes
- [ ] Components/NotificationMenu - accent and error colors both themes

Expected: No visual differences from before conversion

**Step 5: Test hue customization**

In browser console with Storybook open:
```javascript
// Test purple primary
document.documentElement.style.setProperty('--boom-hue-blue', '280');

// Test cyan success
document.documentElement.style.setProperty('--boom-hue-success', '180');

// Test pink error
document.documentElement.style.setProperty('--boom-hue-error', '340');
```

Expected: All blue/success/error colors shift to new hues, everything still looks cohesive

---

## Task 13: Create Hue Customization Documentation

**Files:**
- Create: `docs/theming.md`

**Step 1: Create theming documentation**

```markdown
# Theme Customization

boom-ui uses an HSL-based color system that supports full hue rotation for brand customization.

## Customizing Brand Colors

You can customize any color family by overriding its hue variable:

\`\`\`css
:root {
  /* Change primary from blue to purple */
  --boom-hue-blue: 280;

  /* Change success from green to teal */
  --boom-hue-success: 180;

  /* Change error from red to pink */
  --boom-hue-error: 340;
}
\`\`\`

## Available Hue Variables

| Variable | Default | Color Family | Usage |
|----------|---------|--------------|-------|
| `--boom-hue-slate` | 215 | Slate blue | Neutral backgrounds, text, borders |
| `--boom-hue-blue` | 213 | Blue | Primary brand color, interactive elements |
| `--boom-hue-success` | 142 | Green | Success states, confirmations |
| `--boom-hue-warning` | 38 | Amber | Warning states, cautions |
| `--boom-hue-error` | 0 | Red | Error states, destructive actions |
| `--boom-hue-info` | 173 | Teal | Info states, notifications |

## How It Works

The color system has two tiers:

1. **Palettes** - Raw color values using `hsl(var(--boom-hue-X) S% L%)`
2. **Themes** - Semantic tokens that reference palette colors

All palette colors use their family's hue variable, so changing one hue updates all shades in that family.

## Example: Purple Brand

\`\`\`css
:root {
  --boom-hue-blue: 280;
}
\`\`\`

This changes:
- All buttons from blue to purple
- Focus rings from blue to purple
- Primary interactive elements from blue to purple
- Light/dark theme variants automatically adjust

## Best Practices

1. **Stay in range**: Hue values are 0-360 (color wheel degrees)
2. **Test both themes**: Verify your hue works in light and dark modes
3. **Check contrast**: Ensure text remains readable on backgrounds
4. **Use semantic tokens**: Components should use `--boom-theme-*` tokens, not palette directly

## Advanced: Per-Component Customization

You can override hue variables at any scope:

\`\`\`css
.my-component {
  --boom-hue-blue: 340;  /* Pink primary only for this component */
}
\`\`\`
```

**Step 2: Commit**

```bash
git add docs/theming.md
git commit -m "docs: add theme customization guide"
```

---

## Task 14: Update README with Theming Section

**Files:**
- Modify: `README.md` (add section before "Development" or similar)

**Step 1: Add theming section to README**

Add this section:

```markdown
## Theme Customization

boom-ui supports dynamic color theming through HSL-based hue variables. Customize your brand colors by overriding hue values:

\`\`\`css
:root {
  --boom-hue-blue: 280;      /* Purple primary */
  --boom-hue-success: 180;   /* Cyan success */
}
\`\`\`

See [docs/theming.md](docs/theming.md) for full customization guide.

### Available Hue Variables

- `--boom-hue-blue` - Primary brand (default: 213)
- `--boom-hue-success` - Success states (default: 142)
- `--boom-hue-warning` - Warning states (default: 38)
- `--boom-hue-error` - Error states (default: 0)
- `--boom-hue-info` - Info states (default: 173)
- `--boom-hue-slate` - Neutrals (default: 215)
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add theming section to README"
```

---

## Task 15: Add Hue Customization to Storybook

**Files:**
- Modify: `src/components/ThemeProvider/Theme.stories.tsx` (add controls for hue variables)

**Step 1: Add hue controls to Theme stories**

Find the Theme stories file and add a new story with hue controls:

```typescript
export const CustomHues: Story = {
  render: (args) => {
    // Apply hue customizations
    useEffect(() => {
      if (args.primaryHue !== undefined) {
        document.documentElement.style.setProperty('--boom-hue-blue', String(args.primaryHue));
      }
      if (args.successHue !== undefined) {
        document.documentElement.style.setProperty('--boom-hue-success', String(args.successHue));
      }
      if (args.errorHue !== undefined) {
        document.documentElement.style.setProperty('--boom-hue-error', String(args.errorHue));
      }

      return () => {
        // Reset on unmount
        document.documentElement.style.removeProperty('--boom-hue-blue');
        document.documentElement.style.removeProperty('--boom-hue-success');
        document.documentElement.style.removeProperty('--boom-hue-error');
      };
    }, [args.primaryHue, args.successHue, args.errorHue]);

    return (
      <ThemeProvider theme={args.theme}>
        <div style={{ padding: '2rem' }}>
          <h2>Hue Customization Demo</h2>
          <p>Adjust the hue controls to see brand colors change dynamically.</p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
          </div>
        </div>
      </ThemeProvider>
    );
  },
  argTypes: {
    primaryHue: {
      control: { type: 'range', min: 0, max: 360, step: 1 },
      defaultValue: 213,
      description: 'Primary brand hue (0-360)',
    },
    successHue: {
      control: { type: 'range', min: 0, max: 360, step: 1 },
      defaultValue: 142,
      description: 'Success state hue (0-360)',
    },
    errorHue: {
      control: { type: 'range', min: 0, max: 360, step: 1 },
      defaultValue: 0,
      description: 'Error state hue (0-360)',
    },
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark', 'system'],
      defaultValue: 'dark',
    },
  },
};
```

**Step 2: Test in Storybook**

Run: `npm run storybook`
Navigate to: ThemeProvider/Custom Hues
Expected: Sliders change colors in real-time

**Step 3: Commit**

```bash
git add src/components/ThemeProvider/Theme.stories.tsx
git commit -m "feat: add hue customization demo to Storybook"
```

---

## Success Criteria

- ✅ All 58 hex colors converted to HSL
- ✅ 6 hue variables defined (slate, blue, success, warning, error, info)
- ✅ Input component's 13 undefined variables fixed
- ✅ Shadows, overlays, focus rings use themeable tokens
- ✅ Missing theme tokens added (accent, border-color, shadows, overlay)
- ✅ Zero visual regressions in Storybook
- ✅ All automated tests pass
- ✅ Hue customization works (tested in browser console)
- ✅ Documentation complete (theming.md, README)
- ✅ Storybook demo shows dynamic hue rotation

## Rollback Plan

If critical issues arise:

```bash
# Rollback entire feature
git revert HEAD~15..HEAD

# Or rollback to specific safe commit
git reset --hard <commit-before-HSL-conversion>
```

Low risk because:
- Changes primarily in token files (not component logic)
- Semantic token layer provides abstraction
- Extensive testing at each phase
- Can partially rollback (e.g., keep new tokens, revert palette to hex)

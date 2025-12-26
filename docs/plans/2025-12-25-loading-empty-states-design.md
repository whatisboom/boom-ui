# Loading and Empty States Component Design

**Date:** 2025-12-25
**Status:** Design Complete

## Overview

This design covers a comprehensive set of loading and empty state components for boom-ui:
- **Skeleton system** - Base component + composite patterns for content loading
- **Spinner** - Circular loading indicator with overlay support
- **EmptyState** - Semantic empty/no-data state component

These components work together to provide complete coverage for loading and empty state scenarios.

## Design Principles

- **Accessibility-first** - All components include proper ARIA attributes and semantic markup
- **Animation respect** - All animations honor `prefers-reduced-motion` and support `disableAnimation` prop
- **Theme integration** - Components use CSS tokens and work with light/dark themes
- **Type safety** - Leverage existing shared types (`Size`, `MotionProps`) for consistency
- **Minimal footprint** - Use CSS animations over JavaScript, keep bundle size small

## Component Specifications

### 1. Skeleton System

#### Base Skeleton Component

**Purpose:** Flexible building block for creating loading placeholders.

**Props:**
```typescript
interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect' | 'custom';
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  lines?: number;  // For repeating (e.g., multiple text lines)
  disableAnimation?: boolean;
  className?: string;
}
```

**Behavior:**
- Default variant: `rect`
- Animation: Subtle shimmer using CSS gradient animation (no JavaScript)
- `text` variant: Height ~1em, randomized widths 90-100% for natural appearance
- `circle` variant: Uses aspect ratio 1:1
- `custom` variant: Full control via width/height/borderRadius props
- `lines` prop: Renders multiple instances with spacing

**CSS Implementation:**
- Uses existing spacing and border-radius tokens
- New tokens: `--skeleton-base-color`, `--skeleton-shimmer-color` for theming
- Shimmer: Linear gradient animation moving left to right
- GPU-accelerated transform for smooth 60fps animation

#### SkeletonText Component

**Purpose:** Pre-built pattern for paragraph/content loading.

**Props:**
```typescript
interface SkeletonTextProps {
  lines?: number;  // Default: 3
  lastLineWidth?: string;  // Percentage for trailing line (default: '75%')
  disableAnimation?: boolean;
  className?: string;
}
```

**Implementation:**
- Uses base Skeleton internally with `variant="text"`
- Last line uses `lastLineWidth` for realistic paragraph ending
- Vertical spacing between lines matches line-height

#### SkeletonAvatar Component

**Purpose:** Matches Avatar component loading state.

**Props:**
```typescript
interface SkeletonAvatarProps {
  size?: Size;  // 'sm' | 'md' | 'lg'
  withText?: boolean;  // Show text lines beside avatar
  textLines?: number;  // Number of text lines (default: 2)
  disableAnimation?: boolean;
  className?: string;
}
```

**Implementation:**
- Circle skeleton matching Avatar size variants
- Optional text lines in flex layout beside circle
- Sizes match Avatar component exactly

#### SkeletonCard Component

**Purpose:** Pre-built card loading pattern matching Card component.

**Props:**
```typescript
interface SkeletonCardProps {
  variant?: CardVariant;  // Matches Card variants
  hasImage?: boolean;  // Show image placeholder
  hasActions?: boolean;  // Show action button placeholders
  disableAnimation?: boolean;
  className?: string;
}
```

**Implementation:**
- Uses Card component structure
- Image placeholder: Rectangle at top (if hasImage)
- Title: 2 text lines
- Description: 3 text lines with last at 60%
- Actions: 2 button-sized rectangles (if hasActions)

### 2. Spinner Component

**Purpose:** Circular loading indicator for inline and overlay loading states.

**Props:**
```typescript
interface SpinnerProps {
  size?: Size;  // 'sm' | 'md' | 'lg'
  overlay?: boolean;  // Adds backdrop + centers spinner
  label?: string;  // For aria-label (default: "Loading")
  disableAnimation?: boolean;
  className?: string;
}
```

**Size Mapping:**
- `sm`: 16px
- `md`: 24px (default)
- `lg`: 32px

**Behavior:**
- Circular spinner: Rotating ring with gap (CSS border animation)
- Color: Inherits currentColor by default, overridable via `--spinner-color` token
- Accessible: `role="status"`, `aria-live="polite"`, `aria-label`
- Animation: CSS `@keyframes` rotate (GPU-accelerated, 60fps)

**Overlay Mode:**
- Renders using Portal + Overlay primitives (existing components)
- Adds backdrop with semi-transparent background
- Centers spinner vertically and horizontally
- Locks scroll using `useScrollLock` hook
- Traps focus using `useFocusTrap` hook

**Reduced Motion:**
- Normal: Full rotation animation
- Reduced motion: Slower rotation or pulsing opacity instead

### 3. EmptyState Component

**Purpose:** Semantic component for no-data, no-results, and empty scenarios.

**Props:**
```typescript
interface EmptyStateProps {
  illustration?: ReactNode;  // Slot for custom illustrations/icons
  title: string;
  description?: string;
  action?: ReactNode;  // Slot for Button or CTA
  size?: Size;  // Controls spacing and sizing
  className?: string;
}
```

**Layout Structure:**
1. Illustration container (optional) - Fixed aspect ratio to prevent shift
2. Title (required) - Typography component with h2 variant
3. Description (optional) - Typography with muted color
4. Action area (optional) - Renders children as-is

**Styling:**
- Uses Stack component internally for consistent spacing
- Centered layout (flex with center alignment)
- Max-width constraint: 400px for readability
- Description uses muted text color from tokens
- Size prop affects:
  - Illustration container size
  - Title font size (via Typography variant)
  - Stack spacing

**Size Variants:**
- `sm`: Compact spacing, smaller illustration area
- `md`: Default balanced layout
- `lg`: Generous spacing, larger illustration area

**Accessibility:**
- Semantic HTML structure
- Title uses proper heading level (h2 by default)
- Description uses paragraph element
- Illustration decorative (aria-hidden if purely visual)

## Implementation Guidelines

### File Structure

Each component follows the standard boom-ui pattern:

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.types.ts
├── ComponentName.module.css
├── ComponentName.test.tsx
├── ComponentName.stories.tsx
└── index.ts
```

Composite components (SkeletonText, SkeletonAvatar, SkeletonCard) live in `Skeleton/` directory as separate files.

### Testing Requirements

**All components must include:**
- Accessibility tests using vitest-axe
- Prop variation tests (all variants, sizes)
- Animation disable tests (disableAnimation prop)
- Reduced motion tests (prefers-reduced-motion)
- Overlay tests for Spinner (Portal rendering, scroll lock, focus trap)

**Minimum 80% coverage** across lines, functions, branches, statements.

### Storybook Stories

**Each component needs stories showing:**
- All variants/sizes
- With/without optional props
- Common usage patterns
- Composite examples (e.g., SkeletonCard in a grid)
- Dark mode variants
- Animation states (normal + reduced motion)

### CSS Token Additions

New tokens needed in `src/styles/tokens/`:

```css
/* Skeleton colors */
--skeleton-base-color: var(--color-neutral-200);
--skeleton-shimmer-color: var(--color-neutral-300);

/* Dark theme overrides */
[data-theme="dark"] {
  --skeleton-base-color: var(--color-neutral-800);
  --skeleton-shimmer-color: var(--color-neutral-700);
}

/* Spinner color (optional override) */
--spinner-color: currentColor;
```

### Export Strategy

**Main exports in `src/index.ts`:**

```typescript
// Components
export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard } from './components/Skeleton';
export { Spinner } from './components/Spinner';
export { EmptyState } from './components/EmptyState';

// Types
export type {
  SkeletonProps,
  SkeletonTextProps,
  SkeletonAvatarProps,
  SkeletonCardProps
} from './components/Skeleton';
export type { SpinnerProps } from './components/Spinner';
export type { EmptyStateProps } from './components/EmptyState';
```

## Usage Examples

### Skeleton Loading

```tsx
// Simple text loading
<SkeletonText lines={5} />

// Avatar with text
<SkeletonAvatar size="md" withText textLines={2} />

// Card grid loading
<div className={styles.grid}>
  {[...Array(6)].map((_, i) => (
    <SkeletonCard key={i} hasImage hasActions />
  ))}
</div>

// Custom skeleton pattern
<Stack spacing={3}>
  <Skeleton variant="circle" width={48} height={48} />
  <Skeleton variant="text" width="80%" />
  <Skeleton variant="rect" height={200} />
</Stack>
```

### Spinner Usage

```tsx
// Inline loading
<Button disabled>
  <Spinner size="sm" /> Processing...
</Button>

// Section loading
<Box className={styles.container}>
  <Spinner size="md" />
</Box>

// Fullscreen loading overlay
<Spinner size="lg" overlay label="Loading application" />
```

### EmptyState Usage

```tsx
// No results
<EmptyState
  illustration={<SearchIcon />}
  title="No results found"
  description="Try adjusting your search or filters"
  action={<Button onClick={clearSearch}>Clear search</Button>}
/>

// No data state
<EmptyState
  illustration={<EmptyBoxIllustration />}
  title="No items yet"
  description="Get started by creating your first item"
  action={<Button variant="primary" onClick={onCreate}>Create item</Button>}
  size="lg"
/>

// Error state
<EmptyState
  illustration={<ErrorIcon />}
  title="Something went wrong"
  action={<Button onClick={retry}>Try again</Button>}
/>
```

## Dependencies

### Existing boom-ui components/utilities used:
- `Stack` - For EmptyState layout
- `Typography` - For EmptyState title/description
- `Portal` - For Spinner overlay
- `Overlay` - For Spinner backdrop
- `Card` - For SkeletonCard structure matching
- `useScrollLock` - For Spinner overlay
- `useFocusTrap` - For Spinner overlay
- Shared types: `Size`, `MotionProps`

### No external dependencies needed.

## Success Criteria

- [ ] All components pass accessibility tests (vitest-axe)
- [ ] 80%+ test coverage
- [ ] Animations respect prefers-reduced-motion
- [ ] Components work in light and dark themes
- [ ] Storybook stories demonstrate all variants
- [ ] Type exports available for consumers
- [ ] Zero TypeScript `any` types
- [ ] Documentation in Storybook with usage examples

## Future Considerations

**Not included in this design (YAGNI):**
- Multiple spinner styles (dots, bars, pulse) - single style sufficient
- Built-in illustrations for EmptyState - keep library lean, let consumers provide
- Progress indication in Spinner - use Progress component instead
- Skeleton animation variants - single shimmer is standard and accessible

**Potential future additions:**
- `SkeletonTable` - If table component is added to boom-ui
- `SkeletonForm` - Common form loading pattern
- Spinner `delay` prop - Prevent flash for fast loads (add if needed)

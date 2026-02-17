# Component Patterns Reference

## Creating New Components

1. Follow the component structure pattern exactly
2. Use existing components as templates (Button, Checkbox, Switch are good examples)
3. Define props in separate `.types.ts` file
4. Export component and **ALL types** from component's `index.ts` (props, variants, base props, context types)
5. Add component and **ALL its types** to main `src/index.ts` for public API
6. Use shared types from `src/types/index.ts` where appropriate (Size, Variant, PolymorphicProps)
7. Write comprehensive tests including `axe()` accessibility check
8. Create Storybook stories showing all variants
9. **Review [SECURITY_CHECKLIST.md](../SECURITY_CHECKLIST.md) before submitting PR**

## Style Implementation

- Use CSS variables from tokens, never hardcode colors/spacing
- Follow BEM-like naming in CSS modules
- Support theme switching via ThemeProvider context
- Prefer CSS Grid/Flexbox with token-based spacing
- Animation: Use Framer Motion `motion` components

## Layout Components

### Box

For custom layouts with spacing tokens:

```tsx
// ❌ WRONG: Inline styles
<div style={{ display: 'flex', padding: '1.5rem', gap: '1rem' }}>

// ✅ CORRECT: Box with spacing tokens
<Box display="flex" padding={6} gap={4}>
```

**Box props:**
- `padding`, `margin`, `gap` - Spacing tokens (numbers)
- `display`, `flexDirection`, `alignItems`, `justifyContent` - Layout
- `width`, `height` - Dimensions
- `as` - Render as different HTML element

### Stack

For vertical/horizontal stacks with equal spacing:

```tsx
<Stack spacing={4}>
  <Item1 />
  <Item2 />
  <Item3 />
</Stack>
```

**Stack props:**
- `direction` - 'column' (default) or 'row'
- `spacing` - Gap between items (spacing token)
- `align`, `justify` - Alignment

### Grid

For multi-column layouts:

```tsx
<Grid columns={4} gap={4}>
  <Card />
  <Card />
  <Card />
  <Card />
</Grid>
```

**Grid props:**
- `columns` - Number of columns (fixed)
- `gap` - Space between items (spacing token)
- `minColumnWidth` - Minimum column width (responsive)
- `autoFit` - Use CSS Grid auto-fit

### Theme Colors in TypeScript

Use `useTheme()` hook to access theme colors:

```tsx
import { useTheme } from '@whatisboom/boom-ui';

function MyComponent() {
  const { colors } = useTheme();
  return <Box style={{ borderColor: colors.border.default, color: colors.primary }}>
}
```

**Available color groups:**
- `colors.bg.*` - Background colors
- `colors.text.*` - Text colors
- `colors.border.*` - Border colors
- `colors.primary`, `colors.secondary` - Interactive colors
- `colors.success.*`, `colors.error.*`, `colors.warning.*` - Semantic colors

### Layout Decision Tree

```
Do you need colors from the theme?
├─ YES → Use useTheme().colors
└─ NO  → Do you need a grid layout?
          ├─ YES → Use Grid
          └─ NO  → Do you need stacked items with equal spacing?
                    ├─ YES → Use Stack
                    └─ NO  → Use Box
```

## Custom Hooks (`src/hooks/`)

- `useClickOutside` - Detect outside clicks
- `useFocusTrap` - Trap focus for modals
- `useScrollLock` - Prevent body scroll
- `useKeyboardShortcut` - Keyboard event handling
- `useDebounce` - Debounce values

## Accessibility Helpers

- Focus management utils: `src/utils/focus-management.ts`
- Use semantic HTML elements
- ARIA attributes when semantic HTML insufficient
- Keyboard navigation support required for all interactive components

## Memory Cleanup Patterns

**CRITICAL: All components must properly clean up resources to prevent memory leaks.**

### Event Listeners

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => { /* handle event */ };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [dependencies]);
```

### Timers

```typescript
useEffect(() => {
  const timer = setTimeout(() => { /* do something */ }, delay);
  return () => clearTimeout(timer);
}, [dependencies]);
```

### Intervals

```typescript
useEffect(() => {
  const interval = setInterval(() => { /* do something */ }, delay);
  return () => clearInterval(interval);
}, [dependencies]);
```

### Animation Frames

```typescript
useEffect(() => {
  let rafId: number;
  const animate = () => {
    // animation logic
    rafId = requestAnimationFrame(animate);
  };
  rafId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(rafId);
}, [dependencies]);
```

### Scroll Lock

```typescript
import { useScrollLock } from '@/hooks/useScrollLock';

function MyComponent({ isOpen }: Props) {
  useScrollLock(isOpen); // Automatically cleans up
  return <div>...</div>;
}
```

### Memory Profiling

```bash
# Profile specific test file
MEMORY_PROFILE=true npm test -- src/components/MyComponent/MyComponent.test.tsx

# Capture heap snapshots for detailed analysis
MEMORY_PROFILE=true HEAP_SNAPSHOT=true npm test -- src/components/MyComponent/MyComponent.test.tsx
```

Heap snapshots are saved to `.heap-snapshots/` (gitignored).

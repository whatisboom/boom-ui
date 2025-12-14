# Card Component Design

**Date:** 2025-12-14
**Component:** Card
**Purpose:** Data display component for content containers and data presentation

## Overview

Card is a styled container component that provides visual treatment (elevation, borders, background) to distinguish content sections. Unlike Box (which is purely layout-focused), Card adds the aesthetic qualities that make something feel like a distinct content card.

## Design Decisions

### Component Pattern
- **Simple component** (not compound pattern)
- Polymorphic like Box/Typography (supports `as` prop)
- Users compose internal structure with Box, Stack, Typography, etc.
- Can refactor to compound pattern later if usage patterns emerge

### Use Cases
- Content containers (blog posts, product listings, user profiles)
- Data presentation (metrics, stats, dashboards)
- Interactive cards (clickable links, modal triggers)

### Visual Distinction from Box
- Box = layout primitive (flexbox/grid controls)
- Card = styling primitive (elevation, borders, visual treatment)
- Card likely uses Box or similar structure internally

## API Design

### Props

```typescript
interface CardProps<E extends ElementType = 'div'> {
  // Visual variants
  variant?: 'flat' | 'raised' | 'elevated';  // default: 'raised'

  // Spacing
  padding?: number;  // 0-12 scale, default: 4

  // Interactivity
  hoverable?: boolean;  // adds hover lift/shadow effects
  disableAnimation?: boolean;  // disables Framer Motion

  // Polymorphic
  as?: E;  // div, a, button, article, section, etc.

  // Standard
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
```

### Variant Styles

**flat** - Border only, no shadow
- Use case: Subtle separation, minimal design
- Border: `1px solid var(--boom-color-border)`
- Shadow: None

**raised** (default) - Subtle shadow for depth
- Use case: Standard cards, moderate emphasis
- Border: `1px solid var(--boom-color-border)`
- Shadow: `0 1px 3px rgba(0, 0, 0, 0.1)`

**elevated** - Pronounced shadow for prominence
- Use case: Important content, key metrics, featured items
- Border: `1px solid var(--boom-color-border)`
- Shadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`

### Base Styling

- Background: `var(--boom-color-bg-primary)`
- Border radius: `var(--boom-radius-lg)`
- Default padding: `var(--boom-spacing-4)` (16px)
- Transition: All properties with `prefers-reduced-motion` support

### Padding Control

- Default padding: `--boom-spacing-4`
- Configurable via `padding` prop (0-12 scale)
- `padding={0}` allows edge-to-edge content (images, tables)
- Users can override for dense layouts or custom spacing

### Interactivity

**Hoverable Behavior:**
- Opt-in via `hoverable={true}` prop
- Automatically applies `cursor: pointer`
- Works with polymorphic `as` prop (link, button, div with onClick)

**Hover Animation (when `hoverable && !disableAnimation`):**
- Lift: `translateY(-4px)`
- Shadow upgrade: Increases one level (flat→raised, raised→elevated, elevated→stronger)
- Duration: `0.2s ease-out`
- No scale transform (avoids content jump)
- Powered by Framer Motion for smooth animation
- Respects `prefers-reduced-motion` automatically

**Animation Control:**
- `disableAnimation={true}` - Disables Framer Motion, falls back to CSS-only
- Default animations are subtle and modern
- Motion effects respect system accessibility preferences

## Usage Examples

### Basic Card
```tsx
<Card>
  <Typography variant="h3">Title</Typography>
  <Typography>Content goes here</Typography>
</Card>
```

### Clickable Link Card
```tsx
<Card as="a" href="/article/123" hoverable>
  <Typography variant="h3">Article Title</Typography>
  <Typography variant="caption">Published Dec 14, 2025</Typography>
  <Typography>Preview text...</Typography>
</Card>
```

### Modal Trigger Card
```tsx
<Card as="button" onClick={openModal} hoverable>
  <Typography variant="h4">Click to view details</Typography>
</Card>
```

### Edge-to-Edge Image
```tsx
<Card padding={0}>
  <img src="hero.jpg" style={{ width: '100%' }} />
  <Box padding={4}>
    <Typography variant="h4">Image Caption</Typography>
    <Typography>Description text</Typography>
  </Box>
</Card>
```

### Elevated Metric Card
```tsx
<Card variant="elevated" padding={6}>
  <Typography variant="caption">Total Revenue</Typography>
  <Typography variant="h2">$1.2M</Typography>
  <Typography variant="body">↑ 12% from last month</Typography>
</Card>
```

### Flat Card for Subtle Grouping
```tsx
<Card variant="flat">
  <Stack spacing={2}>
    <Input label="Name" />
    <Input label="Email" />
    <Button>Submit</Button>
  </Stack>
</Card>
```

## Implementation Notes

### Component Structure
- Uses polymorphic pattern from existing components (Box, Typography)
- Conditionally wraps in Framer Motion when `hoverable && !disableAnimation`
- Falls back to static component when animations disabled
- CSS Module handles base styles, variants, static hover states

### TypeScript Types
- Extends `PolymorphicProps` for type-safe polymorphism
- Proper type inference for `as` prop and its native attributes
- Omits conflicting HTML attributes if needed

### Accessibility
- Semantic HTML encouraged via `as` prop (article, section, etc.)
- Interactive cards use proper elements (a, button)
- Respects `prefers-reduced-motion` via Framer Motion
- No ARIA needed for basic card (styling only)

### Testing Strategy
- Variant rendering (flat, raised, elevated)
- Padding prop application
- Polymorphic `as` prop (div, a, button, article)
- Hoverable behavior and cursor styles
- Animation enable/disable via `disableAnimation`
- Framer Motion integration
- Accessibility (no violations, reduced motion)

### Future Considerations
- Could add compound components (Card.Header, Card.Footer) if patterns emerge
- Could add more variants (outlined, ghost, colored borders)
- Could expose shadow/border controls individually for advanced use cases
- Monitor usage to see if default padding should change

## Design Rationale

### Why Simple Over Compound?
- Consistency with existing library philosophy (Box, Stack, Typography all simple)
- Maximum flexibility for composition
- Lower API surface area
- Can add compound components later without breaking changes

### Why Framer Motion for Hover?
- Consistent with Button component
- Smooth, performant animations
- Built-in `prefers-reduced-motion` support
- Easy to disable via prop

### Why Default Padding?
- Cards typically need internal spacing
- 95% of use cases want padding
- Easy to override with `padding={0}` for edge cases
- Better DX than forcing users to add padding every time

### Why Three Elevation Levels?
- Provides visual hierarchy for content importance
- Not overwhelming (3 options vs 5+)
- Covers common use cases (flat grouping, standard cards, featured content)
- Can add more variants later if needed

## Success Criteria

1. Card visually distinct from Box (elevation/borders clear)
2. Polymorphic `as` prop works with links, buttons, divs
3. Hoverable cards feel responsive and modern
4. Animations respect `prefers-reduced-motion`
5. Users can compose complex layouts with Box/Stack inside
6. 100% test coverage
7. No accessibility violations
8. Matches existing component patterns (types, CSS modules, tests)

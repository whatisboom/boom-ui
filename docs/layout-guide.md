# Layout Utilities Guide

> **TL;DR:** Use Box for custom layouts with spacing tokens. Use Stack for vertical/horizontal stacks. Use Grid for grid layouts. Avoid inline styles.

## The Problem with Inline Styles

Inline styles bypass the design system and create maintenance nightmares:

```tsx
// ❌ Problems:
// - Hardcoded values not from design system
// - No type safety or autocomplete
// - Inconsistent spacing across app
// - Can't easily update spacing globally
<div style={{
  display: 'flex',
  padding: '1.5rem',    // Is this 1.5rem everywhere? Or sometimes 24px?
  gap: '1rem',          // No connection to design tokens
  margin: '2rem 0'      // Magic numbers
}}>
```

## The Solution: Layout Components

boom-ui provides layout components that use design tokens and provide type-safe APIs:

```tsx
// ✅ Better:
// - Uses spacing tokens (6 = 1.5rem = 24px)
// - Type-safe with autocomplete
// - Consistent with design system
// - Easy to update globally
<Box display="flex" padding={6} gap={4} margin={8}>
```

---

## Spacing Token System

All layout components accept spacing tokens as numbers:

| Token | Pixels | Rems | Use Case |
|-------|--------|------|----------|
| 0 | 0 | 0 | No spacing |
| 1 | 4px | 0.25rem | Tiny spacing |
| 2 | 8px | 0.5rem | Small spacing |
| 3 | 12px | 0.75rem | Compact spacing |
| 4 | 16px | 1rem | Default spacing |
| 5 | 20px | 1.25rem | Comfortable spacing |
| 6 | 24px | 1.5rem | Medium spacing |
| 8 | 32px | 2rem | Large spacing |
| 10 | 40px | 2.5rem | Extra large spacing |
| 12 | 48px | 3rem | Section spacing |
| 16 | 64px | 4rem | Major section spacing |
| 20 | 80px | 5rem | Page-level spacing |

**How to choose:**
- **4-6**: Most common use case (buttons, cards, form fields)
- **8-10**: Sections and larger components
- **12-20**: Page layout and major sections

---

## Component Comparison

### Box - General Purpose Layout Utility

**Use for:**
- Custom flex or grid layouts
- Adding padding/margin to elements
- Polymorphic components (render as different HTML elements)
- When Stack and Grid don't fit

**Props:**
- `display` - CSS display property
- `flexDirection`, `alignItems`, `justifyContent` - Flex properties
- `padding`, `margin`, `gap` - Spacing tokens
- `width`, `height` - Dimensions
- `as` - Render as different HTML element

**Examples:**

```tsx
// Flex row with space-between
<Box display="flex" justifyContent="space-between" padding={6}>
  <Logo />
  <Navigation />
</Box>

// Centered content
<Box display="flex" alignItems="center" justifyContent="center" height="100vh">
  <LoginForm />
</Box>

// Semantic HTML with layout
<Box as="header" padding={4} margin={8}>
  <h1>Page Title</h1>
</Box>
```

---

### Stack - Vertical or Horizontal Layouts

**Use for:**
- Lists of items stacked vertically or horizontally
- Form fields
- Navigation menus
- Anywhere you need evenly-spaced items

**Props:**
- `direction` - 'column' (default) or 'row'
- `spacing` - Gap between items (spacing token)
- `align` - Align items (flex alignItems)
- `justify` - Justify content (flex justifyContent)

**Examples:**

```tsx
// Vertical form fields
<Stack spacing={4}>
  <Input label="Email" />
  <Input label="Password" type="password" />
  <Button>Submit</Button>
</Stack>

// Horizontal navigation
<Stack direction="row" spacing={6} align="center">
  <NavLink href="/">Home</NavLink>
  <NavLink href="/about">About</NavLink>
  <NavLink href="/contact">Contact</NavLink>
</Stack>

// Space-between header
<Stack direction="row" justify="space-between" align="center" padding={4}>
  <Logo />
  <Button>Sign In</Button>
</Stack>
```

---

### Grid - Multi-Column Layouts

**Use for:**
- Card grids (dashboards, product galleries)
- Responsive multi-column layouts
- Image galleries
- Data displays

**Props:**
- `columns` - Number of columns (fixed)
- `gap` - Space between grid items (spacing token)
- `minColumnWidth` - Minimum column width (responsive)
- `autoFit` - Use CSS Grid auto-fit
- `autoFill` - Use CSS Grid auto-fill

**Examples:**

```tsx
// Fixed 4-column dashboard grid
<Grid columns={4} gap={4}>
  <StatCard title="Users" value={1234} />
  <StatCard title="Revenue" value="$45k" />
  <StatCard title="Orders" value={567} />
  <StatCard title="Conversion" value="12%" />
</Grid>

// Responsive auto-fitting grid
<Grid minColumnWidth="250px" autoFit gap={6}>
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</Grid>

// Image gallery
<Grid columns={3} gap={2}>
  {images.map(img => (
    <img key={img.id} src={img.url} alt={img.alt} />
  ))}
</Grid>
```

---

## Decision Tree: Which Component?

```
Do you need a grid layout?
├─ YES → Use Grid
└─ NO  → Do you need vertically/horizontally stacked items with equal spacing?
          ├─ YES → Use Stack
          └─ NO  → Use Box
```

**More specific guidance:**

| Pattern | Component | Example |
|---------|-----------|---------|
| Dashboard stat cards | `Grid columns={4}` | 4-column card grid |
| Form fields | `Stack spacing={4}` | Vertical field list |
| Header with logo & nav | `Stack direction="row" justify="space-between"` | Space-between header |
| Centered modal content | `Box display="flex" alignItems="center"` | Centering |
| Product gallery | `Grid minColumnWidth="200px" autoFit` | Responsive grid |
| Button group | `Stack direction="row" spacing={2}` | Horizontal buttons |
| Sidebar navigation | `Stack spacing={1}` | Vertical nav links |

---

## Migration Examples

### Example 1: Dashboard Grid

**Before (inline styles):**
```tsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
  <StatCard />
  <StatCard />
  <StatCard />
  <StatCard />
</div>
```

**After (Grid component):**
```tsx
<Grid columns={4} gap={4}>
  <StatCard />
  <StatCard />
  <StatCard />
  <StatCard />
</Grid>
```

---

### Example 2: Form Layout

**Before (inline styles):**
```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
  <input />
  <input />
  <button>Submit</button>
</div>
```

**After (Stack component):**
```tsx
<Stack spacing={4}>
  <Input />
  <Input />
  <Button>Submit</Button>
</Stack>
```

---

### Example 3: Header Layout

**Before (inline styles):**
```tsx
<header style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.5rem',
}}>
  <Logo />
  <Nav />
</header>
```

**After (Stack component):**
```tsx
<Stack
  as="header"
  direction="row"
  justify="space-between"
  align="center"
  padding={6}
>
  <Logo />
  <Nav />
</Stack>
```

---

### Example 4: Card with Padding

**Before (inline styles):**
```tsx
<Card style={{ padding: '2rem' }}>
  <h2>Title</h2>
  <p>Content</p>
</Card>
```

**After (Box props):**
```tsx
<Card padding={8}>
  <h2>Title</h2>
  <p>Content</p>
</Card>
```

---

## Best Practices

### ✅ Do This

1. **Use spacing tokens consistently**
   ```tsx
   <Box padding={6} margin={4}>
   ```

2. **Use Stack for simple stacks**
   ```tsx
   <Stack spacing={4}>
     <Item1 />
     <Item2 />
   </Stack>
   ```

3. **Use Grid for multi-column layouts**
   ```tsx
   <Grid columns={3} gap={4}>
   ```

4. **Use semantic HTML with layout components**
   ```tsx
   <Box as="header" padding={4}>
   <Stack as="nav" direction="row">
   ```

5. **Combine components when needed**
   ```tsx
   <Box padding={8}>
     <Stack spacing={4}>
       <Typography variant="h2">Title</Typography>
       <Grid columns={2} gap={4}>
         <Card />
         <Card />
       </Grid>
     </Stack>
   </Box>
   ```

---

### ❌ Don't Do This

1. **Don't use inline styles for spacing**
   ```tsx
   // Bad
   <div style={{ padding: '1.5rem', margin: '1rem' }}>

   // Good
   <Box padding={6} margin={4}>
   ```

2. **Don't hardcode dimensions**
   ```tsx
   // Bad
   <div style={{ gap: '16px' }}>

   // Good
   <Stack spacing={4}>
   ```

3. **Don't use Box when Stack or Grid fits better**
   ```tsx
   // Bad
   <Box display="flex" flexDirection="column" gap={4}>

   // Good
   <Stack spacing={4}>
   ```

4. **Don't mix spacing systems**
   ```tsx
   // Bad - mixing tokens and inline styles
   <Box padding={6} style={{ margin: '1rem' }}>

   // Good - consistent tokens
   <Box padding={6} margin={4}>
   ```

---

## Common Patterns

### Page Layout

```tsx
<Box as="main" padding={8} maxWidth="1200px" margin="0 auto">
  <Stack spacing={8}>
    <Typography variant="h1">Page Title</Typography>

    <Grid columns={3} gap={6}>
      <Card>Column 1</Card>
      <Card>Column 2</Card>
      <Card>Column 3</Card>
    </Grid>

    <Stack spacing={4}>
      <Typography variant="h2">Section</Typography>
      <Typography variant="body">Content</Typography>
    </Stack>
  </Stack>
</Box>
```

### Dashboard

```tsx
<Box padding={6}>
  <Stack spacing={6}>
    {/* Header */}
    <Stack direction="row" justify="space-between" align="center">
      <Typography variant="h1">Dashboard</Typography>
      <Button>Export</Button>
    </Stack>

    {/* Stats Grid */}
    <Grid columns={4} gap={4}>
      <StatCard title="Total Users" value={1234} />
      <StatCard title="Active" value={890} />
      <StatCard title="New Today" value={42} />
      <StatCard title="Conversion" value="8.5%" />
    </Grid>

    {/* Content */}
    <Card padding={6}>
      <ActivityFeed />
    </Card>
  </Stack>
</Box>
```

### Form

```tsx
<Card padding={8} maxWidth="500px">
  <Stack spacing={6}>
    <Typography variant="h2">Login</Typography>

    <Stack spacing={4}>
      <Input label="Email" type="email" required />
      <Input label="Password" type="password" required />
    </Stack>

    <Stack direction="row" spacing={3} justify="flex-end">
      <Button variant="ghost">Cancel</Button>
      <Button type="submit">Login</Button>
    </Stack>
  </Stack>
</Card>
```

---

## Responsive Layouts

All layout components work with responsive design:

```tsx
// Responsive grid - auto-adjusts columns
<Grid minColumnWidth="250px" autoFit gap={4}>
  <Card />
  <Card />
  <Card />
</Grid>

// Stack that switches direction on mobile
<Stack
  direction={{ base: 'column', md: 'row' }}
  spacing={4}
>
  <Button />
  <Button />
</Stack>

// Note: Responsive props syntax depends on implementation
// Check component docs for exact API
```

---

## Advanced: Nesting and Composition

Layout components are designed to be composed:

```tsx
<Box padding={8}>
  {/* Outer container with padding */}
  <Stack spacing={8}>
    {/* Vertical sections with large spacing */}

    <Grid columns={2} gap={6}>
      {/* Two-column grid */}
      <Card padding={6}>
        {/* Card with padding */}
        <Stack spacing={4}>
          {/* Vertical content inside card */}
          <Typography variant="h3">Title</Typography>
          <Typography variant="body">Description</Typography>
        </Stack>
      </Card>

      <Card padding={6}>
        <Stack spacing={4}>
          <Typography variant="h3">Title</Typography>
          <Typography variant="body">Description</Typography>
        </Stack>
      </Card>
    </Grid>
  </Stack>
</Box>
```

---

## FAQ

**Q: Can I still use inline styles?**
A: Yes, but only for truly one-off styles that aren't related to spacing or layout. All spacing should use tokens.

**Q: What if I need a spacing value not in the token system?**
A: Use the closest token value. If you consistently need a custom value, consider proposing it as a new token.

**Q: Can Box replace div completely?**
A: For layout purposes, yes! But use semantic HTML (Typography, Card, etc.) for content.

**Q: How do I center content?**
A: Use Box with flex centering:
```tsx
<Box display="flex" alignItems="center" justifyContent="center" height="100vh">
  <Content />
</Box>
```

**Q: Can I combine Box props with className?**
A: Yes! Box props handle layout, className can add additional styling.

**Q: What about CSS Grid template areas?**
A: Use Box with `display="grid"` for advanced grid layouts. Grid component is for simple column-based grids.

---

## Summary

- **Box**: Custom layouts, padding/margin, flex containers, polymorphic rendering
- **Stack**: Vertical or horizontal stacks with equal spacing
- **Grid**: Multi-column grid layouts
- **Tokens**: Always use spacing tokens (numbers) instead of CSS units
- **Migration**: Replace inline styles with layout component props
- **Composition**: Combine components to build complex layouts

**Remember:** The goal is consistent, maintainable layouts using the design system. When in doubt, use a layout component instead of inline styles.

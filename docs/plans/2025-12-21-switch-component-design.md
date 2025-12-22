# Switch Component Design

## Overview
Add an iOS-style toggle switch component to the boom-ui library. The switch provides a binary on/off control with minimal visual design (sliding circle, no internal labels).

## Component API

### Core Props
- `checked: boolean` - Current state (controlled)
- `onChange: (checked: boolean) => void` - State change handler
- `label?: string` - Optional label text
- `labelPosition?: 'left' | 'right'` - Label placement (default: 'right')
- `size?: 'sm' | 'md' | 'lg'` - Size variant (default: 'md')

### Form Integration
- `error?: string` - Error message (shows below, hides helperText)
- `helperText?: string` - Helper text (shows below when no error)
- `required?: boolean` - Shows asterisk, sets aria-required
- `disabled?: boolean` - Disables interaction
- `fullWidth?: boolean` - Takes full container width

### Standard HTML Props
- `id?: string` - Auto-generated if not provided
- `name?: string` - Form field name
- `className?: string` - Custom wrapper class

## Visual Structure

```
[wrapper]
  [label (optional, positioned left or right)]
    [hidden native checkbox input with role="switch"]
    [custom visual switch]
      [track] - pill-shaped background
      [thumb] - circular sliding element
  [error or helperText]
```

### Visual Design
- **Track**: Rounded pill (border-radius: 9999px), transitions background color
  - Unchecked: `--boom-theme-bg-elevated` with border
  - Checked: `--boom-theme-primary` solid fill
- **Thumb**: White circle, absolutely positioned inside track
  - Unchecked: positioned left
  - Checked: positioned right (using `transform: translateX()`)
  - Smooth transition on state change
- **Sizes**:
  - `sm`: track ~32px × 18px, thumb ~14px
  - `md`: track ~40px × 22px, thumb ~18px
  - `lg`: track ~48px × 26px, thumb ~22px

### States
- Hover: Subtle background change on unchecked, darker primary on checked
- Focus: `--boom-theme-focus-ring` outline with 2px offset
- Disabled: 0.5 opacity, not-allowed cursor
- Error: Error border color on track

## Implementation Details

### File Structure
```
src/components/Switch/
├── Switch.tsx          - Main component with forwardRef
├── Switch.types.ts     - TypeScript interface
├── Switch.module.css   - CSS modules for styling
├── Switch.test.tsx     - Tests (rendering, interaction, accessibility)
├── Switch.stories.tsx  - Storybook stories
└── index.ts           - Exports
```

### CSS Approach
- Use CSS modules with theme tokens (`--boom-theme-*`)
- Track: `position: relative` container
- Thumb: `position: absolute`, use `transform: translateX()` for animation
- Transition: `transition: all 0.2s ease` on both track and thumb
- Hover/focus states follow Checkbox patterns

### Accessibility
- Native `<input type="checkbox" role="switch">` for proper semantics
- Visual track/thumb are `aria-hidden="true"`
- `aria-describedby` links to error/helperText IDs
- `aria-invalid="true"` when error present
- Keyboard: Space/Enter to toggle, focus-visible ring
- Auto-generated IDs using `useId()` hook

### Pattern Consistency
Follows established patterns from Checkbox and Input components:
- Same controlled component API (checked + onChange)
- Same form integration (error, helperText, required, disabled)
- Same size system (sm, md, lg)
- Same accessibility approach (auto-IDs, aria attributes)
- Same forwardRef pattern for ref forwarding

## Testing Strategy
- Rendering tests (sizes, states, labels)
- Interaction tests (click, keyboard)
- Accessibility tests (vitest-axe, ARIA attributes)
- Form integration tests (error, helperText, required)
- Comprehensive coverage matching Checkbox (28+ tests)

## Storybook Documentation
Stories demonstrating:
- Default switch
- Checked state
- Size variants
- Label positions
- Disabled states
- Error states
- Helper text
- Form examples
- Full width variant

# Storybook Organization Restructure

## Overview

Restructure Storybook sidebar organization from a component-type approach to a use-case-based approach. This makes it easier for developers to find components by what they're trying to accomplish and provides clearer pathways for adding new components in the future.

## Goals

1. Organize components by use case rather than component type
2. Make it easier for developers to discover relevant components
3. Provide compositional examples showing real-world patterns
4. Maintain clear documentation for low-level primitives
5. Scale cleanly as new components are added

## Current State

Components are currently organized with mixed approaches:
- Some use type-based paths: `'Components/Inputs/Button'`
- Some use primitive designation: `'Primitives/Modal'`
- Some have no clear categorization
- No compositional examples showing components working together

## Proposed Structure

### New Category Organization

```
📘 Getting Started
   - Introduction
   - Theme System
   - Layout Basics

📝 Forms & Validation
   - Button
   - Checkbox
   - Form
   - Input
   - Radio Group
   - Select
   - Slider
   - Switch
   - Textarea

📊 Data & Content
   - Avatar
   - Badge
   - Card
   - Skeleton
   - Table
   - Tree
   - Typography

🧭 Navigation & Menus
   - Header
   - Navigation
   - Notification Menu
   - Search Command
   - Tabs

💬 Feedback & Alerts
   - Alert
   - Empty State
   - Progress
   - Spinner
   - Toast

🪟 Overlays & Dialogs
   - Drawer
   - Modal
   - Overlay (primitive)
   - Popover
   - Portal (primitive)
   - Tooltip

🎨 Page Layouts
   - Box (primitive)
   - Error Boundary
   - Hero
   - Stack (primitive)

🎯 Examples
   - Authentication Flow
   - Data Management
   - Settings Panel
   - Admin Tools
```

### Component Categorization Rationale

**Forms & Validation**
- All interactive form controls and submission components
- Button included as primary action/submission component
- Complete form system with validation

**Data & Content**
- Components for displaying information
- Tables, cards, typography, badges, avatars
- Loading states (skeleton)

**Navigation & Menus**
- Components for site/app navigation
- Headers, menus, tabs, command palettes

**Feedback & Alerts**
- User feedback mechanisms
- Alerts, toasts, progress indicators
- Empty states for no-data scenarios

**Overlays & Dialogs**
- Components that appear above page content
- Modals, drawers, popovers, tooltips
- Includes low-level primitives (Portal, Overlay)

**Page Layouts**
- Structural layout components
- Hero sections, error boundaries
- Low-level layout primitives (Box, Stack)

**Examples**
- Compositional patterns showing multiple components working together
- Real-world use cases
- Minimal but functional demonstrations

## Implementation Details

### Story File Updates

Each component's story file will be updated:

```typescript
// Before
const meta = {
  title: 'Components/Inputs/Button',
  // ...
}

// After
const meta = {
  title: 'Forms & Validation/Button',
  // ...
}
```

### Primitive Component Notation

Low-level primitives will include warning documentation:

```typescript
const meta = {
  title: 'Overlays & Dialogs/Portal',
  component: Portal,
  parameters: {
    docs: {
      description: {
        component: '⚠️ Low-level primitive component. Most developers should use Modal, Drawer, or Popover instead.'
      }
    }
  },
  // ...
}
```

Applies to: Portal, Overlay, Box, Stack

### New Story Files to Create

#### 1. Introduction.stories.tsx (`Getting Started/Introduction`)

Content:
- Welcome message
- Installation instructions (`npm install @whatisboom/boom-ui`)
- Quick start guide
- Links to GitHub repository and documentation
- Basic usage example

#### 2. AuthenticationFlow.stories.tsx (`Examples/Authentication Flow`)

Stories:
- **Login Form** - Email, password, remember me checkbox
- **Signup Flow** - Multi-step registration (reference existing Form multi-step example)
- **Password Reset** - Email input with submission and success feedback

Components used: Form, Field, Input, Button, Card, Alert, FormMessage

#### 3. DataManagement.stories.tsx (`Examples/Data Management`)

Stories:
- **Filterable Table** - Table with Select/Input filters
- **Sortable Columns** - Interactive column headers
- **Row Actions** - Buttons and Popover menus for row operations
- **With Pagination** - Table with pagination controls

Components used: Table, Input, Select, Button, Badge, Popover

#### 4. SettingsPanel.stories.tsx (`Examples/Settings Panel`)

Stories:
- **Tabbed Settings** - Multiple setting categories in tabs
- **Profile Settings** - Form with various input types
- **Notification Preferences** - Switches and checkboxes
- **Save with Feedback** - Form submission with Toast confirmation

Components used: Tabs, Form, Field, Input, Switch, Checkbox, Button, Toast

#### 5. AdminTools.stories.tsx (`Examples/Admin Tools`)

Stories:
- **Admin Header** - Header with SearchCommand and NotificationMenu
- **Quick Actions** - Command palette with modal workflow
- **Bulk Operations** - Table selection with bulk action modals

Components used: Header, SearchCommand, NotificationMenu, Modal, Button, Table

### File Changes Summary

**Existing files to update (title field only):**
- All 38 existing `.stories.tsx` files
- Add primitive warnings to: Portal, Overlay, Box, Stack

**New files to create:**
- `src/components/Introduction.stories.tsx`
- `src/examples/AuthenticationFlow.stories.tsx`
- `src/examples/DataManagement.stories.tsx`
- `src/examples/SettingsPanel.stories.tsx`
- `src/examples/AdminTools.stories.tsx`

Note: Examples could live in `src/components/examples/` or `src/examples/` - either location works.

## Benefits

1. **Easier Discovery** - Developers find components by what they want to accomplish
2. **Clear Scaling Path** - New components have obvious categories to fit into
3. **Real-World Context** - Examples show how components work together
4. **Better Documentation** - Primitives clearly marked for advanced usage
5. **Consistent Organization** - All components follow the same categorization approach

## Migration Impact

**What changes:**
- Storybook sidebar organization
- Story file `title` fields
- Storybook URLs (bookmarks will break)

**What doesn't change:**
- Component implementations
- Component APIs
- Import paths
- Published package structure

**No redirects needed** - Users can re-bookmark stories if needed.

## Success Criteria

1. All components organized into clear use-case categories
2. Primitives clearly marked with warnings
3. Four compositional examples demonstrating real-world patterns
4. Getting Started section with introduction and theme documentation
5. Storybook sidebar easy to navigate and understand
6. Clear pathway for categorizing future components

## Future Enhancements

Potential additions (not part of this design):
- More compositional examples as patterns emerge
- Category-level documentation pages
- Custom sidebar ordering (if alphabetical isn't sufficient)
- Tags/filters for cross-cutting concerns (accessibility, form-related, etc.)

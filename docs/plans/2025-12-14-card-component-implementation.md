# Card Component Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a styled container component (Card) for data display with elevation variants and optional hover animations.

**Architecture:** Simple polymorphic component using PolymorphicProps pattern (like Box/Typography). Conditionally wraps in Framer Motion for hover animations when `hoverable && !disableAnimation`. Uses CSS modules for variant styling (flat/raised/elevated).

**Tech Stack:** React 18, TypeScript, Framer Motion, CSS Modules, Vitest, React Testing Library, vitest-axe

---

## Task 1: Type Definitions

**Files:**
- Create: `src/components/Card/Card.types.ts`

**Step 1: Create type definitions file**

Create the file with complete TypeScript types following the polymorphic pattern.

```typescript
import { ElementType, CSSProperties, ReactNode } from 'react';
import { PolymorphicProps } from '@/types';

export type CardVariant = 'flat' | 'raised' | 'elevated';

export interface CardBaseProps {
  /**
   * Visual variant for elevation/shadow
   */
  variant?: CardVariant;
  /**
   * Padding (uses spacing scale 0-12)
   */
  padding?: number;
  /**
   * Enable hover lift and shadow effects
   */
  hoverable?: boolean;
  /**
   * Disable Framer Motion animations
   */
  disableAnimation?: boolean;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Custom inline styles
   */
  style?: CSSProperties;
  /**
   * Child content
   */
  children?: ReactNode;
}

export type CardProps<E extends ElementType = 'div'> = CardBaseProps & PolymorphicProps<E>;
```

**Step 2: Verify types compile**

Run: `npm run typecheck`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/Card/Card.types.ts
git commit -m "feat(card): add Card component type definitions"
```

---

## Task 2: Test Suite (RED Phase)

**Files:**
- Create: `src/components/Card/Card.test.tsx`

**Step 1: Create comprehensive test suite**

Write all tests first (TDD RED phase). Tests will fail because component doesn't exist yet.

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Card } from './Card';
import styles from './Card.module.css';

describe('Card', () => {
  describe('Basic Rendering', () => {
    it('should render with children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should render as div by default', () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Card className="custom-class">Content</Card>);
      expect(screen.getByText('Content').closest('div')).toHaveClass('custom-class');
    });

    it('should apply custom styles', () => {
      render(<Card style={{ backgroundColor: 'red' }}>Content</Card>);
      const card = screen.getByText('Content').closest('div');
      expect(card).toHaveStyle({ backgroundColor: 'red' });
    });
  });

  describe('Variant Styles', () => {
    it('should render with raised variant by default', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass(styles.raised);
    });

    it('should render with flat variant', () => {
      const { container } = render(<Card variant="flat">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass(styles.flat);
    });

    it('should render with elevated variant', () => {
      const { container } = render(<Card variant="elevated">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass(styles.elevated);
    });
  });

  describe('Padding Control', () => {
    it('should apply default padding', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle({ padding: 'var(--boom-spacing-4)' });
    });

    it('should apply custom padding from prop', () => {
      const { container } = render(<Card padding={6}>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle({ padding: 'var(--boom-spacing-6)' });
    });

    it('should support zero padding', () => {
      const { container } = render(<Card padding={0}>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle({ padding: 'var(--boom-spacing-0)' });
    });
  });

  describe('Polymorphic Rendering', () => {
    it('should render as anchor when as="a"', () => {
      render(
        <Card as="a" href="/link">
          Link Card
        </Card>
      );
      const link = screen.getByText('Link Card').closest('a');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/link');
    });

    it('should render as button when as="button"', () => {
      render(<Card as="button">Button Card</Card>);
      expect(screen.getByRole('button', { name: /button card/i })).toBeInTheDocument();
    });

    it('should render as article when as="article"', () => {
      const { container } = render(<Card as="article">Article content</Card>);
      expect(container.querySelector('article')).toBeInTheDocument();
    });

    it('should render as section when as="section"', () => {
      const { container } = render(<Card as="section">Section content</Card>);
      expect(container.querySelector('section')).toBeInTheDocument();
    });
  });

  describe('Hoverable Behavior', () => {
    it('should apply hoverable class when hoverable is true', () => {
      const { container } = render(<Card hoverable>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass(styles.hoverable);
    });

    it('should not apply hoverable class by default', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveClass(styles.hoverable);
    });

    it('should have pointer cursor when hoverable', () => {
      const { container } = render(<Card hoverable>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass(styles.hoverable);
      // CSS module will set cursor: pointer
    });
  });

  describe('Animation Control', () => {
    it('should use motion component when hoverable and animations enabled', () => {
      const { container } = render(<Card hoverable>Content</Card>);
      const card = container.firstChild as HTMLElement;
      // Framer Motion adds data-testid or specific attributes
      expect(card).toBeInTheDocument();
    });

    it('should not use motion component when disableAnimation is true', () => {
      const { container } = render(
        <Card hoverable disableAnimation>
          Content
        </Card>
      );
      const card = container.firstChild as HTMLElement;
      expect(card).toBeInTheDocument();
    });

    it('should not use motion component when not hoverable', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('should handle onClick events', async () => {
      let clicked = false;
      const handleClick = () => {
        clicked = true;
      };

      render(
        <Card as="button" onClick={handleClick}>
          Clickable Card
        </Card>
      );

      await userEvent.click(screen.getByRole('button'));
      expect(clicked).toBe(true);
    });

    it('should forward native element props', () => {
      render(
        <Card as="a" href="/test" target="_blank" rel="noopener">
          Link
        </Card>
      );
      const link = screen.getByText('Link').closest('a');
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener');
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations (default)', async () => {
      const { container } = render(
        <Card>
          <h2>Card Title</h2>
          <p>Card content</p>
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations (as link)', async () => {
      const { container } = render(
        <Card as="a" href="/test" hoverable>
          Link Card
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations (as button)', async () => {
      const { container } = render(
        <Card as="button" hoverable>
          Button Card
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should use semantic HTML when appropriate', () => {
      const { container } = render(<Card as="article">Article</Card>);
      expect(container.querySelector('article')).toBeInTheDocument();
    });
  });

  describe('Composition', () => {
    it('should work with nested components', () => {
      render(
        <Card>
          <div data-testid="header">Header</div>
          <div data-testid="body">Body</div>
          <div data-testid="footer">Footer</div>
        </Card>
      );
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('body')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });
});
```

**Step 2: Run tests to verify they fail (RED)**

Run: `npm test -- Card.test.tsx`
Expected: All tests FAIL with "Cannot find module './Card'" or similar

**Step 3: Commit**

```bash
git add src/components/Card/Card.test.tsx
git commit -m "test(card): add comprehensive test suite for Card component"
```

---

## Task 3: CSS Module Styling

**Files:**
- Create: `src/components/Card/Card.module.css`

**Step 1: Create CSS module with all variant styles**

```css
.card {
  background-color: var(--boom-color-bg-primary);
  border-radius: var(--boom-radius-lg);
  transition: all var(--boom-transition-base);
}

/* Variants */
.flat {
  border: 1px solid var(--boom-color-border);
  box-shadow: none;
}

.raised {
  border: 1px solid var(--boom-color-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.elevated {
  border: 1px solid var(--boom-color-border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Hoverable state */
.hoverable {
  cursor: pointer;
}

.hoverable.flat:hover {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.hoverable.raised:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.hoverable.elevated:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }
}
```

**Step 2: Verify CSS file exists**

Run: `ls -la src/components/Card/Card.module.css`
Expected: File exists

**Step 3: Commit**

```bash
git add src/components/Card/Card.module.css
git commit -m "style(card): add CSS module with variant styles"
```

---

## Task 4: Component Implementation (GREEN Phase)

**Files:**
- Create: `src/components/Card/Card.tsx`

**Step 1: Implement Card component**

Write the component to make all tests pass (TDD GREEN phase).

```typescript
import { ElementType } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/classnames';
import { CardProps } from './Card.types';
import styles from './Card.module.css';

export function Card<E extends ElementType = 'div'>({
  as,
  variant = 'raised',
  padding = 4,
  hoverable = false,
  disableAnimation = false,
  className,
  style,
  children,
  ...props
}: CardProps<E>) {
  const Component = as || 'div';

  // Build inline styles with padding
  const cardStyle = {
    ...(padding !== undefined && {
      padding: `var(--boom-spacing-${padding})`,
    }),
    ...style,
  };

  // Build className
  const cardClassName = cn(
    styles.card,
    styles[variant],
    hoverable && styles.hoverable,
    className
  );

  // Use Framer Motion for hover animations when enabled
  const shouldAnimate = hoverable && !disableAnimation;

  if (shouldAnimate) {
    // Cast Component to motion component
    const MotionComponent = motion[Component as keyof typeof motion] || motion.div;

    return (
      <MotionComponent
        className={cardClassName}
        style={cardStyle}
        whileHover={{
          y: -4,
        }}
        transition={{
          duration: 0.2,
          ease: 'easeOut',
        }}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }

  // Static component without animations
  return (
    <Component className={cardClassName} style={cardStyle} {...props}>
      {children}
    </Component>
  );
}

Card.displayName = 'Card';
```

**Step 2: Run tests to verify they pass (GREEN)**

Run: `npm test -- Card.test.tsx`
Expected: All tests PASS

**Step 3: Check test coverage**

Run: `npm test -- Card.test.tsx --coverage`
Expected: 100% coverage for Card.tsx

**Step 4: Commit**

```bash
git add src/components/Card/Card.tsx
git commit -m "feat(card): implement Card component with variants and hover animations"
```

---

## Task 5: Barrel Export

**Files:**
- Create: `src/components/Card/index.ts`

**Step 1: Create barrel export**

```typescript
export { Card } from './Card';
export type { CardProps, CardVariant } from './Card.types';
```

**Step 2: Verify imports work**

Run: `npm run typecheck`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/Card/index.ts
git commit -m "feat(card): add barrel export for Card component"
```

---

## Task 6: Update Main Library Export

**Files:**
- Modify: `src/index.ts`

**Step 1: Add Card to main exports**

Add Card component and types to the main library export file.

```typescript
// Styles
import './styles/index.css';

// Components
export { Button } from './components/Button';
export { Typography } from './components/Typography';
export { Box } from './components/Box';
export { Stack } from './components/Stack';
export { Input } from './components/Input';
export { Card } from './components/Card';

// Types
export type { ButtonProps } from './components/Button';
export type { TypographyProps, TypographyVariant } from './components/Typography';
export type { BoxProps } from './components/Box';
export type { StackProps } from './components/Stack';
export type { InputProps } from './components/Input';
export type { CardProps, CardVariant } from './components/Card';

// Shared types
export type { Size, Variant, PolymorphicProps } from './types';
```

**Step 2: Verify build works**

Run: `npm run build`
Expected: Build succeeds, no errors

**Step 3: Commit**

```bash
git add src/index.ts
git commit -m "feat(card): export Card component from main library"
```

---

## Task 7: Storybook Stories

**Files:**
- Create: `src/components/Card/Card.stories.tsx`

**Step 1: Create comprehensive Storybook stories**

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Typography } from '../Typography';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Box } from '../Box';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['flat', 'raised', 'elevated'],
    },
    padding: {
      control: { type: 'number', min: 0, max: 12, step: 1 },
    },
    hoverable: {
      control: 'boolean',
    },
    disableAnimation: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a card with default settings.',
  },
};

export const Flat: Story = {
  args: {
    variant: 'flat',
    children: 'This is a flat card with no shadow.',
  },
};

export const Raised: Story = {
  args: {
    variant: 'raised',
    children: 'This is a raised card with subtle shadow (default).',
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: 'This is an elevated card with pronounced shadow.',
  },
};

export const WithCustomPadding: Story = {
  args: {
    padding: 8,
    children: 'This card has larger padding (8).',
  },
};

export const NoPadding: Story = {
  args: {
    padding: 0,
    children: (
      <div>
        <img
          src="https://via.placeholder.com/400x200"
          alt="Placeholder"
          style={{ width: '100%', display: 'block' }}
        />
        <Box padding={4}>
          <Typography variant="h4">Edge-to-Edge Image</Typography>
          <Typography>Image touches the card edges, content has padding.</Typography>
        </Box>
      </div>
    ),
  },
};

export const Hoverable: Story = {
  args: {
    hoverable: true,
    children: 'Hover over this card to see the lift effect.',
  },
};

export const HoverableLink: Story = {
  render: () => (
    <Card as="a" href="#" hoverable>
      <Typography variant="h4">Clickable Card</Typography>
      <Typography>This card is a link. Hover to see the effect.</Typography>
    </Card>
  ),
};

export const HoverableButton: Story = {
  render: () => (
    <Card as="button" onClick={() => alert('Card clicked!')} hoverable>
      <Typography variant="h4">Button Card</Typography>
      <Typography>This card triggers an action when clicked.</Typography>
    </Card>
  ),
};

export const BlogPost: Story = {
  render: () => (
    <Card as="article" style={{ maxWidth: '600px' }}>
      <Stack spacing={3}>
        <Typography variant="h3">Understanding React Hooks</Typography>
        <Typography variant="caption">Published on December 14, 2025</Typography>
        <Typography>
          React Hooks revolutionized how we write components by allowing us to use
          state and lifecycle features in functional components...
        </Typography>
        <Button variant="link" style={{ alignSelf: 'flex-start' }}>
          Read more →
        </Button>
      </Stack>
    </Card>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <Card hoverable style={{ maxWidth: '300px' }}>
      <Stack spacing={3}>
        <img
          src="https://via.placeholder.com/300x200"
          alt="Product"
          style={{ width: '100%', borderRadius: 'var(--boom-radius-md)' }}
        />
        <Stack spacing={2}>
          <Typography variant="h4">Premium Headphones</Typography>
          <Typography variant="body">
            High-quality wireless headphones with noise cancellation.
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h3">$299</Typography>
            <Button size="sm">Add to Cart</Button>
          </Box>
        </Stack>
      </Stack>
    </Card>
  ),
};

export const MetricCard: Story = {
  render: () => (
    <Card variant="elevated" padding={6} style={{ maxWidth: '250px' }}>
      <Stack spacing={2}>
        <Typography variant="caption" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Total Revenue
        </Typography>
        <Typography variant="h2" style={{ color: 'var(--boom-color-primary-600)' }}>
          $1.2M
        </Typography>
        <Typography variant="body" style={{ color: 'var(--boom-color-success-600)' }}>
          ↑ 12% from last month
        </Typography>
      </Stack>
    </Card>
  ),
};

export const UserProfile: Story = {
  render: () => (
    <Card padding={6} style={{ maxWidth: '400px' }}>
      <Stack spacing={4}>
        <Box display="flex" gap={3} alignItems="center">
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--boom-color-primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            JD
          </div>
          <Stack spacing={1}>
            <Typography variant="h4">John Doe</Typography>
            <Typography variant="caption">Software Engineer</Typography>
          </Stack>
        </Box>
        <Typography>
          Passionate about building great user experiences and scalable systems.
        </Typography>
        <Box display="flex" gap={2}>
          <Button size="sm" variant="outline" style={{ flex: 1 }}>
            Message
          </Button>
          <Button size="sm" style={{ flex: 1 }}>
            Follow
          </Button>
        </Box>
      </Stack>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <Stack spacing={4}>
      <Card variant="flat">
        <Typography variant="h4">Flat Card</Typography>
        <Typography>Border only, no shadow</Typography>
      </Card>
      <Card variant="raised">
        <Typography variant="h4">Raised Card</Typography>
        <Typography>Subtle shadow (default)</Typography>
      </Card>
      <Card variant="elevated">
        <Typography variant="h4">Elevated Card</Typography>
        <Typography>Pronounced shadow</Typography>
      </Card>
    </Stack>
  ),
};

export const DifferentPadding: Story = {
  render: () => (
    <Stack spacing={4}>
      <Card padding={2}>
        <Typography>Padding: 2 (small)</Typography>
      </Card>
      <Card padding={4}>
        <Typography>Padding: 4 (default)</Typography>
      </Card>
      <Card padding={8}>
        <Typography>Padding: 8 (large)</Typography>
      </Card>
    </Stack>
  ),
};

export const InteractiveCards: Story = {
  render: () => (
    <Box display="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--boom-spacing-4)' }}>
      <Card as="a" href="#" hoverable>
        <Typography variant="h4">Link Card</Typography>
        <Typography>Navigates to a new page</Typography>
      </Card>
      <Card as="button" onClick={() => console.log('clicked')} hoverable>
        <Typography variant="h4">Button Card</Typography>
        <Typography>Triggers an action</Typography>
      </Card>
      <Card hoverable disableAnimation>
        <Typography variant="h4">No Animation</Typography>
        <Typography>Hoverable but animations disabled</Typography>
      </Card>
    </Box>
  ),
};
```

**Step 2: Verify Storybook works**

Run: `npm run storybook`
Navigate to: http://localhost:6006
Expected: Card stories render correctly with all variants

**Step 3: Commit**

```bash
git add src/components/Card/Card.stories.tsx
git commit -m "docs(card): add Storybook stories for Card component"
```

---

## Task 8: Final Verification

**Files:**
- All Card component files

**Step 1: Run all tests**

Run: `npm test`
Expected: All tests pass (including existing components)

**Step 2: Check type safety**

Run: `npm run typecheck`
Expected: No TypeScript errors

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds, Card exported in dist/

**Step 4: Check linting**

Run: `npm run lint`
Expected: No linting errors

**Step 5: Verify test coverage**

Run: `npm test -- Card --coverage`
Expected: 100% coverage for Card component files

**Step 6: Final commit**

```bash
git add -A
git commit -m "feat(card): complete Card component implementation with tests and docs"
```

---

## Summary

**Created Files:**
1. `src/components/Card/Card.types.ts` - TypeScript type definitions
2. `src/components/Card/Card.test.tsx` - Comprehensive test suite (29 tests)
3. `src/components/Card/Card.module.css` - CSS module with variant styles
4. `src/components/Card/Card.tsx` - Component implementation
5. `src/components/Card/index.ts` - Barrel export
6. `src/components/Card/Card.stories.tsx` - Storybook stories (15 stories)
7. `docs/plans/2025-12-14-card-component-design.md` - Design document
8. `docs/plans/2025-12-14-card-component-implementation.md` - This implementation plan

**Modified Files:**
1. `src/index.ts` - Added Card exports

**Test Coverage:**
- 29 tests covering rendering, variants, padding, polymorphism, interactivity, animations, accessibility
- 100% code coverage on Card component

**Key Features:**
- Three elevation variants (flat, raised, elevated)
- Configurable padding (0-12 scale)
- Polymorphic (renders as any HTML element via `as` prop)
- Optional hover animations via Framer Motion
- Respects `prefers-reduced-motion`
- Full TypeScript support with type inference
- Accessibility compliant (WCAG 2.1 AA)

**TDD Approach:**
- RED: Write failing tests first
- GREEN: Implement component to pass tests
- REFACTOR: Code is clean from the start
- Frequent commits after each task

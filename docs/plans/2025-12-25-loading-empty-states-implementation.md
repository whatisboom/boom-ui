# Loading and Empty States Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement Skeleton, Spinner, and EmptyState components for loading and empty states.

**Architecture:** Three independent component systems using CSS animations, existing primitives (Portal, Overlay), and semantic markup. All animations respect prefers-reduced-motion. TDD approach with accessibility tests.

**Tech Stack:** React 18, TypeScript, CSS Modules, Framer Motion, vitest-axe, @testing-library/react

---

## Task 1: Add CSS Tokens for Skeleton

**Files:**
- Modify: `src/styles/tokens/palettes.css` (add skeleton colors to existing palette variables)

**Step 1: Add skeleton color tokens**

Add these tokens to the palettes.css file after the existing color definitions:

```css
/* Skeleton loading colors */
--boom-skeleton-base-light: hsl(var(--boom-hue-base), 10%, 85%);
--boom-skeleton-shimmer-light: hsl(var(--boom-hue-base), 10%, 90%);
--boom-skeleton-base-dark: hsl(var(--boom-hue-base), 8%, 20%);
--boom-skeleton-shimmer-dark: hsl(var(--boom-hue-base), 8%, 25%);
```

**Step 2: Verify tokens in light/dark themes**

Check that palettes.css has theme-specific sections and add the CSS variables:

```css
:root {
  /* Dark theme (default) */
  --skeleton-base-color: var(--boom-skeleton-base-dark);
  --skeleton-shimmer-color: var(--boom-skeleton-shimmer-dark);
}

[data-theme="light"] {
  --skeleton-base-color: var(--boom-skeleton-base-light);
  --skeleton-shimmer-color: var(--boom-skeleton-shimmer-light);
}
```

**Step 3: Commit**

```bash
git add src/styles/tokens/palettes.css
git commit -m "Add skeleton color tokens for light and dark themes"
```

---

## Task 2: Skeleton Base Component - Types

**Files:**
- Create: `src/components/Skeleton/Skeleton.types.ts`
- Create: `src/components/Skeleton/index.ts`

**Step 1: Create Skeleton types file**

```typescript
export interface SkeletonProps {
  /**
   * Visual variant of the skeleton
   * @default 'rect'
   */
  variant?: 'text' | 'circle' | 'rect' | 'custom';

  /**
   * Width of skeleton (CSS value or number in px)
   */
  width?: string | number;

  /**
   * Height of skeleton (CSS value or number in px)
   */
  height?: string | number;

  /**
   * Border radius (CSS value or number in px)
   */
  borderRadius?: string | number;

  /**
   * Number of skeleton lines to render
   * @default 1
   */
  lines?: number;

  /**
   * Disable shimmer animation
   * @default false
   */
  disableAnimation?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;
}
```

**Step 2: Create barrel export**

```typescript
export { Skeleton } from './Skeleton';
export type { SkeletonProps } from './Skeleton.types';
```

**Step 3: Commit**

```bash
git add src/components/Skeleton/Skeleton.types.ts src/components/Skeleton/index.ts
git commit -m "Add Skeleton component types"
```

---

## Task 3: Skeleton Base Component - Styles

**Files:**
- Create: `src/components/Skeleton/Skeleton.module.css`

**Step 1: Create Skeleton CSS with shimmer animation**

```css
.skeleton {
  background-color: var(--skeleton-base-color);
  border-radius: var(--boom-radius-sm);
  overflow: hidden;
  position: relative;
}

.skeleton::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    var(--skeleton-shimmer-color),
    transparent
  );
  animation: shimmer 1.5s infinite;
  transform: translateZ(0);
  will-change: transform;
}

@keyframes shimmer {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(200%);
  }
}

.noAnimation::after {
  animation: none;
}

/* Variant: text */
.text {
  height: 1em;
  border-radius: var(--boom-radius-xs);
}

/* Variant: circle */
.circle {
  border-radius: 50%;
  aspect-ratio: 1;
}

/* Variant: rect */
.rect {
  /* Uses base styles */
}

/* Variant: custom - user controls dimensions */
.custom {
  /* Uses base styles + user dimensions */
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .skeleton::after {
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
}
```

**Step 2: Commit**

```bash
git add src/components/Skeleton/Skeleton.module.css
git commit -m "Add Skeleton component styles with shimmer animation"
```

---

## Task 4: Skeleton Base Component - Implementation

**Files:**
- Create: `src/components/Skeleton/Skeleton.tsx`

**Step 1: Write failing test first**

Create: `src/components/Skeleton/Skeleton.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('should render with default props', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('should pass accessibility tests', async () => {
    const { container } = render(<Skeleton />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should render multiple lines when lines prop is provided', () => {
    const { container } = render(<Skeleton lines={3} />);
    const skeletons = container.querySelectorAll('[role="status"]');
    expect(skeletons).toHaveLength(3);
  });

  it('should apply variant classes', () => {
    const { rerender } = render(<Skeleton variant="text" data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('text');

    rerender(<Skeleton variant="circle" data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('circle');
  });

  it('should apply custom dimensions', () => {
    render(<Skeleton width={100} height={50} data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveStyle({ width: '100px', height: '50px' });
  });

  it('should disable animation when disableAnimation is true', () => {
    render(<Skeleton disableAnimation data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('noAnimation');
  });

  it('should have aria-busy and aria-live attributes', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
    expect(skeleton).toHaveAttribute('role', 'status');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test src/components/Skeleton/Skeleton.test.tsx`
Expected: FAIL - Skeleton component doesn't exist

**Step 3: Implement Skeleton component**

```typescript
import { CSSProperties } from 'react';
import { SkeletonProps } from './Skeleton.types';
import styles from './Skeleton.module.css';

export function Skeleton({
  variant = 'rect',
  width,
  height,
  borderRadius,
  lines = 1,
  disableAnimation = false,
  className = '',
}: SkeletonProps) {
  const formatDimension = (value: string | number | undefined): string | undefined => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
  };

  const style: CSSProperties = {
    width: formatDimension(width),
    height: formatDimension(height),
    borderRadius: formatDimension(borderRadius),
  };

  // Add random width variation for text variant
  const getTextWidth = (index: number): string | undefined => {
    if (variant !== 'text' || width !== undefined) return undefined;
    const widths = ['100%', '95%', '98%', '92%', '97%'];
    return widths[index % widths.length];
  };

  const skeletonClasses = [
    styles.skeleton,
    styles[variant],
    disableAnimation && styles.noAnimation,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (lines > 1) {
    return (
      <div className={styles.container}>
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={skeletonClasses}
            style={{
              ...style,
              width: getTextWidth(index) || style.width,
              marginBottom: index < lines - 1 ? '0.5em' : undefined,
            }}
            role="status"
            aria-busy="true"
            aria-live="polite"
            aria-label="Loading"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={skeletonClasses}
      style={style}
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading"
    />
  );
}
```

**Step 4: Add container styles for multiple lines**

Add to `Skeleton.module.css`:

```css
.container {
  display: flex;
  flex-direction: column;
}
```

**Step 5: Run tests to verify they pass**

Run: `npm test src/components/Skeleton/Skeleton.test.tsx`
Expected: PASS - All tests passing

**Step 6: Commit**

```bash
git add src/components/Skeleton/
git commit -m "Implement Skeleton base component with TDD"
```

---

## Task 5: Skeleton Base Component - Storybook

**Files:**
- Create: `src/components/Skeleton/Skeleton.stories.tsx`

**Step 1: Create Storybook stories**

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';
import { Stack } from '../Stack';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Text: Story = {
  args: {
    variant: 'text',
  },
};

export const TextMultipleLines: Story = {
  args: {
    variant: 'text',
    lines: 5,
  },
};

export const Circle: Story = {
  args: {
    variant: 'circle',
    width: 48,
    height: 48,
  },
};

export const Rectangle: Story = {
  args: {
    variant: 'rect',
    width: '100%',
    height: 200,
  },
};

export const CustomDimensions: Story = {
  args: {
    variant: 'custom',
    width: 300,
    height: 100,
    borderRadius: 16,
  },
};

export const NoAnimation: Story = {
  args: {
    variant: 'text',
    lines: 3,
    disableAnimation: true,
  },
};

export const CompositePattern: Story = {
  render: () => (
    <Stack spacing={4}>
      <Skeleton variant="circle" width={64} height={64} />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="rect" height={200} />
    </Stack>
  ),
};
```

**Step 2: Test in Storybook**

Run: `npm run storybook`
Navigate to: Skeleton component
Verify: All stories render correctly, animations work, dark mode works

**Step 3: Commit**

```bash
git add src/components/Skeleton/Skeleton.stories.tsx
git commit -m "Add Storybook stories for Skeleton component"
```

---

## Task 6: SkeletonText Component

**Files:**
- Create: `src/components/Skeleton/SkeletonText.tsx`
- Modify: `src/components/Skeleton/Skeleton.types.ts`
- Modify: `src/components/Skeleton/index.ts`

**Step 1: Add SkeletonText types**

Add to `Skeleton.types.ts`:

```typescript
export interface SkeletonTextProps {
  /**
   * Number of text lines
   * @default 3
   */
  lines?: number;

  /**
   * Width of the last line (for realistic paragraph ending)
   * @default '75%'
   */
  lastLineWidth?: string;

  /**
   * Disable shimmer animation
   * @default false
   */
  disableAnimation?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;
}
```

**Step 2: Write failing test**

Create: `src/components/Skeleton/SkeletonText.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { SkeletonText } from './SkeletonText';

describe('SkeletonText', () => {
  it('should render default 3 lines', () => {
    const { container } = render(<SkeletonText />);
    const skeletons = container.querySelectorAll('[role="status"]');
    expect(skeletons).toHaveLength(3);
  });

  it('should render custom number of lines', () => {
    const { container } = render(<SkeletonText lines={5} />);
    const skeletons = container.querySelectorAll('[role="status"]');
    expect(skeletons).toHaveLength(5);
  });

  it('should apply custom lastLineWidth to last line', () => {
    const { container } = render(<SkeletonText lines={3} lastLineWidth="50%" />);
    const skeletons = container.querySelectorAll('[role="status"]');
    const lastSkeleton = skeletons[skeletons.length - 1] as HTMLElement;
    expect(lastSkeleton).toHaveStyle({ width: '50%' });
  });

  it('should pass accessibility tests', async () => {
    const { container } = render(<SkeletonText />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

**Step 3: Run test to verify it fails**

Run: `npm test src/components/Skeleton/SkeletonText.test.tsx`
Expected: FAIL - SkeletonText doesn't exist

**Step 4: Implement SkeletonText**

```typescript
import { Skeleton } from './Skeleton';
import { SkeletonTextProps } from './Skeleton.types';

export function SkeletonText({
  lines = 3,
  lastLineWidth = '75%',
  disableAnimation = false,
  className,
}: SkeletonTextProps) {
  return (
    <div className={className}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? lastLineWidth : undefined}
          disableAnimation={disableAnimation}
          style={{ marginBottom: index < lines - 1 ? '0.5em' : undefined }}
        />
      ))}
    </div>
  );
}
```

**Step 5: Run tests to verify they pass**

Run: `npm test src/components/Skeleton/SkeletonText.test.tsx`
Expected: PASS

**Step 6: Update barrel export**

In `index.ts`:

```typescript
export { Skeleton } from './Skeleton';
export { SkeletonText } from './SkeletonText';
export type { SkeletonProps, SkeletonTextProps } from './Skeleton.types';
```

**Step 7: Commit**

```bash
git add src/components/Skeleton/
git commit -m "Add SkeletonText composite component"
```

---

## Task 7: SkeletonAvatar Component

**Files:**
- Create: `src/components/Skeleton/SkeletonAvatar.tsx`
- Create: `src/components/Skeleton/SkeletonAvatar.module.css`
- Modify: `src/components/Skeleton/Skeleton.types.ts`
- Modify: `src/components/Skeleton/index.ts`

**Step 1: Add SkeletonAvatar types**

Add to `Skeleton.types.ts`:

```typescript
import { Size } from '@/types';

export interface SkeletonAvatarProps {
  /**
   * Avatar size (matches Avatar component)
   * @default 'md'
   */
  size?: Size;

  /**
   * Show text lines beside avatar
   * @default false
   */
  withText?: boolean;

  /**
   * Number of text lines when withText is true
   * @default 2
   */
  textLines?: number;

  /**
   * Disable shimmer animation
   * @default false
   */
  disableAnimation?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;
}
```

**Step 2: Create styles**

Create `SkeletonAvatar.module.css`:

```css
.container {
  display: flex;
  align-items: center;
  gap: var(--boom-spacing-3);
}

.textContainer {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

/* Avatar sizes matching Avatar component */
.sm {
  width: 32px;
  height: 32px;
}

.md {
  width: 40px;
  height: 40px;
}

.lg {
  width: 48px;
  height: 48px;
}
```

**Step 3: Write failing test**

Create: `src/components/Skeleton/SkeletonAvatar.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { SkeletonAvatar } from './SkeletonAvatar';

describe('SkeletonAvatar', () => {
  it('should render circle skeleton', () => {
    const { container } = render(<SkeletonAvatar />);
    const skeleton = container.querySelector('[role="status"]');
    expect(skeleton).toBeInTheDocument();
  });

  it('should render with text when withText is true', () => {
    const { container } = render(<SkeletonAvatar withText />);
    const skeletons = container.querySelectorAll('[role="status"]');
    expect(skeletons.length).toBeGreaterThan(1); // Avatar + text lines
  });

  it('should render custom number of text lines', () => {
    const { container } = render(<SkeletonAvatar withText textLines={3} />);
    const skeletons = container.querySelectorAll('[role="status"]');
    expect(skeletons.length).toBe(4); // 1 avatar + 3 text lines
  });

  it('should pass accessibility tests', async () => {
    const { container } = render(<SkeletonAvatar withText />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

**Step 4: Run test to verify it fails**

Run: `npm test src/components/Skeleton/SkeletonAvatar.test.tsx`
Expected: FAIL

**Step 5: Implement SkeletonAvatar**

```typescript
import { Skeleton } from './Skeleton';
import { SkeletonTextProps } from './Skeleton.types';
import styles from './SkeletonAvatar.module.css';

export function SkeletonAvatar({
  size = 'md',
  withText = false,
  textLines = 2,
  disableAnimation = false,
  className,
}: SkeletonAvatarProps) {
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  const avatarSize = sizeMap[size];

  if (!withText) {
    return (
      <Skeleton
        variant="circle"
        width={avatarSize}
        height={avatarSize}
        disableAnimation={disableAnimation}
        className={className}
      />
    );
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <Skeleton
        variant="circle"
        width={avatarSize}
        height={avatarSize}
        disableAnimation={disableAnimation}
      />
      <div className={styles.textContainer}>
        {Array.from({ length: textLines }, (_, index) => (
          <Skeleton
            key={index}
            variant="text"
            disableAnimation={disableAnimation}
          />
        ))}
      </div>
    </div>
  );
}
```

**Step 6: Run tests to verify they pass**

Run: `npm test src/components/Skeleton/SkeletonAvatar.test.tsx`
Expected: PASS

**Step 7: Update exports**

In `index.ts`:

```typescript
export { Skeleton } from './Skeleton';
export { SkeletonText } from './SkeletonText';
export { SkeletonAvatar } from './SkeletonAvatar';
export type { SkeletonProps, SkeletonTextProps, SkeletonAvatarProps } from './Skeleton.types';
```

**Step 8: Commit**

```bash
git add src/components/Skeleton/
git commit -m "Add SkeletonAvatar composite component"
```

---

## Task 8: SkeletonCard Component

**Files:**
- Create: `src/components/Skeleton/SkeletonCard.tsx`
- Modify: `src/components/Skeleton/Skeleton.types.ts`
- Modify: `src/components/Skeleton/index.ts`

**Step 1: Add SkeletonCard types**

Add to `Skeleton.types.ts`:

```typescript
import { CardVariant } from '../Card/Card.types';

export interface SkeletonCardProps {
  /**
   * Card variant (matches Card component)
   * @default 'raised'
   */
  variant?: CardVariant;

  /**
   * Show image placeholder at top
   * @default false
   */
  hasImage?: boolean;

  /**
   * Show action button placeholders
   * @default false
   */
  hasActions?: boolean;

  /**
   * Disable shimmer animation
   * @default false
   */
  disableAnimation?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;
}
```

**Step 2: Write failing test**

Create: `src/components/Skeleton/SkeletonCard.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { SkeletonCard } from './SkeletonCard';

describe('SkeletonCard', () => {
  it('should render basic card skeleton', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with image when hasImage is true', () => {
    const { container } = render(<SkeletonCard hasImage />);
    const skeletons = container.querySelectorAll('[role="status"]');
    expect(skeletons.length).toBeGreaterThan(2); // Title + description + image
  });

  it('should render with actions when hasActions is true', () => {
    const { container } = render(<SkeletonCard hasActions />);
    const skeletons = container.querySelectorAll('[role="status"]');
    expect(skeletons.length).toBeGreaterThan(2); // Title + description + actions
  });

  it('should pass accessibility tests', async () => {
    const { container } = render(<SkeletonCard hasImage hasActions />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

**Step 3: Run test to verify it fails**

Run: `npm test src/components/Skeleton/SkeletonCard.test.tsx`
Expected: FAIL

**Step 4: Implement SkeletonCard**

```typescript
import { Card } from '../Card';
import { Skeleton } from './Skeleton';
import { SkeletonCardProps } from './Skeleton.types';
import { Stack } from '../Stack';

export function SkeletonCard({
  variant = 'raised',
  hasImage = false,
  hasActions = false,
  disableAnimation = false,
  className,
}: SkeletonCardProps) {
  return (
    <Card variant={variant} className={className}>
      <Stack spacing={3}>
        {hasImage && (
          <Skeleton
            variant="rect"
            height={200}
            disableAnimation={disableAnimation}
          />
        )}

        <Skeleton
          variant="text"
          width="90%"
          disableAnimation={disableAnimation}
        />
        <Skeleton
          variant="text"
          width="85%"
          disableAnimation={disableAnimation}
        />

        <Skeleton
          variant="text"
          width="95%"
          disableAnimation={disableAnimation}
        />
        <Skeleton
          variant="text"
          width="88%"
          disableAnimation={disableAnimation}
        />
        <Skeleton
          variant="text"
          width="60%"
          disableAnimation={disableAnimation}
        />

        {hasActions && (
          <Stack direction="row" spacing={2}>
            <Skeleton
              variant="rect"
              width={80}
              height={36}
              borderRadius={6}
              disableAnimation={disableAnimation}
            />
            <Skeleton
              variant="rect"
              width={80}
              height={36}
              borderRadius={6}
              disableAnimation={disableAnimation}
            />
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
```

**Step 5: Run tests to verify they pass**

Run: `npm test src/components/Skeleton/SkeletonCard.test.tsx`
Expected: PASS

**Step 6: Update exports**

In `index.ts`:

```typescript
export { Skeleton } from './Skeleton';
export { SkeletonText } from './SkeletonText';
export { SkeletonAvatar } from './SkeletonAvatar';
export { SkeletonCard } from './SkeletonCard';
export type {
  SkeletonProps,
  SkeletonTextProps,
  SkeletonAvatarProps,
  SkeletonCardProps
} from './Skeleton.types';
```

**Step 7: Add Storybook stories for all composite components**

Add to `Skeleton.stories.tsx`:

```typescript
export const SkeletonTextExample: Story = {
  render: () => <SkeletonText lines={5} />,
};

export const SkeletonAvatarExample: Story = {
  render: () => <SkeletonAvatar size="lg" withText textLines={2} />,
};

export const SkeletonCardExample: Story = {
  render: () => <SkeletonCard hasImage hasActions />,
};

export const SkeletonCardGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} hasImage hasActions />
      ))}
    </div>
  ),
};
```

**Step 8: Commit**

```bash
git add src/components/Skeleton/
git commit -m "Add SkeletonCard composite component with stories"
```

---

## Task 9: Spinner Component - Types and Styles

**Files:**
- Create: `src/components/Spinner/Spinner.types.ts`
- Create: `src/components/Spinner/Spinner.module.css`
- Create: `src/components/Spinner/index.ts`

**Step 1: Create Spinner types**

```typescript
import { Size } from '@/types';

export interface SpinnerProps {
  /**
   * Size of the spinner
   * @default 'md'
   */
  size?: Size;

  /**
   * Render with overlay backdrop (fullscreen)
   * @default false
   */
  overlay?: boolean;

  /**
   * Accessible label for screen readers
   * @default 'Loading'
   */
  label?: string;

  /**
   * Disable rotation animation
   * @default false
   */
  disableAnimation?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;
}
```

**Step 2: Create Spinner styles**

```css
.spinner {
  display: inline-block;
  border-radius: 50%;
  border-style: solid;
  border-color: currentColor;
  border-right-color: transparent;
  animation: spin 0.75s linear infinite;
  color: var(--boom-theme-text-primary);
}

.sm {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.md {
  width: 24px;
  height: 24px;
  border-width: 3px;
}

.lg {
  width: 32px;
  height: 32px;
  border-width: 4px;
}

.noAnimation {
  animation: none;
  opacity: 0.5;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Overlay mode */
.overlayContainer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: spin 1.5s linear infinite;
  }

  .spinner:not(.noAnimation) {
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
}
```

**Step 3: Create barrel export**

```typescript
export { Spinner } from './Spinner';
export type { SpinnerProps } from './Spinner.types';
```

**Step 4: Commit**

```bash
git add src/components/Spinner/
git commit -m "Add Spinner types and styles"
```

---

## Task 10: Spinner Component - Implementation

**Files:**
- Create: `src/components/Spinner/Spinner.tsx`
- Create: `src/components/Spinner/Spinner.test.tsx`

**Step 1: Write failing test**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('should render with default props', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('should have correct ARIA attributes', () => {
    render(<Spinner label="Loading content" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading content');
    expect(spinner).toHaveAttribute('aria-live', 'polite');
  });

  it('should render different sizes', () => {
    const { rerender } = render(<Spinner size="sm" />);
    let spinner = screen.getByRole('status');
    expect(spinner.firstChild).toHaveClass('sm');

    rerender(<Spinner size="lg" />);
    spinner = screen.getByRole('status');
    expect(spinner.firstChild).toHaveClass('lg');
  });

  it('should disable animation when disableAnimation is true', () => {
    render(<Spinner disableAnimation />);
    const spinnerElement = screen.getByRole('status').firstChild;
    expect(spinnerElement).toHaveClass('noAnimation');
  });

  it('should render with overlay', () => {
    const { container } = render(<Spinner overlay />);
    // Portal renders outside container
    expect(document.body.querySelector('[role="status"]')).toBeInTheDocument();
  });

  it('should pass accessibility tests', async () => {
    const { container } = render(<Spinner />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test src/components/Spinner/Spinner.test.tsx`
Expected: FAIL

**Step 3: Implement Spinner component**

```typescript
import { useRef, useEffect } from 'react';
import { Portal } from '../primitives/Portal';
import { Overlay } from '../primitives/Overlay';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { SpinnerProps } from './Spinner.types';
import styles from './Spinner.module.css';

export function Spinner({
  size = 'md',
  overlay = false,
  label = 'Loading',
  disableAnimation = false,
  className = '',
}: SpinnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useScrollLock(overlay);
  useFocusTrap(containerRef, overlay);

  const spinnerClasses = [
    styles.spinner,
    styles[size],
    disableAnimation && styles.noAnimation,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const spinnerElement = (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className={spinnerClasses} />
    </div>
  );

  if (overlay) {
    return (
      <Portal>
        <Overlay visible={true} />
        <div ref={containerRef} className={styles.overlayContainer}>
          {spinnerElement}
        </div>
      </Portal>
    );
  }

  return spinnerElement;
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test src/components/Spinner/Spinner.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/Spinner/
git commit -m "Implement Spinner component with TDD"
```

---

## Task 11: Spinner Component - Storybook

**Files:**
- Create: `src/components/Spinner/Spinner.stories.tsx`

**Step 1: Create stories**

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';
import { Stack } from '../Stack';
import { Button } from '../Button';
import { useState } from 'react';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const AllSizes: Story = {
  render: () => (
    <Stack direction="row" spacing={4} align="center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Stack>
  ),
};

export const NoAnimation: Story = {
  args: {
    disableAnimation: true,
  },
};

export const InButton: Story = {
  render: () => (
    <Button disabled>
      <Spinner size="sm" /> Processing...
    </Button>
  ),
};

export const WithOverlay: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);

    return (
      <>
        <Button onClick={() => setLoading(true)}>
          Show Loading Overlay
        </Button>
        {loading && (
          <Spinner
            overlay
            label="Loading application"
          />
        )}
        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
          Note: Refresh page to dismiss overlay in Storybook
        </div>
      </>
    );
  },
};
```

**Step 2: Test in Storybook**

Run: `npm run storybook`
Verify: All stories render, overlay works, sizes correct

**Step 3: Commit**

```bash
git add src/components/Spinner/Spinner.stories.tsx
git commit -m "Add Storybook stories for Spinner component"
```

---

## Task 12: EmptyState Component - Types and Styles

**Files:**
- Create: `src/components/EmptyState/EmptyState.types.ts`
- Create: `src/components/EmptyState/EmptyState.module.css`
- Create: `src/components/EmptyState/index.ts`

**Step 1: Create EmptyState types**

```typescript
import { ReactNode } from 'react';
import { Size } from '@/types';

export interface EmptyStateProps {
  /**
   * Illustration or icon element
   */
  illustration?: ReactNode;

  /**
   * Title text (required)
   */
  title: string;

  /**
   * Optional description text
   */
  description?: string;

  /**
   * Optional action element (typically a Button)
   */
  action?: ReactNode;

  /**
   * Controls sizing and spacing
   * @default 'md'
   */
  size?: Size;

  /**
   * Additional CSS class name
   */
  className?: string;
}
```

**Step 2: Create EmptyState styles**

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.illustration {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--boom-theme-text-tertiary);
}

.illustrationSm {
  width: 64px;
  height: 64px;
  font-size: 2rem;
}

.illustrationMd {
  width: 96px;
  height: 96px;
  font-size: 3rem;
}

.illustrationLg {
  width: 128px;
  height: 128px;
  font-size: 4rem;
}

.description {
  color: var(--boom-theme-text-secondary);
}
```

**Step 3: Create barrel export**

```typescript
export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState.types';
```

**Step 4: Commit**

```bash
git add src/components/EmptyState/
git commit -m "Add EmptyState types and styles"
```

---

## Task 13: EmptyState Component - Implementation

**Files:**
- Create: `src/components/EmptyState/EmptyState.tsx`
- Create: `src/components/EmptyState/EmptyState.test.tsx`

**Step 1: Write failing test**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { EmptyState } from './EmptyState';
import { Button } from '../Button';

describe('EmptyState', () => {
  it('should render with title', () => {
    render(<EmptyState title="No results found" />);
    expect(screen.getByRole('heading', { name: /no results found/i })).toBeInTheDocument();
  });

  it('should render with description', () => {
    render(
      <EmptyState
        title="No results"
        description="Try adjusting your filters"
      />
    );
    expect(screen.getByText(/try adjusting your filters/i)).toBeInTheDocument();
  });

  it('should render with illustration', () => {
    render(
      <EmptyState
        title="Empty"
        illustration={<div data-testid="illustration">Icon</div>}
      />
    );
    expect(screen.getByTestId('illustration')).toBeInTheDocument();
  });

  it('should render with action', () => {
    render(
      <EmptyState
        title="No items"
        action={<Button>Create item</Button>}
      />
    );
    expect(screen.getByRole('button', { name: /create item/i })).toBeInTheDocument();
  });

  it('should render different sizes', () => {
    const { rerender, container } = render(<EmptyState title="Title" size="sm" />);
    let emptyState = container.firstChild as HTMLElement;
    expect(emptyState).toBeInTheDocument();

    rerender(<EmptyState title="Title" size="lg" />);
    emptyState = container.firstChild as HTMLElement;
    expect(emptyState).toBeInTheDocument();
  });

  it('should pass accessibility tests', async () => {
    const { container } = render(
      <EmptyState
        illustration={<span>📭</span>}
        title="No messages"
        description="Your inbox is empty"
        action={<Button>Compose</Button>}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should use h2 heading by default', () => {
    render(<EmptyState title="No results" />);
    const heading = screen.getByRole('heading', { name: /no results/i });
    expect(heading.tagName).toBe('H2');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test src/components/EmptyState/EmptyState.test.tsx`
Expected: FAIL

**Step 3: Implement EmptyState**

```typescript
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { EmptyStateProps } from './EmptyState.types';
import styles from './EmptyState.module.css';

export function EmptyState({
  illustration,
  title,
  description,
  action,
  size = 'md',
  className = '',
}: EmptyStateProps) {
  const spacingMap = {
    sm: 2,
    md: 4,
    lg: 6,
  };

  const illustrationSizeClass = {
    sm: styles.illustrationSm,
    md: styles.illustrationMd,
    lg: styles.illustrationLg,
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <Stack spacing={spacingMap[size]} align="center">
        {illustration && (
          <div
            className={`${styles.illustration} ${illustrationSizeClass[size]}`}
            aria-hidden="true"
          >
            {illustration}
          </div>
        )}

        <Stack spacing={2} align="center">
          <Typography variant="h2" weight="semibold">
            {title}
          </Typography>

          {description && (
            <Typography
              variant="body"
              className={styles.description}
            >
              {description}
            </Typography>
          )}
        </Stack>

        {action && (
          <div>
            {action}
          </div>
        )}
      </Stack>
    </div>
  );
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test src/components/EmptyState/EmptyState.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/EmptyState/
git commit -m "Implement EmptyState component with TDD"
```

---

## Task 14: EmptyState Component - Storybook

**Files:**
- Create: `src/components/EmptyState/EmptyState.stories.tsx`

**Step 1: Create stories**

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { Button } from '../Button';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'No results found',
  },
};

export const WithDescription: Story = {
  args: {
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you\'re looking for',
  },
};

export const WithIllustration: Story = {
  args: {
    illustration: <span style={{ fontSize: '3rem' }}>🔍</span>,
    title: 'No results found',
    description: 'Try adjusting your search or filters',
  },
};

export const WithAction: Story = {
  args: {
    illustration: <span style={{ fontSize: '3rem' }}>📭</span>,
    title: 'No messages',
    description: 'Your inbox is empty',
    action: <Button variant="primary">Compose message</Button>,
  },
};

export const NoData: Story = {
  args: {
    illustration: <span style={{ fontSize: '3rem' }}>📦</span>,
    title: 'No items yet',
    description: 'Get started by creating your first item',
    action: <Button variant="primary">Create item</Button>,
  },
};

export const ErrorState: Story = {
  args: {
    illustration: <span style={{ fontSize: '3rem' }}>⚠️</span>,
    title: 'Something went wrong',
    description: 'We couldn\'t load your data. Please try again.',
    action: <Button>Try again</Button>,
  },
};

export const SmallSize: Story = {
  args: {
    illustration: <span style={{ fontSize: '2rem' }}>🔍</span>,
    title: 'No results',
    description: 'Try different keywords',
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    illustration: <span style={{ fontSize: '4rem' }}>📭</span>,
    title: 'Your inbox is empty',
    description: 'Messages from your contacts will appear here',
    action: <Button variant="primary" size="lg">Compose message</Button>,
    size: 'lg',
  },
};

export const MultipleActions: Story = {
  args: {
    illustration: <span style={{ fontSize: '3rem' }}>🎯</span>,
    title: 'Get started',
    description: 'Choose an action below to begin',
    action: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button variant="primary">Primary action</Button>
        <Button variant="secondary">Secondary action</Button>
      </div>
    ),
  },
};
```

**Step 2: Test in Storybook**

Run: `npm run storybook`
Verify: All stories render correctly, sizes work, actions functional

**Step 3: Commit**

```bash
git add src/components/EmptyState/EmptyState.stories.tsx
git commit -m "Add Storybook stories for EmptyState component"
```

---

## Task 15: Export All Components

**Files:**
- Modify: `src/index.ts`

**Step 1: Add component exports**

Add these exports to `src/index.ts`:

```typescript
// Skeleton components
export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard } from './components/Skeleton';

// Spinner
export { Spinner } from './components/Spinner';

// EmptyState
export { EmptyState } from './components/EmptyState';
```

**Step 2: Add type exports**

Add these type exports to `src/index.ts`:

```typescript
// Skeleton types
export type {
  SkeletonProps,
  SkeletonTextProps,
  SkeletonAvatarProps,
  SkeletonCardProps
} from './components/Skeleton';

// Spinner types
export type { SpinnerProps } from './components/Spinner';

// EmptyState types
export type { EmptyStateProps } from './components/EmptyState';
```

**Step 3: Verify exports with TypeScript**

Run: `npm run typecheck`
Expected: No errors

**Step 4: Commit**

```bash
git add src/index.ts
git commit -m "Export Skeleton, Spinner, and EmptyState components"
```

---

## Task 16: Run Full Test Suite

**Files:**
- All test files

**Step 1: Run all tests**

Run: `npm test`
Expected: All tests pass

**Step 2: Check coverage**

Run: `npm run test:coverage`
Expected: ≥80% coverage for all new components

**Step 3: If coverage is below 80%, add missing tests**

Check coverage report and add tests for uncovered branches/lines.

**Step 4: Commit any additional tests**

```bash
git add src/components/
git commit -m "Add additional tests to meet coverage requirements"
```

---

## Task 17: Build and Verify

**Files:**
- Distribution files

**Step 1: Run type checking**

Run: `npm run typecheck`
Expected: No TypeScript errors

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds, dist/ created

**Step 3: Verify exports in build**

Check: `dist/index.d.ts` includes new component types
Check: `dist/index.js` includes new component exports

**Step 4: Test in Storybook production build**

Run: `npm run build-storybook`
Expected: Build succeeds

**Step 5: Commit if any fixes needed**

```bash
git add .
git commit -m "Fix build issues for loading components"
```

---

## Task 18: Documentation Review

**Files:**
- Storybook stories for all components

**Step 1: Start Storybook**

Run: `npm run storybook`

**Step 2: Review each component's documentation**

Check:
- [ ] Skeleton - All variants, stories, docs complete
- [ ] SkeletonText - Example usage clear
- [ ] SkeletonAvatar - Size variants shown
- [ ] SkeletonCard - Composite patterns shown
- [ ] Spinner - All sizes, overlay mode shown
- [ ] EmptyState - All use cases demonstrated

**Step 3: Test accessibility in Storybook**

Use the a11y addon to verify all components pass

**Step 4: Test dark mode**

Toggle dark mode in Storybook, verify all components look correct

**Step 5: If documentation needs improvement, update stories**

```bash
git add src/components/*/
git commit -m "Improve component documentation and stories"
```

---

## Success Criteria Checklist

Before considering this implementation complete:

- [ ] All components pass vitest-axe accessibility tests
- [ ] 80%+ test coverage across all new components
- [ ] Animations respect prefers-reduced-motion (tested in browser DevTools)
- [ ] Components work in light and dark themes (tested in Storybook)
- [ ] Storybook stories demonstrate all variants
- [ ] All types exported in src/index.ts
- [ ] Zero TypeScript `any` types (verified by lint)
- [ ] Build succeeds with no errors
- [ ] Type checking passes
- [ ] All tests pass

---

## Testing Commands Reference

```bash
# Run specific component tests
npm test src/components/Skeleton/Skeleton.test.tsx
npm test src/components/Spinner/Spinner.test.tsx
npm test src/components/EmptyState/EmptyState.test.tsx

# Run all tests
npm test

# Coverage report
npm run test:coverage

# Type checking
npm run typecheck

# Build
npm run build

# Storybook
npm run storybook
npm run build-storybook
```

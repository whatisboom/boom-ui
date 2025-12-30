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

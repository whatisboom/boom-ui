import { describe, it, expect } from 'vitest';
import { render } from '../../../tests/test-utils';
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

import { describe, it, expect } from 'vitest';
import { render } from '../../../tests/test-utils';
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

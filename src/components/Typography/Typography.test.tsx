import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Typography } from './Typography';
import styles from './Typography.module.css';

describe('Typography', () => {
  it('should render with text', () => {
    render(<Typography>Hello World</Typography>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should render as p tag by default', () => {
    render(<Typography>Paragraph</Typography>);
    expect(screen.getByText('Paragraph').tagName).toBe('P');
  });

  it('should render as specified element with "as" prop', () => {
    render(<Typography as="h1">Heading</Typography>);
    expect(screen.getByText('Heading').tagName).toBe('H1');
  });

  it('should apply variant styles', () => {
    const { rerender } = render(<Typography variant="h1">Heading 1</Typography>);
    expect(screen.getByText('Heading 1')).toHaveClass(styles.h1);

    rerender(<Typography variant="caption">Caption</Typography>);
    expect(screen.getByText('Caption')).toHaveClass(styles.caption);
  });

  it('should apply alignment', () => {
    const { rerender } = render(<Typography align="center">Center</Typography>);
    expect(screen.getByText('Center')).toHaveClass(styles.center);

    rerender(<Typography align="right">Right</Typography>);
    expect(screen.getByText('Right')).toHaveClass(styles.right);
  });

  it('should apply font weight', () => {
    const { rerender } = render(<Typography weight="bold">Bold</Typography>);
    expect(screen.getByText('Bold')).toHaveClass(styles.bold);

    rerender(<Typography weight="medium">Medium</Typography>);
    expect(screen.getByText('Medium')).toHaveClass(styles.medium);
  });

  it('should merge custom className', () => {
    render(<Typography className="custom">Custom</Typography>);
    expect(screen.getByText('Custom')).toHaveClass('custom');
    expect(screen.getByText('Custom')).toHaveClass(styles.typography);
  });

  it('should use semantic HTML for headings', () => {
    render(<Typography variant="h1">Heading 1</Typography>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <div>
        <Typography variant="h1">Heading</Typography>
        <Typography>Body text</Typography>
      </div>
    );
    // @ts-expect-error - vitest-axe types are not fully compatible with vitest
    expect(await axe(container)).toHaveNoViolations();
  });
});

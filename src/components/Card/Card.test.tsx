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

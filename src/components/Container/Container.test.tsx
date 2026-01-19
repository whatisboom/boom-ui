import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { axe } from 'vitest-axe';
import { Container } from './Container';
import styles from './Container.module.css';

describe('Container', () => {
  describe('Basic Rendering', () => {
    it('should render with children', () => {
      render(<Container>Container content</Container>);
      expect(screen.getByText('Container content')).toBeInTheDocument();
    });

    it('should render as div by default', () => {
      const { container } = render(<Container>Content</Container>);
      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Container className="custom-class">Content</Container>);
      expect(screen.getByText('Content').closest('div')).toHaveClass('custom-class');
    });

    it('should apply custom styles', () => {
      render(<Container style={{ backgroundColor: 'red' }}>Content</Container>);
      const containerEl = screen.getByText('Content').closest('div');
      expect(containerEl).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' });
    });
  });

  describe('Size Variants', () => {
    it('should render with lg size by default', () => {
      const { container } = render(<Container>Content</Container>);
      const containerEl = container.firstChild as HTMLElement;
      expect(containerEl).toHaveClass(styles.lg);
    });

    it('should render with sm size', () => {
      const { container } = render(<Container size="sm">Content</Container>);
      const containerEl = container.firstChild as HTMLElement;
      expect(containerEl).toHaveClass(styles.sm);
    });

    it('should render with md size', () => {
      const { container } = render(<Container size="md">Content</Container>);
      const containerEl = container.firstChild as HTMLElement;
      expect(containerEl).toHaveClass(styles.md);
    });

    it('should render with lg size', () => {
      const { container } = render(<Container size="lg">Content</Container>);
      const containerEl = container.firstChild as HTMLElement;
      expect(containerEl).toHaveClass(styles.lg);
    });

    it('should render with xl size', () => {
      const { container } = render(<Container size="xl">Content</Container>);
      const containerEl = container.firstChild as HTMLElement;
      expect(containerEl).toHaveClass(styles.xl);
    });

    it('should render with full size', () => {
      const { container } = render(<Container size="full">Content</Container>);
      const containerEl = container.firstChild as HTMLElement;
      expect(containerEl).toHaveClass(styles.full);
    });
  });

  describe('Padding Control', () => {
    it('should apply default padding', () => {
      const { container } = render(<Container>Content</Container>);
      const containerEl = container.firstChild as HTMLElement;
      expect(containerEl).toHaveStyle({ padding: 'var(--boom-spacing-4)' });
    });

    it('should apply custom padding from prop', () => {
      const { container } = render(<Container padding={6}>Content</Container>);
      const containerEl = container.firstChild as HTMLElement;
      expect(containerEl).toHaveStyle({ padding: 'var(--boom-spacing-6)' });
    });

    it('should support zero padding', () => {
      const { container } = render(<Container padding={0}>Content</Container>);
      const containerEl = container.firstChild as HTMLElement;
      expect(containerEl).toHaveStyle({ padding: 'var(--boom-spacing-0)' });
    });

    it('should support large padding values', () => {
      const { container } = render(<Container padding={12}>Content</Container>);
      const containerEl = container.firstChild as HTMLElement;
      expect(containerEl).toHaveStyle({ padding: 'var(--boom-spacing-12)' });
    });
  });

  describe('Centered Alignment', () => {
    it('should be centered by default', () => {
      const { container } = render(<Container>Content</Container>);
      const containerEl = container.firstChild as HTMLElement;
      expect(containerEl).toHaveClass(styles.centered);
    });

    it('should apply centered class when centered=true', () => {
      const { container } = render(<Container centered>Content</Container>);
      const containerEl = container.firstChild as HTMLElement;
      expect(containerEl).toHaveClass(styles.centered);
    });

    it('should not apply centered class when centered=false', () => {
      const { container } = render(<Container centered={false}>Content</Container>);
      const containerEl = container.firstChild as HTMLElement;
      expect(containerEl).not.toHaveClass(styles.centered);
    });
  });

  describe('Polymorphic Rendering', () => {
    it('should render as main when as="main"', () => {
      const { container } = render(
        <Container as="main">
          Main content
        </Container>
      );
      expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('should render as section when as="section"', () => {
      const { container } = render(
        <Container as="section">
          Section content
        </Container>
      );
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should render as article when as="article"', () => {
      const { container } = render(
        <Container as="article">
          Article content
        </Container>
      );
      expect(container.querySelector('article')).toBeInTheDocument();
    });

    it('should forward native element props', () => {
      render(
        <Container as="section" aria-label="Test container" data-testid="custom-container">
          Content
        </Container>
      );
      const section = screen.getByLabelText('Test container');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('data-testid', 'custom-container');
    });
  });

  describe('Composition', () => {
    it('should work with nested components', () => {
      render(
        <Container>
          <div data-testid="header">Header</div>
          <div data-testid="body">Body</div>
          <div data-testid="footer">Footer</div>
        </Container>
      );
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('body')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should handle complex nested structures', () => {
      render(
        <Container size="xl" padding={8}>
          <header>
            <h1>Page Title</h1>
          </header>
          <main>
            <p>Main content</p>
          </main>
        </Container>
      );
      expect(screen.getByText('Page Title')).toBeInTheDocument();
      expect(screen.getByText('Main content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations (default)', async () => {
      const { container } = render(
        <Container>
          <h1>Content Title</h1>
          <p>Content paragraph</p>
        </Container>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations (as main)', async () => {
      const { container } = render(
        <Container as="main">
          <h1>Main Title</h1>
          <p>Main content</p>
        </Container>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations (as section)', async () => {
      const { container } = render(
        <Container as="section" aria-label="Content section">
          <p>Section content</p>
        </Container>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should use semantic HTML when appropriate', () => {
      const { container } = render(
        <Container as="main">
          Main content
        </Container>
      );
      expect(container.querySelector('main')).toBeInTheDocument();
    });
  });

  describe('Style Combination', () => {
    it('should combine size and padding correctly', () => {
      const { container } = render(
        <Container size="sm" padding={8}>
          Content
        </Container>
      );
      const containerEl = container.firstChild as HTMLElement;
      expect(containerEl).toHaveClass(styles.sm);
      expect(containerEl).toHaveStyle({ padding: 'var(--boom-spacing-8)' });
    });

    it('should handle custom styles with size variants', () => {
      const { container } = render(
        <Container size="xl" style={{ backgroundColor: 'blue' }}>
          Content
        </Container>
      );
      const containerEl = container.firstChild as HTMLElement;
      expect(containerEl).toHaveClass(styles.xl);
      expect(containerEl).toHaveStyle({ backgroundColor: 'rgb(0, 0, 255)' });
    });

    it('should support all props in combination', () => {
      const { container } = render(
        <Container
          as="section"
          size="md"
          padding={6}
          centered={false}
          className="custom-class"
          style={{ color: 'red' }}
        >
          Content
        </Container>
      );
      const containerEl = container.firstChild as HTMLElement;
      expect(containerEl.tagName.toLowerCase()).toBe('section');
      expect(containerEl).toHaveClass(styles.md);
      expect(containerEl).toHaveClass('custom-class');
      expect(containerEl).not.toHaveClass(styles.centered);
      expect(containerEl).toHaveStyle({
        padding: 'var(--boom-spacing-6)',
        color: 'rgb(255, 0, 0)',
      });
    });
  });
});

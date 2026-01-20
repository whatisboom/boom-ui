import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { axe } from 'vitest-axe';
import { Divider } from './Divider';
import styles from './Divider.module.css';

describe('Divider', () => {
  describe('Basic Rendering', () => {
    it('should render as hr element by default (no label)', () => {
      const { container } = render(<Divider />);
      expect(container.querySelector('hr')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Divider className="custom-class" />);
      const divider = container.querySelector('hr');
      expect(divider).toHaveClass('custom-class');
    });

    it('should apply custom styles', () => {
      const { container } = render(<Divider style={{ margin: '20px' }} />);
      const divider = container.querySelector('hr');
      expect(divider).toHaveStyle({ margin: '20px' });
    });
  });

  describe('Orientation', () => {
    it('should render horizontal by default', () => {
      const { container } = render(<Divider />);
      const divider = container.querySelector('hr');
      expect(divider).toHaveClass(styles.horizontal);
      expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('should render horizontal orientation', () => {
      const { container } = render(<Divider orientation="horizontal" />);
      const divider = container.querySelector('hr');
      expect(divider).toHaveClass(styles.horizontal);
      expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('should render vertical orientation', () => {
      const { container } = render(<Divider orientation="vertical" />);
      const divider = container.querySelector('hr');
      expect(divider).toHaveClass(styles.vertical);
      expect(divider).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  describe('Style Variants', () => {
    it('should render solid variant by default', () => {
      const { container } = render(<Divider />);
      const divider = container.querySelector('hr');
      expect(divider).toHaveClass(styles.solid);
    });

    it('should render solid variant', () => {
      const { container } = render(<Divider variant="solid" />);
      const divider = container.querySelector('hr');
      expect(divider).toHaveClass(styles.solid);
    });

    it('should render dashed variant', () => {
      const { container } = render(<Divider variant="dashed" />);
      const divider = container.querySelector('hr');
      expect(divider).toHaveClass(styles.dashed);
    });

    it('should render dotted variant', () => {
      const { container } = render(<Divider variant="dotted" />);
      const divider = container.querySelector('hr');
      expect(divider).toHaveClass(styles.dotted);
    });
  });

  describe('Labels', () => {
    it('should render with text label', () => {
      render(<Divider label="OR" />);
      expect(screen.getByText('OR')).toBeInTheDocument();
    });

    it('should use div with role separator when label is present', () => {
      const { container } = render(<Divider label="Text" />);
      const divider = container.querySelector('[role="separator"]');
      expect(divider).toBeInTheDocument();
      expect(divider?.tagName.toLowerCase()).toBe('div');
    });

    it('should render with icon label', () => {
      const icon = <span data-testid="icon">⭐</span>;
      render(<Divider label={icon} />);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should apply dividerWithLabel class when label is present', () => {
      const { container } = render(<Divider label="Text" />);
      const divider = container.querySelector('[role="separator"]');
      expect(divider).toHaveClass(styles.dividerWithLabel);
    });
  });

  describe('Label Positioning', () => {
    it('should center label by default', () => {
      const { container } = render(<Divider label="Text" />);
      const divider = container.querySelector('[role="separator"]');
      expect(divider).toHaveClass(styles.center);
    });

    it('should position label at center', () => {
      const { container } = render(<Divider label="Text" labelPosition="center" />);
      const divider = container.querySelector('[role="separator"]');
      expect(divider).toHaveClass(styles.center);
    });

    it('should position label at left', () => {
      const { container } = render(<Divider label="Text" labelPosition="left" />);
      const divider = container.querySelector('[role="separator"]');
      expect(divider).toHaveClass(styles.left);
    });

    it('should position label at right', () => {
      const { container } = render(<Divider label="Text" labelPosition="right" />);
      const divider = container.querySelector('[role="separator"]');
      expect(divider).toHaveClass(styles.right);
    });
  });

  describe('Vertical Dividers with Labels', () => {
    it('should warn when label is used with vertical orientation', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(<Divider orientation="vertical" label="Text" />);

      expect(warnSpy).toHaveBeenCalledWith(
        'Divider: Labels are not supported for vertical orientation. Rendering without label.'
      );

      warnSpy.mockRestore();
    });

    it('should not render label for vertical dividers', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(<Divider orientation="vertical" label="Text" />);

      expect(screen.queryByText('Text')).not.toBeInTheDocument();

      warnSpy.mockRestore();
    });

    it('should render vertical divider without label when label provided', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { container } = render(<Divider orientation="vertical" label="Text" />);
      const divider = container.querySelector('[role="separator"]');

      expect(divider).toHaveClass(styles.vertical);
      expect(divider).not.toHaveClass(styles.dividerWithLabel);

      warnSpy.mockRestore();
    });
  });

  describe('Semantic HTML', () => {
    it('should use hr element when no label', () => {
      const { container } = render(<Divider />);
      expect(container.querySelector('hr')).toBeInTheDocument();
    });

    it('should use div with role separator when label is present', () => {
      const { container } = render(<Divider label="Text" />);
      const divider = container.querySelector('[role="separator"]');
      expect(divider).toBeInTheDocument();
      expect(container.querySelector('hr')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations (horizontal)', async () => {
      const { container } = render(
        <div>
          <p>Content above</p>
          <Divider />
          <p>Content below</p>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations (vertical)', async () => {
      const { container } = render(
        <div style={{ display: 'flex', height: '100px' }}>
          <span>Left</span>
          <Divider orientation="vertical" />
          <span>Right</span>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations (with label)', async () => {
      const { container } = render(
        <div>
          <p>Content above</p>
          <Divider label="OR" />
          <p>Content below</p>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations (dashed variant)', async () => {
      const { container } = render(
        <div>
          <p>Content above</p>
          <Divider variant="dashed" />
          <p>Content below</p>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should set aria-orientation attribute', () => {
      const { container } = render(<Divider orientation="horizontal" />);
      const divider = container.querySelector('hr');
      expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('should set aria-orientation for vertical divider', () => {
      const { container } = render(<Divider orientation="vertical" />);
      const divider = container.querySelector('hr');
      expect(divider).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('should set aria-orientation on labeled divider', () => {
      const { container } = render(<Divider label="Text" />);
      const divider = container.querySelector('[role="separator"]');
      expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
    });
  });

  describe('Combined Props', () => {
    it('should combine orientation and variant correctly', () => {
      const { container } = render(<Divider orientation="horizontal" variant="dashed" />);
      const divider = container.querySelector('hr');
      expect(divider).toHaveClass(styles.horizontal);
      expect(divider).toHaveClass(styles.dashed);
    });

    it('should combine all props correctly', () => {
      const { container } = render(
        <Divider
          orientation="horizontal"
          variant="dotted"
          label="OR"
          labelPosition="left"
          className="custom"
          style={{ margin: '10px' }}
        />
      );
      const divider = container.querySelector('[role="separator"]');
      expect(divider).toHaveClass(styles.dividerWithLabel);
      expect(divider).toHaveClass(styles.left);
      expect(divider).toHaveClass('custom');
      expect(divider).toHaveStyle({ margin: '10px' });
      expect(screen.getByText('OR')).toBeInTheDocument();
    });
  });
});

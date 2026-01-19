import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Grid } from './Grid';

describe('Grid', () => {
  describe('Rendering', () => {
    it('renders children', () => {
      render(
        <Grid>
          <div>Item 1</div>
          <div>Item 2</div>
        </Grid>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('renders as div by default', () => {
      const { container } = render(
        <Grid>
          <div>Content</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.tagName).toBe('DIV');
    });

    it('renders as specified element with "as" prop', () => {
      const { container } = render(
        <Grid as="section">
          <div>Content</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.tagName).toBe('SECTION');
    });

    it('applies custom className', () => {
      const { container } = render(
        <Grid className="custom-grid">
          <div>Content</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain('custom-grid');
    });
  });

  describe('Fixed Columns', () => {
    it('applies fixed column count', () => {
      const { container } = render(
        <Grid columns={4}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('repeat(4, 1fr)');
    });

    it('applies single column when no props provided', () => {
      const { container } = render(
        <Grid>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('1fr');
    });
  });

  describe('Responsive Grid', () => {
    it('applies minColumnWidth with auto-fit by default', () => {
      const { container } = render(
        <Grid minColumnWidth="250px">
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('repeat(auto-fit, minmax(250px, 1fr))');
    });

    it('applies auto-fit when specified', () => {
      const { container } = render(
        <Grid minColumnWidth="200px" autoFit>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('repeat(auto-fit, minmax(200px, 1fr))');
    });

    it('applies auto-fill when specified', () => {
      const { container } = render(
        <Grid minColumnWidth="200px" autoFill>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('repeat(auto-fill, minmax(200px, 1fr))');
    });
  });

  describe('Gap/Spacing', () => {
    it('applies default gap (4)', () => {
      const { container } = render(
        <Grid columns={2}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      // Gap is applied via Box component which uses CSS variable
      // We can verify the gap prop was passed by checking computed style
      expect(grid.style.gap).toBeTruthy();
    });

    it('applies custom gap value', () => {
      const { container } = render(
        <Grid columns={2} gap={8}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gap).toBeTruthy();
    });

    it('applies gap value of 0', () => {
      const { container } = render(
        <Grid columns={2} gap={0}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gap).toBeTruthy();
    });
  });

  describe('Style Props', () => {
    it('applies custom inline styles', () => {
      const { container } = render(
        <Grid columns={2} style={{ border: '1px solid red' }}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.border).toBe('1px solid red');
    });

    it('merges custom styles with grid styles', () => {
      const { container } = render(
        <Grid columns={3} style={{ padding: '1rem', background: 'blue' }}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
      expect(grid.style.padding).toBe('1rem');
      expect(grid.style.background).toBe('blue');
    });
  });

  describe('Prop Validation', () => {
    it('warns when using both columns and minColumnWidth', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <Grid columns={4} minColumnWidth="250px">
          <div>Item</div>
        </Grid>
      );

      expect(consoleWarn).toHaveBeenCalledWith(
        'Grid: Cannot use both "columns" and "minColumnWidth" props. Using "columns".'
      );

      consoleWarn.mockRestore();
    });

    it('warns when using autoFit without minColumnWidth', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <Grid columns={4} autoFit>
          <div>Item</div>
        </Grid>
      );

      expect(consoleWarn).toHaveBeenCalledWith(
        'Grid: "autoFit" and "autoFill" only work with "minColumnWidth". Ignoring.'
      );

      consoleWarn.mockRestore();
    });

    it('uses columns when both columns and minColumnWidth provided', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { container } = render(
        <Grid columns={4} minColumnWidth="250px">
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('repeat(4, 1fr)');

      consoleWarn.mockRestore();
    });
  });

  describe('Display', () => {
    it('applies display: grid', () => {
      const { container } = render(
        <Grid columns={2}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.display).toBe('grid');
    });
  });

  describe('Accessibility', () => {
    it('passes axe accessibility tests', async () => {
      const { container } = render(
        <Grid columns={2}>
          <div>Item 1</div>
          <div>Item 2</div>
        </Grid>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe with semantic element', async () => {
      const { container } = render(
        <Grid as="section" columns={3} aria-label="Product Grid">
          <article>Product 1</article>
          <article>Product 2</article>
          <article>Product 3</article>
        </Grid>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Multiple Layouts', () => {
    it('handles two-column layout', () => {
      const { container } = render(
        <Grid columns={2} gap={4}>
          <div>Col 1</div>
          <div>Col 2</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('repeat(2, 1fr)');
    });

    it('handles four-column layout', () => {
      const { container } = render(
        <Grid columns={4} gap={6}>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('repeat(4, 1fr)');
    });

    it('handles responsive grid', () => {
      const { container } = render(
        <Grid minColumnWidth="15rem" gap={4}>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gridTemplateColumns).toContain('minmax(15rem, 1fr)');
    });
  });

  describe('Responsive Columns', () => {
    it('applies responsive columns with base value', () => {
      const { container } = render(
        <Grid columns={{ base: 1, md: 2, lg: 3 }}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain('cols-base-1');
      expect(grid.className).toContain('cols-md-2');
      expect(grid.className).toContain('cols-lg-3');
    });

    it('applies responsive columns without base value', () => {
      const { container } = render(
        <Grid columns={{ md: 2, lg: 4 }}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain('cols-md-2');
      expect(grid.className).toContain('cols-lg-4');
    });

    it('applies all breakpoints for responsive columns', () => {
      const { container } = render(
        <Grid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 6 }}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain('cols-base-1');
      expect(grid.className).toContain('cols-sm-2');
      expect(grid.className).toContain('cols-md-3');
      expect(grid.className).toContain('cols-lg-4');
      expect(grid.className).toContain('cols-xl-6');
    });

    it('does not apply inline gridTemplateColumns when using responsive columns', () => {
      const { container } = render(
        <Grid columns={{ base: 1, md: 2 }}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('');
    });
  });

  describe('Responsive Gap', () => {
    it('applies responsive gap with base value', () => {
      const { container } = render(
        <Grid columns={2} gap={{ base: 2, md: 4, lg: 6 }}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain('gap-base-2');
      expect(grid.className).toContain('gap-md-4');
      expect(grid.className).toContain('gap-lg-6');
    });

    it('applies responsive gap without base value', () => {
      const { container } = render(
        <Grid columns={2} gap={{ md: 4, lg: 8 }}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain('gap-md-4');
      expect(grid.className).toContain('gap-lg-8');
    });

    it('applies all breakpoints for responsive gap', () => {
      const { container } = render(
        <Grid columns={2} gap={{ base: 2, sm: 3, md: 4, lg: 6, xl: 8 }}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain('gap-base-2');
      expect(grid.className).toContain('gap-sm-3');
      expect(grid.className).toContain('gap-md-4');
      expect(grid.className).toContain('gap-lg-6');
      expect(grid.className).toContain('gap-xl-8');
    });

    it('does not apply inline gap when using responsive gap', () => {
      const { container } = render(
        <Grid columns={2} gap={{ base: 2, md: 4 }}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gap).toBe('');
    });
  });

  describe('Combined Responsive Props', () => {
    it('applies both responsive columns and gap', () => {
      const { container } = render(
        <Grid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: 2, md: 4 }}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain('cols-base-1');
      expect(grid.className).toContain('cols-md-2');
      expect(grid.className).toContain('cols-lg-3');
      expect(grid.className).toContain('gap-base-2');
      expect(grid.className).toContain('gap-md-4');
    });

    it('mixes responsive and non-responsive props', () => {
      const { container } = render(
        <Grid columns={{ base: 1, md: 2 }} gap={4}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.className).toContain('cols-base-1');
      expect(grid.className).toContain('cols-md-2');
      expect(grid.style.gap).toBeTruthy();
    });

    it('mixes non-responsive columns with responsive gap', () => {
      const { container } = render(
        <Grid columns={3} gap={{ base: 2, lg: 6 }}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
      expect(grid.className).toContain('gap-base-2');
      expect(grid.className).toContain('gap-lg-6');
    });
  });

  describe('Backward Compatibility', () => {
    it('still supports number columns prop', () => {
      const { container } = render(
        <Grid columns={4}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe('repeat(4, 1fr)');
    });

    it('still supports number gap prop', () => {
      const { container } = render(
        <Grid columns={2} gap={6}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gap).toBeTruthy();
    });

    it('still supports minColumnWidth', () => {
      const { container } = render(
        <Grid minColumnWidth="200px">
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.style.gridTemplateColumns).toContain('minmax(200px, 1fr)');
    });
  });

  describe('Edge Cases', () => {
    it('handles responsive columns with only some breakpoints defined', () => {
      const { container } = render(
        <Grid columns={{ md: 2, xl: 4 }}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.className).not.toContain('cols-base-');
      expect(grid.className).not.toContain('cols-sm-');
      expect(grid.className).toContain('cols-md-2');
      expect(grid.className).not.toContain('cols-lg-');
      expect(grid.className).toContain('cols-xl-4');
    });

    it('handles responsive gap with only some breakpoints defined', () => {
      const { container } = render(
        <Grid columns={2} gap={{ sm: 3, lg: 6 }}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      expect(grid.className).not.toContain('gap-base-');
      expect(grid.className).toContain('gap-sm-3');
      expect(grid.className).not.toContain('gap-md-');
      expect(grid.className).toContain('gap-lg-6');
      expect(grid.className).not.toContain('gap-xl-');
    });

    it('handles empty responsive object gracefully', () => {
      const { container } = render(
        <Grid columns={{} as Record<string, number>}>
          <div>Item</div>
        </Grid>
      );

      const grid = container.firstChild as HTMLElement;
      // Should not crash and should render with default
      expect(grid).toBeInTheDocument();
    });
  });
});

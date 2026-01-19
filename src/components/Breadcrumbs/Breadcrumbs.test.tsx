import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  describe('Rendering', () => {
    it('renders breadcrumb items', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
          <Breadcrumbs.Item current>Product Name</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Product Name')).toBeInTheDocument();
    });

    it('renders as nav by default', () => {
      const { container } = render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const nav = container.firstChild as HTMLElement;
      expect(nav.tagName).toBe('NAV');
    });

    it('renders as specified element with "as" prop', () => {
      const { container } = render(
        <Breadcrumbs as="div">
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.tagName).toBe('DIV');
    });

    it('applies custom className', () => {
      const { container } = render(
        <Breadcrumbs className="custom-breadcrumbs">
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const breadcrumbs = container.firstChild as HTMLElement;
      expect(breadcrumbs.className).toContain('custom-breadcrumbs');
    });
  });

  describe('Separators', () => {
    it('renders default separator', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const separators = screen.getAllByText('/');
      expect(separators).toHaveLength(1);
    });

    it('renders custom text separator', () => {
      render(
        <Breadcrumbs separator=">">
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      expect(screen.getByText('>')).toBeInTheDocument();
    });

    it('renders custom component separator', () => {
      const ChevronIcon = () => <span data-testid="chevron">›</span>;
      render(
        <Breadcrumbs separator={<ChevronIcon />}>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      expect(screen.getByTestId('chevron')).toBeInTheDocument();
    });

    it('does not render separator after last item', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item current>Products</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const separators = screen.getAllByText('/');
      expect(separators).toHaveLength(1);
    });
  });

  describe('BreadcrumbItem', () => {
    it('renders as link when href provided', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const link = screen.getByText('Home');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/home');
    });

    it('renders as span when no href', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item>Current</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const item = screen.getByText('Current');
      expect(item.tagName).toBe('SPAN');
    });

    it('renders as custom element with "as" prop', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item as="button">Home</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const item = screen.getByText('Home');
      expect(item.tagName).toBe('BUTTON');
    });

    it('applies custom className to item', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/" className="custom-item">
            Home
          </Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const item = screen.getByText('Home');
      expect(item.className).toContain('custom-item');
    });

    it('handles click events', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/home" onClick={handleClick}>
            Home
          </Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const item = screen.getByText('Home');
      await user.click(item);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Current Page', () => {
    it('applies aria-current="page" to current item', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item current>Products</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const currentItem = screen.getByText('Products');
      expect(currentItem).toHaveAttribute('aria-current', 'page');
    });

    it('does not apply aria-current to non-current items', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item current>Products</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const homeItem = screen.getByText('Home');
      expect(homeItem).not.toHaveAttribute('aria-current');
    });
  });

  describe('Max Items / Ellipsis', () => {
    it('shows all items when count is less than maxItems', () => {
      render(
        <Breadcrumbs maxItems={5}>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
          <Breadcrumbs.Item current>Product Name</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Product Name')).toBeInTheDocument();
      expect(screen.queryByText('…')).not.toBeInTheDocument();
    });

    it('collapses items when count exceeds maxItems', () => {
      render(
        <Breadcrumbs maxItems={3}>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/category">Category</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/subcategory">Subcategory</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
          <Breadcrumbs.Item current>Product Name</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      // Should show first item, ellipsis, and last item
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('…')).toBeInTheDocument();
      expect(screen.getByText('Product Name')).toBeInTheDocument();

      // Hidden items should not be in document
      expect(screen.queryByText('Category')).not.toBeInTheDocument();
      expect(screen.queryByText('Subcategory')).not.toBeInTheDocument();
    });

    it('shows first and last items with ellipsis when maxItems=3', () => {
      render(
        <Breadcrumbs maxItems={3}>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/a">A</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/b">B</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/c">C</Breadcrumbs.Item>
          <Breadcrumbs.Item current>Current</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('…')).toBeInTheDocument();
      expect(screen.getByText('Current')).toBeInTheDocument();
    });

    it('ellipsis has aria-hidden', () => {
      render(
        <Breadcrumbs maxItems={3}>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/a">A</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/b">B</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/c">C</Breadcrumbs.Item>
          <Breadcrumbs.Item current>Current</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const ellipsis = screen.getByText('…');
      expect(ellipsis).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Accessibility', () => {
    it('has aria-label="breadcrumb" by default', () => {
      const { container } = render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const nav = container.firstChild as HTMLElement;
      expect(nav).toHaveAttribute('aria-label', 'breadcrumb');
    });

    it('accepts custom aria-label', () => {
      const { container } = render(
        <Breadcrumbs aria-label="Custom navigation">
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const nav = container.firstChild as HTMLElement;
      expect(nav).toHaveAttribute('aria-label', 'Custom navigation');
    });

    it('separators have aria-hidden', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const separator = screen.getByText('/');
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });

    it('passes axe accessibility tests', async () => {
      const { container } = render(
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
          <Breadcrumbs.Item current>Product Name</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe with custom separator', async () => {
      const { container } = render(
        <Breadcrumbs separator=">">
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
          <Breadcrumbs.Item current>Product Name</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe with maxItems', async () => {
      const { container } = render(
        <Breadcrumbs maxItems={3}>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/a">A</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/b">B</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/c">C</Breadcrumbs.Item>
          <Breadcrumbs.Item current>Current</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Edge Cases', () => {
    it('handles single item', () => {
      render(
        <Breadcrumbs>
          <Breadcrumbs.Item current>Home</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.queryByText('/')).not.toBeInTheDocument();
    });

    it('handles maxItems=1', () => {
      render(
        <Breadcrumbs maxItems={1}>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
          <Breadcrumbs.Item current>Product Name</Breadcrumbs.Item>
        </Breadcrumbs>
      );

      // With maxItems=1, should still show at least 2 items (first and last) with ellipsis
      expect(screen.getByText('…')).toBeInTheDocument();
    });

    it('handles empty children gracefully', () => {
      const { container } = render(<Breadcrumbs>{[]}</Breadcrumbs>);

      const nav = container.firstChild as HTMLElement;
      expect(nav).toBeInTheDocument();
    });
  });
});

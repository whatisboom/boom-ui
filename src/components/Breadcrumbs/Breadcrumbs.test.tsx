import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Breadcrumbs } from './Breadcrumbs';
import { BreadcrumbItem } from './BreadcrumbItem';

describe('Breadcrumbs', () => {
  describe('Rendering', () => {
    it('renders breadcrumb items', () => {
      render(
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
          <BreadcrumbItem current>Product Name</BreadcrumbItem>
        </Breadcrumbs>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Product Name')).toBeInTheDocument();
    });

    it('renders as nav by default', () => {
      const { container } = render(
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
        </Breadcrumbs>
      );

      const nav = container.firstChild as HTMLElement;
      expect(nav.tagName).toBe('NAV');
    });

    it('renders as specified element with "as" prop', () => {
      const { container } = render(
        <Breadcrumbs as="div">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
        </Breadcrumbs>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.tagName).toBe('DIV');
    });

    it('applies custom className', () => {
      const { container } = render(
        <Breadcrumbs className="custom-breadcrumbs">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
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
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        </Breadcrumbs>
      );

      const separators = screen.getAllByText('/');
      expect(separators).toHaveLength(1);
    });

    it('renders custom text separator', () => {
      render(
        <Breadcrumbs separator=">">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        </Breadcrumbs>
      );

      expect(screen.getByText('>')).toBeInTheDocument();
    });

    it('renders custom component separator', () => {
      const ChevronIcon = () => <span data-testid="chevron">›</span>;
      render(
        <Breadcrumbs separator={<ChevronIcon />}>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        </Breadcrumbs>
      );

      expect(screen.getByTestId('chevron')).toBeInTheDocument();
    });

    it('does not render separator after last item', () => {
      render(
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem current>Products</BreadcrumbItem>
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
          <BreadcrumbItem href="/home">Home</BreadcrumbItem>
        </Breadcrumbs>
      );

      const link = screen.getByText('Home');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/home');
    });

    it('renders as span when no href', () => {
      render(
        <Breadcrumbs>
          <BreadcrumbItem>Current</BreadcrumbItem>
        </Breadcrumbs>
      );

      const item = screen.getByText('Current');
      expect(item.tagName).toBe('SPAN');
    });

    it('renders as custom element with "as" prop', () => {
      render(
        <Breadcrumbs>
          <BreadcrumbItem as="button">Home</BreadcrumbItem>
        </Breadcrumbs>
      );

      const item = screen.getByText('Home');
      expect(item.tagName).toBe('BUTTON');
    });

    it('applies custom className to item', () => {
      render(
        <Breadcrumbs>
          <BreadcrumbItem href="/" className="custom-item">
            Home
          </BreadcrumbItem>
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
          <BreadcrumbItem href="/home" onClick={handleClick}>
            Home
          </BreadcrumbItem>
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
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem current>Products</BreadcrumbItem>
        </Breadcrumbs>
      );

      const currentItem = screen.getByText('Products');
      expect(currentItem).toHaveAttribute('aria-current', 'page');
    });

    it('does not apply aria-current to non-current items', () => {
      render(
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem current>Products</BreadcrumbItem>
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
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
          <BreadcrumbItem current>Product Name</BreadcrumbItem>
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
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/category">Category</BreadcrumbItem>
          <BreadcrumbItem href="/subcategory">Subcategory</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
          <BreadcrumbItem current>Product Name</BreadcrumbItem>
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
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/a">A</BreadcrumbItem>
          <BreadcrumbItem href="/b">B</BreadcrumbItem>
          <BreadcrumbItem href="/c">C</BreadcrumbItem>
          <BreadcrumbItem current>Current</BreadcrumbItem>
        </Breadcrumbs>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('…')).toBeInTheDocument();
      expect(screen.getByText('Current')).toBeInTheDocument();
    });

    it('ellipsis has aria-hidden', () => {
      render(
        <Breadcrumbs maxItems={3}>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/a">A</BreadcrumbItem>
          <BreadcrumbItem href="/b">B</BreadcrumbItem>
          <BreadcrumbItem href="/c">C</BreadcrumbItem>
          <BreadcrumbItem current>Current</BreadcrumbItem>
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
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
        </Breadcrumbs>
      );

      const nav = container.firstChild as HTMLElement;
      expect(nav).toHaveAttribute('aria-label', 'breadcrumb');
    });

    it('accepts custom aria-label', () => {
      const { container } = render(
        <Breadcrumbs aria-label="Custom navigation">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
        </Breadcrumbs>
      );

      const nav = container.firstChild as HTMLElement;
      expect(nav).toHaveAttribute('aria-label', 'Custom navigation');
    });

    it('separators have aria-hidden', () => {
      render(
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        </Breadcrumbs>
      );

      const separator = screen.getByText('/');
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });

    it('passes axe accessibility tests', async () => {
      const { container } = render(
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
          <BreadcrumbItem current>Product Name</BreadcrumbItem>
        </Breadcrumbs>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe with custom separator', async () => {
      const { container } = render(
        <Breadcrumbs separator=">">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
          <BreadcrumbItem current>Product Name</BreadcrumbItem>
        </Breadcrumbs>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe with maxItems', async () => {
      const { container } = render(
        <Breadcrumbs maxItems={3}>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/a">A</BreadcrumbItem>
          <BreadcrumbItem href="/b">B</BreadcrumbItem>
          <BreadcrumbItem href="/c">C</BreadcrumbItem>
          <BreadcrumbItem current>Current</BreadcrumbItem>
        </Breadcrumbs>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Key Generation', () => {
    it('generates stable keys for items with href', () => {
      const { rerender } = render(
        <Breadcrumbs>
          <BreadcrumbItem href="/home">Home</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        </Breadcrumbs>
      );

      const firstRenderHome = screen.getByText('Home');
      const firstRenderProducts = screen.getByText('Products');

      // Re-render with same items
      rerender(
        <Breadcrumbs>
          <BreadcrumbItem href="/home">Home</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        </Breadcrumbs>
      );

      // Elements should be the same instances (keys are stable)
      expect(screen.getByText('Home')).toBe(firstRenderHome);
      expect(screen.getByText('Products')).toBe(firstRenderProducts);
    });

    it('respects explicit keys when provided', () => {
      render(
        <Breadcrumbs>
          <BreadcrumbItem key="custom-home" href="/home">
            Home
          </BreadcrumbItem>
          <BreadcrumbItem key="custom-products" href="/products">
            Products
          </BreadcrumbItem>
        </Breadcrumbs>
      );

      // Should render without console warnings about duplicate keys
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
    });

    it('generates keys for ellipsis when using maxItems', () => {
      render(
        <Breadcrumbs maxItems={3}>
          <BreadcrumbItem href="/home">Home</BreadcrumbItem>
          <BreadcrumbItem href="/a">A</BreadcrumbItem>
          <BreadcrumbItem href="/b">B</BreadcrumbItem>
          <BreadcrumbItem href="/c">C</BreadcrumbItem>
          <BreadcrumbItem current>Current</BreadcrumbItem>
        </Breadcrumbs>
      );

      // Ellipsis should render without key warnings
      expect(screen.getByText('…')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Current')).toBeInTheDocument();
    });

    it('handles dynamic maxItems changes without key conflicts', () => {
      const { rerender } = render(
        <Breadcrumbs maxItems={5}>
          <BreadcrumbItem href="/home">Home</BreadcrumbItem>
          <BreadcrumbItem href="/a">A</BreadcrumbItem>
          <BreadcrumbItem href="/b">B</BreadcrumbItem>
          <BreadcrumbItem href="/c">C</BreadcrumbItem>
          <BreadcrumbItem current>Current</BreadcrumbItem>
        </Breadcrumbs>
      );

      // All items visible
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();

      // Change maxItems to collapse some items
      rerender(
        <Breadcrumbs maxItems={3}>
          <BreadcrumbItem href="/home">Home</BreadcrumbItem>
          <BreadcrumbItem href="/a">A</BreadcrumbItem>
          <BreadcrumbItem href="/b">B</BreadcrumbItem>
          <BreadcrumbItem href="/c">C</BreadcrumbItem>
          <BreadcrumbItem current>Current</BreadcrumbItem>
        </Breadcrumbs>
      );

      // Ellipsis now visible, middle items hidden
      expect(screen.getByText('…')).toBeInTheDocument();
      expect(screen.queryByText('A')).not.toBeInTheDocument();
      expect(screen.queryByText('B')).not.toBeInTheDocument();
    });

    it('generates unique keys for items without href', () => {
      render(
        <Breadcrumbs>
          <BreadcrumbItem href="/home">Home</BreadcrumbItem>
          <BreadcrumbItem>No Link 1</BreadcrumbItem>
          <BreadcrumbItem>No Link 2</BreadcrumbItem>
          <BreadcrumbItem current>Current</BreadcrumbItem>
        </Breadcrumbs>
      );

      // All items should render without duplicate key warnings
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('No Link 1')).toBeInTheDocument();
      expect(screen.getByText('No Link 2')).toBeInTheDocument();
      expect(screen.getByText('Current')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles single item', () => {
      render(
        <Breadcrumbs>
          <BreadcrumbItem current>Home</BreadcrumbItem>
        </Breadcrumbs>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.queryByText('/')).not.toBeInTheDocument();
    });

    it('handles maxItems=1', () => {
      render(
        <Breadcrumbs maxItems={1}>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
          <BreadcrumbItem current>Product Name</BreadcrumbItem>
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

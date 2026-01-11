import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  const defaultProps = {
    pageIndex: 0,
    pageSize: 10,
    pageCount: 10,
    rowCount: 100,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
  };

  it('renders current page info', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText(/showing 1-10 of 100 rows/i)).toBeInTheDocument();
  });

  it('renders current page info for last page with partial results', () => {
    render(
      <Pagination
        {...defaultProps}
        pageIndex={9}
        rowCount={95}
      />
    );
    expect(screen.getByText(/showing 91-95 of 95 rows/i)).toBeInTheDocument();
  });

  it('renders previous button disabled on first page', () => {
    render(<Pagination {...defaultProps} pageIndex={0} />);
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('renders previous button enabled on second page', () => {
    render(<Pagination {...defaultProps} pageIndex={1} />);
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).not.toBeDisabled();
  });

  it('renders next button disabled on last page', () => {
    render(<Pagination {...defaultProps} pageIndex={9} />);
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('renders next button enabled on first page', () => {
    render(<Pagination {...defaultProps} pageIndex={0} />);
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).not.toBeDisabled();
  });

  it('calls onPageChange when previous clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination {...defaultProps} pageIndex={1} onPageChange={onPageChange} />
    );

    const prevButton = screen.getByRole('button', { name: /previous/i });
    await user.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(0);
  });

  it('calls onPageChange when next clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination {...defaultProps} pageIndex={0} onPageChange={onPageChange} />
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('renders all page numbers for small page counts', () => {
    render(
      <Pagination
        {...defaultProps}
        pageCount={5}
        rowCount={50}
      />
    );

    // Should show all pages: 1, 2, 3, 4, 5
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
  });

  it('renders page numbers with ellipsis for large page counts at start', () => {
    render(
      <Pagination
        {...defaultProps}
        pageIndex={0}
        pageCount={10}
      />
    );

    // Should show: 1, 2, 3, ..., 10
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
  });

  it('renders page numbers with ellipsis for large page counts in middle', () => {
    render(
      <Pagination
        {...defaultProps}
        pageIndex={4}
        pageCount={10}
      />
    );

    // Should show: 1, ..., 4, 5, 6, ..., 10
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();

    const ellipses = screen.getAllByText('...');
    expect(ellipses).toHaveLength(2);
  });

  it('renders page numbers with ellipsis for large page counts at end', () => {
    render(
      <Pagination
        {...defaultProps}
        pageIndex={9}
        pageCount={10}
      />
    );

    // Should show: 1, ..., 8, 9, 10
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '8' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '9' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
  });

  it('calls onPageChange when page number clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination
        {...defaultProps}
        pageIndex={0}
        pageCount={5}
        onPageChange={onPageChange}
      />
    );

    const page3Button = screen.getByRole('button', { name: '3' });
    await user.click(page3Button);

    expect(onPageChange).toHaveBeenCalledWith(2); // 0-indexed
  });

  it('highlights current page', () => {
    render(
      <Pagination
        {...defaultProps}
        pageIndex={2}
        pageCount={5}
      />
    );

    const currentPageButton = screen.getByRole('button', { name: '3' });
    expect(currentPageButton).toHaveAttribute('aria-current', 'page');
  });

  it('renders page size selector by default', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByRole('combobox', { name: /rows per page/i })).toBeInTheDocument();
  });

  it('renders page size selector with custom options', () => {
    render(
      <Pagination
        {...defaultProps}
        pageSizeOptions={[5, 10, 25]}
      />
    );

    const select = screen.getByRole('combobox', { name: /rows per page/i });
    expect(select).toBeInTheDocument();

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveValue('5');
    expect(options[1]).toHaveValue('10');
    expect(options[2]).toHaveValue('25');
  });

  it('hides page size selector when showPageSizeSelector is false', () => {
    render(
      <Pagination
        {...defaultProps}
        showPageSizeSelector={false}
      />
    );

    expect(screen.queryByRole('combobox', { name: /rows per page/i })).not.toBeInTheDocument();
  });

  it('calls onPageSizeChange when page size changed', async () => {
    const user = userEvent.setup();
    const onPageSizeChange = vi.fn();
    render(
      <Pagination
        {...defaultProps}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={[10, 20, 50]}
      />
    );

    const select = screen.getByRole('combobox', { name: /rows per page/i });
    await user.selectOptions(select, '20');

    expect(onPageSizeChange).toHaveBeenCalledWith(20);
  });

  it('supports keyboard navigation with Enter on page numbers', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination
        {...defaultProps}
        pageIndex={0}
        pageCount={5}
        onPageChange={onPageChange}
      />
    );

    const page3Button = screen.getByRole('button', { name: '3' });
    page3Button.focus();
    await user.keyboard('{Enter}');

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('supports keyboard navigation with Space on navigation buttons', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination
        {...defaultProps}
        pageIndex={1}
        onPageChange={onPageChange}
      />
    );

    const prevButton = screen.getByRole('button', { name: /previous/i });
    prevButton.focus();
    await user.keyboard(' ');

    expect(onPageChange).toHaveBeenCalledWith(0);
  });

  it('applies custom className', () => {
    const { container } = render(
      <Pagination
        {...defaultProps}
        className="custom-pagination"
      />
    );

    expect(container.firstChild).toHaveClass('custom-pagination');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Pagination {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

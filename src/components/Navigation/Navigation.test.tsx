import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../tests/test-utils';
import { Navigation } from './Navigation';
import { NavItem } from './Navigation.types';
import styles from './Navigation.module.css';

describe('Navigation', () => {
  const items: NavItem[] = [
    { label: 'Home', href: '/', isActive: true },
    { label: 'About', href: '/about' },
    { label: 'Contact', onClick: vi.fn() },
  ];

  it('should render navigation items', () => {
    render(<Navigation items={items} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('should have semantic nav element', () => {
    render(<Navigation items={items} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should mark active item', () => {
    render(<Navigation items={items} />);

    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveClass(styles.active);
  });

  it('should call onClick handler', () => {
    const onClick = vi.fn();
    const itemsWithHandler: NavItem[] = [
      { label: 'Click Me', onClick },
    ];

    render(<Navigation items={itemsWithHandler} />);

    fireEvent.click(screen.getByText('Click Me'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should render with icon and badge', () => {
    const itemsWithExtras: NavItem[] = [
      {
        label: 'Messages',
        href: '/messages',
        icon: <span data-testid="icon">📧</span>,
        badge: 5,
      },
    ];

    render(<Navigation items={itemsWithExtras} />);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render dropdown items', () => {
    const itemsWithDropdown: NavItem[] = [
      {
        label: 'Products',
        dropdown: [
          { label: 'Product A', href: '/products/a' },
          { label: 'Product B', href: '/products/b' },
        ],
      },
    ];

    render(<Navigation items={itemsWithDropdown} />);

    const productsButton = screen.getByText('Products');
    fireEvent.click(productsButton);

    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();
  });
});

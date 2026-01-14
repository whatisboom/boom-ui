import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import userEvent from '@testing-library/user-event';
import { Nav } from './Nav';
import { NavItem } from './NavItem';

describe('Nav', () => {
  describe('Rendering', () => {
    it('renders children', () => {
      render(
        <Nav>
          <NavItem>Home</NavItem>
          <NavItem>About</NavItem>
        </Nav>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('renders as div by default', () => {
      render(
        <Nav data-testid="nav">
          <NavItem>Home</NavItem>
        </Nav>
      );

      expect(screen.getByTestId('nav').tagName).toBe('DIV');
    });

    it('renders as specified element with "as" prop', () => {
      render(
        <Nav as="nav" data-testid="nav">
          <NavItem>Home</NavItem>
        </Nav>
      );

      expect(screen.getByTestId('nav').tagName).toBe('NAV');
    });

    it('applies custom className', () => {
      const { container } = render(
        <Nav className="custom-nav">
          <NavItem>Home</NavItem>
        </Nav>
      );

      const nav = container.firstChild as HTMLElement;
      expect(nav.className).toContain('custom-nav');
    });

    it('applies role="navigation"', () => {
      render(
        <Nav>
          <NavItem>Home</NavItem>
        </Nav>
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('Orientation', () => {
    it('renders vertically by default', () => {
      const { container } = render(
        <Nav>
          <NavItem>Home</NavItem>
        </Nav>
      );

      const nav = container.firstChild as HTMLElement;
      expect(nav.style.flexDirection).toBe('column');
    });

    it('renders horizontally when orientation="horizontal"', () => {
      const { container } = render(
        <Nav orientation="horizontal">
          <NavItem>Home</NavItem>
        </Nav>
      );

      const nav = container.firstChild as HTMLElement;
      expect(nav.style.flexDirection).toBe('row');
    });

    it('renders vertically when orientation="vertical"', () => {
      const { container } = render(
        <Nav orientation="vertical">
          <NavItem>Home</NavItem>
        </Nav>
      );

      const nav = container.firstChild as HTMLElement;
      expect(nav.style.flexDirection).toBe('column');
    });
  });

  describe('Spacing', () => {
    it('applies default spacing of 1', () => {
      const { container } = render(
        <Nav>
          <NavItem>Home</NavItem>
        </Nav>
      );

      const nav = container.firstChild as HTMLElement;
      expect(nav.style.gap).toBeTruthy();
    });

    it('applies custom spacing', () => {
      const { container } = render(
        <Nav spacing={4}>
          <NavItem>Home</NavItem>
        </Nav>
      );

      const nav = container.firstChild as HTMLElement;
      expect(nav.style.gap).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('passes axe accessibility tests', async () => {
      const { container } = render(
        <Nav>
          <NavItem>Home</NavItem>
          <NavItem>About</NavItem>
        </Nav>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe with active items', async () => {
      const { container } = render(
        <Nav>
          <NavItem isActive>Home</NavItem>
          <NavItem>About</NavItem>
        </Nav>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe('NavItem', () => {
  describe('Rendering', () => {
    it('renders children', () => {
      render(<NavItem>Home</NavItem>);
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('renders as div by default', () => {
      render(<NavItem data-testid="item">Home</NavItem>);
      expect(screen.getByTestId('item').tagName).toBe('DIV');
    });

    it('renders as specified element with "as" prop', () => {
      render(<NavItem as="button" data-testid="item">Home</NavItem>);
      expect(screen.getByTestId('item').tagName).toBe('BUTTON');
    });

    it('applies custom className', () => {
      const { container } = render(<NavItem className="custom-item">Home</NavItem>);
      const item = container.firstChild as HTMLElement;
      expect(item.className).toContain('custom-item');
    });
  });

  describe('Active State', () => {
    it('applies active class when isActive is true', () => {
      const { container } = render(<NavItem isActive>Home</NavItem>);
      const item = container.firstChild as HTMLElement;
      expect(item.className).toContain('navItemActive');
    });

    it('does not apply active class when isActive is false', () => {
      const { container } = render(<NavItem isActive={false}>Home</NavItem>);
      const item = container.firstChild as HTMLElement;
      expect(item.className).not.toContain('navItemActive');
    });

    it('applies aria-current="page" when active', () => {
      render(<NavItem isActive data-testid="item">Home</NavItem>);
      const item = screen.getByTestId('item');
      expect(item).toHaveAttribute('aria-current', 'page');
    });

    it('does not apply aria-current when not active', () => {
      render(<NavItem>Home</NavItem>);
      const item = screen.getByText('Home');
      expect(item).not.toHaveAttribute('aria-current');
    });
  });

  describe('Icon', () => {
    it('renders icon when provided', () => {
      render(
        <NavItem icon={<span data-testid="icon">🏠</span>}>Home</NavItem>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('renders without icon when not provided', () => {
      const { container } = render(<NavItem>Home</NavItem>);
      const icon = container.querySelector('.navItemIcon');
      expect(icon).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <NavItem as="button" onClick={handleClick}>
          Home
        </NavItem>
      );

      const button = screen.getByText('Home');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('supports link navigation', () => {
      render(<NavItem as="a" href="/home" data-testid="item">Home</NavItem>);
      const link = screen.getByTestId('item');
      expect(link).toHaveAttribute('href', '/home');
    });
  });

  describe('Accessibility', () => {
    it('passes axe accessibility tests', async () => {
      const { container } = render(<NavItem>Home</NavItem>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe with icon', async () => {
      const { container } = render(
        <NavItem icon={<span aria-label="Home icon">🏠</span>}>Home</NavItem>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe as button', async () => {
      const { container } = render(
        <NavItem as="button" type="button">
          Home
        </NavItem>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Combined with Nav', () => {
    it('renders multiple items in vertical nav', () => {
      render(
        <Nav>
          <NavItem>Home</NavItem>
          <NavItem>About</NavItem>
          <NavItem>Contact</NavItem>
        </Nav>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('renders multiple items in horizontal nav', () => {
      render(
        <Nav orientation="horizontal">
          <NavItem>Home</NavItem>
          <NavItem>About</NavItem>
        </Nav>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('highlights active item', () => {
      render(
        <Nav>
          <NavItem isActive data-testid="home">Home</NavItem>
          <NavItem>About</NavItem>
        </Nav>
      );

      const homeItem = screen.getByTestId('home');
      expect(homeItem.className).toContain('navItemActive');
    });
  });
});

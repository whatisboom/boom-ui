import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { AppShell } from './AppShell';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

describe('AppShell', () => {
  describe('Rendering Variants', () => {
    it('renders with header + sidebar + content', () => {
      render(
        <AppShell
          header={<Header logo={<span>Logo</span>}>Header content</Header>}
          sidebar={
            <Sidebar>
              <Sidebar.Header>Navigation</Sidebar.Header>
            </Sidebar>
          }
        >
          <div>Main content</div>
        </AppShell>
      );

      expect(screen.getByText('Header content')).toBeInTheDocument();
      expect(screen.getByText('Navigation')).toBeInTheDocument();
      expect(screen.getByText('Main content')).toBeInTheDocument();
    });

    it('renders with header only (no sidebar)', () => {
      render(
        <AppShell header={<Header logo={<span>Logo</span>}>Header content</Header>}>
          <div>Main content</div>
        </AppShell>
      );

      expect(screen.getByText('Header content')).toBeInTheDocument();
      expect(screen.getByText('Main content')).toBeInTheDocument();
    });

    it('renders with sidebar only (no header)', () => {
      render(
        <AppShell
          sidebar={
            <Sidebar>
              <Sidebar.Header>Navigation</Sidebar.Header>
            </Sidebar>
          }
        >
          <div>Main content</div>
        </AppShell>
      );

      expect(screen.getByText('Navigation')).toBeInTheDocument();
      expect(screen.getByText('Main content')).toBeInTheDocument();
    });

    it('renders with content only (no header or sidebar)', () => {
      render(
        <AppShell>
          <div>Main content</div>
        </AppShell>
      );

      expect(screen.getByText('Main content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <AppShell className="custom-shell">
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.className).toContain('custom-shell');
    });

    it('applies custom inline styles', () => {
      const { container } = render(
        <AppShell style={{ backgroundColor: 'red' }}>
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.backgroundColor).toBe('red');
    });
  });

  describe('Grid Layout - Template Areas', () => {
    it('uses correct grid-template-areas with header + sidebar', () => {
      const { container } = render(
        <AppShell
          header={<Header>Header</Header>}
          sidebar={<Sidebar>Sidebar</Sidebar>}
        >
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.gridTemplateAreas).toBe('"header header" "sidebar main"');
    });

    it('uses correct grid-template-areas with header only', () => {
      const { container } = render(
        <AppShell header={<Header>Header</Header>}>
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.gridTemplateAreas).toBe('"header" "main"');
    });

    it('uses correct grid-template-areas with sidebar only', () => {
      const { container } = render(
        <AppShell sidebar={<Sidebar>Sidebar</Sidebar>}>
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.gridTemplateAreas).toBe('"sidebar main"');
    });

    it('uses correct grid-template-areas with content only', () => {
      const { container } = render(
        <AppShell>
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.gridTemplateAreas).toBe('"main"');
    });
  });

  describe('Grid Layout - Template Rows', () => {
    it('uses correct grid-template-rows with header + sidebar', () => {
      const { container } = render(
        <AppShell
          header={<Header>Header</Header>}
          sidebar={<Sidebar>Sidebar</Sidebar>}
        >
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.gridTemplateRows).toBe('var(--boom-header-height, 64px) 1fr');
    });

    it('uses correct grid-template-rows with header only', () => {
      const { container } = render(
        <AppShell header={<Header>Header</Header>}>
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.gridTemplateRows).toBe('var(--boom-header-height, 64px) 1fr');
    });

    it('uses correct grid-template-rows with sidebar only', () => {
      const { container } = render(
        <AppShell sidebar={<Sidebar>Sidebar</Sidebar>}>
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.gridTemplateRows).toBe('100vh');
    });

    it('uses correct grid-template-rows with content only', () => {
      const { container } = render(
        <AppShell>
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.gridTemplateRows).toBe('100vh');
    });
  });

  describe('Grid Layout - Template Columns', () => {
    it('uses correct grid-template-columns with header + sidebar (default width)', () => {
      const { container } = render(
        <AppShell
          header={<Header>Header</Header>}
          sidebar={<Sidebar>Sidebar</Sidebar>}
        >
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.gridTemplateColumns).toBe('280px 1fr');
    });

    it('uses correct grid-template-columns with sidebar (custom width)', () => {
      const { container } = render(
        <AppShell sidebar={<Sidebar width="350px">Sidebar</Sidebar>}>
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.gridTemplateColumns).toBe('350px 1fr');
    });

    it('uses correct grid-template-columns with header only', () => {
      const { container } = render(
        <AppShell header={<Header>Header</Header>}>
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.gridTemplateColumns).toBe('1fr');
    });

    it('uses correct grid-template-columns with content only', () => {
      const { container } = render(
        <AppShell>
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.gridTemplateColumns).toBe('1fr');
    });
  });

  describe('Sidebar Position', () => {
    it('positions sidebar on left by default', () => {
      const { container } = render(
        <AppShell sidebar={<Sidebar>Sidebar</Sidebar>}>
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.gridTemplateAreas).toBe('"sidebar main"');
      expect(appShell.style.gridTemplateColumns).toBe('280px 1fr');
    });

    it('positions sidebar on right when position="right"', () => {
      const { container } = render(
        <AppShell sidebar={<Sidebar position="right">Sidebar</Sidebar>}>
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.gridTemplateAreas).toBe('"main sidebar"');
      expect(appShell.style.gridTemplateColumns).toBe('1fr 280px');
    });

    it('positions sidebar on right with header when position="right"', () => {
      const { container } = render(
        <AppShell
          header={<Header>Header</Header>}
          sidebar={<Sidebar position="right">Sidebar</Sidebar>}
        >
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.gridTemplateAreas).toBe('"header header" "main sidebar"');
      expect(appShell.style.gridTemplateColumns).toBe('1fr 280px');
    });

    it('respects custom width with right-positioned sidebar', () => {
      const { container } = render(
        <AppShell sidebar={<Sidebar position="right" width="350px">Sidebar</Sidebar>}>
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.gridTemplateColumns).toBe('1fr 350px');
    });
  });

  describe('Main Content Area', () => {
    it('wraps children in main element', () => {
      render(
        <AppShell>
          <div>Main content</div>
        </AppShell>
      );

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveTextContent('Main content');
    });

    it('applies grid-area: main to main element', () => {
      render(
        <AppShell>
          <div>Content</div>
        </AppShell>
      );

      const main = screen.getByRole('main');
      expect(main.style.gridArea).toBe('main');
    });
  });

  describe('Header Grid Area', () => {
    it('applies grid-area: header to header wrapper', () => {
      const { container } = render(
        <AppShell header={<Header>Header content</Header>}>
          <div>Content</div>
        </AppShell>
      );

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();

      // Check that the header's parent div has grid-area: header
      const headerWrapper = header?.parentElement;
      expect(headerWrapper?.style.gridArea).toBe('header');
    });
  });

  describe('Sidebar Grid Area', () => {
    it('applies grid-area: sidebar to sidebar wrapper', () => {
      const { container } = render(
        <AppShell sidebar={<Sidebar disableAnimation>Sidebar</Sidebar>}>
          <div>Content</div>
        </AppShell>
      );

      // Sidebar with disableAnimation renders nav directly (no motion.div wrapper)
      const sidebar = container.querySelector('nav');
      expect(sidebar).toBeInTheDocument();

      // Check that the sidebar's parent div has grid-area: sidebar
      const sidebarWrapper = sidebar?.parentElement;
      expect(sidebarWrapper?.style.gridArea).toBe('sidebar');
    });
  });

  describe('Container Styles', () => {
    it('applies display: grid', () => {
      const { container } = render(
        <AppShell>
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.display).toBe('grid');
    });

    it('applies height: 100vh', () => {
      const { container } = render(
        <AppShell>
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.height).toBe('100vh');
    });

    it('applies overflow: hidden', () => {
      const { container } = render(
        <AppShell>
          <div>Content</div>
        </AppShell>
      );

      const appShell = container.firstChild as HTMLElement;
      expect(appShell.style.overflow).toBe('hidden');
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations with header + sidebar + content', async () => {
      const { container } = render(
        <AppShell
          header={<Header logo={<span>Logo</span>}>Header</Header>}
          sidebar={
            <Sidebar>
              <Sidebar.Header>Nav</Sidebar.Header>
            </Sidebar>
          }
        >
          <div>Main content</div>
        </AppShell>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with header only', async () => {
      const { container } = render(
        <AppShell header={<Header>Header</Header>}>
          <div>Main content</div>
        </AppShell>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with sidebar only', async () => {
      const { container } = render(
        <AppShell
          sidebar={
            <Sidebar>
              <Sidebar.Header>Nav</Sidebar.Header>
            </Sidebar>
          }
        >
          <div>Main content</div>
        </AppShell>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with content only', async () => {
      const { container } = render(
        <AppShell>
          <div>Main content</div>
        </AppShell>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('main element has implicit main role', () => {
      render(
        <AppShell>
          <div>Content</div>
        </AppShell>
      );

      const main = screen.getByRole('main');
      expect(main.tagName).toBe('MAIN');
    });
  });

  describe('Integration', () => {
    it('integrates with actual Header component', () => {
      render(
        <AppShell
          header={
            <Header logo={<span>Logo</span>} sticky>
              <nav>Navigation links</nav>
            </Header>
          }
        >
          <div>Content</div>
        </AppShell>
      );

      expect(screen.getByText('Logo')).toBeInTheDocument();
      expect(screen.getByText('Navigation links')).toBeInTheDocument();
    });

    it('integrates with actual Sidebar component', () => {
      render(
        <AppShell
          sidebar={
            <Sidebar>
              <Sidebar.Header>App Nav</Sidebar.Header>
              <Sidebar.Nav>
                <Sidebar.Item label="Dashboard" />
                <Sidebar.Item label="Settings" />
              </Sidebar.Nav>
            </Sidebar>
          }
        >
          <div>Content</div>
        </AppShell>
      );

      expect(screen.getByText('App Nav')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('integrates with both Header and Sidebar components', () => {
      render(
        <AppShell
          header={<Header logo={<span>MyApp</span>}>Header</Header>}
          sidebar={
            <Sidebar>
              <Sidebar.Header>Menu</Sidebar.Header>
            </Sidebar>
          }
        >
          <h1>Page Title</h1>
          <p>Page content</p>
        </AppShell>
      );

      expect(screen.getByText('MyApp')).toBeInTheDocument();
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Menu')).toBeInTheDocument();
      expect(screen.getByText('Page Title')).toBeInTheDocument();
      expect(screen.getByText('Page content')).toBeInTheDocument();
    });
  });
});

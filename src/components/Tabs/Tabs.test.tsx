import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Tabs } from './Tabs';
import { TabList } from './TabList';
import { Tab } from './Tab';
import { TabPanel } from './TabPanel';

describe('Tabs', () => {
  const renderTabs = (value = 'tab1', onChange = vi.fn()) => {
    return render(
      <Tabs value={value} onChange={onChange}>
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
          <Tab value="tab3">Tab 3</Tab>
        </TabList>
        <TabPanel value="tab1">Content 1</TabPanel>
        <TabPanel value="tab2">Content 2</TabPanel>
        <TabPanel value="tab3">Content 3</TabPanel>
      </Tabs>
    );
  };

  // Basic Rendering
  it('should render tabs and panels', () => {
    renderTabs();

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('should show active tab panel and hide others', () => {
    renderTabs('tab2');

    expect(screen.getByText('Content 2')).toBeVisible();
    expect(screen.queryByText('Content 1')).not.toBeVisible();
    expect(screen.queryByText('Content 3')).not.toBeVisible();
  });

  // Tab switching
  it('should call onChange when tab is clicked', async () => {
    const onChange = vi.fn();
    renderTabs('tab1', onChange);

    await userEvent.click(screen.getByText('Tab 2'));

    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('should switch to clicked tab', async () => {
    const onChange = vi.fn();
    const { rerender } = renderTabs('tab1', onChange);

    await userEvent.click(screen.getByText('Tab 3'));
    expect(onChange).toHaveBeenCalledWith('tab3');

    // Simulate controlled component update
    rerender(
      <Tabs value="tab3" onChange={onChange}>
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
          <Tab value="tab3">Tab 3</Tab>
        </TabList>
        <TabPanel value="tab1">Content 1</TabPanel>
        <TabPanel value="tab2">Content 2</TabPanel>
        <TabPanel value="tab3">Content 3</TabPanel>
      </Tabs>
    );

    expect(screen.getByText('Content 3')).toBeVisible();
  });

  // Keyboard navigation
  it('should navigate to next tab with ArrowRight', async () => {
    const onChange = vi.fn();
    renderTabs('tab1', onChange);

    const tab1 = screen.getByText('Tab 1');
    tab1.focus();

    await userEvent.keyboard('{ArrowRight}');

    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('should navigate to previous tab with ArrowLeft', async () => {
    const onChange = vi.fn();
    renderTabs('tab2', onChange);

    const tab2 = screen.getByText('Tab 2');
    tab2.focus();

    await userEvent.keyboard('{ArrowLeft}');

    expect(onChange).toHaveBeenCalledWith('tab1');
  });

  it('should navigate to first tab with Home', async () => {
    const onChange = vi.fn();
    renderTabs('tab3', onChange);

    const tab3 = screen.getByText('Tab 3');
    tab3.focus();

    await userEvent.keyboard('{Home}');

    expect(onChange).toHaveBeenCalledWith('tab1');
  });

  it('should navigate to last tab with End', async () => {
    const onChange = vi.fn();
    renderTabs('tab1', onChange);

    const tab1 = screen.getByText('Tab 1');
    tab1.focus();

    await userEvent.keyboard('{End}');

    expect(onChange).toHaveBeenCalledWith('tab3');
  });

  it('should wrap around from last to first tab with ArrowRight', async () => {
    const onChange = vi.fn();
    renderTabs('tab3', onChange);

    const tab3 = screen.getByText('Tab 3');
    tab3.focus();

    await userEvent.keyboard('{ArrowRight}');

    expect(onChange).toHaveBeenCalledWith('tab1');
  });

  it('should wrap around from first to last tab with ArrowLeft', async () => {
    const onChange = vi.fn();
    renderTabs('tab1', onChange);

    const tab1 = screen.getByText('Tab 1');
    tab1.focus();

    await userEvent.keyboard('{ArrowLeft}');

    expect(onChange).toHaveBeenCalledWith('tab3');
  });

  // Disabled tabs
  it('should not activate disabled tab on click', async () => {
    const onChange = vi.fn();
    render(
      <Tabs value="tab1" onChange={onChange}>
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2" disabled>
            Tab 2
          </Tab>
          <Tab value="tab3">Tab 3</Tab>
        </TabList>
        <TabPanel value="tab1">Content 1</TabPanel>
        <TabPanel value="tab2">Content 2</TabPanel>
        <TabPanel value="tab3">Content 3</TabPanel>
      </Tabs>
    );

    await userEvent.click(screen.getByText('Tab 2'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should skip disabled tabs with keyboard navigation', async () => {
    const onChange = vi.fn();
    render(
      <Tabs value="tab1" onChange={onChange}>
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2" disabled>
            Tab 2
          </Tab>
          <Tab value="tab3">Tab 3</Tab>
        </TabList>
        <TabPanel value="tab1">Content 1</TabPanel>
        <TabPanel value="tab2">Content 2</TabPanel>
        <TabPanel value="tab3">Content 3</TabPanel>
      </Tabs>
    );

    const tab1 = screen.getByText('Tab 1');
    tab1.focus();

    await userEvent.keyboard('{ArrowRight}');

    expect(onChange).toHaveBeenCalledWith('tab3');
  });

  // Vertical orientation
  it('should navigate vertically with ArrowDown/ArrowUp in vertical mode', async () => {
    const onChange = vi.fn();
    render(
      <Tabs value="tab1" onChange={onChange} orientation="vertical">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
          <Tab value="tab3">Tab 3</Tab>
        </TabList>
        <TabPanel value="tab1">Content 1</TabPanel>
        <TabPanel value="tab2">Content 2</TabPanel>
        <TabPanel value="tab3">Content 3</TabPanel>
      </Tabs>
    );

    const tab1 = screen.getByText('Tab 1');
    tab1.focus();

    await userEvent.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenCalledWith('tab2');

    const tab2 = screen.getByText('Tab 2');
    tab2.focus();

    await userEvent.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenCalledWith('tab1');
  });

  // ARIA attributes
  it('should have correct ARIA attributes on tablist', () => {
    renderTabs();

    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('should have correct ARIA attributes on tabs', () => {
    renderTabs('tab1');

    const tab1 = screen.getByText('Tab 1');
    expect(tab1).toHaveAttribute('role', 'tab');
    expect(tab1).toHaveAttribute('aria-selected', 'true');
    expect(tab1).toHaveAttribute('tabindex', '0');

    const tab2 = screen.getByText('Tab 2');
    expect(tab2).toHaveAttribute('role', 'tab');
    expect(tab2).toHaveAttribute('aria-selected', 'false');
    expect(tab2).toHaveAttribute('tabindex', '-1');
  });

  it('should have correct ARIA attributes on panels', () => {
    renderTabs('tab1');

    const panel1 = screen.getByText('Content 1').closest('[role="tabpanel"]');
    expect(panel1).toHaveAttribute('role', 'tabpanel');
    expect(panel1).toHaveAttribute('tabindex', '0');
  });

  it('should link tabs and panels with aria-controls and aria-labelledby', () => {
    renderTabs('tab1');

    const tab1 = screen.getByText('Tab 1');
    const panel1 = screen.getByText('Content 1').closest('[role="tabpanel"]');

    const tabId = tab1.getAttribute('id');
    const panelId = panel1?.getAttribute('id');

    expect(tab1).toHaveAttribute('aria-controls', panelId);
    expect(panel1).toHaveAttribute('aria-labelledby', tabId);
  });

  // Accessibility
  it('should have no accessibility violations (horizontal)', async () => {
    const { container } = renderTabs();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (vertical)', async () => {
    const { container } = render(
      <Tabs value="tab1" onChange={vi.fn()} orientation="vertical">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
        </TabList>
        <TabPanel value="tab1">Content 1</TabPanel>
        <TabPanel value="tab2">Content 2</TabPanel>
      </Tabs>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (with disabled tab)', async () => {
    const { container } = render(
      <Tabs value="tab1" onChange={vi.fn()}>
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2" disabled>
            Tab 2
          </Tab>
        </TabList>
        <TabPanel value="tab1">Content 1</TabPanel>
        <TabPanel value="tab2">Content 2</TabPanel>
      </Tabs>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

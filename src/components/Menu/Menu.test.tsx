import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Menu } from './Menu';
import { MenuTrigger } from './MenuTrigger';
import { MenuContent } from './MenuContent';
import { MenuItem } from './MenuItem';
import { MenuSeparator } from './MenuSeparator';
import { Button } from '../Button';

describe('Menu', () => {
  it('renders menu with trigger and content', () => {
    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Menu>
    );

    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('opens menu when trigger is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Menu>
    );

    const trigger = screen.getByText('Actions');
    await user.click(trigger);

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
  });

  it('closes menu when item is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem onSelect={onSelect}>Edit</MenuItem>
        </MenuContent>
      </Menu>
    );

    await user.click(screen.getByText('Actions'));
    const editItem = screen.getByRole('menuitem', { name: 'Edit' });

    // Wait for item to be rendered and available
    await vi.waitFor(() => expect(editItem).toBeInTheDocument());
    await user.click(editItem);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes menu when Escape is pressed', async () => {
    const user = userEvent.setup();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
        </MenuContent>
      </Menu>
    );

    await user.click(screen.getByText('Actions'));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('navigates items with ArrowDown key', async () => {
    const user = userEvent.setup();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Menu>
    );

    await user.click(screen.getByText('Actions'));
    const editItem = screen.getByRole('menuitem', { name: 'Edit' });
    const copyItem = screen.getByRole('menuitem', { name: 'Copy' });

    // Wait for focus to be set
    await vi.waitFor(() => expect(editItem).toHaveFocus());

    await user.keyboard('{ArrowDown}');
    await vi.waitFor(() => expect(copyItem).toHaveFocus());
  });

  it('navigates items with ArrowUp key', async () => {
    const user = userEvent.setup();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Menu>
    );

    await user.click(screen.getByText('Actions'));
    const editItem = screen.getByRole('menuitem', { name: 'Edit' });
    const deleteItem = screen.getByRole('menuitem', { name: 'Delete' });

    // Wait for focus to be set
    await vi.waitFor(() => expect(editItem).toHaveFocus());

    await user.keyboard('{ArrowUp}');
    await vi.waitFor(() => expect(deleteItem).toHaveFocus());
  });

  it('navigates to first item with Home key', async () => {
    const user = userEvent.setup();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Menu>
    );

    await user.click(screen.getByText('Actions'));
    const editItem = screen.getByRole('menuitem', { name: 'Edit' });

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Home}');
    await vi.waitFor(() => expect(editItem).toHaveFocus());
  });

  it('navigates to last item with End key', async () => {
    const user = userEvent.setup();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Menu>
    );

    await user.click(screen.getByText('Actions'));
    const deleteItem = screen.getByRole('menuitem', { name: 'Delete' });

    await user.keyboard('{End}');
    await vi.waitFor(() => expect(deleteItem).toHaveFocus());
  });

  it('activates item with Enter key', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem onSelect={onSelect}>Edit</MenuItem>
        </MenuContent>
      </Menu>
    );

    await user.click(screen.getByText('Actions'));
    const editItem = screen.getByRole('menuitem', { name: 'Edit' });

    // Wait for focus
    await vi.waitFor(() => expect(editItem).toHaveFocus());
    await user.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('activates item with Space key', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem onSelect={onSelect}>Edit</MenuItem>
        </MenuContent>
      </Menu>
    );

    await user.click(screen.getByText('Actions'));
    const editItem = screen.getByRole('menuitem', { name: 'Edit' });

    // Wait for focus
    await vi.waitFor(() => expect(editItem).toHaveFocus());
    await user.keyboard(' ');

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('skips disabled items in keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
          <MenuItem disabled>Copy</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Menu>
    );

    await user.click(screen.getByText('Actions'));
    const editItem = screen.getByRole('menuitem', { name: 'Edit' });
    const deleteItem = screen.getByRole('menuitem', { name: 'Delete' });

    // Wait for focus
    await vi.waitFor(() => expect(editItem).toHaveFocus());

    await user.keyboard('{ArrowDown}');
    await vi.waitFor(() => expect(deleteItem).toHaveFocus());
  });

  it('does not trigger onSelect for disabled items', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem disabled onSelect={onSelect}>
            Edit
          </MenuItem>
        </MenuContent>
      </Menu>
    );

    await user.click(screen.getByText('Actions'));
    const disabledItem = screen.getByRole('menuitem', { name: 'Edit' });
    await user.click(disabledItem);

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('renders menu item with icon', async () => {
    const user = userEvent.setup();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem icon={<span data-testid="icon">📝</span>}>Edit</MenuItem>
        </MenuContent>
      </Menu>
    );

    await user.click(screen.getByText('Actions'));
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders menu item with keyboard shortcut', async () => {
    const user = userEvent.setup();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem shortcut="⌘C">Copy</MenuItem>
        </MenuContent>
      </Menu>
    );

    await user.click(screen.getByText('Actions'));
    expect(screen.getByText('⌘C')).toBeInTheDocument();
  });

  it('applies danger variant styles', async () => {
    const user = userEvent.setup();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem variant="danger">Delete</MenuItem>
        </MenuContent>
      </Menu>
    );

    await user.click(screen.getByText('Actions'));
    const dangerItem = screen.getByRole('menuitem', { name: 'Delete' });
    // CSS modules create hashed class names, so check that variant class exists
    expect(dangerItem.className).toMatch(/_danger_/);
  });

  it('renders separator', async () => {
    const user = userEvent.setup();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
          <MenuSeparator />
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Menu>
    );

    await user.click(screen.getByText('Actions'));
    const separator = screen.getByRole('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('sets trigger aria attributes correctly', () => {
    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
        </MenuContent>
      </Menu>
    );

    const trigger = screen.getByText('Actions');
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('updates aria-expanded when menu opens', async () => {
    const user = userEvent.setup();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
        </MenuContent>
      </Menu>
    );

    const trigger = screen.getByText('Actions');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('opens menu with ArrowDown on trigger', async () => {
    const user = userEvent.setup();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
        </MenuContent>
      </Menu>
    );

    const trigger = screen.getByText('Actions');
    trigger.focus();
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('opens menu with ArrowUp on trigger', async () => {
    const user = userEvent.setup();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
        </MenuContent>
      </Menu>
    );

    const trigger = screen.getByText('Actions');
    trigger.focus();
    await user.keyboard('{ArrowUp}');

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('passes accessibility tests', async () => {
    const { container } = render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem icon={<span>📝</span>}>Edit</MenuItem>
          <MenuItem shortcut="⌘C">Copy</MenuItem>
          <MenuSeparator />
          <MenuItem variant="danger">Delete</MenuItem>
        </MenuContent>
      </Menu>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes accessibility tests when open', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
          <MenuItem disabled>Copy</MenuItem>
          <MenuSeparator />
          <MenuItem variant="danger">Delete</MenuItem>
        </MenuContent>
      </Menu>
    );

    await user.click(screen.getByText('Actions'));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('applies custom className to Menu', () => {
    const { container } = render(
      <Menu className="custom-menu">
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
        </MenuContent>
      </Menu>
    );

    const menu = container.querySelector('.custom-menu');
    expect(menu).toBeInTheDocument();
  });

  it('applies custom className to MenuContent', async () => {
    const user = userEvent.setup();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent className="custom-content">
          <MenuItem>Edit</MenuItem>
        </MenuContent>
      </Menu>
    );

    await user.click(screen.getByText('Actions'));
    const menuContent = screen.getByRole('menu');
    expect(menuContent).toHaveClass('custom-content');
  });

  it('applies custom className to MenuItem', async () => {
    const user = userEvent.setup();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem className="custom-item">Edit</MenuItem>
        </MenuContent>
      </Menu>
    );

    await user.click(screen.getByText('Actions'));
    const menuItem = screen.getByRole('menuitem', { name: 'Edit' });
    expect(menuItem).toHaveClass('custom-item');
  });

  it('applies custom className to MenuSeparator', async () => {
    const user = userEvent.setup();

    render(
      <Menu>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
          <MenuSeparator className="custom-separator" />
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Menu>
    );

    await user.click(screen.getByText('Actions'));
    const separator = screen.getByRole('separator');
    expect(separator).toHaveClass('custom-separator');
  });
});

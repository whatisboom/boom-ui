import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu } from './Menu';
import { MenuTrigger } from './MenuTrigger';
import { MenuContent } from './MenuContent';
import { MenuItem } from './MenuItem';
import { MenuSeparator } from './MenuSeparator';
import { Button } from '../Button';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>Actions</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <MenuItem>Archive</MenuItem>
        <MenuSeparator />
        <MenuItem variant="danger">Delete</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>Options</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem icon={<span>📝</span>}>Edit</MenuItem>
        <MenuItem icon={<span>📋</span>}>Copy</MenuItem>
        <MenuItem icon={<span>📦</span>}>Archive</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<span>🗑️</span>} variant="danger">
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const WithShortcuts: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>Edit</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem icon={<span>↩️</span>} shortcut="⌘Z">
          Undo
        </MenuItem>
        <MenuItem icon={<span>↪️</span>} shortcut="⌘⇧Z">
          Redo
        </MenuItem>
        <MenuSeparator />
        <MenuItem icon={<span>✂️</span>} shortcut="⌘X">
          Cut
        </MenuItem>
        <MenuItem icon={<span>📋</span>} shortcut="⌘C">
          Copy
        </MenuItem>
        <MenuItem icon={<span>📄</span>} shortcut="⌘V">
          Paste
        </MenuItem>
        <MenuSeparator />
        <MenuItem icon={<span>🗑️</span>} shortcut="⌫">
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const WithDisabledItems: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>Actions</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem>New File</MenuItem>
        <MenuItem>Open</MenuItem>
        <MenuItem disabled>Save</MenuItem>
        <MenuItem>Save As...</MenuItem>
        <MenuSeparator />
        <MenuItem disabled>Print</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const DangerActions: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button variant="outline">Manage</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem icon={<span>👁️</span>}>View Details</MenuItem>
        <MenuItem icon={<span>📝</span>}>Edit</MenuItem>
        <MenuItem icon={<span>📋</span>}>Duplicate</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<span>🔒</span>} variant="danger">
          Lock
        </MenuItem>
        <MenuItem icon={<span>🗑️</span>} variant="danger">
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const Placement: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Menu>
        <MenuTrigger>
          <Button>Bottom (Default)</Button>
        </MenuTrigger>
        <MenuContent placement="bottom">
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Menu>

      <Menu>
        <MenuTrigger>
          <Button>Top</Button>
        </MenuTrigger>
        <MenuContent placement="top">
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Menu>

      <Menu>
        <MenuTrigger>
          <Button>Left</Button>
        </MenuTrigger>
        <MenuContent placement="left">
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Menu>

      <Menu>
        <MenuTrigger>
          <Button>Right</Button>
        </MenuTrigger>
        <MenuContent placement="right">
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Menu>
    </div>
  ),
};

export const ComplexMenu: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button>File</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem icon={<span>📄</span>} shortcut="⌘N">
          New File
        </MenuItem>
        <MenuItem icon={<span>📁</span>} shortcut="⌘O">
          Open File
        </MenuItem>
        <MenuItem icon={<span>💾</span>} shortcut="⌘S">
          Save
        </MenuItem>
        <MenuItem icon={<span>💾</span>} shortcut="⌘⇧S">
          Save As...
        </MenuItem>
        <MenuSeparator />
        <MenuItem icon={<span>📤</span>}>Export</MenuItem>
        <MenuItem icon={<span>📥</span>}>Import</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<span>🖨️</span>} shortcut="⌘P">
          Print
        </MenuItem>
        <MenuSeparator />
        <MenuItem icon={<span>⚙️</span>}>Settings</MenuItem>
        <MenuSeparator />
        <MenuItem icon={<span>🚪</span>} shortcut="⌘Q" variant="danger">
          Quit
        </MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const MinimalMenu: Story = {
  render: () => (
    <Menu>
      <MenuTrigger>
        <Button variant="ghost">⋮</Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem>Share</MenuItem>
        <MenuItem>Bookmark</MenuItem>
        <MenuItem>Copy Link</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const MultipleMenus: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Menu>
        <MenuTrigger>
          <Button>File</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem shortcut="⌘N">New</MenuItem>
          <MenuItem shortcut="⌘O">Open</MenuItem>
          <MenuItem shortcut="⌘S">Save</MenuItem>
        </MenuContent>
      </Menu>

      <Menu>
        <MenuTrigger>
          <Button>Edit</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem shortcut="⌘Z">Undo</MenuItem>
          <MenuItem shortcut="⌘Y">Redo</MenuItem>
          <MenuSeparator />
          <MenuItem shortcut="⌘X">Cut</MenuItem>
          <MenuItem shortcut="⌘C">Copy</MenuItem>
          <MenuItem shortcut="⌘V">Paste</MenuItem>
        </MenuContent>
      </Menu>

      <Menu>
        <MenuTrigger>
          <Button>View</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Zoom In</MenuItem>
          <MenuItem>Zoom Out</MenuItem>
          <MenuItem>Reset Zoom</MenuItem>
          <MenuSeparator />
          <MenuItem>Full Screen</MenuItem>
        </MenuContent>
      </Menu>
    </div>
  ),
};

export const KeyboardNavigationDemo: Story = {
  render: () => (
    <div>
      <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--boom-theme-text-secondary)' }}>
        Keyboard shortcuts:
        <br />
        • Arrow keys to navigate
        <br />
        • Enter or Space to select
        <br />
        • Escape to close
        <br />
        • Home/End to jump to first/last item
        <br />• Arrow Down/Up on trigger to open menu
      </p>
      <Menu>
        <MenuTrigger>
          <Button>Try Keyboard Navigation</Button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem icon={<span>1️⃣</span>}>First Item</MenuItem>
          <MenuItem icon={<span>2️⃣</span>}>Second Item</MenuItem>
          <MenuItem icon={<span>3️⃣</span>} disabled>
            Third Item (Disabled)
          </MenuItem>
          <MenuItem icon={<span>4️⃣</span>}>Fourth Item</MenuItem>
          <MenuSeparator />
          <MenuItem icon={<span>5️⃣</span>}>Fifth Item</MenuItem>
          <MenuItem icon={<span>6️⃣</span>}>Sixth Item</MenuItem>
        </MenuContent>
      </Menu>
    </div>
  ),
};

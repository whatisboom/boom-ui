import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tree } from './Tree';
import { TreeNode } from './Tree.types';

const meta: Meta<typeof Tree> = {
  title: 'Data & Content/Tree',
  component: Tree,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tree>;

const defaultData: TreeNode[] = [
  {
    id: 'components',
    label: 'Components',
    children: [
      {
        id: 'forms',
        label: 'Forms',
        children: [
          { id: 'input', label: 'Input' },
          { id: 'checkbox', label: 'Checkbox' },
          { id: 'select', label: 'Select' },
        ],
      },
      {
        id: 'navigation',
        label: 'Navigation',
        children: [
          { id: 'tabs', label: 'Tabs' },
          { id: 'tree', label: 'Tree' },
        ],
      },
    ],
  },
  {
    id: 'hooks',
    label: 'Hooks',
    children: [
      { id: 'use-click-outside', label: 'useClickOutside' },
      { id: 'use-focus-trap', label: 'useFocusTrap' },
    ],
  },
  {
    id: 'utils',
    label: 'Utils',
  },
];

export const Default: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<string[]>([]);
    const [selected, setSelected] = useState<string>();

    return (
      <div style={{ maxWidth: '400px' }}>
        <Tree
          data={defaultData}
          expanded={expanded}
          onExpandedChange={setExpanded}
          selected={selected}
          onSelectedChange={setSelected}
        />
      </div>
    );
  },
};

export const FullyExpanded: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<string[]>([
      'components',
      'forms',
      'navigation',
      'hooks',
    ]);
    const [selected, setSelected] = useState<string>('input');

    return (
      <div style={{ maxWidth: '400px' }}>
        <Tree
          data={defaultData}
          expanded={expanded}
          onExpandedChange={setExpanded}
          selected={selected}
          onSelectedChange={setSelected}
        />
      </div>
    );
  },
};

export const WithCustomIcons: Story = {
  render: () => {
    const dataWithIcons: TreeNode[] = [
      {
        id: 'src',
        label: 'src',
        icon: <span>📁</span>,
        children: [
          {
            id: 'components',
            label: 'components',
            icon: <span>📁</span>,
            children: [
              { id: 'button.tsx', label: 'Button.tsx', icon: <span>📄</span> },
              { id: 'input.tsx', label: 'Input.tsx', icon: <span>📄</span> },
            ],
          },
          {
            id: 'hooks',
            label: 'hooks',
            icon: <span>📁</span>,
            children: [
              { id: 'use-state.ts', label: 'useState.ts', icon: <span>📄</span> },
            ],
          },
        ],
      },
      {
        id: 'package.json',
        label: 'package.json',
        icon: <span>📦</span>,
      },
      {
        id: 'readme.md',
        label: 'README.md',
        icon: <span>📝</span>,
      },
    ];

    const [expanded, setExpanded] = useState<string[]>(['src']);
    const [selected, setSelected] = useState<string>();

    return (
      <div style={{ maxWidth: '400px' }}>
        <Tree
          data={dataWithIcons}
          expanded={expanded}
          onExpandedChange={setExpanded}
          selected={selected}
          onSelectedChange={setSelected}
        />
      </div>
    );
  },
};

export const WithDisabledItems: Story = {
  render: () => {
    const dataWithDisabled: TreeNode[] = [
      {
        id: 'available',
        label: 'Available Features',
        children: [
          { id: 'feature1', label: 'Basic Features' },
          { id: 'feature2', label: 'Standard Features' },
        ],
      },
      {
        id: 'premium',
        label: 'Premium Features (Upgrade Required)',
        disabled: true,
        children: [
          { id: 'premium1', label: 'Advanced Analytics', disabled: true },
          { id: 'premium2', label: 'Custom Reports', disabled: true },
        ],
      },
      {
        id: 'enterprise',
        label: 'Enterprise Features',
        disabled: true,
      },
    ];

    const [expanded, setExpanded] = useState<string[]>(['available']);
    const [selected, setSelected] = useState<string>();

    return (
      <div style={{ maxWidth: '400px' }}>
        <Tree
          data={dataWithDisabled}
          expanded={expanded}
          onExpandedChange={setExpanded}
          selected={selected}
          onSelectedChange={setSelected}
        />
      </div>
    );
  },
};

export const LargeTree: Story = {
  render: () => {
    const generateLargeData = (): TreeNode[] => {
      const result: TreeNode[] = [];
      for (let i = 1; i <= 10; i++) {
        result.push({
          id: `category-${i}`,
          label: `Category ${i}`,
          children: Array.from({ length: 10 }, (_, j) => ({
            id: `category-${i}-item-${j + 1}`,
            label: `Item ${j + 1}`,
            children:
              j < 3
                ? Array.from({ length: 5 }, (_, k) => ({
                    id: `category-${i}-item-${j + 1}-sub-${k + 1}`,
                    label: `Sub Item ${k + 1}`,
                  }))
                : undefined,
          })),
        });
      }
      return result;
    };

    const [expanded, setExpanded] = useState<string[]>([]);
    const [selected, setSelected] = useState<string>();

    return (
      <div style={{ maxWidth: '400px', maxHeight: '500px', overflow: 'auto' }}>
        <Tree
          data={generateLargeData()}
          expanded={expanded}
          onExpandedChange={setExpanded}
          selected={selected}
          onSelectedChange={setSelected}
        />
      </div>
    );
  },
};

export const KeyboardNavigation: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<string[]>(['components']);
    const [selected, setSelected] = useState<string>();

    return (
      <div>
        <div
          style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: 'var(--boom-theme-bg-elevated)',
            borderRadius: '8px',
          }}
        >
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
            Keyboard Navigation:
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
            <li>
              <strong>Arrow Down/Up:</strong> Navigate between visible items
            </li>
            <li>
              <strong>Arrow Right:</strong> Expand collapsed item
            </li>
            <li>
              <strong>Arrow Left:</strong> Collapse expanded item
            </li>
            <li>
              <strong>Enter/Space:</strong> Select focused item
            </li>
            <li>
              <strong>Home:</strong> Focus first item
            </li>
            <li>
              <strong>End:</strong> Focus last visible item
            </li>
          </ul>
        </div>
        <div style={{ maxWidth: '400px' }}>
          <Tree
            data={defaultData}
            expanded={expanded}
            onExpandedChange={setExpanded}
            selected={selected}
            onSelectedChange={setSelected}
          />
        </div>
      </div>
    );
  },
};

export const DeepNesting: Story = {
  render: () => {
    const deepData: TreeNode[] = [
      {
        id: 'level1',
        label: 'Level 1',
        children: [
          {
            id: 'level2',
            label: 'Level 2',
            children: [
              {
                id: 'level3',
                label: 'Level 3',
                children: [
                  {
                    id: 'level4',
                    label: 'Level 4',
                    children: [
                      {
                        id: 'level5',
                        label: 'Level 5',
                        children: [
                          {
                            id: 'level6',
                            label: 'Level 6',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const [expanded, setExpanded] = useState<string[]>([
      'level1',
      'level2',
      'level3',
      'level4',
      'level5',
    ]);
    const [selected, setSelected] = useState<string>();

    return (
      <div style={{ maxWidth: '400px' }}>
        <Tree
          data={deepData}
          expanded={expanded}
          onExpandedChange={setExpanded}
          selected={selected}
          onSelectedChange={setSelected}
        />
      </div>
    );
  },
};

export const ControlledExpansion: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<string[]>(['components']);
    const [selected, setSelected] = useState<string>();

    const expandAll = () => {
      const allIds = new Set<string>();
      const traverse = (nodes: TreeNode[]) => {
        nodes.forEach((node) => {
          if (node.children) {
            allIds.add(node.id);
            traverse(node.children);
          }
        });
      };
      traverse(defaultData);
      setExpanded(Array.from(allIds));
    };

    const collapseAll = () => {
      setExpanded([]);
    };

    return (
      <div>
        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
          <button
            onClick={expandAll}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid var(--boom-theme-border-default)',
              background: 'var(--boom-theme-bg-elevated)',
              color: 'var(--boom-theme-text-primary)',
              cursor: 'pointer',
            }}
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid var(--boom-theme-border-default)',
              background: 'var(--boom-theme-bg-elevated)',
              color: 'var(--boom-theme-text-primary)',
              cursor: 'pointer',
            }}
          >
            Collapse All
          </button>
        </div>
        <div style={{ maxWidth: '400px' }}>
          <Tree
            data={defaultData}
            expanded={expanded}
            onExpandedChange={setExpanded}
            selected={selected}
            onSelectedChange={setSelected}
          />
        </div>
      </div>
    );
  },
};

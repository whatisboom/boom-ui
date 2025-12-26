import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Tree } from './Tree';
import { TreeNode } from './Tree.types';

describe('Tree', () => {
  const mockData: TreeNode[] = [
    {
      id: 'item1',
      label: 'Item 1',
      children: [
        { id: 'item1-1', label: 'Item 1.1' },
        { id: 'item1-2', label: 'Item 1.2', disabled: true },
      ],
    },
    {
      id: 'item2',
      label: 'Item 2',
      children: [
        {
          id: 'item2-1',
          label: 'Item 2.1',
          children: [
            { id: 'item2-1-1', label: 'Item 2.1.1' },
          ],
        },
      ],
    },
    {
      id: 'item3',
      label: 'Item 3',
    },
  ];

  const renderTree = (
    data = mockData,
    expanded: string[] = [],
    onExpandedChange = vi.fn(),
    selected?: string,
    onSelectedChange = vi.fn()
  ) => {
    return render(
      <Tree
        data={data}
        expanded={expanded}
        onExpandedChange={onExpandedChange}
        selected={selected}
        onSelectedChange={onSelectedChange}
      />
    );
  };

  // Helper to get treeitem element by label text
  const getTreeItemByLabel = (label: string) => {
    return screen.getByText(label).closest('[role="treeitem"]') as HTMLElement;
  };

  // Basic Rendering
  it('should render tree items', () => {
    renderTree();

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('should not show children when collapsed', () => {
    renderTree();

    expect(screen.queryByText('Item 1.1')).not.toBeInTheDocument();
    expect(screen.queryByText('Item 2.1')).not.toBeInTheDocument();
  });

  it('should show children when expanded', () => {
    renderTree(mockData, ['item1']);

    expect(screen.getByText('Item 1.1')).toBeInTheDocument();
    expect(screen.getByText('Item 1.2')).toBeInTheDocument();
  });

  it('should show deeply nested children when all parents are expanded', () => {
    renderTree(mockData, ['item2', 'item2-1']);

    expect(screen.getByText('Item 2.1')).toBeInTheDocument();
    expect(screen.getByText('Item 2.1.1')).toBeInTheDocument();
  });

  it('should render with custom icons', () => {
    const dataWithIcons: TreeNode[] = [
      {
        id: 'item1',
        label: 'Item 1',
        icon: <span data-testid="custom-icon">📁</span>,
      },
    ];

    renderTree(dataWithIcons);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  // Expand/Collapse
  it('should call onExpandedChange when chevron is clicked', async () => {
    const onExpandedChange = vi.fn();
    renderTree(mockData, [], onExpandedChange);

    const chevrons = screen.getAllByLabelText('Expand');
    await userEvent.click(chevrons[0]);

    expect(onExpandedChange).toHaveBeenCalledWith(['item1']);
  });

  it('should collapse expanded item when chevron is clicked', async () => {
    const onExpandedChange = vi.fn();
    renderTree(mockData, ['item1'], onExpandedChange);

    const chevron = screen.getByLabelText('Collapse');
    await userEvent.click(chevron);

    expect(onExpandedChange).toHaveBeenCalledWith([]);
  });

  it('should maintain other expanded items when toggling', async () => {
    const onExpandedChange = vi.fn();
    renderTree(mockData, ['item1'], onExpandedChange);

    const chevrons = screen.getAllByLabelText('Expand');
    // Find the chevron for item2 (it's the second one after item1's collapse button)
    await userEvent.click(chevrons[0]);

    expect(onExpandedChange).toHaveBeenCalledWith(['item1', 'item2']);
  });

  // Selection
  it('should call onSelectedChange when item is clicked', async () => {
    const onSelectedChange = vi.fn();
    renderTree(mockData, [], vi.fn(), undefined, onSelectedChange);

    await userEvent.click(screen.getByText('Item 1'));

    expect(onSelectedChange).toHaveBeenCalledWith('item1');
  });

  it('should not call onSelectedChange when disabled item is clicked', async () => {
    const onSelectedChange = vi.fn();
    renderTree(mockData, ['item1'], vi.fn(), undefined, onSelectedChange);

    await userEvent.click(screen.getByText('Item 1.2'));

    expect(onSelectedChange).not.toHaveBeenCalled();
  });

  it('should apply selected styling to selected item', () => {
    renderTree(mockData, [], vi.fn(), 'item2');

    const item = getTreeItemByLabel('Item 2');
    expect(item).toHaveAttribute('aria-selected', 'true');
  });

  // Keyboard Navigation - Arrow Down/Up
  it('should move focus to next item with ArrowDown', async () => {
    renderTree(mockData, ['item1']);

    const item1 = getTreeItemByLabel('Item 1');
    item1.focus();

    await userEvent.keyboard('{ArrowDown}');

    expect(getTreeItemByLabel('Item 1.1')).toHaveFocus();
  });

  it('should move focus to previous item with ArrowUp', async () => {
    renderTree(mockData, ['item1']);

    const item11 = getTreeItemByLabel('Item 1.1');
    item11.focus();

    await userEvent.keyboard('{ArrowUp}');

    expect(getTreeItemByLabel('Item 1')).toHaveFocus();
  });

  it('should skip disabled items with ArrowDown', async () => {
    renderTree(mockData, ['item1']);

    const item11 = getTreeItemByLabel('Item 1.1');
    item11.focus();

    await userEvent.keyboard('{ArrowDown}');

    expect(getTreeItemByLabel('Item 2')).toHaveFocus();
  });

  it('should skip disabled items with ArrowUp', async () => {
    renderTree(mockData, ['item1']);

    const item2 = getTreeItemByLabel('Item 2');
    item2.focus();

    await userEvent.keyboard('{ArrowUp}');

    expect(getTreeItemByLabel('Item 1.1')).toHaveFocus();
  });

  // Keyboard Navigation - Home/End
  it('should move focus to first item with Home', async () => {
    renderTree(mockData, ['item1']);

    const item2 = getTreeItemByLabel('Item 2');
    item2.focus();

    await userEvent.keyboard('{Home}');

    expect(getTreeItemByLabel('Item 1')).toHaveFocus();
  });

  it('should move focus to last item with End', async () => {
    renderTree(mockData, ['item1']);

    const item1 = getTreeItemByLabel('Item 1');
    item1.focus();

    await userEvent.keyboard('{End}');

    expect(getTreeItemByLabel('Item 3')).toHaveFocus();
  });

  // Keyboard Navigation - Arrow Right/Left
  it('should expand collapsed item with ArrowRight', async () => {
    const onExpandedChange = vi.fn();
    renderTree(mockData, [], onExpandedChange);

    const item1 = getTreeItemByLabel('Item 1');
    item1.focus();

    await userEvent.keyboard('{ArrowRight}');

    expect(onExpandedChange).toHaveBeenCalledWith(['item1']);
  });

  it('should not expand item without children with ArrowRight', async () => {
    const onExpandedChange = vi.fn();
    renderTree(mockData, [], onExpandedChange);

    const item3 = getTreeItemByLabel('Item 3');
    item3.focus();

    await userEvent.keyboard('{ArrowRight}');

    expect(onExpandedChange).not.toHaveBeenCalled();
  });

  it('should collapse expanded item with ArrowLeft', async () => {
    const onExpandedChange = vi.fn();
    renderTree(mockData, ['item1'], onExpandedChange);

    const item1 = getTreeItemByLabel('Item 1');
    item1.focus();

    await userEvent.keyboard('{ArrowLeft}');

    expect(onExpandedChange).toHaveBeenCalledWith([]);
  });

  // Keyboard Navigation - Enter/Space
  it('should select item with Enter', async () => {
    const onSelectedChange = vi.fn();
    renderTree(mockData, [], vi.fn(), undefined, onSelectedChange);

    const item1 = getTreeItemByLabel('Item 1');
    item1.focus();

    await userEvent.keyboard('{Enter}');

    expect(onSelectedChange).toHaveBeenCalledWith('item1');
  });

  it('should select item with Space', async () => {
    const onSelectedChange = vi.fn();
    renderTree(mockData, [], vi.fn(), undefined, onSelectedChange);

    const item1 = getTreeItemByLabel('Item 1');
    item1.focus();

    await userEvent.keyboard(' ');

    expect(onSelectedChange).toHaveBeenCalledWith('item1');
  });

  it('should not select disabled item with Enter', async () => {
    const onSelectedChange = vi.fn();
    renderTree(mockData, ['item1'], vi.fn(), undefined, onSelectedChange);

    const item12 = getTreeItemByLabel('Item 1.2');
    item12.focus();

    await userEvent.keyboard('{Enter}');

    expect(onSelectedChange).not.toHaveBeenCalled();
  });

  // Edge Cases
  it('should render empty tree', () => {
    const { container } = renderTree([]);

    expect(container.querySelector('[role="tree"]')).toBeInTheDocument();
  });

  it('should render single item tree', () => {
    const singleItem: TreeNode[] = [{ id: 'single', label: 'Single Item' }];
    renderTree(singleItem);

    expect(screen.getByText('Single Item')).toBeInTheDocument();
  });

  it('should handle deeply nested structure', () => {
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
                      { id: 'level5', label: 'Level 5' },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    renderTree(deepData, ['level1', 'level2', 'level3', 'level4']);

    expect(screen.getByText('Level 5')).toBeInTheDocument();
  });

  // ARIA Attributes
  it('should have correct role on tree container', () => {
    renderTree();

    expect(screen.getByRole('tree')).toBeInTheDocument();
  });

  it('should have correct role on tree items', () => {
    renderTree();

    const items = screen.getAllByRole('treeitem');
    expect(items).toHaveLength(3); // Only top-level items when collapsed
  });

  it('should have correct aria-expanded attribute', () => {
    renderTree(mockData, ['item1']);

    const item1 = getTreeItemByLabel('Item 1');
    expect(item1).toHaveAttribute('aria-expanded', 'true');

    const item2 = getTreeItemByLabel('Item 2');
    expect(item2).toHaveAttribute('aria-expanded', 'false');
  });

  it('should not have aria-expanded on items without children', () => {
    renderTree();

    const item3 = getTreeItemByLabel('Item 3');
    expect(item3).not.toHaveAttribute('aria-expanded');
  });

  it('should have correct aria-level attribute', () => {
    renderTree(mockData, ['item1', 'item2', 'item2-1']);

    const item1 = getTreeItemByLabel('Item 1');
    expect(item1).toHaveAttribute('aria-level', '1');

    const item11 = getTreeItemByLabel('Item 1.1');
    expect(item11).toHaveAttribute('aria-level', '2');

    const item211 = getTreeItemByLabel('Item 2.1.1');
    expect(item211).toHaveAttribute('aria-level', '3');
  });

  it('should have correct aria-setsize and aria-posinset', () => {
    renderTree(mockData, ['item1']);

    const item1 = getTreeItemByLabel('Item 1');
    expect(item1).toHaveAttribute('aria-setsize', '3');
    expect(item1).toHaveAttribute('aria-posinset', '1');

    const item11 = getTreeItemByLabel('Item 1.1');
    expect(item11).toHaveAttribute('aria-setsize', '2');
    expect(item11).toHaveAttribute('aria-posinset', '1');

    const item12 = getTreeItemByLabel('Item 1.2');
    expect(item12).toHaveAttribute('aria-setsize', '2');
    expect(item12).toHaveAttribute('aria-posinset', '2');
  });

  it('should have correct aria-selected attribute', () => {
    renderTree(mockData, [], vi.fn(), 'item2');

    const item1 = getTreeItemByLabel('Item 1');
    expect(item1).toHaveAttribute('aria-selected', 'false');

    const item2 = getTreeItemByLabel('Item 2');
    expect(item2).toHaveAttribute('aria-selected', 'true');
  });

  it('should have correct aria-disabled attribute', () => {
    renderTree(mockData, ['item1']);

    const item12 = getTreeItemByLabel('Item 1.2');
    expect(item12).toHaveAttribute('aria-disabled', 'true');
  });

  it('should have correct tabindex (roving tabindex)', () => {
    renderTree(mockData, ['item1']);

    const item1 = getTreeItemByLabel('Item 1');
    expect(item1).toHaveAttribute('tabindex', '0');

    const item11 = getTreeItemByLabel('Item 1.1');
    expect(item11).toHaveAttribute('tabindex', '-1');

    const item2 = getTreeItemByLabel('Item 2');
    expect(item2).toHaveAttribute('tabindex', '-1');
  });

  // Accessibility
  it('should have no accessibility violations (collapsed)', async () => {
    const { container } = renderTree();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (expanded)', async () => {
    const { container } = renderTree(mockData, ['item1', 'item2']);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (with selection)', async () => {
    const { container } = renderTree(mockData, ['item1'], vi.fn(), 'item1');

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (with disabled items)', async () => {
    const { container } = renderTree(mockData, ['item1']);

    expect(await axe(container)).toHaveNoViolations();
  });
});

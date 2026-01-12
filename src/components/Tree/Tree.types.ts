import type { ReactNode, RefObject } from 'react';

/**
 * Tree node data structure
 */
export interface TreeNode {
  /**
   * Unique identifier for the node
   */
  id: string;

  /**
   * Display label for the node
   */
  label: string;

  /**
   * Child nodes (for recursive nesting)
   */
  children?: TreeNode[];

  /**
   * Whether the node is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional icon element to display before the label
   */
  icon?: ReactNode;
}

/**
 * Tree component props
 */
export interface TreeProps {
  /**
   * Tree data structure
   */
  data: TreeNode[];

  /**
   * Currently selected node ID
   */
  selected?: string;

  /**
   * Callback when a node is selected
   */
  onSelectedChange?: (id: string) => void;

  /**
   * Array of expanded node IDs (controlled)
   */
  expanded: string[];

  /**
   * Callback when expansion state changes
   */
  onExpandedChange: (expanded: string[]) => void;

  /**
   * Additional CSS class name
   */
  className?: string;
}

/**
 * Internal tree item props
 */
export interface TreeItemProps {
  /**
   * Node data
   */
  node: TreeNode;

  /**
   * Nesting depth (1-based for ARIA)
   */
  depth: number;

  /**
   * Index within siblings
   */
  index: number;

  /**
   * Total number of siblings
   */
  siblingCount: number;
}

/**
 * Tree context value
 */
export interface TreeContextValue {
  /**
   * Currently selected node ID
   */
  selectedId?: string;

  /**
   * Array of expanded node IDs
   */
  expandedIds: string[];

  /**
   * Currently focused node ID
   */
  focusedId?: string;

  /**
   * Select a node
   */
  onSelect: (id: string) => void;

  /**
   * Toggle expansion of a node
   */
  onToggleExpand: (id: string) => void;

  /**
   * Set focus to a node
   */
  onFocus: (id: string) => void;

  /**
   * Register a tree item with its ref
   */
  registerItem: (id: string, ref: RefObject<HTMLDivElement>) => void;

  /**
   * Unregister a tree item
   */
  unregisterItem: (id: string) => void;
}

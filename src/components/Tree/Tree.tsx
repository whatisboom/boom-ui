import type { RefObject, KeyboardEvent } from 'react';
import { useState, useCallback, useMemo, useRef } from 'react';
import { cn } from '@/utils/classnames';
import { TreeContext } from './TreeContext';
import { TreeItem } from './TreeItem';
import type { TreeProps, TreeNode } from './Tree.types';
import styles from './Tree.module.css';

export const Tree = ({
  data,
  selected,
  onSelectedChange,
  expanded,
  onExpandedChange,
  className,
}: TreeProps) => {
  const [focusedId, setFocusedId] = useState<string | undefined>(
    data.length > 0 ? data[0].id : undefined
  );
  const itemRefs = useRef<Map<string, RefObject<HTMLDivElement | null>>>(new Map());

  // Build a flat list of visible items for keyboard navigation
  const visibleItems = useMemo(() => {
    const items: { id: string; disabled: boolean }[] = [];

    const traverse = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        items.push({ id: node.id, disabled: node.disabled || false });
        if (node.children && expanded.includes(node.id)) {
          traverse(node.children);
        }
      });
    };

    traverse(data);
    return items;
  }, [data, expanded]);

  const registerItem = useCallback(
    (id: string, ref: RefObject<HTMLDivElement | null>) => {
      itemRefs.current.set(id, ref);
    },
    []
  );

  const unregisterItem = useCallback((id: string) => {
    itemRefs.current.delete(id);
  }, []);

  const onSelect = useCallback(
    (id: string) => {
      onSelectedChange?.(id);
    },
    [onSelectedChange]
  );

  const onToggleExpand = useCallback(
    (id: string) => {
      const newExpanded = expanded.includes(id)
        ? expanded.filter((expandedId) => expandedId !== id)
        : [...expanded, id];
      onExpandedChange(newExpanded);
    },
    [expanded, onExpandedChange]
  );

  const onFocus = useCallback((id: string) => {
    setFocusedId(id);
  }, []);

  const focusItem = useCallback((id: string) => {
    const ref = itemRefs.current.get(id);
    if (ref?.current) {
      ref.current.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!focusedId) {return;}

      const currentIndex = visibleItems.findIndex((item) => item.id === focusedId);
      if (currentIndex === -1) {return;}

      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          // Find next non-disabled item
          for (let i = currentIndex + 1; i < visibleItems.length; i++) {
            if (!visibleItems[i].disabled) {
              nextIndex = i;
              break;
            }
          }
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          // Find previous non-disabled item
          for (let i = currentIndex - 1; i >= 0; i--) {
            if (!visibleItems[i].disabled) {
              nextIndex = i;
              break;
            }
          }
          break;
        }
        case 'Home': {
          e.preventDefault();
          // Find first non-disabled item
          for (let i = 0; i < visibleItems.length; i++) {
            if (!visibleItems[i].disabled) {
              nextIndex = i;
              break;
            }
          }
          break;
        }
        case 'End': {
          e.preventDefault();
          // Find last non-disabled item
          for (let i = visibleItems.length - 1; i >= 0; i--) {
            if (!visibleItems[i].disabled) {
              nextIndex = i;
              break;
            }
          }
          break;
        }
        default:
          return;
      }

      if (nextIndex !== currentIndex) {
        const nextItem = visibleItems[nextIndex];
        setFocusedId(nextItem.id);
        focusItem(nextItem.id);
      }
    },
    [focusedId, visibleItems, focusItem]
  );

  const contextValue = useMemo(
    () => ({
      selectedId: selected,
      expandedIds: expanded,
      focusedId,
      onSelect,
      onToggleExpand,
      onFocus,
      registerItem,
      unregisterItem,
    }),
    [selected, expanded, focusedId, onSelect, onToggleExpand, onFocus, registerItem, unregisterItem]
  );

  return (
    <TreeContext.Provider value={contextValue}>
      <div
        role="tree"
        aria-label="Tree navigation"
        className={cn(styles.tree, className)}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {data.map((node, index) => (
          <TreeItem
            key={node.id}
            node={node}
            depth={1}
            index={index}
            siblingCount={data.length}
          />
        ))}
      </div>
    </TreeContext.Provider>
  );
};

Tree.displayName = 'Tree';

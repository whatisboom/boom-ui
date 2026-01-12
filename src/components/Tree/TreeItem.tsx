import type { KeyboardEvent } from 'react';
import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/classnames';
import { useTreeContext } from './TreeContext';
import type { TreeItemProps } from './Tree.types';
import styles from './Tree.module.css';

export const TreeItem = ({ node, depth, index, siblingCount }: TreeItemProps) => {
  const {
    selectedId,
    expandedIds,
    focusedId,
    onSelect,
    onToggleExpand,
    onFocus,
    registerItem,
    unregisterItem,
  } = useTreeContext();

  const itemRef = useRef<HTMLDivElement>(null);
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.includes(node.id);
  const isSelected = selectedId === node.id;
  const isFocused = focusedId === node.id;

  // Register/unregister this item
  useEffect(() => {
    registerItem(node.id, itemRef);
    return () => {
      unregisterItem(node.id);
    };
  }, [node.id, registerItem, unregisterItem]);

  // Focus this element when it becomes the focused item
  useEffect(() => {
    if (isFocused && itemRef.current) {
      itemRef.current.focus();
    }
  }, [isFocused]);

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren && !node.disabled) {
      onToggleExpand(node.id);
    }
  };

  const handleItemClick = () => {
    if (!node.disabled) {
      onSelect(node.id);
      onFocus(node.id);
      // Toggle expansion if this is a parent node
      if (hasChildren) {
        onToggleExpand(node.id);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (node.disabled) {return;}

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(node.id);
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (hasChildren && !isExpanded) {
          onToggleExpand(node.id);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (hasChildren && isExpanded) {
          onToggleExpand(node.id);
        }
        break;
    }
  };

  const handleFocus = () => {
    if (!node.disabled) {
      onFocus(node.id);
    }
  };

  return (
    <div>
      <div
        ref={itemRef}
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        aria-level={depth}
        aria-setsize={siblingCount}
        aria-posinset={index + 1}
        aria-disabled={node.disabled}
        tabIndex={isFocused ? 0 : -1}
        className={cn(
          styles.treeItem,
          isSelected && styles.selected,
          node.disabled && styles.disabled
        )}
        onClick={handleItemClick}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            className={cn(styles.chevron, isExpanded && styles.chevronExpanded)}
            onClick={handleChevronClick}
            tabIndex={-1}
            disabled={node.disabled}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6 4l4 4-4 4V4z" />
            </svg>
          </button>
        ) : (
          <span className={styles.chevronPlaceholder} />
        )}

        {node.icon && <span className={styles.icon}>{node.icon}</span>}

        <span className={styles.label}>{node.label}</span>
      </div>

      {hasChildren && (
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ overflow: 'hidden', marginLeft: 'var(--boom-spacing-4)' }}
              role="group"
            >
              {node.children!.map((child, childIndex) => (
                <TreeItem
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                  index={childIndex}
                  siblingCount={node.children!.length}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

TreeItem.displayName = 'TreeItem';

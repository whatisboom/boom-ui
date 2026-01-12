import { forwardRef } from 'react';
import { cn } from '@/utils/classnames';
import type { TableRowProps } from './Table.types';
import { Checkbox } from '../Checkbox';
import styles from './Table.module.css';

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, selected, onSelectionChange, onKeyDown, ...props }, ref) => {
    const showCheckbox = selected !== undefined;
    const isSelectable = onSelectionChange !== undefined;

    const handleCheckboxChange = (checked: boolean) => {
      onSelectionChange?.(checked);
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
      // Stop propagation to prevent triggering row click handlers
      e.stopPropagation();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
      // Call existing onKeyDown if provided
      onKeyDown?.(e);

      // Toggle selection when Space key is pressed and row is selectable
      if (e.key === ' ' && isSelectable) {
        e.preventDefault(); // Prevent page scroll
        onSelectionChange(!(selected ?? false));
      }
    };

    return (
      <tr
        ref={ref}
        className={cn(
          styles.row,
          selected && styles.rowSelected,
          onSelectionChange && styles.rowSelectable,
          className
        )}
        onKeyDown={isSelectable ? handleKeyDown : onKeyDown}
        tabIndex={isSelectable ? 0 : undefined}
        {...props}
      >
        {showCheckbox && (
          <td className={styles.selectionCheckbox} onClick={handleCheckboxClick}>
            <Checkbox
              checked={selected}
              onChange={handleCheckboxChange}
              aria-label="Select row"
            />
          </td>
        )}
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

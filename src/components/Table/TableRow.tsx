import { forwardRef } from 'react';
import { cn } from '@/utils/classnames';
import { TableRowProps } from './Table.types';
import { Checkbox } from '../Checkbox';
import styles from './Table.module.css';

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, selected, onSelectionChange, ...props }, ref) => {
    const showCheckbox = selected !== undefined;

    const handleCheckboxChange = (checked: boolean) => {
      onSelectionChange?.(checked);
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
      // Stop propagation to prevent triggering row click handlers
      e.stopPropagation();
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
        {...props}
      >
        {showCheckbox && (
          <td className={styles.selectionCheckbox} onClick={handleCheckboxClick}>
            <Checkbox
              checked={selected ?? false}
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

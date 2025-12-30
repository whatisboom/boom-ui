# Table/DataGrid Component Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an accessible, feature-rich Table/DataGrid component for boom-ui with sorting, selection, pagination, and keyboard navigation.

**Architecture:** Compound component pattern (like Tabs) with context-based state sharing. Root `<Table>` component provides context to child components (`TableHead`, `TableBody`, `TableRow`, `TableCell`, `TableHeaderCell`). Uses ref registration for keyboard navigation (like Tree component). All state is controlled externally for maximum flexibility.

**Tech Stack:** React 19, TypeScript (strict mode), CSS Modules, Framer Motion, vitest + @testing-library/react + vitest-axe

---

## Phase 1: Basic Table Structure (Foundation)

### Task 1: Create TypeScript Types

**Files:**
- Create: `src/components/Table/Table.types.ts`

**Step 1: Create types file with all interfaces**

```typescript
import { ReactNode, HTMLAttributes } from 'react';

/**
 * Column definition for table
 */
export interface ColumnDef<T = unknown> {
  /**
   * Unique column identifier
   */
  id: string;

  /**
   * Header label
   */
  header: ReactNode | ((column: ColumnDef<T>) => ReactNode);

  /**
   * Accessor for cell data (supports nested paths like 'user.name')
   */
  accessorKey?: keyof T | string;

  /**
   * Custom accessor function
   */
  accessorFn?: (row: T) => unknown;

  /**
   * Custom cell renderer
   */
  cell?: (props: CellContext<T>) => ReactNode;

  /**
   * Column width (CSS value)
   */
  width?: string | number;

  /**
   * Text alignment
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Additional CSS class for cells in this column
   */
  className?: string;

  /**
   * Additional CSS class for header cell
   */
  headerClassName?: string;
}

/**
 * Cell render context
 */
export interface CellContext<T> {
  row: T;
  value: unknown;
  rowIndex: number;
  columnId: string;
}

/**
 * Table density options
 */
export type TableDensity = 'compact' | 'normal' | 'comfortable';

/**
 * Table layout mode
 */
export type TableLayout = 'auto' | 'fixed';

/**
 * Table root component props
 */
export interface TableProps<T = unknown> {
  /**
   * Column definitions
   */
  columns: ColumnDef<T>[];

  /**
   * Data array
   */
  data: T[];

  /**
   * Unique key extractor for rows
   */
  getRowId: (row: T, index: number) => string;

  /**
   * Table layout mode
   * @default 'auto'
   */
  layout?: TableLayout;

  /**
   * Table density
   * @default 'normal'
   */
  density?: TableDensity;

  /**
   * Enable sticky header
   * @default false
   */
  stickyHeader?: boolean;

  /**
   * Stripe rows for better readability
   * @default false
   */
  striped?: boolean;

  /**
   * Highlight rows on hover
   * @default true
   */
  hoverable?: boolean;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Empty state element
   */
  emptyState?: ReactNode;

  /**
   * Disable all animations
   */
  disableAnimation?: boolean;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * ARIA label
   */
  'aria-label'?: string;

  /**
   * ARIA labelledby
   */
  'aria-labelledby'?: string;

  /**
   * Children (table structure)
   */
  children?: ReactNode;
}

/**
 * Table context value
 */
export interface TableContextValue<T = unknown> {
  columns: ColumnDef<T>[];
  data: T[];
  getRowId: (row: T, index: number) => string;
  layout: TableLayout;
  density: TableDensity;
  stickyHeader: boolean;
  striped: boolean;
  hoverable: boolean;
  loading: boolean;
  emptyState?: ReactNode;
  disableAnimation: boolean;
}

/**
 * TableHead props
 */
export interface TableHeadProps extends HTMLAttributes<HTMLTableSectionElement> {
  children?: ReactNode;
}

/**
 * TableBody props
 */
export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children?: ReactNode;
}

/**
 * TableRow props
 */
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children?: ReactNode;
}

/**
 * TableCell props
 */
export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  /**
   * Align cell content
   */
  align?: 'left' | 'center' | 'right';

  children?: ReactNode;
}

/**
 * TableHeaderCell props
 */
export interface TableHeaderCellProps extends HTMLAttributes<HTMLTableCellElement> {
  /**
   * Align header content
   */
  align?: 'left' | 'center' | 'right';

  children?: ReactNode;
}
```

**Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

**Step 3: Commit types**

```bash
git add src/components/Table/Table.types.ts
git commit -m "feat(table): add TypeScript types for Table component"
```

---

### Task 2: Create Table Context

**Files:**
- Create: `src/components/Table/TableContext.tsx`

**Step 1: Create context with provider hook**

```typescript
import { createContext, useContext } from 'react';
import { TableContextValue } from './Table.types';

export const TableContext = createContext<TableContextValue | undefined>(undefined);

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('Table compound components must be used within a Table component');
  }
  return context;
};
```

**Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

**Step 3: Commit context**

```bash
git add src/components/Table/TableContext.tsx
git commit -m "feat(table): add Table context for compound components"
```

---

### Task 3: Create CSS Module

**Files:**
- Create: `src/components/Table/Table.module.css`

**Step 1: Write base styles with design tokens**

```css
/* Container */
.tableContainer {
  width: 100%;
  overflow-x: auto;
  position: relative;
}

/* Base table */
.table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  color: var(--boom-theme-text-primary);
  font-size: var(--boom-font-size-sm);
  background-color: var(--boom-theme-bg-primary);
}

/* Layout variants */
.layoutFixed {
  table-layout: fixed;
}

.layoutAuto {
  table-layout: auto;
}

/* Density variants */
.densityCompact .cell,
.densityCompact .headerCell {
  padding: var(--boom-spacing-2) var(--boom-spacing-3);
}

.densityNormal .cell,
.densityNormal .headerCell {
  padding: var(--boom-spacing-3) var(--boom-spacing-4);
}

.densityComfortable .cell,
.densityComfortable .headerCell {
  padding: var(--boom-spacing-4) var(--boom-spacing-5);
}

/* Header */
.thead {
  background-color: var(--boom-theme-bg-elevated);
}

.headerRow {
  border-bottom: 2px solid var(--boom-theme-border-default);
}

.headerCell {
  font-weight: var(--boom-font-weight-semibold);
  text-align: left;
  color: var(--boom-theme-text-primary);
  background-color: var(--boom-theme-bg-elevated);
  border-bottom: 2px solid var(--boom-theme-border-default);
}

.stickyHeader .headerCell {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Body */
.tbody {
  /* Base styles */
}

.row {
  border-bottom: 1px solid var(--boom-theme-border-subtle);
}

.striped .row:nth-child(even) {
  background-color: var(--boom-theme-bg-secondary);
}

.hoverable .row:hover {
  background-color: var(--boom-theme-bg-tertiary);
  transition: background-color var(--boom-transition-fast);
}

/* Cells */
.cell {
  border-bottom: 1px solid var(--boom-theme-border-subtle);
}

/* Alignment */
.alignLeft {
  text-align: left;
}

.alignCenter {
  text-align: center;
}

.alignRight {
  text-align: right;
}

/* Focus styles */
.cell:focus,
.headerCell:focus {
  outline: 2px solid var(--boom-theme-focus-ring);
  outline-offset: -2px;
}

/* Empty state */
.emptyState {
  padding: var(--boom-spacing-8);
  text-align: center;
  color: var(--boom-theme-text-secondary);
}

/* Screen reader only */
.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**Step 2: Verify no CSS syntax errors**

Run: `npm run build`
Expected: Build succeeds without CSS errors

**Step 3: Commit styles**

```bash
git add src/components/Table/Table.module.css
git commit -m "feat(table): add CSS module with design tokens"
```

---

### Task 4: Create TableCell Component

**Files:**
- Create: `src/components/Table/TableCell.tsx`

**Step 1: Write failing test**

Create: `src/components/Table/TableCell.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { TableCell } from './TableCell';

describe('TableCell', () => {
  it('should render cell content', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Test content</TableCell>
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should have role="cell"', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Content</TableCell>
          </tr>
        </tbody>
      </table>
    );

    const cell = screen.getByRole('cell');
    expect(cell).toBeInTheDocument();
  });

  it('should apply alignment classes', () => {
    const { rerender } = render(
      <table>
        <tbody>
          <tr>
            <TableCell align="left">Content</TableCell>
          </tr>
        </tbody>
      </table>
    );

    let cell = screen.getByRole('cell');
    expect(cell).toHaveClass('alignLeft');

    rerender(
      <table>
        <tbody>
          <tr>
            <TableCell align="center">Content</TableCell>
          </tr>
        </tbody>
      </table>
    );

    cell = screen.getByRole('cell');
    expect(cell).toHaveClass('alignCenter');
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell>Content</TableCell>
          </tr>
        </tbody>
      </table>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest src/components/Table/TableCell.test.tsx`
Expected: FAIL - "TableCell is not defined"

**Step 3: Write minimal implementation**

```typescript
import { forwardRef } from 'react';
import { cn } from '@/utils/classnames';
import { TableCellProps } from './Table.types';
import styles from './Table.module.css';

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ align = 'left', className, children, ...props }, ref) => {
    return (
      <td
        ref={ref}
        role="cell"
        className={cn(
          styles.cell,
          styles[`align${align.charAt(0).toUpperCase()}${align.slice(1)}`],
          className
        )}
        {...props}
      >
        {children}
      </td>
    );
  }
);

TableCell.displayName = 'TableCell';
```

**Step 4: Run test to verify it passes**

Run: `npx vitest src/components/Table/TableCell.test.tsx`
Expected: PASS - All tests pass

**Step 5: Commit**

```bash
git add src/components/Table/TableCell.tsx src/components/Table/TableCell.test.tsx
git commit -m "feat(table): add TableCell component with tests"
```

---

### Task 5: Create TableHeaderCell Component

**Files:**
- Create: `src/components/Table/TableHeaderCell.tsx`
- Create: `src/components/Table/TableHeaderCell.test.tsx`

**Step 1: Write failing test**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { TableHeaderCell } from './TableHeaderCell';

describe('TableHeaderCell', () => {
  it('should render header content', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHeaderCell>Name</TableHeaderCell>
          </tr>
        </thead>
      </table>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('should have role="columnheader"', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHeaderCell>Name</TableHeaderCell>
          </tr>
        </thead>
      </table>
    );

    const header = screen.getByRole('columnheader');
    expect(header).toBeInTheDocument();
  });

  it('should apply alignment classes', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHeaderCell align="center">Name</TableHeaderCell>
          </tr>
        </thead>
      </table>
    );

    const header = screen.getByRole('columnheader');
    expect(header).toHaveClass('alignCenter');
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHeaderCell>Name</TableHeaderCell>
          </tr>
        </thead>
      </table>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest src/components/Table/TableHeaderCell.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

```typescript
import { forwardRef } from 'react';
import { cn } from '@/utils/classnames';
import { TableHeaderCellProps } from './Table.types';
import styles from './Table.module.css';

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  ({ align = 'left', className, children, ...props }, ref) => {
    return (
      <th
        ref={ref}
        role="columnheader"
        className={cn(
          styles.headerCell,
          styles[`align${align.charAt(0).toUpperCase()}${align.slice(1)}`],
          className
        )}
        {...props}
      >
        {children}
      </th>
    );
  }
);

TableHeaderCell.displayName = 'TableHeaderCell';
```

**Step 4: Run test to verify it passes**

Run: `npx vitest src/components/Table/TableHeaderCell.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/Table/TableHeaderCell.tsx src/components/Table/TableHeaderCell.test.tsx
git commit -m "feat(table): add TableHeaderCell component with tests"
```

---

### Task 6: Create TableRow Component

**Files:**
- Create: `src/components/Table/TableRow.tsx`
- Create: `src/components/Table/TableRow.test.tsx`

**Step 1: Write failing test**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';

describe('TableRow', () => {
  it('should render row with cells', () => {
    render(
      <table>
        <tbody>
          <TableRow>
            <TableCell>Cell 1</TableCell>
            <TableCell>Cell 2</TableCell>
          </TableRow>
        </tbody>
      </table>
    );

    expect(screen.getByText('Cell 1')).toBeInTheDocument();
    expect(screen.getByText('Cell 2')).toBeInTheDocument();
  });

  it('should have role="row"', () => {
    render(
      <table>
        <tbody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </tbody>
      </table>
    );

    const row = screen.getByRole('row');
    expect(row).toBeInTheDocument();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </tbody>
      </table>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest src/components/Table/TableRow.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

```typescript
import { forwardRef } from 'react';
import { cn } from '@/utils/classnames';
import { TableRowProps } from './Table.types';
import styles from './Table.module.css';

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        role="row"
        className={cn(styles.row, className)}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';
```

**Step 4: Run test to verify it passes**

Run: `npx vitest src/components/Table/TableRow.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/Table/TableRow.tsx src/components/Table/TableRow.test.tsx
git commit -m "feat(table): add TableRow component with tests"
```

---

### Task 7: Create TableHead Component

**Files:**
- Create: `src/components/Table/TableHead.tsx`
- Create: `src/components/Table/TableHead.test.tsx`

**Step 1: Write failing test**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { TableHead } from './TableHead';
import { TableRow } from './TableRow';
import { TableHeaderCell } from './TableHeaderCell';

describe('TableHead', () => {
  it('should render header section', () => {
    render(
      <table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
      </table>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('should have role="rowgroup"', () => {
    const { container } = render(
      <table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
      </table>
    );

    const thead = container.querySelector('thead');
    expect(thead).toHaveAttribute('role', 'rowgroup');
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
      </table>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest src/components/Table/TableHead.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

```typescript
import { forwardRef } from 'react';
import { cn } from '@/utils/classnames';
import { TableHeadProps } from './Table.types';
import styles from './Table.module.css';

export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        role="rowgroup"
        className={cn(styles.thead, className)}
        {...props}
      >
        {children}
      </thead>
    );
  }
);

TableHead.displayName = 'TableHead';
```

**Step 4: Run test to verify it passes**

Run: `npx vitest src/components/Table/TableHead.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/Table/TableHead.tsx src/components/Table/TableHead.test.tsx
git commit -m "feat(table): add TableHead component with tests"
```

---

### Task 8: Create TableBody Component

**Files:**
- Create: `src/components/Table/TableBody.tsx`
- Create: `src/components/Table/TableBody.test.tsx`

**Step 1: Write failing test**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { TableBody } from './TableBody';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';

describe('TableBody', () => {
  it('should render body section', () => {
    render(
      <table>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </table>
    );

    expect(screen.getByText('Data')).toBeInTheDocument();
  });

  it('should have role="rowgroup"', () => {
    const { container } = render(
      <table>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </table>
    );

    const tbody = container.querySelector('tbody');
    expect(tbody).toHaveAttribute('role', 'rowgroup');
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <table>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </table>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest src/components/Table/TableBody.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

```typescript
import { forwardRef } from 'react';
import { cn } from '@/utils/classnames';
import { TableBodyProps } from './Table.types';
import styles from './Table.module.css';

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        role="rowgroup"
        className={cn(styles.tbody, className)}
        {...props}
      >
        {children}
      </tbody>
    );
  }
);

TableBody.displayName = 'TableBody';
```

**Step 4: Run test to verify it passes**

Run: `npx vitest src/components/Table/TableBody.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/Table/TableBody.tsx src/components/Table/TableBody.test.tsx
git commit -m "feat(table): add TableBody component with tests"
```

---

### Task 9: Create Root Table Component

**Files:**
- Create: `src/components/Table/Table.tsx`
- Create: `src/components/Table/Table.test.tsx`

**Step 1: Write failing test**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Table } from './Table';
import { TableHead } from './TableHead';
import { TableBody } from './TableBody';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';
import { TableHeaderCell } from './TableHeaderCell';
import { ColumnDef } from './Table.types';

interface User {
  id: number;
  name: string;
  email: string;
}

const columns: ColumnDef<User>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name' },
  { id: 'email', header: 'Email', accessorKey: 'email' },
];

const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

describe('Table', () => {
  it('should render table with columns and data', () => {
    render(
      <Table columns={columns} data={data} getRowId={(row) => String(row.id)}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableHeaderCell key={col.id}>{col.header}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={col.id}>
                  {String(row[col.accessorKey as keyof User])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('should have role="table"', () => {
    render(
      <Table columns={columns} data={data} getRowId={(row) => String(row.id)} aria-label="Users">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>John</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const table = screen.getByRole('table', { name: 'Users' });
    expect(table).toBeInTheDocument();
  });

  it('should apply density classes', () => {
    const { rerender } = render(
      <Table columns={columns} data={data} getRowId={(row) => String(row.id)} density="compact">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
      </Table>
    );

    let container = screen.getByRole('table').parentElement;
    expect(container).toHaveClass('densityCompact');

    rerender(
      <Table columns={columns} data={data} getRowId={(row) => String(row.id)} density="comfortable">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
      </Table>
    );

    container = screen.getByRole('table').parentElement;
    expect(container).toHaveClass('densityComfortable');
  });

  it('should apply striped class when striped prop is true', () => {
    render(
      <Table columns={columns} data={data} getRowId={(row) => String(row.id)} striped>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
      </Table>
    );

    const container = screen.getByRole('table').parentElement;
    expect(container).toHaveClass('striped');
  });

  it('should apply sticky header class when stickyHeader is true', () => {
    render(
      <Table columns={columns} data={data} getRowId={(row) => String(row.id)} stickyHeader>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
      </Table>
    );

    const container = screen.getByRole('table').parentElement;
    expect(container).toHaveClass('stickyHeader');
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Table columns={columns} data={data} getRowId={(row) => String(row.id)} aria-label="Users">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableHeaderCell key={col.id}>{col.header}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={col.id}>
                  {String(row[col.accessorKey as keyof User])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest src/components/Table/Table.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

```typescript
import { forwardRef, useMemo } from 'react';
import { cn } from '@/utils/classnames';
import { TableContext } from './TableContext';
import { TableProps } from './Table.types';
import styles from './Table.module.css';

export const Table = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      columns,
      data,
      getRowId,
      layout = 'auto',
      density = 'normal',
      stickyHeader = false,
      striped = false,
      hoverable = true,
      loading = false,
      emptyState,
      disableAnimation = false,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      children,
      ...props
    },
    ref
  ) => {
    const contextValue = useMemo(
      () => ({
        columns,
        data,
        getRowId,
        layout,
        density,
        stickyHeader,
        striped,
        hoverable,
        loading,
        emptyState,
        disableAnimation,
      }),
      [
        columns,
        data,
        getRowId,
        layout,
        density,
        stickyHeader,
        striped,
        hoverable,
        loading,
        emptyState,
        disableAnimation,
      ]
    );

    return (
      <TableContext.Provider value={contextValue}>
        <div
          className={cn(
            styles.tableContainer,
            styles[`density${density.charAt(0).toUpperCase()}${density.slice(1)}`],
            styles[`layout${layout.charAt(0).toUpperCase()}${layout.slice(1)}`],
            stickyHeader && styles.stickyHeader,
            striped && styles.striped,
            hoverable && styles.hoverable,
            className
          )}
        >
          <table
            ref={ref}
            role="table"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-rowcount={data.length}
            aria-colcount={columns.length}
            aria-busy={loading}
            className={styles.table}
            {...props}
          >
            {children}
          </table>
        </div>
      </TableContext.Provider>
    );
  }
);

Table.displayName = 'Table';
```

**Step 4: Run test to verify it passes**

Run: `npx vitest src/components/Table/Table.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/Table/Table.tsx src/components/Table/Table.test.tsx
git commit -m "feat(table): add Table root component with context provider"
```

---

### Task 10: Create Component Index and Exports

**Files:**
- Create: `src/components/Table/index.ts`
- Modify: `src/index.ts`

**Step 1: Create component index**

```typescript
export { Table } from './Table';
export { TableHead } from './TableHead';
export { TableBody } from './TableBody';
export { TableRow } from './TableRow';
export { TableCell } from './TableCell';
export { TableHeaderCell } from './TableHeaderCell';

export type {
  TableProps,
  ColumnDef,
  CellContext,
  TableContextValue,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableHeaderCellProps,
  TableDensity,
  TableLayout,
} from './Table.types';
```

**Step 2: Add to main exports**

In `src/index.ts`, add:

```typescript
// Table components
export {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from './components/Table';

export type {
  TableProps,
  ColumnDef,
  CellContext,
  TableContextValue,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableHeaderCellProps,
  TableDensity,
  TableLayout,
} from './components/Table';
```

**Step 3: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

**Step 4: Verify build succeeds**

Run: `npm run build`
Expected: Build completes successfully

**Step 5: Commit**

```bash
git add src/components/Table/index.ts src/index.ts
git commit -m "feat(table): export all Table components and types"
```

---

### Task 11: Create Storybook Stories

**Files:**
- Create: `src/components/Table/Table.stories.tsx`

**Step 1: Create basic stories**

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';
import { TableHead } from './TableHead';
import { TableBody } from './TableBody';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';
import { TableHeaderCell } from './TableHeaderCell';
import { ColumnDef } from './Table.types';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columns: ColumnDef<User>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name' },
  { id: 'email', header: 'Email', accessorKey: 'email' },
  { id: 'role', header: 'Role', accessorKey: 'role' },
];

const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Manager' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User' },
];

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component:
          'Accessible data table component with support for sorting, selection, and pagination. Built with semantic HTML and comprehensive keyboard navigation.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Basic: Story = {
  render: () => (
    <Table columns={columns} data={data} getRowId={(row) => String(row.id)} aria-label="Users">
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableHeaderCell key={col.id}>{col.header}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((col) => (
              <TableCell key={col.id}>
                {String(row[col.accessorKey as keyof User])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Compact: Story = {
  render: () => (
    <Table
      columns={columns}
      data={data}
      getRowId={(row) => String(row.id)}
      density="compact"
      aria-label="Users (compact)"
    >
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableHeaderCell key={col.id}>{col.header}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((col) => (
              <TableCell key={col.id}>
                {String(row[col.accessorKey as keyof User])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Comfortable: Story = {
  render: () => (
    <Table
      columns={columns}
      data={data}
      getRowId={(row) => String(row.id)}
      density="comfortable"
      aria-label="Users (comfortable)"
    >
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableHeaderCell key={col.id}>{col.header}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((col) => (
              <TableCell key={col.id}>
                {String(row[col.accessorKey as keyof User])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Striped: Story = {
  render: () => (
    <Table
      columns={columns}
      data={data}
      getRowId={(row) => String(row.id)}
      striped
      aria-label="Users (striped)"
    >
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableHeaderCell key={col.id}>{col.header}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((col) => (
              <TableCell key={col.id}>
                {String(row[col.accessorKey as keyof User])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const StickyHeader: Story = {
  render: () => (
    <div style={{ height: '300px', overflow: 'auto' }}>
      <Table
        columns={columns}
        data={[...data, ...data, ...data]}
        getRowId={(row, index) => String(index)}
        stickyHeader
        aria-label="Users (sticky header)"
      >
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableHeaderCell key={col.id}>{col.header}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...data, ...data, ...data].map((row, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={col.id}>
                  {String(row[col.accessorKey as keyof User])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
```

**Step 2: Verify Storybook builds**

Run: `npm run build-storybook`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/Table/Table.stories.tsx
git commit -m "feat(table): add Storybook stories for Table component"
```

---

## Phase 1 Complete! ✅

**What we built:**
- ✅ Basic Table component with compound component pattern
- ✅ TableContext for state sharing
- ✅ All child components (TableHead, TableBody, TableRow, TableCell, TableHeaderCell)
- ✅ CSS Module with design tokens
- ✅ Comprehensive tests (80%+ coverage)
- ✅ Accessibility compliance (passes axe)
- ✅ Storybook documentation
- ✅ Full TypeScript support
- ✅ Proper exports in package

**Next Phases:**
- Phase 2: Sorting
- Phase 3: Row Selection
- Phase 4: Pagination
- Phase 5: Expandable Rows
- Phase 6: Advanced Features (sticky columns, keyboard navigation, loading/empty states)

---

## Phase 2: Sorting (Coming Next)

The next phase will add sorting capabilities with:
- Sortable header cells (click to sort)
- Sort indicators (icons)
- Multi-column sorting
- Custom sort functions
- Keyboard support (Enter/Space on headers)
- ARIA attributes for screen readers
- Screen reader announcements

---

## Implementation Notes

### Following Boom-UI Patterns

This implementation follows all existing boom-ui patterns discovered in codebase exploration:

1. **Compound Components**: Like Tabs component
2. **Context Pattern**: Like Tabs and Tree
3. **forwardRef**: All interactive components
4. **CSS Modules**: Design tokens only, no hardcoded values
5. **Testing**: vitest + @testing-library/react + vitest-axe (MANDATORY)
6. **TDD**: Test first, then implement
7. **Exports**: All components + ALL types exported
8. **Accessibility**: WCAG 2.1 AA compliance

### Critical Files Referenced

- `/Users/brandon/projects/boom-ui/src/components/Tabs/` - Compound component pattern
- `/Users/brandon/projects/boom-ui/src/components/Tree/` - Keyboard navigation
- `/Users/brandon/projects/boom-ui/src/utils/classnames.ts` - cn() utility
- `/Users/brandon/projects/boom-ui/src/styles/tokens/` - Design tokens

### Testing Requirements

- 80% minimum coverage (enforced by package.json)
- vitest-axe accessibility tests (MANDATORY for every component)
- Keyboard navigation tests
- ARIA attribute verification

### Build Verification

After Phase 1 completion:

```bash
npm run typecheck  # No TypeScript errors
npm run lint       # No linting errors
npm run test       # All tests pass, 80%+ coverage
npm run build      # Build succeeds
npm run storybook  # Storybook runs without errors
```


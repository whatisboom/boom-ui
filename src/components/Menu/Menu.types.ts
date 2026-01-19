import type { ReactNode } from 'react';

export interface MenuProps {
  /**
   * Menu children (Menu.Trigger and Menu.Content)
   */
  children: ReactNode;

  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface MenuTriggerProps {
  /**
   * Trigger element (usually a Button)
   */
  children: ReactNode;

  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface MenuContentProps {
  /**
   * Menu items and separators
   */
  children: ReactNode;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Placement of the menu relative to trigger
   * @default 'bottom'
   */
  placement?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * Offset from trigger in pixels
   * @default 8
   */
  offset?: number;
}

export interface MenuItemProps {
  /**
   * Item label
   */
  children: ReactNode;

  /**
   * Click handler
   */
  onSelect?: () => void;

  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Item variant
   * @default 'default'
   */
  variant?: 'default' | 'danger';

  /**
   * Icon to display before label
   */
  icon?: ReactNode;

  /**
   * Keyboard shortcut to display (visual only, does not bind)
   */
  shortcut?: string;

  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface MenuSeparatorProps {
  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface MenuContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  itemRefs: React.MutableRefObject<Map<number, HTMLButtonElement>>;
  registerItem: (index: number, ref: HTMLButtonElement) => void;
  unregisterItem: (index: number) => void;
  closeMenu: () => void;
  itemCount: number;
  setItemCount: (count: number) => void;
}

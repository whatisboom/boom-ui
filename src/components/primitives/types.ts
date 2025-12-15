export interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  lockScroll?: boolean;
}

export interface ModalProps extends OverlayProps {
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export interface DrawerProps extends OverlayProps {
  side?: 'left' | 'right';
  width?: string;
}

export interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  anchorEl: HTMLElement | null;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
}

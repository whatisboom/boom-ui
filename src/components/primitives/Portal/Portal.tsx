import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children: ReactNode;
  container?: Element;
}

export function Portal({ children, container }: PortalProps) {
  // Compute mount node directly without state - React can handle this efficiently
  const mountNode = container || (typeof document !== 'undefined' ? document.body : null);

  if (!mountNode) return null;

  return createPortal(children, mountNode);
}

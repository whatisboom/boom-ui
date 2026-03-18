import { type ReactNode, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export interface PortalProps {
  children: ReactNode;
  container?: Element;
}

export function Portal({ children, container }: PortalProps) {
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isClient) {
    return null;
  }

  const mountNode = container || document.body;
  return createPortal(children, mountNode);
}

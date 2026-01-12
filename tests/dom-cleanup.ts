// tests/dom-cleanup.ts
export function cleanupPortals(): void {
  // Find all portal containers
  const portals = document.querySelectorAll('[data-portal-root], .modal-root, .drawer-root, .popover-root, .tooltip-root');

  portals.forEach(portal => {
    portal.remove();
  });
}

export function resetDocumentBody(): void {
  // Clear inline styles that might be left by scroll lock
  document.body.style.cssText = '';
  document.documentElement.style.cssText = '';

  // Remove any remaining child nodes except scripts
  const children = Array.from(document.body.children);
  children.forEach(child => {
    if (child.tagName !== 'SCRIPT') {
      child.remove();
    }
  });
}

export function countDetachedNodes(): number {
  // Note: This is a simplified implementation
  // JSDOM doesn't provide direct access to detached nodes like Chrome DevTools
  // We return 0 for now and can enhance with gc() if needed

  // In a real implementation, you might use:
  // - global.gc() if --expose-gc flag is set
  // - Heap snapshot analysis
  // For now, we'll return 0 as a placeholder
  return 0;
}

export function cleanupFramerMotion(): void {
  // Clear any Framer Motion related state
  // This is component-specific and will be enhanced in component audit phase

  // Cancel any ongoing animations by forcing all motion elements to finish
  const motionElements = document.querySelectorAll('[data-framer-component]');
  motionElements.forEach(el => {
    // Force animation to complete
    if (el instanceof HTMLElement) {
      el.style.transition = 'none';
    }
  });
}

// tests/test-utils.tsx
import { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';

type CleanupFunction = () => void;

// Per-test cleanup registry
let cleanupCallbacks: CleanupFunction[] = [];

export function registerCleanup(fn: CleanupFunction): void {
  cleanupCallbacks.push(fn);
}

export function runRegisteredCleanup(): void {
  cleanupCallbacks.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error('Cleanup callback failed:', e);
    }
  });
  cleanupCallbacks = [];
}

// Enhanced render with automatic cleanup tracking
export function renderWithCleanup(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  // Track portal containers before render
  const portalsBefore = new Set(
    Array.from(document.querySelectorAll('[data-portal-root]')).map(el => el)
  );

  // Render component
  const result = render(ui, options);

  // Track new portals created during render
  const portalsAfter = new Set(
    Array.from(document.querySelectorAll('[data-portal-root]')).map(el => el)
  );

  const newPortals = Array.from(portalsAfter).filter(el => !portalsBefore.has(el));

  // Register portal cleanup
  if (newPortals.length > 0) {
    registerCleanup(() => {
      newPortals.forEach(portal => portal.remove());
    });
  }

  // Wrap unmount to include registered cleanup
  const originalUnmount = result.unmount;
  result.unmount = () => {
    runRegisteredCleanup();
    originalUnmount();
  };

  return result;
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Export our custom render as the default render
export { renderWithCleanup as render };

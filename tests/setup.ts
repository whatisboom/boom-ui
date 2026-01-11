import '@testing-library/jest-dom';
import { expect, afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from 'vitest-axe/matchers';
import React, { ReactNode, Fragment, createElement } from 'react';
import {
  installTimerTracking,
  clearAllTrackedTimers,
  getActiveTimerCount,
  logLeakedTimers
} from './timer-tracker';
import {
  installListenerTracking,
  removeAllTrackedListeners,
  getActiveListenerCount,
  logLeakedListeners
} from './listener-tracker';
import {
  cleanupPortals,
  resetDocumentBody,
  cleanupFramerMotion
} from './dom-cleanup';
import { logMemoryUsage, captureBaseline } from './memory-profiler';
import { runRegisteredCleanup } from './test-utils';

// Mock framer-motion to skip animations in tests
// Keep the conditional rendering logic but skip animation delays
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');

  // Component cache needs to be reset between tests to prevent stale references
  let componentCache: Map<string, React.ForwardRefExoticComponent<any>> | null = null;

  const getComponentCache = () => {
    if (!componentCache) {
      componentCache = new Map<string, React.ForwardRefExoticComponent<any>>();
    }
    return componentCache;
  };

  const motionProxy = new Proxy({}, {
    get: (_target, prop: string) => {
      const cache = getComponentCache();

      // Handle motion.create() for custom components
      if (prop === 'create') {
        return (Component: React.ComponentType<any>) => {
          const key = `create_${Component.displayName || Component.name || 'Component'}`;
          if (!cache.has(key)) {
            const MotionComponent = React.forwardRef((props: any, ref) => {
              // Filter out Framer Motion props before passing to component
              const { initial, animate, exit, transition, variants, whileHover, whileTap, whileFocus, whileInView, ...domProps } = props;
              return createElement(Component, { ...domProps, ref });
            });
            MotionComponent.displayName = `motion(${Component.displayName || Component.name})`;
            cache.set(key, MotionComponent);
          }
          return cache.get(key);
        };
      }

      // Handle motion.div, motion.button, etc.
      if (!cache.has(prop)) {
        const Component = React.forwardRef((props: any, ref) => {
          // Filter out Framer Motion props before passing to DOM element
          const { initial, animate, exit, transition, variants, whileHover, whileTap, whileFocus, whileInView, ...domProps } = props;
          return createElement(prop, { ...domProps, ref });
        });
        Component.displayName = `motion.${prop}`;
        cache.set(prop, Component);
      }
      return cache.get(prop);
    }
  });

  return {
    ...actual,
    motion: motionProxy,
    AnimatePresence: ({ children }: { children: ReactNode }) => {
      // Render children directly without animation delays
      // Return null when children is falsy to preserve conditional rendering
      return children ? createElement(Fragment, null, children) : null;
    },
    // Expose function to clear cache between tests
    __resetMotionCache__: () => {
      componentCache = null;
    },
  };
});

// Mock HTMLCanvasElement.getContext for axe-core color contrast checks
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillStyle: '',
  fillRect: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
})) as unknown as typeof HTMLCanvasElement.prototype.getContext;

// Mock window.getComputedStyle for pseudo-elements (axe-core color contrast)
const originalGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = vi.fn((element: Element, pseudoElt?: string | null) => {
  // For pseudo-elements, return empty CSSStyleDeclaration to prevent errors
  if (pseudoElt) {
    return {
      getPropertyValue: () => '',
      length: 0,
    } as CSSStyleDeclaration;
  }
  // For regular elements, use original implementation
  return originalGetComputedStyle(element);
}) as typeof window.getComputedStyle;

expect.extend(matchers);

// Install tracking
installTimerTracking();
installListenerTracking();

// Capture baseline before tests start
captureBaseline();

// Memory profiling before each test
beforeEach(() => {
  logMemoryUsage('BEFORE_TEST');
});

// Enhanced cleanup after each test
afterEach(async () => {
  const errors: Error[] = [];

  try {
    // Reset motion component cache to prevent test isolation issues
    const framerMotion = await import('framer-motion');
    if (typeof (framerMotion as any).__resetMotionCache__ === 'function') {
      (framerMotion as any).__resetMotionCache__();
    }
  } catch (e) {
    // Silently ignore - not all mocks expose this function
  }

  try {
    // Timer cleanup
    vi.clearAllTimers();
    clearAllTrackedTimers();

    if (process.env.MEMORY_PROFILE === 'true') {
      const activeTimers = getActiveTimerCount();
      if (activeTimers > 0) {
        logLeakedTimers();
      }
    }
  } catch (e) {
    errors.push(new Error(`Timer cleanup failed: ${e}`));
  }

  try {
    // Event listener cleanup
    removeAllTrackedListeners();

    if (process.env.MEMORY_PROFILE === 'true') {
      const activeListeners = getActiveListenerCount();
      if (activeListeners > 0) {
        logLeakedListeners();
      }
    }
  } catch (e) {
    errors.push(new Error(`Event listener cleanup failed: ${e}`));
  }

  try {
    // React cleanup - must happen BEFORE DOM cleanup
    // This allows React to properly unmount components before we remove their DOM nodes
    cleanup();
  } catch (e) {
    errors.push(new Error(`React cleanup failed: ${e}`));
  }

  try {
    // Portal/DOM cleanup - happens AFTER React cleanup
    // Run any registered per-test cleanup
    runRegisteredCleanup();
    cleanupPortals();
    cleanupFramerMotion();
    resetDocumentBody();
  } catch (e) {
    errors.push(new Error(`DOM cleanup failed: ${e}`));
  } finally {
    // Always restore mocks, even if cleanup failed
    vi.clearAllMocks();
    vi.restoreAllMocks();
  }

  if (errors.length > 0) {
    console.warn('Cleanup errors detected:', errors);
  }

  // Log memory usage after cleanup
  logMemoryUsage('AFTER_TEST');
});

// Mock matchMedia - disable animations in tests by returning matches: true for prefers-reduced-motion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

// Mock requestAnimationFrame for Popover positioning
global.requestAnimationFrame = (callback: FrameRequestCallback): number => {
  return setTimeout(() => callback(Date.now()), 0) as unknown as number;
};

global.cancelAnimationFrame = (id: number): void => {
  clearTimeout(id);
};

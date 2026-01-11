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

// Mock framer-motion AnimatePresence to skip exit animations in tests
// Keep the conditional rendering logic but skip animation delays
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: ReactNode }) => {
      // Render children directly without animation delays
      // Return null when children is falsy to preserve conditional rendering
      return children ? createElement(Fragment, null, children) : null;
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
afterEach(() => {
  const errors: Error[] = [];

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

import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from 'vitest-axe/matchers';

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

// Cleanup after each test
afterEach(() => {
  cleanup();
  // Clear mock call history to prevent memory accumulation
  vi.clearAllMocks();
});

// Mock matchMedia for prefers-reduced-motion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

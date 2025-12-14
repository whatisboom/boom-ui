/// <reference types="@testing-library/jest-dom" />

import type { AxeResults } from 'axe-core';

interface AxeMatchers {
  /**
   * A custom matcher that can check aXe results for violations.
   */
  toHaveNoViolations(): unknown;
}

declare global {
  namespace Vi {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface Assertion<T = any> extends AxeMatchers {}
    interface AsymmetricMatchersContaining extends AxeMatchers {}
  }
}

export {};

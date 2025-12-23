/// <reference types="@testing-library/jest-dom" />

interface AxeMatchers {
  /**
   * A custom matcher that can check aXe results for violations.
   */
  toHaveNoViolations(): unknown;
}

declare global {
  namespace Vi {
    interface Assertion extends AxeMatchers {}
    interface AsymmetricMatchersContaining extends AxeMatchers {}
  }
}

export {};

/// <reference types="@testing-library/jest-dom" />

interface AxeMatchers {
  /**
   * A custom matcher that can check aXe results for violations.
   */
  toHaveNoViolations(): unknown;
}

declare global {
  namespace Vi {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Assertion extends AxeMatchers {}
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface AsymmetricMatchersContaining extends AxeMatchers {}
  }
}

export {};

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFormStep } from './useFormStep';

describe('useFormStep', () => {
  it('should throw error when used outside FormStepper', () => {
    expect(() => {
      renderHook(() => useFormStep());
    }).toThrow('useFormStep must be used within a FormStepper');
  });
});

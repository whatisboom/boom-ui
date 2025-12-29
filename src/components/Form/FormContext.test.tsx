import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFormContext } from './FormContext';

describe('useFormContext', () => {
  it('should throw error when used outside Form', () => {
    expect(() => {
      renderHook(() => useFormContext());
    }).toThrow('Form components must be used within a Form component');
  });
});

import { describe, it, expect } from 'vitest';
import { cn } from './classnames';

describe('cn (classnames utility)', () => {
  it('should combine multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should filter out falsy values', () => {
    expect(cn('foo', false, 'bar', null, undefined, 'baz')).toBe('foo bar baz');
  });

  it('should handle empty input', () => {
    expect(cn()).toBe('');
  });

  it('should handle only falsy values', () => {
    expect(cn(false, null, undefined)).toBe('');
  });

  it('should handle conditional classes', () => {
    const isActive = Math.random() > -1; // Always true, but TypeScript doesn't know
    const isDisabled = Math.random() < -1; // Always false, but TypeScript doesn't know
    expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active');
  });
});

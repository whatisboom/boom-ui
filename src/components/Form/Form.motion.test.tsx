import { vi } from 'vitest';
import type { ReactNode } from 'react';
import React, { Fragment, createElement } from 'react';
import type * as FramerMotion from 'framer-motion';

// Mock motion components to render as plain elements
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof FramerMotion>('framer-motion');

  // Cache components to maintain referential equality across re-renders
  const componentCache = new Map<string, React.ForwardRefExoticComponent<Record<string, unknown>>>();

  const motionProxy = new Proxy({}, {
    get: (_target, prop: string) => {
      if (!componentCache.has(prop)) {
        const Component = React.forwardRef((props: Record<string, unknown>, ref) => {
          // Filter out Framer Motion props before passing to DOM element
          const motionProps = ['initial', 'animate', 'exit', 'transition', 'variants', 'whileHover', 'whileTap', 'whileFocus', 'whileInView'];
          const domProps = Object.fromEntries(
            Object.entries(props).filter(([key]) => !motionProps.includes(key))
          );
          return createElement(prop, { ...domProps, ref });
        });
        Component.displayName = `motion.${prop}`;
        componentCache.set(prop, Component);
      }
      return componentCache.get(prop);
    }
  });

  return {
    ...actual,
    motion: motionProxy,
    AnimatePresence: ({ children }: { children: ReactNode }) => {
      return children ? createElement(Fragment, null, children) : null;
    },
  };
});

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { z } from 'zod';
import { Form } from './Form';
import { Button } from '../Button';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

describe('Form - Motion Tests', () => {
  it('should call onSubmit with validated data', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(
      <Form schema={loginSchema} onSubmit={handleSubmit}>
        {(form) => (
          <>
            <form.Field name="email" label="Email" component="input" />
            <form.Field name="password" label="Password" component="input" type="password" />
            <Button type="submit">Submit</Button>
          </>
        )}
      </Form>
    );

    // Use fireEvent.change directly to bypass userEvent issues
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    await user.click(screen.getByText('Submit'));

    await waitFor(
      () => {
        expect(handleSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      },
      { timeout: 2000 }
    );
  });

  it('should reset form when resetOnSubmit is true', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup({ delay: null });

    render(
      <Form schema={loginSchema} onSubmit={handleSubmit} resetOnSubmit>
        {(form) => (
          <>
            <form.Field name="email" label="Email" component="input" />
            <form.Field name="password" label="Password" component="input" type="password" />
            <Button type="submit">Submit</Button>
          </>
        )}
      </Form>
    );

    const emailInput = screen.getByLabelText<HTMLInputElement>('Email');
    const passwordInput = screen.getByLabelText<HTMLInputElement>('Password');

    // Use fireEvent.change directly to bypass userEvent issues
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Verify values are set
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');

    // Submit the form
    await user.click(screen.getByText('Submit'));

    // Wait for submit handler to be called
    await waitFor(
      () => {
        expect(handleSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      },
      { timeout: 2000 }
    );

    // Wait for form to reset
    await waitFor(
      () => {
        expect(emailInput.value).toBe('');
        expect(passwordInput.value).toBe('');
      },
      { timeout: 2000 }
    );
  });
});

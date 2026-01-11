import { vi } from 'vitest';
import React, { Fragment, createElement, ReactNode } from 'react';

// Mock motion components to render as plain elements
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');

  const motionProxy = new Proxy({}, {
    get: (_target, prop: string) => {
      const Component = React.forwardRef((props: any, ref) => {
        return createElement(prop, { ...props, ref });
      });
      Component.displayName = `motion.${prop}`;
      return Component;
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
import { render, screen, waitFor } from '../../../tests/test-utils';
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

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
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
    const user = userEvent.setup();

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

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');

    await user.click(screen.getByText('Submit'));

    await waitFor(
      () => {
        expect(handleSubmit).toHaveBeenCalled();
      },
      { timeout: 2000 }
    );

    await waitFor(
      () => {
        expect(emailInput.value).toBe('');
        expect(passwordInput.value).toBe('');
      },
      { timeout: 2000 }
    );
  });
});

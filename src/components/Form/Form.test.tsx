import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { z } from 'zod';
import { Form } from './Form';
import { Button } from '../Button';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

describe('Form', () => {
  it('should render form element', () => {
    const handleSubmit = vi.fn();

    render(
      <Form schema={loginSchema} onSubmit={handleSubmit}>
        {(form) => (
          <>
            <form.Field name="email" label="Email" component="input" />
            <form.Field name="password" label="Password" component="input" type="password" />
          </>
        )}
      </Form>
    );

    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('should render fields from render prop', () => {
    const handleSubmit = vi.fn();

    render(
      <Form schema={loginSchema} onSubmit={handleSubmit}>
        {(form) => (
          <>
            <form.Field name="email" label="Email" component="input" />
            <form.Field name="password" label="Password" component="input" type="password" />
          </>
        )}
      </Form>
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('should validate on submit and show errors', async () => {
    const handleSubmit = vi.fn();
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

    await user.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with validated data', async () => {
    const handleSubmit = vi.fn();
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

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should reset form when resetOnSubmit is true', async () => {
    const handleSubmit = vi.fn();
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
    await user.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });
  });

  it('should support imperative control via ref', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();
    const formRef = { current: null };

    render(
      <>
        <Form ref={formRef} schema={loginSchema} onSubmit={handleSubmit}>
          {(form) => (
            <>
              <form.Field name="email" label="Email" component="input" />
              <form.Field name="password" label="Password" component="input" type="password" />
            </>
          )}
        </Form>
        <Button onClick={() => formRef.current?.reset()}>External Reset</Button>
      </>
    );

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    await user.type(emailInput, 'test@example.com');

    expect(emailInput.value).toBe('test@example.com');

    await user.click(screen.getByText('External Reset'));

    expect(emailInput.value).toBe('');
  });

  it('should support custom field rendering', () => {
    const handleSubmit = vi.fn();

    render(
      <Form schema={loginSchema} onSubmit={handleSubmit}>
        {(form) => (
          <form.Field
            name="email"
            render={({ field, error }) => (
              <div>
                <input {...field} data-testid="custom-input" />
                {error && <span>{error.message}</span>}
              </div>
            )}
          />
        )}
      </Form>
    );

    expect(screen.getByTestId('custom-input')).toBeInTheDocument();
  });

  it('should have no accessibility violations', async () => {
    const handleSubmit = vi.fn();

    const { container } = render(
      <Form schema={loginSchema} onSubmit={handleSubmit}>
        {(form) => (
          <>
            <form.Field name="email" label="Email" component="input" />
            <form.Field name="password" label="Password" component="input" type="password" />
          </>
        )}
      </Form>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

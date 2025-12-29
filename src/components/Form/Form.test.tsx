import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { z } from 'zod';
import { Form } from './Form';
import { useFormContext } from './FormContext';

const testSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

describe('Form', () => {
  it('should render form element', () => {
    const handleSubmit = vi.fn();
    render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <div>Form content</div>
      </Form>
    );

    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('should call onSubmit with validated data', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    function TestForm() {
      const { form } = useFormContext();
      return (
        <>
          <input {...form.register('email')} type="email" />
          <input {...form.register('password')} type="password" />
          <button type="submit">Submit</button>
        </>
      );
    }

    render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <TestForm />
      </Form>
    );

    await user.type(screen.getByRole('textbox'), 'test@example.com');
    const passwordInputs = screen.getAllByDisplayValue('');
    await user.type(passwordInputs[0], 'password123');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should provide form context to children', () => {
    const handleSubmit = vi.fn();

    function TestChild() {
      const { form } = useFormContext();
      return <div>Has form: {form ? 'yes' : 'no'}</div>;
    }

    render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <TestChild />
      </Form>
    );

    expect(screen.getByText('Has form: yes')).toBeInTheDocument();
  });

  it('should have no accessibility violations', async () => {
    const handleSubmit = vi.fn();
    const { container } = render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <input name="email" aria-label="Email" />
      </Form>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

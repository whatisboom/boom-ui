import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { z } from 'zod';
import { Form } from './Form';
import { Field } from './Field';

const testSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be 8+ characters'),
  bio: z.string().optional(),
  subscribe: z.boolean(),
});

describe('Field', () => {
  it('should render input field', () => {
    const handleSubmit = vi.fn();
    render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <Field name="email" label="Email" />
      </Form>
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('should render textarea when component="textarea"', () => {
    const handleSubmit = vi.fn();
    render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <Field name="bio" label="Bio" component="textarea" />
      </Form>
    );

    expect(screen.getByLabelText('Bio')).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('should render checkbox when component="checkbox"', () => {
    const handleSubmit = vi.fn();
    render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <Field name="subscribe" label="Subscribe" component="checkbox" />
      </Form>
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should display validation error from Zod', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <Form schema={testSchema} onSubmit={handleSubmit} mode="onBlur">
        <Field name="email" label="Email" type="email" />
        <button type="submit">Submit</button>
      </Form>
    );

    const input = screen.getByLabelText('Email');
    await user.type(input, 'invalid-email');
    await user.tab(); // Trigger onBlur

    expect(await screen.findByText('Invalid email')).toBeInTheDocument();
  });

  it('should have no accessibility violations', async () => {
    const handleSubmit = vi.fn();
    const { container } = render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <Field name="email" label="Email" type="email" />
      </Form>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

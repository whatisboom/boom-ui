import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { z } from 'zod';
import { Form } from './Form';
import { Field } from './Field';
import { FieldArray } from './FieldArray';

const arraySchema = z.object({
  items: z.array(z.object({
    name: z.string(),
  })),
});

describe('FieldArray', () => {
  it('should render add button', () => {
    const handleSubmit = vi.fn();

    render(
      <Form schema={arraySchema} onSubmit={handleSubmit} defaultValues={{ items: [] }}>
        <FieldArray name="items">
          {(_field, index) => (
            <Field name={`items.${index}.name`} label="Name" />
          )}
        </FieldArray>
      </Form>
    );

    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('should add new field when add button clicked', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <Form schema={arraySchema} onSubmit={handleSubmit} defaultValues={{ items: [] }}>
        <FieldArray name="items">
          {(_field, index) => (
            <Field name={`items.${index}.name`} label={`Name ${index + 1}`} />
          )}
        </FieldArray>
      </Form>
    );

    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(screen.getByLabelText('Name 1')).toBeInTheDocument();
  });

  it('should remove field when remove clicked', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <Form schema={arraySchema} onSubmit={handleSubmit} defaultValues={{ items: [{ name: 'Item 1' }] }}>
        <FieldArray name="items">
          {(_field, index, actions) => (
            <div>
              <Field name={`items.${index}.name`} label="Name" />
              <button type="button" onClick={actions.remove}>Remove</button>
            </div>
          )}
        </FieldArray>
      </Form>
    );

    await user.click(screen.getByRole('button', { name: /remove/i }));

    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
  });
});

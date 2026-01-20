import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { z } from 'zod';
import { Form } from './Form';
import { FormActions } from './FormActions';
import { FormMessage } from './FormMessage';
import { Button } from '../Button';

const meta: Meta<typeof Form> = {
  title: 'Forms/Form',
  component: Form,
  parameters: {
    docs: {
      description: {
        component:
          'Comprehensive Form component with React Hook Form integration and Zod validation. Uses render prop pattern for type-safe field access.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

// Login Form Example
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export const LoginForm: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Simple login form with email, password, and remember me checkbox. Shows validation errors from Zod schema.',
      },
    },
  },
  render: () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
      setError(null);
      setSuccess(false);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (data.email === 'test@example.com' && data.password === 'password123') {
        setSuccess(true);
      } else {
        setError('Invalid credentials');
      }
    };

    return (
      <Form schema={loginSchema} onSubmit={handleSubmit} mode="onBlur">
        {(form) => (
          <>
            {error && <FormMessage type="error">{error}</FormMessage>}
            {success && <FormMessage type="success">Login successful!</FormMessage>}

            <form.Field name="email" label="Email" component="input" type="email" placeholder="you@example.com" />
            <form.Field name="password" label="Password" component="input" type="password" />
            <form.Field name="rememberMe" label="Remember me" component="checkbox" />

            <FormActions>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </FormActions>
          </>
        )}
      </Form>
    );
  },
};

// Registration Form
const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  bio: z.string().optional(),
  newsletter: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const RegistrationForm: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Registration form with multiple fields and cross-field validation (password confirmation).',
      },
    },
  },
  render: () => {
    const handleSubmit = async (data: z.infer<typeof registrationSchema>) => {
      console.log('Registration data:', data);
      alert('Registration complete!');
    };

    return (
      <Form schema={registrationSchema} onSubmit={handleSubmit} mode="onBlur">
        {(form) => (
          <>
            <form.Field name="email" label="Email" component="input" type="email" />
            <form.Field name="password" label="Password" component="input" type="password" />
            <form.Field name="confirmPassword" label="Confirm Password" component="input" type="password" />
            <form.Field name="firstName" label="First Name" component="input" />
            <form.Field name="lastName" label="Last Name" component="input" />
            <form.Field name="bio" label="Bio" component="textarea" />
            <form.Field name="newsletter" label="Subscribe to newsletter" component="checkbox" />

            <FormActions>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => form.reset()}>
                Reset
              </Button>
            </FormActions>
          </>
        )}
      </Form>
    );
  },
};

// Contact Form with Custom Render
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const CustomFieldRendering: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates custom field rendering with the render prop for special cases.',
      },
    },
  },
  render: () => {
    const handleSubmit = (data: z.infer<typeof contactSchema>) => {
      console.log('Contact data:', data);
      alert('Message sent!');
    };

    return (
      <Form schema={contactSchema} onSubmit={handleSubmit}>
        {(form) => (
          <>
            <form.Field name="name" label="Name" component="input" />
            <form.Field name="email" label="Email" component="input" type="email" />

            {/* Custom render example with character count */}
            <form.Field
              name="message"
              render={({ field, error }) => (
                <div>
                  <label htmlFor={field.name} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Message
                  </label>
                  <textarea
                    {...field}
                    id={field.name}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '4px',
                      border: error ? '1px solid var(--boom-palette-error-500)' : '1px solid var(--boom-palette-neutral-300)',
                      fontSize: '1rem',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.875rem' }}>
                    {error && <span style={{ color: 'var(--boom-palette-error-500)' }}>{error.message}</span>}
                    <span style={{ marginLeft: 'auto', color: 'var(--boom-palette-neutral-600)' }}>
                      {field.value.length || 0} characters
                    </span>
                  </div>
                </div>
              )}
            />

            <FormActions>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Send Message
              </Button>
            </FormActions>
          </>
        )}
      </Form>
    );
  },
};

// All Field Types
const allFieldsSchema = z.object({
  textInput: z.string().min(1, 'Required'),
  emailInput: z.string().email('Invalid email'),
  numberInput: z.coerce.number().min(0, 'Must be positive'),
  textareaInput: z.string().min(1, 'Required'),
  selectInput: z.string().min(1, 'Please select an option'),
  checkboxInput: z.boolean(),
  switchInput: z.boolean(),
});

export const AllFieldTypes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all available field component types.',
      },
    },
  },
  render: () => {
    const handleSubmit = (data: z.infer<typeof allFieldsSchema>) => {
      console.log('Form data:', data);
      alert(JSON.stringify(data, null, 2));
    };

    return (
      <Form schema={allFieldsSchema} onSubmit={handleSubmit}>
        {(form) => (
          <>
            <form.Field
              name="textInput"
              label="Text Input"
              component="input"
              type="text"
              placeholder="Enter text"
            />

            <form.Field
              name="emailInput"
              label="Email Input"
              component="input"
              type="email"
              placeholder="you@example.com"
            />

            <form.Field
              name="numberInput"
              label="Number Input"
              component="input"
              type="number"
              placeholder="0"
            />

            <form.Field
              name="textareaInput"
              label="Textarea"
              component="textarea"
              placeholder="Enter multiple lines..."
            />

            <form.Field
              name="selectInput"
              label="Select"
              component="select"
              options={[
                { value: '', label: 'Select an option' },
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' },
              ]}
            />

            <form.Field
              name="checkboxInput"
              label="Checkbox"
              component="checkbox"
            />

            <form.Field
              name="switchInput"
              label="Switch"
              component="switch"
            />

            <FormActions>
              <Button type="submit">Submit</Button>
              <Button type="button" variant="secondary" onClick={() => form.reset()}>
                Reset
              </Button>
            </FormActions>
          </>
        )}
      </Form>
    );
  },
};

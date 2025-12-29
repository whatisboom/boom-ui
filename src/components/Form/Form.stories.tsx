import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { z } from 'zod';
import { Form } from './Form';
import { Field } from './Field';
import { FieldArray } from './FieldArray';
import { FormActions } from './FormActions';
import { FormMessage } from './FormMessage';
import { FormStepper } from './FormStepper';
import { FormStep } from './FormStep';
import { Button } from '../Button';

const meta: Meta<typeof Form> = {
  title: 'Forms & Validation/Form',
  component: Form,
  parameters: {
    docs: {
      description: {
        component:
          'Comprehensive Form component with React Hook Form integration, Zod validation, multi-step support, and field arrays. Perfect for authentication flows and complex forms.',
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
        {error && <FormMessage type="error">{error}</FormMessage>}
        {success && <FormMessage type="success">Login successful!</FormMessage>}

        <Field name="email" label="Email" type="email" placeholder="you@example.com" />
        <Field name="password" label="Password" type="password" />
        <Field name="rememberMe" label="Remember me" component="checkbox" />

        <FormActions>
          <Button type="submit">Sign In</Button>
        </FormActions>
      </Form>
    );
  },
};

// Registration Form (Multi-Step)
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

export const MultiStepRegistration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Multi-step registration form with progress indicator. Navigate between steps with Back/Next buttons.',
      },
    },
  },
  render: () => {
    const [step, setStep] = useState(0);

    const handleSubmit = async (data: z.infer<typeof registrationSchema>) => {
      console.log('Registration data:', data);
      alert('Registration complete!');
    };

    return (
      <Form schema={registrationSchema} onSubmit={handleSubmit} mode="onBlur">
        <FormStepper currentStep={step} onStepChange={setStep} showProgress>
          <FormStep title="Account">
            <Field name="email" label="Email" type="email" />
            <Field name="password" label="Password" type="password" />
            <Field name="confirmPassword" label="Confirm Password" type="password" />
          </FormStep>

          <FormStep title="Profile">
            <Field name="firstName" label="First Name" />
            <Field name="lastName" label="Last Name" />
            <Field name="bio" label="Bio" component="textarea" />
          </FormStep>

          <FormStep title="Preferences">
            <Field name="newsletter" label="Subscribe to newsletter" component="checkbox" />
          </FormStep>
        </FormStepper>

        <FormActions align="space-between">
          <Button onClick={() => setStep(s => s - 1)} disabled={step === 0} variant="secondary">
            Back
          </Button>
          <Button type={step === 2 ? 'submit' : 'button'} onClick={() => step < 2 && setStep(s => s + 1)}>
            {step === 2 ? 'Complete Registration' : 'Next'}
          </Button>
        </FormActions>
      </Form>
    );
  },
};

// Dynamic Fields (Field Array)
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phoneNumbers: z.array(z.object({
    number: z.string(),
    type: z.enum(['mobile', 'home', 'work']),
  })).min(1, 'At least one phone number is required'),
});

export const DynamicFields: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Form with dynamic field array. Add or remove phone numbers on the fly.',
      },
    },
  },
  render: () => {
    const handleSubmit = (data: z.infer<typeof contactSchema>) => {
      console.log('Contact data:', data);
      alert('Saved!');
    };

    return (
      <Form
        schema={contactSchema}
        onSubmit={handleSubmit}
        defaultValues={{
          name: '',
          phoneNumbers: [{ number: '', type: 'mobile' as const }]
        }}
      >
        <Field name="name" label="Name" />

        <FieldArray name="phoneNumbers" addButtonText="Add Phone Number">
          {(_field, index, actions) => (
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <Field
                name={`phoneNumbers.${index}.number`}
                label={`Phone ${index + 1}`}
                placeholder="555-1234"
              />
              <Field
                name={`phoneNumbers.${index}.type`}
                label="Type"
                component="select"
                options={[
                  { value: 'mobile', label: 'Mobile' },
                  { value: 'home', label: 'Home' },
                  { value: 'work', label: 'Work' },
                ]}
              />
              <Button
                type="button"
                onClick={actions.remove}
                variant="secondary"
                style={{ marginTop: '1.5rem' }}
              >
                Remove
              </Button>
            </div>
          )}
        </FieldArray>

        <FormActions>
          <Button type="submit">Save Contact</Button>
        </FormActions>
      </Form>
    );
  },
};

// All Field Types
const allFieldsSchema = z.object({
  textInput: z.string(),
  emailInput: z.string().email(),
  numberInput: z.coerce.number(),
  textareaInput: z.string(),
  selectInput: z.string(),
  checkboxInput: z.boolean(),
  switchInput: z.boolean(),
});

export const AllFieldTypes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates all available field component types.',
      },
    },
  },
  render: () => {
    return (
      <Form schema={allFieldsSchema} onSubmit={(data) => console.log(data)}>
        <Field name="textInput" label="Text Input" type="text" placeholder="Enter text" />
        <Field name="emailInput" label="Email Input" type="email" placeholder="you@example.com" />
        <Field name="numberInput" label="Number Input" type="number" placeholder="42" />
        <Field name="textareaInput" label="Textarea" component="textarea" placeholder="Long text..." />
        <Field
          name="selectInput"
          label="Select"
          component="select"
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ]}
        />
        <Field name="checkboxInput" label="Checkbox" component="checkbox" />
        <Field name="switchInput" label="Switch" component="switch" />

        <FormActions>
          <Button type="submit">Submit</Button>
        </FormActions>
      </Form>
    );
  },
};

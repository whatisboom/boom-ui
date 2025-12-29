import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { z } from 'zod';
import { Form } from '../components/Form/Form';
import { Field } from '../components/Form/Field';
import { FormActions } from '../components/Form/FormActions';
import { FormMessage } from '../components/Form/FormMessage';
import { FormStepper } from '../components/Form/FormStepper';
import { FormStep } from '../components/Form/FormStep';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Alert } from '../components/Alert';

const meta: Meta = {
  title: 'Examples/Authentication Flow',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Real-world authentication patterns using Form, Input, Button, Card, and Alert components.'
      }
    }
  },
};

export default meta;

type Story = StoryObj;

// Login Form
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export const LoginForm: Story = {
  render: () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
      setError(null);
      setSuccess(false);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (data.email === 'demo@example.com' && data.password === 'password123') {
        setSuccess(true);
      } else {
        setError('Invalid email or password');
      }
    };

    return (
      <Card style={{ width: '400px', padding: '2rem' }}>
        <h2 style={{ marginTop: 0 }}>Sign In</h2>

        <Form schema={loginSchema} onSubmit={handleSubmit} mode="onBlur">
          {error && <FormMessage type="error">{error}</FormMessage>}
          {success && <FormMessage type="success">Login successful!</FormMessage>}

          <Field name="email" label="Email" type="email" placeholder="demo@example.com" />
          <Field name="password" label="Password" type="password" />
          <Field name="rememberMe" label="Remember me" component="checkbox" />

          <FormActions>
            <Button type="submit" style={{ width: '100%' }}>Sign In</Button>
          </FormActions>
        </Form>

        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--boom-theme-text-secondary)' }}>
          Demo credentials: demo@example.com / password123
        </p>
      </Card>
    );
  },
};

// Multi-Step Signup
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const SignupFlow: Story = {
  render: () => {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const handleSubmit = async (data: z.infer<typeof signupSchema>) => {
      console.log('Signup data:', data);
      setCompleted(true);
    };

    if (completed) {
      return (
        <Card style={{ width: '500px', padding: '2rem', textAlign: 'center' }}>
          <Alert variant="success" style={{ marginBottom: '1rem' }}>
            Account created successfully!
          </Alert>
          <p>Check your email to verify your account.</p>
          <Button onClick={() => { setCompleted(false); setStep(0); }} style={{ marginTop: '1rem' }}>
            Sign Up Another Account
          </Button>
        </Card>
      );
    }

    return (
      <Card style={{ width: '500px', padding: '2rem' }}>
        <h2 style={{ marginTop: 0 }}>Create Account</h2>

        <Form schema={signupSchema} onSubmit={handleSubmit} mode="onBlur">
          <FormStepper currentStep={step} onStepChange={setStep} showProgress>
            <FormStep title="Account">
              <Field name="email" label="Email" type="email" />
              <Field name="password" label="Password" type="password" />
              <Field name="confirmPassword" label="Confirm Password" type="password" />
            </FormStep>

            <FormStep title="Profile">
              <Field name="firstName" label="First Name" />
              <Field name="lastName" label="Last Name" />
            </FormStep>

            <FormStep title="Terms">
              <Field name="agreeToTerms" label="I agree to the Terms of Service and Privacy Policy" component="checkbox" />
            </FormStep>
          </FormStepper>

          <FormActions align="space-between">
            <Button onClick={() => setStep(s => s - 1)} disabled={step === 0} variant="secondary">
              Back
            </Button>
            <Button type={step === 2 ? 'submit' : 'button'} onClick={() => step < 2 && setStep(s => s + 1)}>
              {step === 2 ? 'Create Account' : 'Next'}
            </Button>
          </FormActions>
        </Form>
      </Card>
    );
  },
};

// Password Reset
const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const PasswordReset: Story = {
  render: () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (data: z.infer<typeof resetSchema>) => {
      console.log('Password reset for:', data.email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
    };

    if (submitted) {
      return (
        <Card style={{ width: '400px', padding: '2rem', textAlign: 'center' }}>
          <Alert variant="success" style={{ marginBottom: '1rem' }}>
            Reset link sent!
          </Alert>
          <p>Check your email for instructions to reset your password.</p>
          <Button onClick={() => setSubmitted(false)} variant="outline" style={{ marginTop: '1rem' }}>
            Send Another
          </Button>
        </Card>
      );
    }

    return (
      <Card style={{ width: '400px', padding: '2rem' }}>
        <h2 style={{ marginTop: 0 }}>Reset Password</h2>
        <p style={{ color: 'var(--boom-theme-text-secondary)' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <Form schema={resetSchema} onSubmit={handleSubmit} mode="onBlur">
          <Field name="email" label="Email" type="email" placeholder="you@example.com" />

          <FormActions>
            <Button type="submit" style={{ width: '100%' }}>Send Reset Link</Button>
          </FormActions>
        </Form>
      </Card>
    );
  },
};

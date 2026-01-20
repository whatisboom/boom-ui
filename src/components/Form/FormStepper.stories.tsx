import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { z } from 'zod';
import { Form } from './Form';
import { FormStepper } from './FormStepper';
import { FormStep } from './FormStep';
import { FormActions } from './FormActions';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { useFormStep } from './hooks/useFormStep';

const meta: Meta<typeof FormStepper> = {
  title: 'Forms/FormStepper',
  component: FormStepper,
  parameters: {
    docs: {
      description: {
        component:
          'Multi-step form container with progress tracking, step navigation controls, and context-based state management for building wizard-style forms.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormStepper>;

// Registration wizard example
const registrationSchema = z.object({
  // Step 1: Personal Info
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),

  // Step 2: Contact Details
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),

  // Step 3: Address
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 digits'),
});

// Navigation component using useFormStep hook
function StepperNavigation() {
  const { isFirstStep, isLastStep, prevStep, nextStep } = useFormStep();

  return (
    <FormActions align="space-between">
      <Button
        type="button"
        variant="outline"
        onClick={prevStep}
        disabled={isFirstStep}
      >
        Previous
      </Button>
      <Button type="button" onClick={nextStep} disabled={isLastStep}>
        {isLastStep ? 'Review' : 'Next'}
      </Button>
    </FormActions>
  );
}

export const RegistrationWizard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Complete registration wizard with three steps: personal info, contact details, and address. Uses useFormStep hook for navigation controls.',
      },
    },
  },
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [submittedData, setSubmittedData] = useState<z.infer<
      typeof registrationSchema
    > | null>(null);

    const handleSubmit = async (data: z.infer<typeof registrationSchema>) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmittedData(data);
    };

    if (submittedData) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Registration Complete!</h2>
          <p>
            Welcome, {submittedData.firstName} {submittedData.lastName}!
          </p>
          <Button onClick={() => setSubmittedData(null)}>Start Over</Button>
        </div>
      );
    }

    return (
      <Form schema={registrationSchema} onSubmit={handleSubmit} mode="onBlur">
        {(form) => (
          <FormStepper currentStep={currentStep} onStepChange={setCurrentStep}>
            <FormStep
              title="Personal Info"
              description="Tell us about yourself"
            >
              <Stack spacing={4}>
                <form.Field
                  name="firstName"
                  label="First Name"
                  component="input"
                  placeholder="John"
                />
                <form.Field
                  name="lastName"
                  label="Last Name"
                  component="input"
                  placeholder="Doe"
                />
                <form.Field
                  name="dateOfBirth"
                  label="Date of Birth"
                  component="input"
                  placeholder="YYYY-MM-DD"
                />
                <StepperNavigation />
              </Stack>
            </FormStep>

            <FormStep
              title="Contact Details"
              description="How can we reach you?"
            >
              <Stack spacing={4}>
                <form.Field
                  name="email"
                  label="Email Address"
                  component="input"
                  type="email"
                  placeholder="john@example.com"
                />
                <form.Field
                  name="phone"
                  label="Phone Number"
                  component="input"
                  type="tel"
                  placeholder="(555) 123-4567"
                />
                <StepperNavigation />
              </Stack>
            </FormStep>

            <FormStep title="Address" description="Where do you live?">
              <Stack spacing={4}>
                <form.Field
                  name="street"
                  label="Street Address"
                  component="input"
                  placeholder="123 Main St"
                />
                <form.Field
                  name="city"
                  label="City"
                  component="input"
                  placeholder="Springfield"
                />
                <form.Field
                  name="state"
                  label="State"
                  component="input"
                  placeholder="CA"
                />
                <form.Field
                  name="zipCode"
                  label="ZIP Code"
                  component="input"
                  placeholder="12345"
                />
                <FormActions align="space-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const { prevStep } = form as unknown as {
                        prevStep: () => void;
                      };
                      prevStep();
                    }}
                  >
                    Previous
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting
                      ? 'Submitting...'
                      : 'Complete Registration'}
                  </Button>
                </FormActions>
              </Stack>
            </FormStep>
          </FormStepper>
        )}
      </Form>
    );
  },
};

// Simple checkout flow example
const checkoutSchema = z.object({
  // Step 1: Cart Review
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),

  // Step 2: Shipping
  shippingAddress: z.string().min(1, 'Shipping address is required'),
  shippingMethod: z.enum(['standard', 'express', 'overnight']),

  // Step 3: Payment
  cardNumber: z.string().min(16, 'Card number must be 16 digits'),
  cardName: z.string().min(1, 'Cardholder name is required'),
});

export const CheckoutFlow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'E-commerce checkout flow with cart review, shipping info, and payment details.',
      },
    },
  },
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleSubmit = async (data: z.infer<typeof checkoutSchema>) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`Order placed! Shipping to: ${data.shippingAddress}`);
    };

    return (
      <Form schema={checkoutSchema} onSubmit={handleSubmit}>
        {(form) => (
          <FormStepper currentStep={currentStep} onStepChange={setCurrentStep}>
            <FormStep title="Review Cart" description="Confirm your items">
              <Stack spacing={4}>
                <div style={{ padding: '1rem', background: '#f5f5f5' }}>
                  <p>2 items in cart - Total: $99.99</p>
                </div>
                <form.Field
                  name="agreeToTerms"
                  label="I agree to the terms and conditions"
                  component="checkbox"
                />
                <StepperNavigation />
              </Stack>
            </FormStep>

            <FormStep title="Shipping" description="Where to send your order">
              <Stack spacing={4}>
                <form.Field
                  name="shippingAddress"
                  label="Shipping Address"
                  component="textarea"
                  placeholder="123 Main St, City, State, ZIP"
                />
                <form.Field
                  name="shippingMethod"
                  label="Shipping Method"
                  component="select"
                  options={[
                    { value: 'standard', label: 'Standard (5-7 days) - Free' },
                    { value: 'express', label: 'Express (2-3 days) - $9.99' },
                    {
                      value: 'overnight',
                      label: 'Overnight (1 day) - $24.99',
                    },
                  ]}
                />
                <StepperNavigation />
              </Stack>
            </FormStep>

            <FormStep title="Payment" description="Complete your purchase">
              <Stack spacing={4}>
                <form.Field
                  name="cardNumber"
                  label="Card Number"
                  component="input"
                  placeholder="1234 5678 9012 3456"
                />
                <form.Field
                  name="cardName"
                  label="Cardholder Name"
                  component="input"
                  placeholder="John Doe"
                />
                <FormActions align="space-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    Previous
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting
                      ? 'Processing...'
                      : 'Place Order'}
                  </Button>
                </FormActions>
              </Stack>
            </FormStep>
          </FormStepper>
        )}
      </Form>
    );
  },
};

// Without progress indicator
export const WithoutProgressIndicator: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'FormStepper with progress indicator hidden (showProgress={false}).',
      },
    },
  },
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);

    const simpleSchema = z.object({
      step1: z.string().min(1),
      step2: z.string().min(1),
    });

    return (
      <Form schema={simpleSchema} onSubmit={async () => {}}>
        {(form) => (
          <FormStepper
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            showProgress={false}
          >
            <FormStep title="Step 1" description="First step">
              <Stack spacing={4}>
                <form.Field
                  name="step1"
                  label="Step 1 Input"
                  component="input"
                />
                <StepperNavigation />
              </Stack>
            </FormStep>

            <FormStep title="Step 2" description="Second step">
              <Stack spacing={4}>
                <form.Field
                  name="step2"
                  label="Step 2 Input"
                  component="input"
                />
                <FormActions>
                  <Button type="submit">Submit</Button>
                </FormActions>
              </Stack>
            </FormStep>
          </FormStepper>
        )}
      </Form>
    );
  },
};

// Two-step form
export const TwoStepForm: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Minimal two-step form demonstrating basic stepper functionality.',
      },
    },
  },
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);

    const twoStepSchema = z.object({
      username: z.string().min(3, 'Username must be at least 3 characters'),
      bio: z.string().min(10, 'Bio must be at least 10 characters'),
    });

    return (
      <Form schema={twoStepSchema} onSubmit={async () => {}}>
        {(form) => (
          <FormStepper currentStep={currentStep} onStepChange={setCurrentStep}>
            <FormStep title="Account" description="Choose a username">
              <Stack spacing={4}>
                <form.Field
                  name="username"
                  label="Username"
                  component="input"
                  placeholder="johndoe"
                />
                <StepperNavigation />
              </Stack>
            </FormStep>

            <FormStep title="Profile" description="Tell us about yourself">
              <Stack spacing={4}>
                <form.Field
                  name="bio"
                  label="Bio"
                  component="textarea"
                  placeholder="A few words about yourself..."
                />
                <FormActions align="space-between">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(0)}>
                    Previous
                  </Button>
                  <Button type="submit">Complete Profile</Button>
                </FormActions>
              </Stack>
            </FormStep>
          </FormStepper>
        )}
      </Form>
    );
  },
};

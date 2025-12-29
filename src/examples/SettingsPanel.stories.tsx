import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { z } from 'zod';
import { Tabs } from '../components/Tabs';
import { Form } from '../components/Form/Form';
import { Field } from '../components/Form/Field';
import { FormActions } from '../components/Form/FormActions';
import { Button } from '../components/Button';
import { Toast } from '../components/Toast';

const meta: Meta = {
  title: 'Examples/Settings Panel',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Settings panel patterns using Tabs, Form, Input, Switch, Checkbox, Button, and Toast components.'
      }
    }
  },
};

export default meta;

type Story = StoryObj;

const profileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  email: z.string().email('Invalid email address'),
  bio: z.string().optional(),
});

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  productUpdates: z.boolean(),
});

const privacySchema = z.object({
  profileVisibility: z.enum(['public', 'friends', 'private']),
  showEmail: z.boolean(),
  showActivity: z.boolean(),
});

export const TabbedSettings: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleSave = (data: unknown, section: string) => {
      console.log(`Saving ${section}:`, data);
      setToastMessage(`${section} settings saved successfully!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    };

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>Settings</h1>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value={0}>Profile</Tabs.Tab>
            <Tabs.Tab value={1}>Notifications</Tabs.Tab>
            <Tabs.Tab value={2}>Privacy</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={0}>
            <Form
              schema={profileSchema}
              onSubmit={(data) => handleSave(data, 'Profile')}
              defaultValues={{
                displayName: 'John Doe',
                email: 'john@example.com',
                bio: 'Software developer and design enthusiast.',
              }}
            >
              <Field name="displayName" label="Display Name" />
              <Field name="email" label="Email" type="email" />
              <Field name="bio" label="Bio" component="textarea" />

              <FormActions>
                <Button type="submit">Save Profile</Button>
              </FormActions>
            </Form>
          </Tabs.Panel>

          <Tabs.Panel value={1}>
            <Form
              schema={notificationSchema}
              onSubmit={(data) => handleSave(data, 'Notification')}
              defaultValues={{
                emailNotifications: true,
                pushNotifications: false,
                weeklyDigest: true,
                productUpdates: false,
              }}
            >
              <Field name="emailNotifications" label="Email notifications" component="switch" />
              <Field name="pushNotifications" label="Push notifications" component="switch" />
              <Field name="weeklyDigest" label="Weekly digest" component="checkbox" />
              <Field name="productUpdates" label="Product updates" component="checkbox" />

              <FormActions>
                <Button type="submit">Save Notifications</Button>
              </FormActions>
            </Form>
          </Tabs.Panel>

          <Tabs.Panel value={2}>
            <Form
              schema={privacySchema}
              onSubmit={(data) => handleSave(data, 'Privacy')}
              defaultValues={{
                profileVisibility: 'public' as const,
                showEmail: false,
                showActivity: true,
              }}
            >
              <Field
                name="profileVisibility"
                label="Profile Visibility"
                component="select"
                options={[
                  { value: 'public', label: 'Public' },
                  { value: 'friends', label: 'Friends Only' },
                  { value: 'private', label: 'Private' },
                ]}
              />
              <Field name="showEmail" label="Show email on profile" component="switch" />
              <Field name="showActivity" label="Show activity status" component="switch" />

              <FormActions>
                <Button type="submit">Save Privacy</Button>
              </FormActions>
            </Form>
          </Tabs.Panel>
        </Tabs>

        {showToast && (
          <Toast variant="success" onClose={() => setShowToast(false)}>
            {toastMessage}
          </Toast>
        )}
      </div>
    );
  },
};

import type { Meta, StoryObj } from '@storybook/react';

function Introduction() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Welcome to boom-ui
      </h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: 'var(--boom-theme-text-secondary)' }}>
        An accessibility-first React component library built with TypeScript, Vite, and Framer Motion.
      </p>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '2rem' }}>
        Installation
      </h2>
      <pre style={{
        background: 'var(--boom-theme-bg-secondary)',
        padding: '1rem',
        borderRadius: '4px',
        overflow: 'auto'
      }}>
        <code>npm install @whatisboom/boom-ui</code>
      </pre>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '2rem' }}>
        Quick Start
      </h2>
      <pre style={{
        background: 'var(--boom-theme-bg-secondary)',
        padding: '1rem',
        borderRadius: '4px',
        overflow: 'auto'
      }}>
        <code>{`import { Button, ThemeProvider } from '@whatisboom/boom-ui';
import '@whatisboom/boom-ui/styles';

function App() {
  return (
    <ThemeProvider>
      <Button variant="primary">Click me</Button>
    </ThemeProvider>
  );
}`}</code>
      </pre>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '2rem' }}>
        Features
      </h2>
      <ul style={{ fontSize: '1rem', lineHeight: '1.8' }}>
        <li>🎯 <strong>Accessibility-First</strong> - WCAG compliant with comprehensive keyboard navigation</li>
        <li>🎨 <strong>Themeable</strong> - Built-in light/dark themes with customizable design tokens</li>
        <li>⚡ <strong>TypeScript</strong> - Full type safety with exported types for all components</li>
        <li>📦 <strong>Tree-Shakeable</strong> - Optimized bundle size with ES modules</li>
        <li>🎬 <strong>Animated</strong> - Smooth transitions powered by Framer Motion</li>
        <li>✅ <strong>Form Support</strong> - Integrated with React Hook Form and Zod validation</li>
      </ul>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '2rem' }}>
        Resources
      </h2>
      <ul style={{ fontSize: '1rem', lineHeight: '1.8' }}>
        <li>
          <a
            href="https://github.com/whatisboom/boom-ui"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--boom-palette-accent-600)' }}
          >
            GitHub Repository
          </a>
        </li>
        <li>
          <a
            href="https://www.npmjs.com/package/@whatisboom/boom-ui"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--boom-palette-accent-600)' }}
          >
            npm Package
          </a>
        </li>
      </ul>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '2rem' }}>
        Next Steps
      </h2>
      <p style={{ fontSize: '1rem', lineHeight: '1.8' }}>
        Explore the sidebar to find components organized by use case:
      </p>
      <ul style={{ fontSize: '1rem', lineHeight: '1.8' }}>
        <li><strong>Getting Started</strong> - Theme system and layout basics</li>
        <li><strong>Forms & Validation</strong> - Form controls and validation patterns</li>
        <li><strong>Data & Content</strong> - Tables, cards, typography, and more</li>
        <li><strong>Navigation & Menus</strong> - Headers, tabs, and navigation components</li>
        <li><strong>Feedback & Alerts</strong> - Alerts, toasts, and progress indicators</li>
        <li><strong>Overlays & Dialogs</strong> - Modals, drawers, tooltips, and popovers</li>
        <li><strong>Page Layouts</strong> - Hero sections and layout primitives</li>
        <li><strong>Examples</strong> - Real-world compositional patterns</li>
      </ul>
    </div>
  );
}

const meta: Meta<typeof Introduction> = {
  title: 'Getting Started/Introduction',
  component: Introduction,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Introduction>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hero } from './Hero';

const meta = {
  title: 'Components/Display/Hero',
  component: Hero,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['centered', 'split-left', 'split-right', 'minimal'],
      description: 'Layout variant for the hero component',
    },
    heading: {
      control: 'text',
      description: 'Main heading text',
    },
    subheading: {
      control: 'text',
      description: 'Subheading text (optional)',
    },
    headingAs: {
      control: 'select',
      options: ['h1', 'h2', 'h3'],
      description: 'HTML element for heading',
    },
    subheadingAs: {
      control: 'select',
      options: ['p', 'h2', 'h3', 'h4'],
      description: 'HTML element for subheading',
    },
    paddingY: {
      control: { type: 'number', min: 0, max: 20 },
      description: 'Vertical padding (uses spacing scale)',
    },
    paddingX: {
      control: { type: 'number', min: 0, max: 20 },
      description: 'Horizontal padding (uses spacing scale)',
    },
    minHeight: {
      control: 'text',
      description: 'Minimum height (CSS value)',
    },
    maxWidth: {
      control: 'text',
      description: 'Maximum content width (CSS value)',
    },
    disableAnimation: {
      control: 'boolean',
      description: 'Disable Framer Motion animations',
    },
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'Welcome to Boom UI',
    subheading: 'Build beautiful, accessible React applications with our component library',
    variant: 'centered',
  },
};

export const WithCTAs: Story = {
  name: 'With CTAs',
  args: {
    heading: 'Get Started Today',
    subheading: 'Join thousands of developers building with Boom UI',
    variant: 'centered',
    primaryCTA: {
      children: 'Get Started',
      onClick: () => alert('Primary CTA clicked'),
    },
    secondaryCTA: {
      children: 'Learn More',
      onClick: () => alert('Secondary CTA clicked'),
      variant: 'outline',
    },
  },
};

export const SplitLeft: Story = {
  args: {
    variant: 'split-left',
    heading: 'Build Faster',
    subheading: 'Our components are designed for speed and accessibility',
    primaryCTA: {
      children: 'View Components',
      onClick: () => alert('View Components'),
    },
  },
};

export const SplitRight: Story = {
  args: {
    variant: 'split-right',
    heading: 'Design with Confidence',
    subheading: 'Every component follows WCAG 2.1 AA accessibility standards',
    primaryCTA: {
      children: 'Read Documentation',
      onClick: () => alert('Read Documentation'),
    },
    secondaryCTA: {
      children: 'View Examples',
      variant: 'ghost',
    },
  },
};

export const Minimal: Story = {
  args: {
    variant: 'minimal',
    heading: 'Simple & Elegant',
    subheading: 'Sometimes less is more',
    paddingY: 8,
  },
};

export const WithBackgroundImage: Story = {
  args: {
    heading: 'Beautiful Backgrounds',
    subheading: 'Add stunning visuals to your hero sections',
    variant: 'centered',
    backgroundMedia: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1920&q=80',
      alt: 'Abstract technology background',
      overlayOpacity: 0.4,
    },
    primaryCTA: {
      children: 'Explore More',
    },
  },
};

export const WithBackgroundVideo: Story = {
  args: {
    heading: 'Experience the Future',
    subheading: 'Immersive design meets functionality',
    variant: 'centered',
    backgroundMedia: {
      type: 'video',
      sources: [
        {
          src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          type: 'video/mp4',
        },
      ],
      overlayOpacity: 0.6,
    },
    primaryCTA: {
      children: 'Watch Demo',
    },
  },
};

export const SplitLeftWithImage: Story = {
  args: {
    variant: 'split-left',
    heading: 'Modern Development',
    subheading: 'Built with the latest React patterns and TypeScript for type safety',
    backgroundMedia: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=80',
      alt: 'Developer workspace',
      overlayOpacity: 0.3,
    },
    primaryCTA: {
      children: 'Get Started',
    },
    secondaryCTA: {
      children: 'View on GitHub',
      variant: 'outline',
    },
  },
};

export const CustomContent: Story = {
  args: {
    heading: 'Flexible Content',
    subheading: 'Add any custom content below the CTAs',
    primaryCTA: {
      children: 'Sign Up Free',
    },
  },
  render: (args) => (
    <Hero {...args}>
      <div style={{ marginTop: 'var(--boom-spacing-4)', textAlign: 'center' }}>
        <p style={{ fontSize: 'var(--boom-font-size-sm)', color: 'var(--boom-theme-text-tertiary)' }}>
          No credit card required • Free forever • Cancel anytime
        </p>
      </div>
    </Hero>
  ),
};

export const AllVariants: Story = {
  args: {
    heading: 'All Variants',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Hero
        variant="centered"
        heading="Centered Variant"
        subheading="Content is centered both horizontally and vertically"
        minHeight="400px"
        primaryCTA={{ children: 'Learn More' }}
      />
      <Hero
        variant="split-left"
        heading="Split Left Variant"
        subheading="Content aligned to the left side"
        minHeight="400px"
        primaryCTA={{ children: 'Get Started' }}
      />
      <Hero
        variant="split-right"
        heading="Split Right Variant"
        subheading="Content aligned to the right side"
        minHeight="400px"
        primaryCTA={{ children: 'Explore' }}
      />
      <Hero
        variant="minimal"
        heading="Minimal Variant"
        subheading="Reduced spacing and typography"
        primaryCTA={{ children: 'View More' }}
      />
    </div>
  ),
};

export const DarkMode: Story = {
  args: {
    heading: 'Dark Mode Support',
    subheading: 'Looks great in both light and dark themes',
    primaryCTA: {
      children: 'Try It Out',
    },
    secondaryCTA: {
      children: 'Learn More',
      variant: 'outline',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const CustomHeadingLevel: Story = {
  args: {
    heading: 'Custom Heading Level',
    subheading: 'This hero uses h2 for the heading instead of h1',
    headingAs: 'h2',
    subheadingAs: 'h3',
    primaryCTA: {
      children: 'Explore',
    },
  },
};

export const LongContent: Story = {
  args: {
    heading: 'This is a Very Long Heading That Demonstrates How the Component Handles Lengthy Text',
    subheading:
      'This is a longer subheading that provides additional context and information about the product or service. It demonstrates how the component handles multiple lines of text and maintains readability.',
    primaryCTA: {
      children: 'Get Started Now',
    },
    secondaryCTA: {
      children: 'Read Full Documentation',
      variant: 'ghost',
    },
  },
};

export const NoAnimation: Story = {
  args: {
    heading: 'No Animations',
    subheading: 'This hero has animations disabled',
    disableAnimation: true,
    primaryCTA: {
      children: 'Click Me',
    },
  },
};

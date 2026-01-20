import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from './Image';
import { Stack } from '../Stack';

const meta = {
  title: 'Media/Image',
  component: Image,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Image source URL',
    },
    alt: {
      control: 'text',
      description: 'Alt text for accessibility (required)',
    },
    fallbackSrc: {
      control: 'text',
      description: 'Fallback image source when main image fails to load',
    },
    objectFit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'scale-down', 'none'],
      description: 'Object-fit CSS property',
    },
    loading: {
      control: 'select',
      options: ['lazy', 'eager'],
      description: 'Enable lazy loading via IntersectionObserver',
    },
    placeholder: {
      control: 'boolean',
      description: 'Show placeholder blur effect while loading',
    },
    width: {
      control: 'text',
      description: 'Width of the image container',
    },
    height: {
      control: 'text',
      description: 'Height of the image container',
    },
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    alt: 'Mountain landscape',
    width: 400,
    height: 300,
    loading: 'eager',
  },
};

export const WithFallback: Story = {
  args: {
    src: 'https://invalid-url.example.com/image.jpg',
    alt: 'Image with fallback',
    fallbackSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    width: 400,
    height: 300,
    loading: 'eager',
  },
};

export const LazyLoading: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    alt: 'Lazy loaded image',
    width: 400,
    height: 300,
    loading: 'lazy',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '150vh', display: 'flex', alignItems: 'flex-end' }}>
        <div>
          <p style={{ marginBottom: '1rem' }}>Scroll down to see the image load</p>
          <Story />
        </div>
      </div>
    ),
  ],
};

export const WithPlaceholder: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    alt: 'Image with placeholder blur',
    width: 400,
    height: 300,
    placeholder: true,
    loading: 'eager',
  },
};

export const ObjectFitCover: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    alt: 'Object-fit cover',
    width: 300,
    height: 300,
    objectFit: 'cover',
    loading: 'eager',
  },
};

export const ObjectFitContain: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    alt: 'Object-fit contain',
    width: 300,
    height: 300,
    objectFit: 'contain',
    loading: 'eager',
  },
};

export const ObjectFitFill: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    alt: 'Object-fit fill',
    width: 300,
    height: 300,
    objectFit: 'fill',
    loading: 'eager',
  },
};

export const Clickable: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    alt: 'Clickable image',
    width: 400,
    height: 300,
    loading: 'eager',
    onClick: () => alert('Image clicked! This could open a lightbox.'),
  },
};

export const ResponsiveWidth: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    alt: 'Responsive width image',
    width: '100%',
    height: 400,
    loading: 'eager',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export const Gallery: Story = {
  args: {} as Parameters<typeof Image>[0],
  render: () => (
    <Stack spacing={4}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
          alt="Mountain 1"
          width={200}
          height={200}
          objectFit="cover"
          loading="eager"
        />
        <Image
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop"
          alt="Nature 1"
          width={200}
          height={200}
          objectFit="cover"
          loading="eager"
        />
        <Image
          src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=400&fit=crop"
          alt="Forest"
          width={200}
          height={200}
          objectFit="cover"
          loading="eager"
        />
        <Image
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop"
          alt="Valley"
          width={200}
          height={200}
          objectFit="cover"
          loading="eager"
        />
        <Image
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop"
          alt="Woodland"
          width={200}
          height={200}
          objectFit="cover"
          loading="eager"
        />
        <Image
          src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=400&fit=crop"
          alt="Mountain 2"
          width={200}
          height={200}
          objectFit="cover"
          loading="eager"
        />
      </div>
    </Stack>
  ),
};

export const AllObjectFitOptions: Story = {
  args: {} as Parameters<typeof Image>[0],
  render: () => (
    <Stack spacing={4}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '0.5rem' }}>Cover</h3>
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
            alt="Object-fit cover"
            width={250}
            height={250}
            objectFit="cover"
            loading="eager"
          />
        </div>
        <div>
          <h3 style={{ marginBottom: '0.5rem' }}>Contain</h3>
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
            alt="Object-fit contain"
            width={250}
            height={250}
            objectFit="contain"
            loading="eager"
          />
        </div>
        <div>
          <h3 style={{ marginBottom: '0.5rem' }}>Fill</h3>
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
            alt="Object-fit fill"
            width={250}
            height={250}
            objectFit="fill"
            loading="eager"
          />
        </div>
        <div>
          <h3 style={{ marginBottom: '0.5rem' }}>Scale-down</h3>
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
            alt="Object-fit scale-down"
            width={250}
            height={250}
            objectFit="scale-down"
            loading="eager"
          />
        </div>
      </div>
    </Stack>
  ),
};

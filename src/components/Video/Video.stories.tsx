import type { Meta, StoryObj } from '@storybook/react-vite';
import { Video } from './Video';
import { Stack } from '../Stack';

const meta = {
  title: 'Media/Video',
  component: Video,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Video source URL',
    },
    poster: {
      control: 'text',
      description: 'Poster image URL',
    },
    controls: {
      control: 'boolean',
      description: 'Show custom controls',
    },
    captions: {
      control: 'object',
      description: 'Caption tracks (WebVTT format)',
    },
    playbackRates: {
      control: 'object',
      description: 'Available playback rate options',
    },
    defaultPlaybackRate: {
      control: 'select',
      options: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
      description: 'Initial playback rate',
    },
    autoPlay: {
      control: 'boolean',
      description: 'Autoplay video (muted by default)',
    },
    loop: {
      control: 'boolean',
      description: 'Loop video',
    },
    muted: {
      control: 'boolean',
      description: 'Mute video',
    },
    preload: {
      control: 'select',
      options: ['none', 'metadata', 'auto'],
      description: 'Preload strategy',
    },
  },
} satisfies Meta<typeof Video>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    controls: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '640px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithCaptions: Story = {
  args: {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    controls: true,
    captions: [
      {
        src: 'https://gist.githubusercontent.com/samdutton/ca37f3adaf4e23679957b8083e061177/raw/e19399fbccbc069a2af4266e5120ae6bad62699a/sample.vtt',
        label: 'English',
        language: 'en',
        default: true,
      },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: '640px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export const PlaybackRates: Story = {
  args: {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    controls: true,
    playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    defaultPlaybackRate: 1,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '640px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export const AutoPlay: Story = {
  args: {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    controls: true,
    autoPlay: true,
    muted: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '640px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export const Loop: Story = {
  args: {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    controls: true,
    loop: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '640px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export const NoControls: Story = {
  args: {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    controls: false,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '640px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export const ResponsiveWidth: Story = {
  args: {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    controls: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <Story />
      </div>
    ),
  ],
};

export const AllFeatures: Story = {
  args: {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    controls: true,
    captions: [
      {
        src: 'https://gist.githubusercontent.com/samdutton/ca37f3adaf4e23679957b8083e061177/raw/e19399fbccbc069a2af4266e5120ae6bad62699a/sample.vtt',
        label: 'English',
        language: 'en',
        default: true,
      },
    ],
    playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
    defaultPlaybackRate: 1,
    preload: 'metadata',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '640px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export const KeyboardShortcuts: Story = {
  args: {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    controls: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '640px', maxWidth: '100%' }}>
        <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0 }}>Keyboard Shortcuts:</h3>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li><kbd>Space</kbd> or <kbd>K</kbd> - Play/Pause</li>
            <li><kbd>←</kbd> - Seek backward 5s</li>
            <li><kbd>→</kbd> - Seek forward 5s</li>
            <li><kbd>↑</kbd> - Increase volume</li>
            <li><kbd>↓</kbd> - Decrease volume</li>
            <li><kbd>F</kbd> - Toggle fullscreen</li>
            <li><kbd>M</kbd> - Toggle mute</li>
            <li><kbd>0</kbd> or <kbd>Home</kbd> - Seek to start</li>
            <li><kbd>End</kbd> - Seek to end</li>
          </ul>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const MultipleVideos: Story = {
  args: {} as Parameters<typeof Video>[0],
  render: () => (
    <Stack spacing={6}>
      <div style={{ width: '640px', maxWidth: '100%' }}>
        <h3 style={{ marginTop: 0 }}>Big Buck Bunny</h3>
        <Video
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          poster="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
          controls
        />
      </div>
      <div style={{ width: '640px', maxWidth: '100%' }}>
        <h3 style={{ marginTop: 0 }}>Elephant Dream</h3>
        <Video
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          poster="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg"
          controls
        />
      </div>
    </Stack>
  ),
};

export const DifferentAspectRatios: Story = {
  args: {} as Parameters<typeof Video>[0],
  render: () => (
    <Stack spacing={6}>
      <div style={{ width: '640px', maxWidth: '100%' }}>
        <h3 style={{ marginTop: 0 }}>Standard 16:9</h3>
        <Video
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          poster="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
          controls
        />
      </div>
      <div style={{ width: '400px', maxWidth: '100%' }}>
        <h3 style={{ marginTop: 0 }}>Narrow (4:3 simulation)</h3>
        <Video
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          poster="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
          controls
        />
      </div>
    </Stack>
  ),
};

export const EventHandlers: Story = {
  args: {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    controls: true,
    onPlay: () => console.log('Video started playing'),
    onPause: () => console.log('Video paused'),
    onEnded: () => console.log('Video ended'),
    onVideoTimeUpdate: (time: number) => console.log(`Current time: ${time.toFixed(2)}s`),
    onVolumeChange: (volume: number, muted: boolean) =>
      console.log(`Volume: ${(volume * 100).toFixed(0)}%, Muted: ${muted}`),
    onPlaybackRateChange: (rate) => console.log(`Playback rate: ${rate}x`),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '640px', maxWidth: '100%' }}>
        <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <p style={{ margin: 0 }}>
            Open the browser console to see event logs as you interact with the video.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};

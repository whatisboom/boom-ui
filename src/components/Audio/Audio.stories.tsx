import type { Meta, StoryObj } from '@storybook/react-vite';
import { Audio } from './Audio';

const meta = {
  title: 'Components/Media/Audio',
  component: Audio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    showWaveform: {
      control: 'boolean',
      description: 'Show waveform visualization',
    },
    showPlaylist: {
      control: 'boolean',
      description: 'Show playlist UI',
    },
    autoPlay: {
      control: 'boolean',
      description: 'Auto-play on mount',
    },
    loop: {
      control: 'boolean',
      description: 'Loop playback',
    },
    muted: {
      control: 'boolean',
      description: 'Muted state',
    },
    volume: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Initial volume (0-1)',
    },
  },
} satisfies Meta<typeof Audio>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic audio player with single audio source.
 */
export const Default: Story = {
  args: {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    title: 'SoundHelix Song',
    artist: 'SoundHelix',
  },
};

/**
 * Audio player with track metadata displayed.
 */
export const WithMetadata: Story = {
  args: {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    title: 'Summer Vibes',
    artist: 'The Awesome Band',
  },
};

/**
 * Audio player with waveform visualization.
 * Note: Waveform generation requires network access to fetch audio data.
 */
export const WithWaveform: Story = {
  args: {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    title: 'Track with Waveform',
    artist: 'Artist Name',
    showWaveform: true,
  },
};

/**
 * Small size audio player.
 */
export const SmallSize: Story = {
  args: {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    title: 'Compact Player',
    size: 'sm',
  },
};

/**
 * Large size audio player.
 */
export const LargeSize: Story = {
  args: {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    title: 'Large Player',
    artist: 'Big Sound',
    size: 'lg',
  },
};

/**
 * Audio player with custom playback speeds.
 */
export const CustomPlaybackRates: Story = {
  args: {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    title: 'Variable Speed',
    playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3],
  },
};

/**
 * Audio player with playlist.
 */
export const Playlist: Story = {
  args: {
    playlist: [
      {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        title: 'First Track',
        artist: 'Artist One',
        duration: 360,
      },
      {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        title: 'Second Track',
        artist: 'Artist Two',
        duration: 420,
      },
      {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        title: 'Third Track',
        artist: 'Artist Three',
        duration: 300,
      },
    ],
  },
};

/**
 * Audio player with visible playlist.
 */
export const PlaylistWithUI: Story = {
  args: {
    playlist: [
      {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        title: 'Morning Sunshine',
        artist: 'The Dawn Chorus',
        duration: 245,
      },
      {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        title: 'Afternoon Breeze',
        artist: 'Wind Symphony',
        duration: 312,
      },
      {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        title: 'Evening Calm',
        artist: 'Peaceful Minds',
        duration: 198,
      },
      {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        title: 'Night Dreams',
        artist: 'Sleep Orchestra',
        duration: 276,
      },
    ],
    showPlaylist: true,
  },
};

/**
 * Audio player starting muted.
 */
export const Muted: Story = {
  args: {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    title: 'Muted Track',
    muted: true,
  },
};

/**
 * Audio player with low initial volume.
 */
export const LowVolume: Story = {
  args: {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    title: 'Quiet Track',
    volume: 0.3,
  },
};

/**
 * Audio player with loop enabled.
 */
export const Looping: Story = {
  args: {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    title: 'Looping Track',
    loop: true,
  },
};

/**
 * Full-featured audio player with all options enabled.
 */
export const FullFeatured: Story = {
  args: {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    title: 'Complete Experience',
    artist: 'The Full Stack Band',
    showWaveform: true,
    size: 'lg',
    playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
  },
};

/**
 * Demonstrates keyboard shortcuts.
 * - Space: Play/Pause
 * - Arrow Left/Right: Seek backward/forward 5 seconds
 * - M: Mute/Unmute
 */
export const KeyboardShortcuts: Story = {
  args: {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    title: 'Keyboard Controls Demo',
    artist: 'Use Space, Arrows, and M keys',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This player supports keyboard shortcuts:\n\n' +
          '- **Space**: Toggle play/pause\n' +
          '- **Arrow Left**: Seek backward 5 seconds\n' +
          '- **Arrow Right**: Seek forward 5 seconds\n' +
          '- **M**: Toggle mute\n\n' +
          'Focus the page and try these shortcuts!',
      },
    },
  },
};

/**
 * Audio player with callbacks.
 */
export const WithCallbacks: Story = {
  args: {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    title: 'Callback Demo',
    onPlay: () => console.log('Audio started playing'),
    onPause: () => console.log('Audio paused'),
    onEnded: () => console.log('Audio ended'),
    onVolumeChange: (volume) => console.log('Volume changed to:', volume),
    onTimeUpdate: (time) => console.log('Current time:', time),
  },
  parameters: {
    docs: {
      description: {
        story: 'Check the browser console to see callback logs.',
      },
    },
  },
};

/**
 * Playlist with track change callbacks.
 */
export const PlaylistWithCallbacks: Story = {
  args: {
    playlist: [
      {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        title: 'Track One',
        artist: 'Artist A',
      },
      {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        title: 'Track Two',
        artist: 'Artist B',
      },
      {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        title: 'Track Three',
        artist: 'Artist C',
      },
    ],
    showPlaylist: true,
    onTrackChange: (index) => console.log('Track changed to index:', index),
  },
  parameters: {
    docs: {
      description: {
        story: 'Check the browser console to see track change logs.',
      },
    },
  },
};

/**
 * Audio player without any metadata.
 */
export const Minimal: Story = {
  args: {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
  },
};

/**
 * Custom styled audio player.
 */
export const CustomStyled: Story = {
  args: {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    title: 'Custom Style',
    className: 'custom-audio-player',
  },
  parameters: {
    docs: {
      description: {
        story: 'Apply custom CSS classes to style the audio player.',
      },
    },
  },
};

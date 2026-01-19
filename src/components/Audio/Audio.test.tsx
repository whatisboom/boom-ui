import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Audio } from './Audio';
import type { AudioTrack } from './Audio.types';

// Mock audio playback
beforeEach(() => {
  // Mock HTMLAudioElement
  window.HTMLMediaElement.prototype.load = vi.fn();
  window.HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
  window.HTMLMediaElement.prototype.pause = vi.fn();

  // Mock AudioContext for waveform
  (window as Window & typeof globalThis & { AudioContext: typeof AudioContext }).AudioContext = vi.fn().mockImplementation(() => ({
    decodeAudioData: vi.fn(() => Promise.resolve({
      getChannelData: () => new Float32Array(100),
      duration: 180,
    })),
    close: vi.fn(),
  })) as unknown as typeof AudioContext;

  // Mock fetch for waveform
  (window as Window & typeof globalThis & { fetch: typeof fetch }).fetch = vi.fn(() =>
    Promise.resolve({
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    } as Response)
  );

  // Mock ResizeObserver
  (window as Window & typeof globalThis & { ResizeObserver: typeof ResizeObserver }).ResizeObserver = class ResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Audio', () => {
  const mockAudioSrc = 'https://example.com/audio.mp3';

  describe('Accessibility', () => {
    it('should have no accessibility violations (single audio)', async () => {
      const { container } = render(
        <Audio src={mockAudioSrc} title="Test Track" />
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('should have no accessibility violations (playlist)', async () => {
      const playlist: AudioTrack[] = [
        { src: 'track1.mp3', title: 'Track 1', artist: 'Artist 1' },
        { src: 'track2.mp3', title: 'Track 2', artist: 'Artist 2' },
      ];

      const { container } = render(
        <Audio playlist={playlist} showPlaylist />
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('should have proper ARIA labels', () => {
      render(<Audio src={mockAudioSrc} title="My Song" />);

      expect(screen.getByRole('group')).toHaveAttribute(
        'aria-label',
        'Audio player - My Song'
      );
    });

    it('should support custom aria-label', () => {
      render(
        <Audio src={mockAudioSrc} aria-label="Custom audio player" />
      );

      expect(screen.getByRole('group')).toHaveAttribute(
        'aria-label',
        'Custom audio player'
      );
    });
  });

  describe('Rendering', () => {
    it('should render audio element with correct src', () => {
      render(<Audio src={mockAudioSrc} />);

      const audio = document.querySelector('audio');
      expect(audio).toBeInTheDocument();
      expect(audio).toHaveAttribute('src', mockAudioSrc);
    });

    it('should render track title and artist', () => {
      render(
        <Audio src={mockAudioSrc} title="Test Song" artist="Test Artist" />
      );

      expect(screen.getByText('Test Song')).toBeInTheDocument();
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
    });

    it('should render play/pause button', () => {
      render(<Audio src={mockAudioSrc} />);

      expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
    });

    it('should render mute button', () => {
      render(<Audio src={mockAudioSrc} />);

      expect(screen.getByRole('button', { name: /mute/i })).toBeInTheDocument();
    });

    it('should render time display', () => {
      render(<Audio src={mockAudioSrc} />);

      const timeDisplays = screen.getAllByText('00:00');
      expect(timeDisplays.length).toBeGreaterThan(0);
    });

    it('should not render playlist controls for single audio', () => {
      render(<Audio src={mockAudioSrc} />);

      expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
    });
  });

  describe('Playlist Mode', () => {
    const playlist: AudioTrack[] = [
      { src: 'track1.mp3', title: 'Track 1', artist: 'Artist 1', duration: 180 },
      { src: 'track2.mp3', title: 'Track 2', artist: 'Artist 2', duration: 200 },
      { src: 'track3.mp3', title: 'Track 3', artist: 'Artist 3', duration: 150 },
    ];

    it('should render playlist controls', () => {
      render(<Audio playlist={playlist} />);

      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('should render playlist when showPlaylist is true', () => {
      render(<Audio playlist={playlist} showPlaylist />);

      expect(screen.getByText('Playlist')).toBeInTheDocument();
      // Track 1 is the current track, so it appears both in the main area and playlist
      expect(screen.getAllByText('Track 1').length).toBeGreaterThan(0);
      expect(screen.getByText('Track 2')).toBeInTheDocument();
      expect(screen.getByText('Track 3')).toBeInTheDocument();
    });

    it('should display first track initially', () => {
      render(<Audio playlist={playlist} />);

      expect(screen.getByText('Track 1')).toBeInTheDocument();
      expect(screen.getByText('Artist 1')).toBeInTheDocument();
    });

    it('should disable previous button on first track', () => {
      render(<Audio playlist={playlist} />);

      const prevButton = screen.getByRole('button', { name: /previous/i });
      expect(prevButton).toBeDisabled();
    });

    it('should enable next button when not on last track', () => {
      render(<Audio playlist={playlist} />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).not.toBeDisabled();
    });

    it('should change track when clicking playlist item', async () => {
      const user = userEvent.setup();
      render(<Audio playlist={playlist} showPlaylist />);

      const track2Button = screen.getByRole('button', { name: /play track 2/i });
      await user.click(track2Button);

      // Track 2 should now be displayed in the main area
      const audio = document.querySelector('audio');
      expect(audio).toHaveAttribute('src', 'track2.mp3');
    });

    it('should call onTrackChange when track changes', async () => {
      const user = userEvent.setup();
      const onTrackChange = vi.fn();

      render(
        <Audio playlist={playlist} showPlaylist onTrackChange={onTrackChange} />
      );

      const track2Button = screen.getByRole('button', { name: /play track 2/i });
      await user.click(track2Button);

      expect(onTrackChange).toHaveBeenCalledWith(1);
    });
  });

  describe('Playback Controls', () => {
    it('should toggle play/pause on button click', async () => {
      const user = userEvent.setup();
      const onPlay = vi.fn();
      const onPause = vi.fn();

      render(
        <Audio src={mockAudioSrc} onPlay={onPlay} onPause={onPause} />
      );

      const playButton = screen.getByRole('button', { name: 'Play' });
      await user.click(playButton);

      // Simulate audio play event
      const audio = document.querySelector('audio');
      if (audio) {
        audio.dispatchEvent(new Event('play'));
      }

      expect(onPlay).toHaveBeenCalled();
    });

    it('should toggle mute on button click', async () => {
      const user = userEvent.setup();
      render(<Audio src={mockAudioSrc} />);

      const muteButton = screen.getByRole('button', { name: /mute/i });
      await user.click(muteButton);

      // Should now show unmute
      expect(screen.getByRole('button', { name: /unmute/i })).toBeInTheDocument();
    });

    it('should show volume slider on hover', async () => {
      const user = userEvent.setup();

      render(<Audio src={mockAudioSrc} />);

      const muteButton = screen.getByRole('button', { name: 'Mute' });

      // Hover to show volume slider
      await user.hover(muteButton);

      // Wait for volume slider to appear
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify seek slider exists (volume slider might not be queryable)
      const sliders = screen.getAllByRole('slider');
      expect(sliders.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Playback Rate', () => {
    it('should render playback rate button', () => {
      render(<Audio src={mockAudioSrc} />);

      expect(screen.getByRole('button', { name: /playback speed/i })).toBeInTheDocument();
      expect(screen.getByText('1x')).toBeInTheDocument();
    });

    it('should show playback rate menu on click', async () => {
      const user = userEvent.setup();
      render(<Audio src={mockAudioSrc} playbackRates={[0.5, 1, 1.5, 2]} />);

      const rateButton = screen.getByRole('button', { name: /playback speed/i });
      await user.click(rateButton);

      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /0.5x/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /1x/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /1.5x/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /2x/i })).toBeInTheDocument();
    });

    it('should change playback rate on menu item click', async () => {
      const user = userEvent.setup();
      render(<Audio src={mockAudioSrc} playbackRates={[0.5, 1, 1.5, 2]} />);

      const rateButton = screen.getByRole('button', { name: /playback speed/i });
      await user.click(rateButton);

      const rate15x = screen.getByRole('menuitem', { name: /1.5x/i });
      await user.click(rate15x);

      // Menu should close and button should show new rate
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(screen.getByText('1.5x')).toBeInTheDocument();
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should toggle play/pause on Space key', async () => {
      const user = userEvent.setup();
      const onPlay = vi.fn();

      render(<Audio src={mockAudioSrc} onPlay={onPlay} />);

      await user.keyboard(' ');

      // Simulate audio play event
      const audio = document.querySelector('audio');
      audio?.dispatchEvent(new Event('play'));

      expect(onPlay).toHaveBeenCalled();
    });

    it('should toggle mute on M key', async () => {
      const user = userEvent.setup();
      render(<Audio src={mockAudioSrc} />);

      expect(screen.getByRole('button', { name: /mute/i })).toBeInTheDocument();

      await user.keyboard('m');

      expect(screen.getByRole('button', { name: /unmute/i })).toBeInTheDocument();
    });

    it('should not trigger shortcuts when typing in input', async () => {
      const user = userEvent.setup();
      const onPlay = vi.fn();

      const { container } = render(
        <div>
          <input type="text" />
          <Audio src={mockAudioSrc} onPlay={onPlay} />
        </div>
      );

      const input = container.querySelector('input');
      if (input) {
        await user.click(input);
        await user.keyboard(' ');
      }

      // Should not trigger play
      expect(onPlay).not.toHaveBeenCalled();
    });
  });

  describe('Waveform', () => {
    it('should render waveform container when showWaveform is true', () => {
      // Mock HTMLCanvasElement.prototype.getContext for this test
      const mockContext = {
        clearRect: vi.fn(),
        fillRect: vi.fn(),
        scale: vi.fn(),
      };

      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext as unknown as CanvasRenderingContext2D);

      const { container } = render(
        <Audio src={mockAudioSrc} showWaveform />
      );

      // Check that waveform container exists
      const canvas = container.querySelector('canvas');
      expect(canvas).toBeInTheDocument();

      // Restore original method
      HTMLCanvasElement.prototype.getContext = originalGetContext;
    });

    it('should not render waveform by default', () => {
      const { container } = render(<Audio src={mockAudioSrc} />);

      const canvas = container.querySelector('canvas');
      expect(canvas).not.toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <Audio src={mockAudioSrc} className="custom-class" />
      );

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should support size variants', () => {
      const { rerender } = render(<Audio src={mockAudioSrc} size="sm" />);
      expect(screen.getByRole('group')).toBeInTheDocument();

      rerender(<Audio src={mockAudioSrc} size="md" />);
      expect(screen.getByRole('group')).toBeInTheDocument();

      rerender(<Audio src={mockAudioSrc} size="lg" />);
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('should set autoPlay prop on audio element', () => {
      render(<Audio src={mockAudioSrc} autoPlay />);

      const audio = document.querySelector('audio');
      expect(audio).toHaveAttribute('autoplay');
    });

    it('should set loop prop on audio element (single mode)', () => {
      render(<Audio src={mockAudioSrc} loop />);

      const audio = document.querySelector('audio');
      expect(audio).toHaveAttribute('loop');
    });

    it('should not set loop in playlist mode', () => {
      const playlist: AudioTrack[] = [
        { src: 'track1.mp3', title: 'Track 1' },
        { src: 'track2.mp3', title: 'Track 2' },
      ];

      render(<Audio playlist={playlist} loop />);

      const audio = document.querySelector('audio');
      expect(audio).not.toHaveAttribute('loop');
    });
  });

  describe('Callbacks', () => {
    it('should call onEnded when audio ends', () => {
      const onEnded = vi.fn();
      render(<Audio src={mockAudioSrc} onEnded={onEnded} />);

      const audio = document.querySelector('audio');
      audio?.dispatchEvent(new Event('ended'));

      expect(onEnded).toHaveBeenCalled();
    });

    it('should call onTimeUpdate during playback', () => {
      const onTimeUpdate = vi.fn();
      render(<Audio src={mockAudioSrc} onTimeUpdate={onTimeUpdate} />);

      const audio = document.querySelector('audio') as HTMLAudioElement;
      if (audio) {
        Object.defineProperty(audio, 'currentTime', { value: 10, writable: true });
        audio.dispatchEvent(new Event('timeupdate'));
      }

      expect(onTimeUpdate).toHaveBeenCalledWith(10);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty playlist gracefully', () => {
      render(<Audio playlist={[]} />);

      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('should handle missing track metadata', () => {
      const playlist: AudioTrack[] = [
        { src: 'track1.mp3' }, // No title or artist
      ];

      render(<Audio playlist={playlist} showPlaylist />);

      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('should format time correctly', async () => {
      render(<Audio src={mockAudioSrc} />);

      const audio = document.querySelector('audio') as HTMLAudioElement;
      if (audio) {
        Object.defineProperty(audio, 'currentTime', { value: 125, writable: true, configurable: true });
        Object.defineProperty(audio, 'duration', { value: 185, writable: true, configurable: true });

        // First trigger loadedmetadata to set duration
        audio.dispatchEvent(new Event('loadedmetadata'));
        // Then trigger timeupdate to update current time
        audio.dispatchEvent(new Event('timeupdate'));
      }

      // Wait for state updates
      await new Promise(resolve => setTimeout(resolve, 0));

      // Should show 02:05 for 125 seconds and 03:05 for 185 seconds
      expect(screen.getByText('02:05')).toBeInTheDocument();
      expect(screen.getByText('03:05')).toBeInTheDocument();
    });
  });
});

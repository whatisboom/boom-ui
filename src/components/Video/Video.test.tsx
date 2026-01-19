import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Video } from './Video';

// Helper to get video element
const getVideo = (container: HTMLElement): HTMLVideoElement => {
  const video = container.querySelector('video');
  if (!video) {throw new Error('Video element not found');}
  return video;
};

// Mock HTMLMediaElement methods
beforeEach(() => {
  // Mock play and pause methods
  HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  HTMLMediaElement.prototype.pause = vi.fn();

  // Mock fullscreen API
  HTMLElement.prototype.requestFullscreen = vi.fn().mockResolvedValue(undefined);
  document.exitFullscreen = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(document, 'fullscreenElement', {
    writable: true,
    value: null,
  });

  // Mock picture-in-picture API
  Object.defineProperty(document, 'pictureInPictureEnabled', {
    writable: true,
    value: true,
  });
  Object.defineProperty(document, 'pictureInPictureElement', {
    writable: true,
    value: null,
  });
  HTMLVideoElement.prototype.requestPictureInPicture = vi.fn().mockResolvedValue({});
  document.exitPictureInPicture = vi.fn().mockResolvedValue(undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Video', () => {
  // Basic Rendering Tests
  it('should render video element', () => {
    const { container } = render(<Video src="/test-video.mp4" />);

    const video = getVideo(container);
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', '/test-video.mp4');
  });

  it('should render with poster image', () => {
    const { container } = render(<Video src="/test-video.mp4" poster="/poster.jpg" />);

    const video = getVideo(container);
    expect(video).toHaveAttribute('poster', '/poster.jpg');
  });

  it('should render without controls when controls is false', () => {
    const { container } = render(<Video src="/test-video.mp4" controls={false} />);

    const playButton = container.querySelector('button[aria-label="Play"]');
    expect(playButton).not.toBeInTheDocument();
  });

  it('should render with custom className', () => {
    const { container } = render(<Video src="/test-video.mp4" className="custom-video" />);

    expect(container.querySelector('.custom-video')).toBeInTheDocument();
  });

  // Caption Tests
  it('should render caption tracks', () => {
    const captions = [
      { src: '/en.vtt', label: 'English', language: 'en', default: true },
      { src: '/es.vtt', label: 'Spanish', language: 'es' },
    ];

    const { container } = render(<Video src="/test-video.mp4" captions={captions} />);

    const video = getVideo(container);
    const tracks = video.querySelectorAll('track');
    expect(tracks).toHaveLength(2);
    expect(tracks[0]).toHaveAttribute('src', '/en.vtt');
    expect(tracks[0]).toHaveAttribute('srclang', 'en');
    expect(tracks[1]).toHaveAttribute('src', '/es.vtt');
    expect(tracks[1]).toHaveAttribute('srclang', 'es');
  });

  it('should show caption button when captions are provided', () => {
    const captions = [
      { src: '/en.vtt', label: 'English', language: 'en' },
    ];

    render(<Video src="/test-video.mp4" captions={captions} />);

    expect(screen.getByRole('button', { name: /captions/i })).toBeInTheDocument();
  });

  it('should not show caption button when no captions', () => {
    render(<Video src="/test-video.mp4" />);

    expect(screen.queryByRole('button', { name: /captions/i })).not.toBeInTheDocument();
  });

  it('should toggle caption menu when caption button is clicked', async () => {
    const user = userEvent.setup();
    const captions = [
      { src: '/en.vtt', label: 'English', language: 'en' },
      { src: '/es.vtt', label: 'Spanish', language: 'es' },
    ];

    render(<Video src="/test-video.mp4" captions={captions} />);

    const captionButton = screen.getByRole('button', { name: /captions/i });
    await user.click(captionButton);

    expect(screen.getByRole('menuitem', { name: 'English' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Spanish' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Off' })).toBeInTheDocument();
  });

  // Playback Rate Tests
  it('should show playback rate button when multiple rates provided', () => {
    render(<Video src="/test-video.mp4" playbackRates={[0.5, 1, 1.5, 2]} />);

    expect(screen.getByRole('button', { name: /playback speed/i })).toBeInTheDocument();
  });

  it('should not show playback rate button with single rate', () => {
    render(<Video src="/test-video.mp4" playbackRates={[1]} />);

    expect(screen.queryByRole('button', { name: /playback speed/i })).not.toBeInTheDocument();
  });

  it('should toggle playback rate menu when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Video src="/test-video.mp4" playbackRates={[0.5, 1, 1.5, 2]} />);

    const playbackButton = screen.getByRole('button', { name: /playback speed/i });
    await user.click(playbackButton);

    expect(screen.getByRole('menuitem', { name: '0.5x' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '1x' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '1.5x' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '2x' })).toBeInTheDocument();
  });

  it('should change playback rate when menu item is selected', async () => {
    const user = userEvent.setup();
    const handlePlaybackRateChange = vi.fn();

    const { container } = render(
      <Video
        src="/test-video.mp4"
        playbackRates={[0.5, 1, 1.5, 2]}
        onPlaybackRateChange={handlePlaybackRateChange}
      />
    );

    const playbackButton = screen.getByRole('button', { name: /playback speed/i });
    await user.click(playbackButton);

    const rate1_5 = screen.getByRole('menuitem', { name: '1.5x' });
    await user.click(rate1_5);

    const video = getVideo(container);
    expect(video.playbackRate).toBe(1.5);
    expect(handlePlaybackRateChange).toHaveBeenCalledWith(1.5);
  });

  // Control Buttons Tests
  it('should render play button', () => {
    render(<Video src="/test-video.mp4" />);

    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
  });

  it('should toggle play/pause when play button is clicked', async () => {
    const user = userEvent.setup();
    const handlePlay = vi.fn();
    const handlePause = vi.fn();

    const { container } = render(<Video src="/test-video.mp4" onPlay={handlePlay} onPause={handlePause} />);

    const playButton = screen.getByRole('button', { name: 'Play' });
    await user.click(playButton);

    const video = getVideo(container);
    expect(video.play).toHaveBeenCalled();

    // Simulate play event
    video.dispatchEvent(new Event('play'));
    await waitFor(() => {
      expect(handlePlay).toHaveBeenCalled();
    });
  });

  it('should render volume controls', () => {
    render(<Video src="/test-video.mp4" />);

    expect(screen.getByRole('button', { name: /mute/i })).toBeInTheDocument();
  });

  it('should toggle mute when mute button is clicked', async () => {
    const user = userEvent.setup();
    const handleVolumeChange = vi.fn();

    const { container } = render(<Video src="/test-video.mp4" onVolumeChange={handleVolumeChange} />);

    const muteButton = screen.getByRole('button', { name: /mute/i });
    await user.click(muteButton);

    const video = getVideo(container);
    expect(video.muted).toBe(true);
  });

  it('should render fullscreen button', () => {
    render(<Video src="/test-video.mp4" />);

    expect(screen.getByRole('button', { name: /fullscreen/i })).toBeInTheDocument();
  });

  it('should request fullscreen when fullscreen button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<Video src="/test-video.mp4" />);

    const fullscreenButton = screen.getByRole('button', { name: /fullscreen/i });
    await user.click(fullscreenButton);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.requestFullscreen).toHaveBeenCalled();
  });

  it('should show picture-in-picture button when supported', () => {
    render(<Video src="/test-video.mp4" />);

    expect(screen.getByRole('button', { name: /picture-in-picture/i })).toBeInTheDocument();
  });

  it('should not show picture-in-picture button when not supported', () => {
    Object.defineProperty(document, 'pictureInPictureEnabled', {
      writable: true,
      value: false,
    });

    render(<Video src="/test-video.mp4" />);

    expect(screen.queryByRole('button', { name: /picture-in-picture/i })).not.toBeInTheDocument();
  });

  // Keyboard Shortcuts Tests
  it('should play/pause on Space key', async () => {
    const user = userEvent.setup();
    const { container } = render(<Video src="/test-video.mp4" />);

    const video = getVideo(container);

    await user.keyboard(' ');
    expect(video.play).toHaveBeenCalled();
  });

  it('should play/pause on k key', async () => {
    const user = userEvent.setup();
    const { container } = render(<Video src="/test-video.mp4" />);

    const video = getVideo(container);

    await user.keyboard('k');
    expect(video.play).toHaveBeenCalled();
  });

  it('should mute/unmute on m key', async () => {
    const user = userEvent.setup();
    const { container } = render(<Video src="/test-video.mp4" />);

    const video = getVideo(container);

    await user.keyboard('m');
    expect(video.muted).toBe(true);

    await user.keyboard('m');
    expect(video.muted).toBe(false);
  });

  it('should toggle fullscreen on f key', async () => {
    const user = userEvent.setup();
    const { container } = render(<Video src="/test-video.mp4" />);

    await user.keyboard('f');

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.requestFullscreen).toHaveBeenCalled();
  });

  // Video Event Tests
  it('should call onEnded when video ends', async () => {
    const handleEnded = vi.fn();
    const { container } = render(<Video src="/test-video.mp4" onEnded={handleEnded} />);

    const video = getVideo(container);
    video.dispatchEvent(new Event('ended'));

    await waitFor(() => {
      expect(handleEnded).toHaveBeenCalled();
    });
  });

  it('should call onTimeUpdate when time updates', async () => {
    const handleTimeUpdate = vi.fn();
    const { container } = render(<Video src="/test-video.mp4" onTimeUpdate={handleTimeUpdate} />);

    const video = getVideo(container);
    Object.defineProperty(video, 'currentTime', { value: 5, writable: true });
    video.dispatchEvent(new Event('timeupdate'));

    await waitFor(() => {
      expect(handleTimeUpdate).toHaveBeenCalledWith(5);
    });
  });

  // HTML Attributes Tests
  it('should support autoPlay prop', () => {
    const { container } = render(<Video src="/test-video.mp4" autoPlay />);

    const video = getVideo(container);
    expect(video).toHaveAttribute('autoplay');
  });

  it('should support loop prop', () => {
    const { container } = render(<Video src="/test-video.mp4" loop />);

    const video = getVideo(container);
    expect(video).toHaveAttribute('loop');
  });

  it('should support muted prop', () => {
    const { container } = render(<Video src="/test-video.mp4" muted />);

    const video = getVideo(container);
    expect(video.muted).toBe(true);
  });

  it('should support preload prop', () => {
    const { container } = render(<Video src="/test-video.mp4" preload="auto" />);

    const video = getVideo(container);
    expect(video).toHaveAttribute('preload', 'auto');
  });

  // forwardRef Tests
  it('should forward ref to video element', () => {
    const ref = vi.fn();
    render(<Video ref={ref} src="/test-video.mp4" />);

    expect(ref).toHaveBeenCalled();
    const videoElement = ref.mock.calls[0][0];
    expect(videoElement).toBeInstanceOf(HTMLVideoElement);
  });

  // Accessibility Tests
  it('should have no accessibility violations', async () => {
    const { container } = render(<Video src="/test-video.mp4" />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations with captions', async () => {
    const captions = [
      { src: '/en.vtt', label: 'English', language: 'en' },
      { src: '/es.vtt', label: 'Spanish', language: 'es' },
    ];

    const { container } = render(<Video src="/test-video.mp4" captions={captions} />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations with all controls', async () => {
    const captions = [
      { src: '/en.vtt', label: 'English', language: 'en' },
    ];

    const { container } = render(
      <Video
        src="/test-video.mp4"
        poster="/poster.jpg"
        captions={captions}
        playbackRates={[0.5, 1, 1.5, 2]}
      />
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

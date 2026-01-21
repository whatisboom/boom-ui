import type { VideoHTMLAttributes } from 'react';

/**
 * Caption/subtitle track
 */
export interface VideoCaption {
  /** Source URL for the WebVTT file */
  src: string;

  /** Label shown in caption selector */
  label: string;

  /** Language code (e.g., 'en', 'es') */
  language: string;

  /** Whether this is the default track */
  default?: boolean;
}

/**
 * Playback rate option
 */
export type PlaybackRate = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;

/**
 * Video player props
 */
export interface VideoProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'controls' | 'onVolumeChange'> {
  /** Video source URL */
  src: string;

  /** Poster image URL */
  poster?: string;

  /** Show custom controls */
  controls?: boolean;

  /** Caption tracks */
  captions?: VideoCaption[];

  /** Available playback rates */
  playbackRates?: PlaybackRate[];

  /** Initial playback rate */
  defaultPlaybackRate?: PlaybackRate;

  /** Autoplay video (muted by default for autoplay) */
  autoPlay?: boolean;

  /** Loop video */
  loop?: boolean;

  /** Mute video */
  muted?: boolean;

  /** Preload strategy */
  preload?: 'none' | 'metadata' | 'auto';

  /** Custom className */
  className?: string;

  /** Callback when video ends */
  onEnded?: () => void;

  /** Callback when video plays */
  onPlay?: () => void;

  /** Callback when video pauses */
  onPause?: () => void;

  /** Callback when time updates (custom handler, use onTimeUpdateCapture for native event) */
  onVideoTimeUpdate?: (currentTime: number) => void;

  /** Callback when volume changes */
  onVolumeChange?: (volume: number, muted: boolean) => void;

  /** Callback when playback rate changes */
  onPlaybackRateChange?: (rate: PlaybackRate) => void;

  /** Delay in milliseconds before hiding volume slider after mouse leaves (default: 500) */
  volumeSliderDelay?: number;
}

/**
 * Video controls props (internal component)
 */
export interface VideoControlsProps {
  /** Video element ref */
  videoRef: React.RefObject<HTMLVideoElement | null>;

  /** Whether video is playing */
  isPlaying: boolean;

  /** Current time in seconds */
  currentTime: number;

  /** Duration in seconds */
  duration: number;

  /** Volume (0-1) */
  volume: number;

  /** Whether video is muted */
  isMuted: boolean;

  /** Current playback rate */
  playbackRate: PlaybackRate;

  /** Available playback rates */
  playbackRates: PlaybackRate[];

  /** Caption tracks */
  captions: VideoCaption[];

  /** Active caption track index (-1 for none) */
  activeCaptionIndex: number;

  /** Whether video is in fullscreen */
  isFullscreen: boolean;

  /** Whether video is in picture-in-picture */
  isPictureInPicture: boolean;

  /** Play/pause handler */
  onPlayPause: () => void;

  /** Seek handler */
  onSeek: (time: number) => void;

  /** Volume change handler */
  onVolumeChange: (volume: number) => void;

  /** Mute toggle handler */
  onMuteToggle: () => void;

  /** Playback rate change handler */
  onPlaybackRateChange: (rate: PlaybackRate) => void;

  /** Caption track change handler */
  onCaptionChange: (index: number) => void;

  /** Fullscreen toggle handler */
  onFullscreenToggle: () => void;

  /** Picture-in-picture toggle handler */
  onPictureInPictureToggle: () => void;

  /** Delay in milliseconds before hiding volume slider after mouse leaves */
  volumeSliderDelay: number;
}

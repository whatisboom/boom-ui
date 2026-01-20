import type { Size } from '@/types';

export interface AudioTrack {
  /** Audio source URL */
  src: string;

  /** Track title */
  title?: string;

  /** Track artist */
  artist?: string;

  /** Track duration in seconds (optional, will be auto-detected) */
  duration?: number;
}

export interface AudioBaseProps {
  /** Size variant */
  size?: Size;

  /** Show waveform visualization */
  showWaveform?: boolean;

  /** Available playback speed options */
  playbackRates?: number[];

  /** Show playlist controls */
  showPlaylist?: boolean;

  /** Auto-play on mount */
  autoPlay?: boolean;

  /** Loop playback */
  loop?: boolean;

  /** Muted state */
  muted?: boolean;

  /** Initial volume (0-1) */
  volume?: number;

  /** Disable animation */
  disableAnimation?: boolean;

  /** Custom className */
  className?: string;

  /** On play callback */
  onPlay?: () => void;

  /** On pause callback */
  onPause?: () => void;

  /** On ended callback */
  onEnded?: () => void;

  /** On volume change callback */
  onVolumeChange?: (volume: number) => void;

  /** On time update callback */
  onTimeUpdate?: (currentTime: number) => void;

  /** On track change callback (for playlists) */
  onTrackChange?: (trackIndex: number) => void;

  /** ARIA label */
  'aria-label'?: string;
}

export interface SingleAudioProps extends AudioBaseProps {
  /** Single audio source URL */
  src: string;

  /** Audio title */
  title?: string;

  /** Audio artist */
  artist?: string;

  /** Playlist is not provided for single mode */
  playlist?: never;
}

export interface PlaylistAudioProps extends AudioBaseProps {
  /** Playlist of audio tracks */
  playlist: AudioTrack[];

  /** Single src is not provided for playlist mode */
  src?: never;

  /** Title is not provided for playlist mode (use track.title) */
  title?: never;

  /** Artist is not provided for playlist mode (use track.artist) */
  artist?: never;
}

export type AudioProps = SingleAudioProps | PlaylistAudioProps;

export interface AudioControlsProps {
  /** Is audio playing */
  isPlaying: boolean;

  /** Is audio muted */
  isMuted: boolean;

  /** Current time in seconds */
  currentTime: number;

  /** Total duration in seconds */
  duration: number;

  /** Current volume (0-1) */
  volume: number;

  /** Current playback rate */
  playbackRate: number;

  /** Available playback rates */
  playbackRates: number[];

  /** Is loop enabled */
  isLoop: boolean;

  /** Size variant */
  size: Size;

  /** Play/pause handler */
  onPlayPause: () => void;

  /** Mute/unmute handler */
  onMuteToggle: () => void;

  /** Volume change handler */
  onVolumeChange: (volume: number) => void;

  /** Seek handler */
  onSeek: (time: number) => void;

  /** Playback rate change handler */
  onPlaybackRateChange: (rate: number) => void;

  /** Loop toggle handler */
  onLoopToggle: () => void;

  /** Skip to previous track (for playlists) */
  onPrevious?: () => void;

  /** Skip to next track (for playlists) */
  onNext?: () => void;

  /** Has previous track */
  hasPrevious?: boolean;

  /** Has next track */
  hasNext?: boolean;
}

export interface AudioWaveformProps {
  /** Audio element reference */
  audioRef: HTMLAudioElement | null;

  /** Current time in seconds */
  currentTime: number;

  /** Total duration in seconds */
  duration: number;

  /** Seek handler */
  onSeek: (time: number) => void;

  /** Size variant */
  size: Size;
}

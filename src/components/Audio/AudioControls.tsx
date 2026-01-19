import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/classnames';
import { Slider } from '@/components/Slider';
import type { AudioControlsProps } from './Audio.types';
import { formatTime } from './Audio.utils';
import styles from './Audio.module.css';

// Icon components (simple SVG icons)
const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
);

const VolumeIcon = ({ muted }: { muted: boolean }) => {
  if (muted) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
    </svg>
  );
};

const PreviousIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
  </svg>
);

const NextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
);

export const AudioControls = ({
  isPlaying,
  isMuted,
  currentTime,
  duration,
  volume,
  playbackRate,
  playbackRates,
  size,
  onPlayPause,
  onMuteToggle,
  onVolumeChange,
  onSeek,
  onPlaybackRateChange,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: AudioControlsProps) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showPlaybackRateMenu, setShowPlaybackRateMenu] = useState(false);
  const volumeRef = useRef<HTMLDivElement>(null);
  const playbackRateRef = useRef<HTMLDivElement>(null);

  // Close volume slider when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(e.target as Node)) {
        setShowVolumeSlider(false);
      }
      if (playbackRateRef.current && !playbackRateRef.current.contains(e.target as Node)) {
        setShowPlaybackRateMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={cn(styles.controls, styles[size])}>
      {/* Time display */}
      <div className={styles.timeDisplay}>
        <span className={styles.currentTime}>{formatTime(currentTime)}</span>
        <span className={styles.timeSeparator}>/</span>
        <span className={styles.totalTime}>{formatTime(duration)}</span>
      </div>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <Slider
          mode="single"
          value={currentTime}
          onChange={onSeek}
          min={0}
          max={duration || 100}
          step={0.1}
          size={size}
          aria-label="Seek"
        />
      </div>

      {/* Control buttons */}
      <div className={styles.buttonGroup}>
        {/* Previous track (playlist mode) */}
        {onPrevious && (
          <button
            type="button"
            className={cn(styles.controlButton, !hasPrevious && styles.disabled)}
            onClick={onPrevious}
            disabled={!hasPrevious}
            aria-label="Previous track"
          >
            <PreviousIcon />
          </button>
        )}

        {/* Play/Pause */}
        <button
          type="button"
          className={cn(styles.controlButton, styles.playPauseButton)}
          onClick={onPlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        {/* Next track (playlist mode) */}
        {onNext && (
          <button
            type="button"
            className={cn(styles.controlButton, !hasNext && styles.disabled)}
            onClick={onNext}
            disabled={!hasNext}
            aria-label="Next track"
          >
            <NextIcon />
          </button>
        )}

        {/* Volume control */}
        <div className={styles.volumeControl} ref={volumeRef}>
          <button
            type="button"
            className={styles.controlButton}
            onClick={onMuteToggle}
            onMouseEnter={() => setShowVolumeSlider(true)}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            <VolumeIcon muted={isMuted} />
          </button>

          {showVolumeSlider && (
            <div className={styles.volumeSlider}>
              <Slider
                mode="single"
                value={isMuted ? 0 : volume}
                onChange={onVolumeChange}
                min={0}
                max={1}
                step={0.01}
                size="sm"
                aria-label="Volume"
              />
            </div>
          )}
        </div>

        {/* Playback rate */}
        <div className={styles.playbackRateControl} ref={playbackRateRef}>
          <button
            type="button"
            className={styles.controlButton}
            onClick={() => setShowPlaybackRateMenu(prev => !prev)}
            aria-label="Playback speed"
            aria-expanded={showPlaybackRateMenu}
          >
            <span className={styles.playbackRateLabel}>{playbackRate}x</span>
          </button>

          {showPlaybackRateMenu && (
            <div className={styles.playbackRateMenu} role="menu">
              {playbackRates.map(rate => (
                <button
                  key={rate}
                  type="button"
                  className={cn(
                    styles.playbackRateOption,
                    rate === playbackRate && styles.active
                  )}
                  onClick={() => {
                    onPlaybackRateChange(rate);
                    setShowPlaybackRateMenu(false);
                  }}
                  role="menuitem"
                  aria-label={`${rate}x speed`}
                  aria-current={rate === playbackRate ? 'true' : undefined}
                >
                  {rate}x
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

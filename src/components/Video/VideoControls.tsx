import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/classnames';
import { Slider } from '@/components/Slider';
import type { VideoControlsProps, PlaybackRate } from './Video.types';
import styles from './Video.module.css';

// Icons
const PlayIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
);

const VolumeUpIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);

const VolumeOffIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
  </svg>
);

const SettingsIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);

const CaptionsIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z" />
  </svg>
);

const FullscreenIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
  </svg>
);

const FullscreenExitIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
  </svg>
);

const PictureInPictureIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z" />
  </svg>
);

const CheckIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

// Format time in MM:SS or HH:MM:SS
const formatTime = (seconds: number): string => {
  if (!isFinite(seconds)) {return '0:00';}

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const VideoControls = ({
  videoRef,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  playbackRate,
  playbackRates,
  captions,
  activeCaptionIndex,
  isFullscreen,
  isPictureInPicture,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onPlaybackRateChange,
  onCaptionChange,
  onFullscreenToggle,
  onPictureInPictureToggle,
}: VideoControlsProps) => {
  const [showPlaybackRateMenu, setShowPlaybackRateMenu] = useState(false);
  const [showCaptionMenu, setShowCaptionMenu] = useState(false);
  const playbackRateRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        playbackRateRef.current &&
        !playbackRateRef.current.contains(event.target as Node)
      ) {
        setShowPlaybackRateMenu(false);
      }
      if (
        captionRef.current &&
        !captionRef.current.contains(event.target as Node)
      ) {
        setShowCaptionMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSeek = (value: number) => {
    onSeek(value);
  };

  const handleVolumeChange = (value: number) => {
    onVolumeChange(value / 100);
  };

  const handlePlaybackRateSelect = (rate: PlaybackRate) => {
    onPlaybackRateChange(rate);
    setShowPlaybackRateMenu(false);
  };

  const handleCaptionSelect = (index: number) => {
    onCaptionChange(index);
    setShowCaptionMenu(false);
  };

  return (
    <div className={cn(styles.controls, !isPlaying && styles.visible)}>
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <Slider
          value={currentTime}
          onChange={handleSeek}
          min={0}
          max={duration || 0}
          step={0.1}
          size="sm"
          formatValue={(val) => formatTime(val)}
          aria-label="Video progress"
        />
      </div>

      {/* Controls row */}
      <div className={styles.controlsRow}>
        {/* Left controls */}
        <div className={styles.leftControls}>
          {/* Play/Pause */}
          <button
            type="button"
            className={cn(styles.controlButton, styles.playButton)}
            onClick={onPlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          {/* Volume */}
          <div className={styles.volumeControl}>
            <button
              type="button"
              className={styles.controlButton}
              onClick={onMuteToggle}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </button>

            <div className={styles.volumeSliderWrapper}>
              <Slider
                value={isMuted ? 0 : volume * 100}
                onChange={handleVolumeChange}
                min={0}
                max={100}
                step={1}
                size="sm"
                aria-label="Volume"
              />
            </div>
          </div>

          {/* Time display */}
          <div className={styles.timeDisplay}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Right controls */}
        <div className={styles.rightControls}>
          {/* Captions */}
          {captions.length > 0 && (
            <div
              ref={captionRef}
              className={cn(styles.dropdown, showCaptionMenu && styles.open)}
            >
              <button
                type="button"
                className={styles.controlButton}
                onClick={() => setShowCaptionMenu(!showCaptionMenu)}
                aria-label="Captions"
                aria-expanded={showCaptionMenu}
              >
                <CaptionsIcon />
              </button>

              <div className={styles.dropdownMenu} role="menu">
                <button
                  type="button"
                  className={cn(
                    styles.dropdownItem,
                    activeCaptionIndex === -1 && styles.active
                  )}
                  onClick={() => handleCaptionSelect(-1)}
                  role="menuitem"
                >
                  Off
                  <span className={styles.dropdownCheckmark}>
                    <CheckIcon />
                  </span>
                </button>
                {captions.map((caption, index) => (
                  <button
                    key={index}
                    type="button"
                    className={cn(
                      styles.dropdownItem,
                      activeCaptionIndex === index && styles.active
                    )}
                    onClick={() => handleCaptionSelect(index)}
                    role="menuitem"
                  >
                    {caption.label}
                    <span className={styles.dropdownCheckmark}>
                      <CheckIcon />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Playback rate */}
          {playbackRates.length > 1 && (
            <div
              ref={playbackRateRef}
              className={cn(styles.dropdown, showPlaybackRateMenu && styles.open)}
            >
              <button
                type="button"
                className={styles.controlButton}
                onClick={() => setShowPlaybackRateMenu(!showPlaybackRateMenu)}
                aria-label="Playback speed"
                aria-expanded={showPlaybackRateMenu}
              >
                <SettingsIcon />
              </button>

              <div className={styles.dropdownMenu} role="menu">
                {playbackRates.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    className={cn(
                      styles.dropdownItem,
                      playbackRate === rate && styles.active
                    )}
                    onClick={() => handlePlaybackRateSelect(rate)}
                    role="menuitem"
                  >
                    {rate}x
                    <span className={styles.dropdownCheckmark}>
                      <CheckIcon />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Picture-in-Picture */}
          {document.pictureInPictureEnabled && (
            <button
              type="button"
              className={styles.controlButton}
              onClick={onPictureInPictureToggle}
              aria-label={isPictureInPicture ? 'Exit picture-in-picture' : 'Picture-in-picture'}
            >
              <PictureInPictureIcon />
            </button>
          )}

          {/* Fullscreen */}
          <button
            type="button"
            className={styles.controlButton}
            onClick={onFullscreenToggle}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};

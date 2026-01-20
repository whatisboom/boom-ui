import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/utils/classnames';
import { VideoControls } from './VideoControls';
import type { VideoProps, PlaybackRate } from './Video.types';
import styles from './Video.module.css';

const PlayIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const Video = forwardRef<HTMLVideoElement, VideoProps>(
  (props, ref) => {
    const {
      src,
      poster,
      controls = true,
      captions = [],
      playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2],
      defaultPlaybackRate = 1,
      autoPlay = false,
      loop = false,
      muted = false,
      preload = 'metadata',
      volumeSliderDelay = 500,
      className,
      onEnded,
      onPlay,
      onPause,
      onVideoTimeUpdate,
      onVolumeChange,
      onPlaybackRateChange,
      ...videoProps
    } = props;

    // Internal video ref
    const internalRef = useRef<HTMLVideoElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Merge forwarded ref with internal ref
    useEffect(() => {
      if (!ref) {return;}

      if (typeof ref === 'function') {
        ref(internalRef.current);
      } else {
        ref.current = internalRef.current;
      }
    }, [ref]);

    // Video state
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(muted);
    const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(defaultPlaybackRate);
    const [activeCaptionIndex, setActiveCaptionIndex] = useState(() => {
      const defaultIndex = captions.findIndex((c) => c.default);
      return defaultIndex !== -1 ? defaultIndex : -1;
    });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPictureInPicture, setIsPictureInPicture] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Play/Pause handler
    const handlePlayPause = useCallback(() => {
      if (!internalRef.current) {return;}

      if (isPlaying) {
        internalRef.current.pause();
      } else {
        void internalRef.current.play();
      }
    }, [isPlaying, internalRef]);

    // Seek handler
    const handleSeek = useCallback((time: number) => {
      if (!internalRef.current) {return;}
      internalRef.current.currentTime = time;
      setCurrentTime(time);
    }, [internalRef]);

    // Volume change handler
    const handleVolumeChange = useCallback((newVolume: number) => {
      if (!internalRef.current) {return;}
      internalRef.current.volume = newVolume;
      setVolume(newVolume);

      if (newVolume > 0 && isMuted) {
        internalRef.current.muted = false;
        setIsMuted(false);
      }
    }, [isMuted, internalRef]);

    // Mute toggle handler
    const handleMuteToggle = useCallback(() => {
      if (!internalRef.current) {return;}
      const newMuted = !isMuted;
      internalRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }, [isMuted, internalRef]);

    // Playback rate change handler
    const handlePlaybackRateChange = useCallback((rate: PlaybackRate) => {
      if (!internalRef.current) {return;}
      internalRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      onPlaybackRateChange?.(rate);
    }, [onPlaybackRateChange, internalRef]);

    // Caption change handler
    const handleCaptionChange = useCallback((index: number) => {
      if (!internalRef.current) {return;}

      const tracks = internalRef.current.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].mode = i === index ? 'showing' : 'hidden';
      }

      setActiveCaptionIndex(index);
    }, [internalRef]);

    // Fullscreen toggle handler
    const handleFullscreenToggle = useCallback(() => {
      if (!wrapperRef.current) {return;}

      if (!document.fullscreenElement) {
        void wrapperRef.current.requestFullscreen();
      } else {
        void document.exitFullscreen();
      }
    }, []);

    // Picture-in-Picture toggle handler
    const handlePictureInPictureToggle = useCallback(() => {
      if (!internalRef.current) {return;}

      const video = internalRef.current;

      const togglePiP = async () => {
        try {
          if (!document.pictureInPictureElement) {
            await video.requestPictureInPicture();
          } else {
            await document.exitPictureInPicture();
          }
        } catch (error) {
          // PiP request failed - silently ignore
          console.warn('Picture-in-Picture request failed:', error);
        }
      };

      void togglePiP();
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!internalRef.current) {return;}

        // Don't handle if user is typing in an input
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          return;
        }

        switch (e.key) {
          case ' ':
          case 'k':
            e.preventDefault();
            handlePlayPause();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            handleSeek(Math.max(0, currentTime - 5));
            break;
          case 'ArrowRight':
            e.preventDefault();
            handleSeek(Math.min(duration, currentTime + 5));
            break;
          case 'ArrowUp':
            e.preventDefault();
            handleVolumeChange(Math.min(1, volume + 0.1));
            break;
          case 'ArrowDown':
            e.preventDefault();
            handleVolumeChange(Math.max(0, volume - 0.1));
            break;
          case 'f':
            e.preventDefault();
            handleFullscreenToggle();
            break;
          case 'm':
            e.preventDefault();
            handleMuteToggle();
            break;
          case '0':
          case 'Home':
            e.preventDefault();
            handleSeek(0);
            break;
          case 'End':
            e.preventDefault();
            handleSeek(duration);
            break;
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [
      currentTime,
      duration,
      volume,
      handlePlayPause,
      handleSeek,
      handleVolumeChange,
      handleMuteToggle,
      handleFullscreenToggle,
      internalRef,
    ]);

    // Video event listeners
    useEffect(() => {
      const video = internalRef.current;
      if (!video) {return;}

      const handlePlay = () => {
        setIsPlaying(true);
        setIsLoading(false);
        onPlay?.();
      };

      const handlePauseEvent = () => {
        setIsPlaying(false);
        onPause?.();
      };

      const handleTimeUpdateEvent = () => {
        setCurrentTime(video.currentTime);
        onVideoTimeUpdate?.(video.currentTime);
      };

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
        setIsLoading(false);
      };

      const handleVolumeChangeEvent = () => {
        setVolume(video.volume);
        setIsMuted(video.muted);
        onVolumeChange?.(video.volume, video.muted);
      };

      const handleEndedEvent = () => {
        setIsPlaying(false);
        onEnded?.();
      };

      const handleWaiting = () => {
        setIsLoading(true);
      };

      const handleCanPlay = () => {
        setIsLoading(false);
      };

      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePauseEvent);
      video.addEventListener('timeupdate', handleTimeUpdateEvent);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('volumechange', handleVolumeChangeEvent);
      video.addEventListener('ended', handleEndedEvent);
      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('canplay', handleCanPlay);

      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePauseEvent);
        video.removeEventListener('timeupdate', handleTimeUpdateEvent);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('volumechange', handleVolumeChangeEvent);
        video.removeEventListener('ended', handleEndedEvent);
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('canplay', handleCanPlay);
      };
    }, [onEnded, onPlay, onPause, onVideoTimeUpdate, onVolumeChange, internalRef]);

    // Fullscreen change listener
    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    }, []);

    // Picture-in-Picture change listener
    useEffect(() => {
      const video = internalRef.current;
      if (!video) {return;}

      const handleEnterPiP = () => {
        setIsPictureInPicture(true);
      };

      const handleLeavePiP = () => {
        setIsPictureInPicture(false);
      };

      video.addEventListener('enterpictureinpicture', handleEnterPiP);
      video.addEventListener('leavepictureinpicture', handleLeavePiP);

      return () => {
        video.removeEventListener('enterpictureinpicture', handleEnterPiP);
        video.removeEventListener('leavepictureinpicture', handleLeavePiP);
      };
    }, [internalRef]);

    return (
      <div
        ref={wrapperRef}
        className={cn(
          styles.videoWrapper,
          isFullscreen && styles.fullscreen,
          className
        )}
      >
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={internalRef}
          className={styles.video}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          preload={preload}
          playsInline
          {...videoProps}
        >
          {captions.length > 0 ? (
            captions.map((caption, index) => (
              <track
                key={index}
                kind="subtitles"
                src={caption.src}
                srcLang={caption.language}
                label={caption.label}
                default={caption.default}
              />
            ))
          ) : (
            <track kind="captions" />
          )}
        </video>

        {/* Loading indicator */}
        {isLoading && (
          <div className={styles.loading} role="status" aria-live="polite" aria-label="Loading video">
            <div className={styles.spinner} />
          </div>
        )}

        {/* Play overlay */}
        <div
          className={cn(styles.playOverlay, !isPlaying && styles.paused)}
          onClick={handlePlayPause}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handlePlayPause();
            }
          }}
          role="button"
          tabIndex={-1}
          aria-label="Play video"
        >
          {!isPlaying && !isLoading && (
            <div className={styles.playOverlayButton}>
              <PlayIcon />
            </div>
          )}
        </div>

        {/* Custom controls */}
        {controls && (
          <VideoControls
            videoRef={internalRef}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            playbackRate={playbackRate}
            playbackRates={playbackRates}
            captions={captions}
            activeCaptionIndex={activeCaptionIndex}
            isFullscreen={isFullscreen}
            isPictureInPicture={isPictureInPicture}
            volumeSliderDelay={volumeSliderDelay}
            onPlayPause={handlePlayPause}
            onSeek={handleSeek}
            onVolumeChange={handleVolumeChange}
            onMuteToggle={handleMuteToggle}
            onPlaybackRateChange={handlePlaybackRateChange}
            onCaptionChange={handleCaptionChange}
            onFullscreenToggle={handleFullscreenToggle}
            onPictureInPictureToggle={handlePictureInPictureToggle}
          />
        )}
      </div>
    );
  }
);

Video.displayName = 'Video';

import { forwardRef, useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/utils/classnames';
import type { AudioProps, AudioTrack } from './Audio.types';
import { AudioControls } from './AudioControls';
import { AudioWaveform } from './AudioWaveform';
import { formatTime } from './Audio.utils';
import styles from './Audio.module.css';

export const Audio = forwardRef<HTMLAudioElement, AudioProps>(
  (props, ref) => {
    const {
      size = 'md',
      showWaveform = false,
      playbackRates = [0.5, 1, 1.5, 2],
      showPlaylist = false,
      autoPlay = false,
      loop = false,
      muted = false,
      volume: initialVolume = 1,
      className,
      onPlay,
      onPause,
      onEnded,
      onVolumeChange,
      onTimeUpdate,
      onTrackChange,
      'aria-label': ariaLabel,
    } = props;

    // Determine if we're in playlist mode
    const isPlaylistMode = 'playlist' in props && props.playlist !== undefined;
    const playlist = isPlaylistMode ? props.playlist : [];
    const singleTrack: AudioTrack | null = !isPlaylistMode
      ? {
          src: props.src,
          title: props.title,
          artist: props.artist,
        }
      : null;

    // State
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(muted);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(initialVolume);
    const [playbackRate, setPlaybackRate] = useState(1);

    // Refs
    const audioRef = useRef<HTMLAudioElement>(null);
    const internalRef = ref || audioRef;

    // Get current track
    const currentTrack = isPlaylistMode ? playlist[currentTrackIndex] : singleTrack;

    // Update audio element properties
    useEffect(() => {
      const audio = typeof internalRef === 'function' ? null : internalRef.current;
      if (!audio) {return;}

      audio.volume = volume;
      audio.muted = isMuted;
      audio.playbackRate = playbackRate;
    }, [volume, isMuted, playbackRate, internalRef]);

    // Audio event handlers
    const handlePlay = useCallback(() => {
      setIsPlaying(true);
      onPlay?.();
    }, [onPlay]);

    const handlePause = useCallback(() => {
      setIsPlaying(false);
      onPause?.();
    }, [onPause]);

    const handleTimeUpdate = useCallback(() => {
      const audio = typeof internalRef === 'function' ? null : internalRef.current;
      if (!audio) {return;}

      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime);
    }, [internalRef, onTimeUpdate]);

    const handleLoadedMetadata = useCallback(() => {
      const audio = typeof internalRef === 'function' ? null : internalRef.current;
      if (!audio) {return;}

      setDuration(audio.duration);
    }, [internalRef]);

    const handleEnded = useCallback(() => {
      setIsPlaying(false);

      // If in playlist mode and there's a next track, play it
      if (isPlaylistMode && currentTrackIndex < playlist.length - 1) {
        const nextIndex = currentTrackIndex + 1;
        setCurrentTrackIndex(nextIndex);
        onTrackChange?.(nextIndex);

        // Auto-play next track
        setTimeout(() => {
          const audio = typeof internalRef === 'function' ? null : internalRef.current;
          if (audio) {
            audio.play().catch(() => {
              // Playback failed, user interaction may be required
            });
          }
        }, 0);
      }

      onEnded?.();
    }, [isPlaylistMode, currentTrackIndex, playlist.length, onTrackChange, onEnded, internalRef]);

    // Control handlers
    const handlePlayPause = useCallback(() => {
      const audio = typeof internalRef === 'function' ? null : internalRef.current;
      if (!audio) {return;}

      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(() => {
          // Playback failed, might need user interaction
          setIsPlaying(false);
        });
      }
    }, [isPlaying, internalRef]);

    const handleMuteToggle = useCallback(() => {
      setIsMuted(prev => !prev);
    }, []);

    const handleVolumeChange = useCallback((newVolume: number) => {
      setVolume(newVolume);
      onVolumeChange?.(newVolume);

      // Unmute if volume is changed from 0
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
      }
    }, [isMuted, onVolumeChange]);

    const handleSeek = useCallback((time: number) => {
      const audio = typeof internalRef === 'function' ? null : internalRef.current;
      if (!audio) {return;}

      // eslint-disable-next-line react-hooks/immutability
      audio.currentTime = time;
      setCurrentTime(time);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePlaybackRateChange = useCallback((rate: number) => {
      setPlaybackRate(rate);
    }, []);

    const handlePrevious = useCallback(() => {
      if (!isPlaylistMode || currentTrackIndex === 0) {return;}

      const prevIndex = currentTrackIndex - 1;
      setCurrentTrackIndex(prevIndex);
      onTrackChange?.(prevIndex);
      setCurrentTime(0);
    }, [isPlaylistMode, currentTrackIndex, onTrackChange]);

    const handleNext = useCallback(() => {
      if (!isPlaylistMode || currentTrackIndex >= playlist.length - 1) {return;}

      const nextIndex = currentTrackIndex + 1;
      setCurrentTrackIndex(nextIndex);
      onTrackChange?.(nextIndex);
      setCurrentTime(0);
    }, [isPlaylistMode, currentTrackIndex, playlist.length, onTrackChange]);

    // Keyboard shortcuts
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Only handle if audio is focused or if target is not an input element
        const target = e.target as HTMLElement;
        const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
        if (isInput) {return;}

        const audio = typeof internalRef === 'function' ? null : internalRef.current;
        if (!audio) {return;}

        switch (e.key) {
          case ' ':
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
          case 'm':
          case 'M':
            e.preventDefault();
            handleMuteToggle();
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [handlePlayPause, handleSeek, handleMuteToggle, currentTime, duration]); // eslint-disable-line react-hooks/exhaustive-deps

    // Determine ARIA label
    const label = ariaLabel ||
      (currentTrack?.title ? `Audio player - ${currentTrack.title}` : 'Audio player');

    return (
      <div className={cn(styles.wrapper, className)} role="group" aria-label={label}>
        {/* Hidden native audio element */}
        <audio
          ref={internalRef as React.RefObject<HTMLAudioElement>}
          src={currentTrack?.src}
          autoPlay={autoPlay}
          loop={loop && !isPlaylistMode} // Disable loop in playlist mode
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        >
          <track kind="captions" />
        </audio>

        {/* Track info */}
        {currentTrack && (currentTrack.title || currentTrack.artist) && (
          <div className={styles.trackInfo}>
            {currentTrack.title && (
              <div className={styles.trackTitle}>{currentTrack.title}</div>
            )}
            {currentTrack.artist && (
              <div className={styles.trackArtist}>{currentTrack.artist}</div>
            )}
          </div>
        )}

        {/* Waveform visualization (optional) */}
        {showWaveform && (
          <AudioWaveform
            audioRef={typeof internalRef === 'function' ? null : internalRef.current}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            size={size}
          />
        )}

        {/* Audio controls */}
        <AudioControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          playbackRate={playbackRate}
          playbackRates={playbackRates}
          size={size}
          onPlayPause={handlePlayPause}
          onMuteToggle={handleMuteToggle}
          onVolumeChange={handleVolumeChange}
          onSeek={handleSeek}
          onPlaybackRateChange={handlePlaybackRateChange}
          onPrevious={isPlaylistMode ? handlePrevious : undefined}
          onNext={isPlaylistMode ? handleNext : undefined}
          hasPrevious={isPlaylistMode && currentTrackIndex > 0}
          hasNext={isPlaylistMode && currentTrackIndex < playlist.length - 1}
        />

        {/* Playlist (optional) */}
        {showPlaylist && isPlaylistMode && (
          <div className={styles.playlist}>
            <div className={styles.playlistTitle}>Playlist</div>
            <ul className={styles.playlistItems}>
              {playlist.map((track, index) => (
                <li
                  key={`${track.src}-${index}`}
                  className={cn(
                    styles.playlistItem,
                    index === currentTrackIndex && styles.active
                  )}
                >
                  <button
                    type="button"
                    className={styles.playlistButton}
                    onClick={() => {
                      setCurrentTrackIndex(index);
                      onTrackChange?.(index);
                      setCurrentTime(0);
                    }}
                    aria-label={`Play ${track.title || `track ${index + 1}`}`}
                    aria-current={index === currentTrackIndex ? 'true' : undefined}
                  >
                    <span className={styles.playlistIndex}>{index + 1}</span>
                    <div className={styles.playlistTrackInfo}>
                      {track.title && (
                        <div className={styles.playlistTrackTitle}>{track.title}</div>
                      )}
                      {track.artist && (
                        <div className={styles.playlistTrackArtist}>{track.artist}</div>
                      )}
                    </div>
                    {track.duration && (
                      <div className={styles.playlistTrackDuration}>
                        {formatTime(track.duration)}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

Audio.displayName = 'Audio';

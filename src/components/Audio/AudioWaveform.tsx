import { useRef, useEffect, useState } from 'react';
import { cn } from '@/utils/classnames';
import type { AudioWaveformProps } from './Audio.types';
import styles from './Audio.module.css';

export const AudioWaveform = ({
  audioRef,
  currentTime,
  duration,
  onSeek,
  size,
}: AudioWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  // Generate waveform data using Web Audio API
  useEffect(() => {
    if (!audioRef) {return;}

    const generateWaveform = async () => {
      try {
        const audioContext = new AudioContext();
        const response = await fetch(audioRef.src);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Get channel data
        const rawData = audioBuffer.getChannelData(0);
        const samples = 100; // Number of bars in the waveform
        const blockSize = Math.floor(rawData.length / samples);
        const filteredData: number[] = [];

        for (let i = 0; i < samples; i++) {
          const start = blockSize * i;
          let sum = 0;

          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[start + j]);
          }

          filteredData.push(sum / blockSize);
        }

        // Normalize data
        const max = Math.max(...filteredData);
        const normalized = filteredData.map(n => n / max);

        setWaveformData(normalized);
        audioContext.close();
      } catch (error) {
        // Fallback to simple bars if waveform generation fails
        const fallback = Array(100).fill(0).map(() => Math.random() * 0.5 + 0.3);
        setWaveformData(fallback);
      }
    };

    generateWaveform();
  }, [audioRef]);

  // Update canvas size on resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {return;}

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Draw waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveformData.length === 0) {return;}

    const ctx = canvas.getContext('2d');
    if (!ctx) {return;}

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate progress
    const progress = duration > 0 ? currentTime / duration : 0;

    // Draw bars
    const barCount = waveformData.length;
    const barWidth = width / barCount;
    const gap = 1;

    waveformData.forEach((value, index) => {
      const barHeight = value * height * 0.8;
      const x = index * barWidth;
      const y = (height - barHeight) / 2;

      // Color based on progress
      const isPast = index / barCount <= progress;
      ctx.fillStyle = isPast
        ? 'var(--boom-color-primary, #1976d2)'
        : 'var(--boom-color-border-default, #e0e0e0)';

      ctx.fillRect(x, y, barWidth - gap, barHeight);
    });
  }, [waveformData, currentTime, duration]);

  // Handle click to seek
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || duration === 0) {return;}

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    onSeek(Math.max(0, Math.min(duration, newTime)));
  };

  return (
    <div className={cn(styles.waveformContainer, styles[size])}>
      <canvas
        ref={canvasRef}
        className={styles.waveformCanvas}
        onClick={handleClick}
        role="slider"
        aria-label="Audio waveform"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            onSeek(Math.max(0, currentTime - 5));
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            onSeek(Math.min(duration, currentTime + 5));
          }
        }}
      />
    </div>
  );
};

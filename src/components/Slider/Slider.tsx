import { forwardRef, useId, useRef } from 'react';
import { cn } from '@/utils/classnames';
import type { SliderProps } from './Slider.types';
import styles from './Slider.module.css';

// Helper utilities
const valueToPercent = (value: number, min: number, max: number): number => {
  return ((value - min) / (max - min)) * 100;
};

const getMarkerPositions = (
  min: number,
  max: number,
  step: number,
  customMarkers?: number[]
): number[] => {
  if (customMarkers) {
    return customMarkers.filter(m => m >= min && m <= max);
  }

  const markers: number[] = [];
  for (let value = min; value <= max; value += step) {
    markers.push(value);
  }
  return markers;
};

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (props, ref) => {
    const {
      label,
      mode = 'single',
      value,
      onChange,
      min = 0,
      max = 100,
      step = 1,
      size = 'md',
      showMarkers = false,
      markers,
      formatValue,
      disabled = false,
      readOnly = false,
      error,
      helperText,
      fullWidth = false,
      className,
      id: providedId,
    } = props;

    // Auto-generate IDs
    const autoId = useId();
    const id = providedId || autoId;
    const errorId = `${id}-error`;
    const helperTextId = `${id}-helper`;

    // Refs for drag tracking
    const trackRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const activeHandleRef = useRef<'start' | 'end' | null>(null);

    // Display value for label
    const displayValue = mode === 'single'
      ? formatValue?.(value as number) ?? value
      : formatValue
        ? `${formatValue((value as [number, number])[0])} - ${formatValue((value as [number, number])[1])}`
        : `${(value as [number, number])[0]} - ${(value as [number, number])[1]}`;

    // Calculate value from position
    const getValueFromPosition = (clientX: number): number => {
      if (!trackRef.current) {return min;}

      const rect = trackRef.current.getBoundingClientRect();
      const percentage = (clientX - rect.left) / rect.width;
      const rawValue = min + percentage * (max - min);

      // Snap to step
      const steppedValue = Math.round(rawValue / step) * step;
      return Math.max(min, Math.min(max, steppedValue));
    };

    // Update value for a handle
    const updateValue = (handle: 'start' | 'end', newValue: number) => {
      if (mode === 'single') {
        onChange(newValue as never);
      } else {
        const [start, end] = value as [number, number];
        if (handle === 'start') {
          onChange([Math.min(newValue, end), end] as never);
        } else {
          onChange([start, Math.max(newValue, start)] as never);
        }
      }
    };

    // Handle track click
    const handleTrackClick = (e: React.MouseEvent) => {
      if (disabled || readOnly) {return;}

      const newValue = getValueFromPosition(e.clientX);

      if (mode === 'single') {
        onChange(newValue as never);
      } else {
        // Move nearest handle
        const [start, end] = value as [number, number];
        const distToStart = Math.abs(newValue - start);
        const distToEnd = Math.abs(newValue - end);
        const nearestHandle = distToStart <= distToEnd ? 'start' : 'end';
        updateValue(nearestHandle, newValue);
      }
    };

    // Handle mouse drag
    const handleMouseDown = (handle: 'start' | 'end') => (e: React.MouseEvent) => {
      if (disabled || readOnly) {return;}

      e.preventDefault();
      isDraggingRef.current = true;
      activeHandleRef.current = handle;

      const handleMouseMove = (e: MouseEvent) => {
        const newValue = getValueFromPosition(e.clientX);
        updateValue(handle, newValue);
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
        activeHandleRef.current = null;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    // Handle touch drag
    const handleTouchStart = (handle: 'start' | 'end') => (e: React.TouchEvent) => {
      if (disabled || readOnly) {return;}

      e.preventDefault();
      isDraggingRef.current = true;
      activeHandleRef.current = handle;

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          const newValue = getValueFromPosition(e.touches[0].clientX);
          updateValue(handle, newValue);
        }
      };

      const handleTouchEnd = () => {
        isDraggingRef.current = false;
        activeHandleRef.current = null;
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };

      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    };

    // Handle keyboard navigation
    const handleKeyDown = (handle: 'start' | 'end') => (e: React.KeyboardEvent) => {
      if (disabled || readOnly) {return;}

      const currentVal = mode === 'single'
        ? value as number
        : (value as [number, number])[handle === 'start' ? 0 : 1];

      let increment = 0;
      const largeStep = (max - min) / 10;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          increment = step;
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          increment = -step;
          break;
        case 'PageUp':
          increment = largeStep;
          break;
        case 'PageDown':
          increment = -largeStep;
          break;
        case 'Home':
          updateValue(handle, min);
          return;
        case 'End':
          updateValue(handle, max);
          return;
        default:
          return;
      }

      e.preventDefault();
      const newValue = Math.max(min, Math.min(max, currentVal + increment));
      updateValue(handle, newValue);
    };

    return (
      <div ref={ref} className={cn(styles.wrapper, fullWidth && styles.fullWidth, className)}>
        {/* Label with inline value */}
        {label && (
          <div className={cn(styles.label, disabled && styles.disabled)}>
            <span>{label}</span>
            <span className={styles.valueDisplay}>{displayValue}</span>
          </div>
        )}

        {/* Slider container */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          ref={trackRef}
          className={cn(
            styles.sliderContainer,
            disabled && styles.disabled,
            readOnly && styles.readOnly
          )}
          onClick={handleTrackClick}
        >
          {/* Track */}
          <div className={cn(styles.track, styles[size], error && styles.error)}>
            {/* Filled track */}
            <div
              className={cn(styles.filledTrack, disabled && styles.disabled)}
              style={{
                left: mode === 'single'
                  ? '0%'
                  : `${valueToPercent((value as [number, number])[0], min, max)}%`,
                width: mode === 'single'
                  ? `${valueToPercent(value as number, min, max)}%`
                  : `${valueToPercent((value as [number, number])[1], min, max) -
                       valueToPercent((value as [number, number])[0], min, max)}%`
              }}
            />

            {/* Markers */}
            {showMarkers && (
              <div className={styles.markers}>
                {getMarkerPositions(min, max, step, markers).map(pos => (
                  <div
                    key={pos}
                    className={styles.marker}
                    style={{ left: `${valueToPercent(pos, min, max)}%` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Handles */}
          {mode === 'single' ? (
            <div
              className={cn(styles.handle, styles[size], disabled && styles.disabled, error && styles.error)}
              style={{ left: `${valueToPercent(value as number, min, max)}%` }}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={value as number}
              aria-valuetext={formatValue?.(value as number)}
              aria-label={label || 'slider'}
              aria-disabled={disabled}
              aria-readonly={readOnly}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? errorId : helperText ? helperTextId : undefined}
              onMouseDown={handleMouseDown('start')}
              onTouchStart={handleTouchStart('start')}
              onKeyDown={handleKeyDown('start')}
            />
          ) : (
            <>
              {/* Start handle */}
              <div
                className={cn(styles.handle, styles[size], disabled && styles.disabled)}
                style={{ left: `${valueToPercent((value as [number, number])[0], min, max)}%` }}
                role="slider"
                tabIndex={disabled ? -1 : 0}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={(value as [number, number])[0]}
                aria-valuetext={formatValue?.((value as [number, number])[0])}
                aria-label={label ? `${label} minimum` : 'minimum value'}
                aria-disabled={disabled}
                aria-readonly={readOnly}
                onMouseDown={handleMouseDown('start')}
                onTouchStart={handleTouchStart('start')}
                onKeyDown={handleKeyDown('start')}
              />

              {/* End handle */}
              <div
                className={cn(styles.handle, styles[size], disabled && styles.disabled)}
                style={{ left: `${valueToPercent((value as [number, number])[1], min, max)}%` }}
                role="slider"
                tabIndex={disabled ? -1 : 0}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={(value as [number, number])[1]}
                aria-valuetext={formatValue?.((value as [number, number])[1])}
                aria-label={label ? `${label} maximum` : 'maximum value'}
                aria-disabled={disabled}
                aria-readonly={readOnly}
                onMouseDown={handleMouseDown('end')}
                onTouchStart={handleTouchStart('end')}
                onKeyDown={handleKeyDown('end')}
              />
            </>
          )}
        </div>

        {/* Error or helper text */}
        {error && (
          <span id={errorId} className={styles.errorText} role="alert">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={helperTextId} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';

import { useState, useEffect, useRef, forwardRef } from 'react';
import { cn } from '@/utils/classnames';
import { Skeleton } from '@/components/Skeleton';
import type { ImageProps } from './Image.types';
import styles from './Image.module.css';

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      fallbackSrc,
      objectFit = 'cover',
      loading = 'lazy',
      placeholder = false,
      onClick,
      className,
      width,
      height,
      ...restProps
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(loading === 'eager');
    const [currentSrc, setCurrentSrc] = useState<string>(src);
    const containerRef = useRef<HTMLDivElement>(null);

    // IntersectionObserver for lazy loading
    useEffect(() => {
      if (loading === 'eager' || !containerRef.current) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );

      observer.observe(containerRef.current);

      return () => {
        observer.disconnect();
      };
    }, [loading]);

    // Sync internal state when src prop changes
    // This is a legitimate use of setState in useEffect - we're syncing internal state with external props
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
      setCurrentSrc(src);
      setIsLoading(true);
      setHasError(false);
    }, [src]);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Handle image loading
    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
    };

    // Handle image error
    const handleError = () => {
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setHasError(false);
      } else {
        setHasError(true);
        setIsLoading(false);
      }
    };

    const formatDimension = (value: string | number | undefined): string | undefined => {
      if (value === undefined) {return undefined;}
      return typeof value === 'number' ? `${value}px` : value;
    };

    const containerStyle = {
      width: formatDimension(width),
      height: formatDimension(height),
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick();
      }
    };

    return (
      <div
        ref={containerRef}
        className={cn(
          styles.container,
          onClick && styles.clickable,
          className
        )}
        style={containerStyle}
        onClick={onClick}
        onKeyDown={onClick ? handleKeyDown : undefined}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        {/* Loading state */}
        {isLoading && !hasError && (
          <div className={styles.skeletonWrapper}>
            <Skeleton variant="rect" width="100%" height="100%" />
          </div>
        )}

        {/* Image - use key to remount when src changes */}
        {isInView && !hasError && (
          <img
            key={src}
            ref={ref}
            src={currentSrc}
            alt={alt}
            className={cn(
              styles.image,
              styles[objectFit],
              isLoading && styles.hidden,
              placeholder && isLoading && styles.placeholder
            )}
            onLoad={handleLoad}
            onError={handleError}
            {...restProps}
          />
        )}

        {/* Error state - show fallback or nothing */}
        {hasError && fallbackSrc && (
          <div className={styles.errorState} role="img" aria-label={alt}>
            <span className={styles.errorIcon}>⚠</span>
          </div>
        )}
      </div>
    );
  }
);

Image.displayName = 'Image';

import { useState } from 'react';
import { cn } from '@/utils/classnames';
import { AvatarProps } from './Avatar.types';
import styles from './Avatar.module.css';

const generateInitials = (name: string): string => {
  if (!name) return '';

  const words = name.trim().split(/\s+/);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0][0]?.toUpperCase() || '';

  return (words[0][0] + words[1][0]).toUpperCase();
};

export const Avatar = ({
  src,
  alt,
  size = 'md',
  name,
  status,
  showStatus = false,
  className,
  ...imgProps
}: AvatarProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const showImage = src && !imageError;
  const initials = name ? generateInitials(name) : '';

  return (
    <div className={cn(styles.avatar, styles[size], className)}>
      {showImage && (
        <img
          src={src}
          alt={alt}
          className={cn(styles.image, !imageLoaded && styles.hidden)}
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...imgProps}
        />
      )}

      {!showImage && initials && (
        <span className={styles.initials} aria-label={alt}>
          {initials}
        </span>
      )}

      {showStatus && status && (
        <span className={cn(styles.status, styles[size], styles[status])} />
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';

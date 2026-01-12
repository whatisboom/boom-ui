import { Skeleton } from './Skeleton';
import type { SkeletonAvatarProps } from './Skeleton.types';
import styles from './SkeletonAvatar.module.css';

export function SkeletonAvatar({
  size = 'md',
  withText = false,
  textLines = 2,
  disableAnimation = false,
  className,
}: SkeletonAvatarProps) {
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  const avatarSize = sizeMap[size];

  if (!withText) {
    return (
      <Skeleton
        variant="circle"
        width={avatarSize}
        height={avatarSize}
        disableAnimation={disableAnimation}
        className={className}
      />
    );
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <Skeleton
        variant="circle"
        width={avatarSize}
        height={avatarSize}
        disableAnimation={disableAnimation}
      />
      <div className={styles.textContainer}>
        {Array.from({ length: textLines }, (_, index) => (
          <Skeleton
            key={index}
            variant="text"
            disableAnimation={disableAnimation}
          />
        ))}
      </div>
    </div>
  );
}

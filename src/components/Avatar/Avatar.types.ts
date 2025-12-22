import { ImgHTMLAttributes } from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size'> {
  /**
   * Image source URL
   */
  src?: string;

  /**
   * Alt text for image (required for accessibility)
   */
  alt: string;

  /**
   * Size of the avatar
   * @default 'md'
   */
  size?: AvatarSize;

  /**
   * Name for initials fallback
   */
  name?: string;

  /**
   * Status indicator
   */
  status?: AvatarStatus;

  /**
   * Whether to show status indicator
   * @default false
   */
  showStatus?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;
}

import type { ImgHTMLAttributes } from 'react';

export type ImageObjectFit = 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';

export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'placeholder'> {
  /**
   * Image source URL (required)
   */
  src: string;

  /**
   * Alt text for accessibility (required)
   */
  alt: string;

  /**
   * Fallback image source when main image fails to load
   */
  fallbackSrc?: string;

  /**
   * Object-fit CSS property
   * @default 'cover'
   */
  objectFit?: ImageObjectFit;

  /**
   * Enable lazy loading via IntersectionObserver
   * @default true
   */
  loading?: 'lazy' | 'eager';

  /**
   * Show placeholder blur effect while loading
   * @default false
   */
  placeholder?: boolean;

  /**
   * Click handler (e.g., for zoom/lightbox)
   */
  onClick?: () => void;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Width of the image container
   */
  width?: string | number;

  /**
   * Height of the image container
   */
  height?: string | number;
}

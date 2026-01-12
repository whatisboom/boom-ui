import type { ReactNode, CSSProperties, VideoHTMLAttributes, ElementType } from 'react';
import type { MotionProps, PolymorphicProps } from '@/types';

/**
 * Layout variants for Hero component
 */
export type HeroVariant = 'centered' | 'split-left' | 'split-right' | 'minimal';

/**
 * Video source configuration
 */
export interface HeroVideoSource {
  /**
   * Video source URL
   */
  src: string;
  /**
   * Video MIME type (e.g., 'video/mp4', 'video/webm')
   */
  type?: string;
}

/**
 * Background media configuration
 */
export interface HeroBackgroundMedia {
  /**
   * Media type
   */
  type: 'image' | 'video';
  /**
   * Image source URL (for type: 'image')
   */
  src?: string;
  /**
   * Alt text for image (required for type: 'image')
   */
  alt?: string;
  /**
   * Video sources (for type: 'video')
   */
  sources?: HeroVideoSource[];
  /**
   * Video poster image (shown before video loads)
   */
  poster?: string;
  /**
   * Overlay opacity (0-1) to ensure text readability
   */
  overlayOpacity?: number;
  /**
   * Additional video attributes (autoplay, loop, muted, etc.)
   */
  videoProps?: Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'poster'>;
}

/**
 * Call-to-action button configuration
 */
export interface HeroCTA {
  /**
   * Button text/content
   */
  children: ReactNode;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Button href (renders as link)
   */
  href?: string;
  /**
   * Button variant (from boom-ui Button)
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
}

/**
 * Base props for Hero component
 */
export interface HeroBaseProps extends MotionProps {
  /**
   * Layout variant
   */
  variant?: HeroVariant;
  /**
   * Heading text (main title)
   */
  heading: ReactNode;
  /**
   * Subheading text (subtitle/description)
   */
  subheading?: ReactNode;
  /**
   * Primary call-to-action button
   */
  primaryCTA?: HeroCTA;
  /**
   * Secondary call-to-action button
   */
  secondaryCTA?: HeroCTA;
  /**
   * Background media configuration
   */
  backgroundMedia?: HeroBackgroundMedia;
  /**
   * Custom content to render below CTAs
   */
  children?: ReactNode;
  /**
   * Vertical padding multiplier (uses spacing scale)
   * @default 16
   */
  paddingY?: number;
  /**
   * Horizontal padding multiplier (uses spacing scale)
   * @default 6
   */
  paddingX?: number;
  /**
   * Minimum height (CSS value)
   * @default '500px'
   */
  minHeight?: string;
  /**
   * Maximum content width (CSS value)
   * @default '1200px'
   */
  maxWidth?: string;
  /**
   * Heading element tag
   * @default 'h1'
   */
  headingAs?: 'h1' | 'h2' | 'h3';
  /**
   * Subheading element tag
   * @default 'p'
   */
  subheadingAs?: 'p' | 'h2' | 'h3' | 'h4';
  /**
   * Custom className
   */
  className?: string;
  /**
   * Custom inline styles
   */
  style?: CSSProperties;
}

/**
 * Polymorphic Hero component props
 */
export type HeroProps<E extends ElementType = 'section'> = HeroBaseProps & PolymorphicProps<E>;

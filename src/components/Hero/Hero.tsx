import type { ElementType, CSSProperties} from 'react';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/classnames';
import { Button } from '@/components/Button';
import type { HeroProps } from './Hero.types';
import styles from './Hero.module.css';

export function Hero<E extends ElementType = 'section'>({
  as,
  variant = 'centered',
  heading,
  subheading,
  primaryCTA,
  secondaryCTA,
  backgroundMedia,
  children,
  paddingY = 16,
  paddingX = 6,
  minHeight = '500px',
  maxWidth = '1200px',
  headingAs = 'h1',
  subheadingAs = 'p',
  disableAnimation = false,
  className,
  style,
  ...props
}: HeroProps<E>) {
  const Component = as || 'section';

  // Build inline styles with padding and minHeight
  const spacingToVar = (value: number) => `var(--boom-spacing-${value})`;
  const heroStyle: CSSProperties = {
    paddingTop: spacingToVar(paddingY),
    paddingBottom: spacingToVar(paddingY),
    paddingLeft: spacingToVar(paddingX),
    paddingRight: spacingToVar(paddingX),
    minHeight,
    ...style,
  };

  // Build className
  const heroClassName = cn(
    styles.hero,
    styles[variant === 'split-left' ? 'splitLeft' : variant === 'split-right' ? 'splitRight' : variant],
    backgroundMedia && styles.hasMedia,
    className
  );

  // Render background media
  const renderBackgroundMedia = () => {
    if (!backgroundMedia) {
      return null;
    }

    if (backgroundMedia.type === 'video') {
      return (
        <>
          <video
            className={styles.backgroundVideo}
            poster={backgroundMedia.poster}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            {...backgroundMedia.videoProps}
          >
            {backgroundMedia.sources?.map((source, idx) => (
              <source key={idx} src={source.src} type={source.type} />
            ))}
          </video>
          <div
            className={styles.overlay}
            style={{ opacity: backgroundMedia.overlayOpacity ?? 0.5 }}
          />
        </>
      );
    }

    // At this point, type must be 'image'
    return (
      <>
        <img
          src={backgroundMedia.src}
          alt={backgroundMedia.alt || ''}
          className={styles.backgroundImage}
          aria-hidden={!backgroundMedia.alt}
        />
        <div
          className={styles.overlay}
          style={{ opacity: backgroundMedia.overlayOpacity ?? 0.3 }}
        />
      </>
    );
  };

  // Render CTAs
  const renderCTAs = () => {
    if (!primaryCTA && !secondaryCTA) {return null;}

    return (
      <div className={styles.ctaContainer}>
        {primaryCTA && (
          <Button variant={primaryCTA.variant || 'primary'} onClick={primaryCTA.onClick} {...primaryCTA}>
            {primaryCTA.children}
          </Button>
        )}
        {secondaryCTA && (
          <Button variant={secondaryCTA.variant || 'outline'} onClick={secondaryCTA.onClick} {...secondaryCTA}>
            {secondaryCTA.children}
          </Button>
        )}
      </div>
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  // Create heading and subheading elements
  const HeadingTag = headingAs;
  const SubheadingTag = subheadingAs;

  // Content component
  const content = (
    <>
      {renderBackgroundMedia()}
      <div className={styles.content} style={{ maxWidth }}>
        <HeadingTag className={styles.heading}>{heading}</HeadingTag>
        {subheading && <SubheadingTag className={styles.subheading}>{subheading}</SubheadingTag>}
        {renderCTAs()}
        {children}
      </div>
    </>
  );

  // Memoize motion component creation to prevent recreating on every render
  /* eslint-disable react-hooks/static-components -- Dynamic polymorphic components require runtime creation with motion.create() */
  const MotionComponent = useMemo(() => motion.create(Component), [Component]);

  if (disableAnimation) {
    return (
      <Component className={heroClassName} style={heroStyle} {...props}>
        {content}
      </Component>
    );
  }

  return (
    <MotionComponent
      className={heroClassName}
      style={heroStyle}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      {...props}
    >
      {content}
    </MotionComponent>
  );
  /* eslint-enable react-hooks/static-components */
}

Hero.displayName = 'Hero';

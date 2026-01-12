import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Hero } from './Hero';
import styles from './Hero.module.css';

describe('Hero', () => {
  it('should render with heading', () => {
    render(<Hero heading="Welcome to Boom UI" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome to Boom UI');
  });

  it('should render heading as h1 by default', () => {
    render(<Hero heading="Test Heading" />);
    const heading = screen.getByText('Test Heading');
    expect(heading.tagName).toBe('H1');
  });

  it('should render heading with custom element', () => {
    render(<Hero heading="Test Heading" headingAs="h2" />);
    const heading = screen.getByText('Test Heading');
    expect(heading.tagName).toBe('H2');
  });

  it('should render with subheading', () => {
    render(<Hero heading="Welcome" subheading="Build accessible components" />);
    expect(screen.getByText('Build accessible components')).toBeInTheDocument();
  });

  it('should render subheading as p by default', () => {
    render(<Hero heading="Test" subheading="Test Subheading" />);
    const subheading = screen.getByText('Test Subheading');
    expect(subheading.tagName).toBe('P');
  });

  it('should render subheading with custom element', () => {
    render(<Hero heading="Test" subheading="Test Subheading" subheadingAs="h3" />);
    const subheading = screen.getByText('Test Subheading');
    expect(subheading.tagName).toBe('H3');
  });

  it('should render with children', () => {
    render(
      <Hero heading="Test">
        <div data-testid="custom-content">Custom Content</div>
      </Hero>
    );
    expect(screen.getByTestId('custom-content')).toHaveTextContent('Custom Content');
  });

  it('should apply centered variant by default', () => {
    const { container } = render(<Hero heading="Test" />);
    const section = container.querySelector('section');
    expect(section).toHaveClass(styles.centered);
  });

  it('should apply split-left variant', () => {
    const { container } = render(<Hero heading="Test" variant="split-left" />);
    const section = container.querySelector('section');
    expect(section).toHaveClass(styles.splitLeft);
  });

  it('should apply split-right variant', () => {
    const { container } = render(<Hero heading="Test" variant="split-right" />);
    const section = container.querySelector('section');
    expect(section).toHaveClass(styles.splitRight);
  });

  it('should apply minimal variant', () => {
    const { container } = render(<Hero heading="Test" variant="minimal" />);
    const section = container.querySelector('section');
    expect(section).toHaveClass(styles.minimal);
  });

  it('should render primary CTA', () => {
    const handleClick = vi.fn();
    render(
      <Hero heading="Test" primaryCTA={{ children: 'Get Started', onClick: handleClick }} />
    );

    const button = screen.getByRole('button', { name: /get started/i });
    expect(button).toBeInTheDocument();
  });

  it('should handle primary CTA click', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Hero heading="Test" primaryCTA={{ children: 'Get Started', onClick: handleClick }} />
    );

    const button = screen.getByRole('button', { name: /get started/i });
    await user.click(button);
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should render secondary CTA', () => {
    const handleClick = vi.fn();
    render(
      <Hero heading="Test" secondaryCTA={{ children: 'Learn More', onClick: handleClick }} />
    );

    const button = screen.getByRole('button', { name: /learn more/i });
    expect(button).toBeInTheDocument();
  });

  it('should render both CTAs', () => {
    render(
      <Hero
        heading="Test"
        primaryCTA={{ children: 'Get Started' }}
        secondaryCTA={{ children: 'Learn More' }}
      />
    );

    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /learn more/i })).toBeInTheDocument();
  });

  it('should use custom variant for primary CTA', () => {
    render(
      <Hero
        heading="Test"
        primaryCTA={{ children: 'Custom', variant: 'secondary' }}
      />
    );

    const button = screen.getByRole('button', { name: /custom/i });
    expect(button).toBeInTheDocument();
  });

  it('should render background image', () => {
    render(
      <Hero
        heading="Test"
        backgroundMedia={{
          type: 'image',
          src: '/hero.jpg',
          alt: 'Hero background',
        }}
      />
    );

    const image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveAttribute('src', '/hero.jpg');
    expect(image).toHaveAttribute('alt', 'Hero background');
  });

  it('should set aria-hidden on image without alt text', () => {
    render(
      <Hero
        heading="Test"
        backgroundMedia={{
          type: 'image',
          src: '/hero.jpg',
        }}
      />
    );

    const images = document.querySelectorAll('img');
    const backgroundImage = Array.from(images).find(img => img.getAttribute('src') === '/hero.jpg');
    expect(backgroundImage).toHaveAttribute('aria-hidden', 'true');
  });

  it('should render background video', () => {
    render(
      <Hero
        heading="Test"
        backgroundMedia={{
          type: 'video',
          sources: [{ src: '/video.mp4', type: 'video/mp4' }],
          poster: '/poster.jpg',
        }}
      />
    );

    const videos = document.querySelectorAll('video');
    expect(videos.length).toBeGreaterThan(0);
    const video = videos[0];
    expect(video).toHaveAttribute('poster', '/poster.jpg');
    expect(video.autoplay).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.muted).toBe(true);
    expect(video.playsInline).toBe(true);
    expect(video).toHaveAttribute('aria-hidden', 'true');
  });

  it('should render video sources', () => {
    render(
      <Hero
        heading="Test"
        backgroundMedia={{
          type: 'video',
          sources: [
            { src: '/video.mp4', type: 'video/mp4' },
            { src: '/video.webm', type: 'video/webm' },
          ],
        }}
      />
    );

    const sources = document.querySelectorAll('source');
    expect(sources.length).toBeGreaterThanOrEqual(2);
    expect(sources[0]).toHaveAttribute('src', '/video.mp4');
    expect(sources[0]).toHaveAttribute('type', 'video/mp4');
    expect(sources[1]).toHaveAttribute('src', '/video.webm');
    expect(sources[1]).toHaveAttribute('type', 'video/webm');
  });

  it('should apply custom overlay opacity for video', () => {
    render(
      <Hero
        heading="Test"
        backgroundMedia={{
          type: 'video',
          sources: [{ src: '/video.mp4' }],
          overlayOpacity: 0.7,
        }}
      />
    );

    const overlays = document.querySelectorAll('[class*="overlay"]');
    const overlay = Array.from(overlays).find(el => {
      const style = (el as HTMLElement).style;
      return style.opacity === '0.7';
    });
    expect(overlay).toBeDefined();
  });

  it('should apply default overlay opacity for video (0.5)', () => {
    render(
      <Hero
        heading="Test"
        backgroundMedia={{
          type: 'video',
          sources: [{ src: '/video.mp4' }],
        }}
      />
    );

    const overlays = document.querySelectorAll('[class*="overlay"]');
    const overlay = Array.from(overlays).find(el => {
      const style = (el as HTMLElement).style;
      return style.opacity === '0.5';
    });
    expect(overlay).toBeDefined();
  });

  it('should apply default overlay opacity for image (0.3)', () => {
    render(
      <Hero
        heading="Test"
        backgroundMedia={{
          type: 'image',
          src: '/hero.jpg',
        }}
      />
    );

    const overlays = document.querySelectorAll('[class*="overlay"]');
    const overlay = Array.from(overlays).find(el => {
      const style = (el as HTMLElement).style;
      return style.opacity === '0.3';
    });
    expect(overlay).toBeDefined();
  });

  it('should render as section by default', () => {
    const { container } = render(<Hero heading="Test" />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('should render as custom element with as prop', () => {
    const { container } = render(<Hero as="div" heading="Test" />);
    expect(container.querySelector('div')).toBeInTheDocument();
    expect(container.querySelector('section')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<Hero heading="Test" className="custom-class" />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

  it('should apply custom inline styles', () => {
    const { container } = render(
      <Hero heading="Test" style={{ color: 'red' }} disableAnimation />
    );
    const section = container.querySelector('section');
    const style = section?.getAttribute('style');
    expect(style).toContain('color');
    expect(style).toContain('red');
  });

  it('should apply custom padding via paddingX and paddingY', () => {
    const { container } = render(<Hero heading="Test" paddingX={8} paddingY={12} />);
    const section = container.querySelector('section');
    const style = section?.getAttribute('style');
    expect(style).toContain('--boom-spacing-8');
    expect(style).toContain('--boom-spacing-12');
  });

  it('should apply custom minHeight', () => {
    const { container } = render(<Hero heading="Test" minHeight="700px" />);
    const section = container.querySelector('section');
    expect(section).toHaveStyle({ minHeight: '700px' });
  });

  it('should apply custom maxWidth to content', () => {
    const { container } = render(<Hero heading="Test" maxWidth="800px" />);
    const content = container.querySelector('[class*="content"]');
    expect(content).toHaveStyle({ maxWidth: '800px' });
  });

  it('should disable animation when disableAnimation is true', () => {
    const { container } = render(<Hero heading="Test" disableAnimation />);
    const section = container.querySelector('section');
    expect(section?.tagName).toBe('SECTION');
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Hero
        heading="Accessible Hero"
        subheading="This is accessible"
        primaryCTA={{ children: 'Learn More' }}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations with background image', async () => {
    const { container } = render(
      <Hero
        heading="Hero with Media"
        backgroundMedia={{
          type: 'image',
          src: '/test.jpg',
          alt: 'Decorative background',
        }}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should pass additional video props to video element', () => {
    render(
      <Hero
        heading="Test"
        backgroundMedia={{
          type: 'video',
          sources: [{ src: '/video.mp4' }],
          videoProps: {
            controls: true,
            preload: 'metadata',
          },
        }}
      />
    );

    const video = document.querySelector('video');
    expect(video).toHaveAttribute('controls');
    expect(video).toHaveAttribute('preload', 'metadata');
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Image } from './Image';

describe('Image', () => {
  let observeMock: ReturnType<typeof vi.fn>;
  let disconnectMock: ReturnType<typeof vi.fn>;
  let unobserveMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    observeMock = vi.fn();
    disconnectMock = vi.fn();
    unobserveMock = vi.fn();

    // Mock IntersectionObserver as a constructor
    window.IntersectionObserver = vi.fn(function (this: IntersectionObserver) {
      return {
        observe: observeMock,
        disconnect: disconnectMock,
        unobserve: unobserveMock,
        root: null,
        rootMargin: '',
        thresholds: [],
        takeRecords: () => [],
      };
    }) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Image src="https://via.placeholder.com/300" alt="Test image" loading="eager" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should require alt text', () => {
      render(<Image src="https://via.placeholder.com/300" alt="Descriptive alt text" loading="eager" />);
      const img = screen.getByAltText('Descriptive alt text');
      expect(img).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show skeleton while loading', () => {
      render(<Image src="https://via.placeholder.com/300" alt="Test image" loading="eager" />);

      // Skeleton should be visible initially
      expect(document.querySelector('[role="status"]')).toBeInTheDocument();
    });

    it('should hide skeleton and show image when loaded', async () => {
      render(<Image src="https://via.placeholder.com/300" alt="Test image" loading="eager" />);

      const img = screen.getByAltText('Test image');

      // Trigger load event
      fireEvent.load(img);

      await waitFor(() => {
        expect(img.className).not.toMatch(/hidden/);
      });
    });

    it('should handle placeholder blur effect', () => {
      render(
        <Image
          src="https://via.placeholder.com/300"
          alt="Test image"
          loading="eager"
          placeholder
        />
      );

      const img = screen.getByAltText('Test image');
      expect(img.className).toMatch(/placeholder/);
    });
  });

  describe('Error Handling', () => {
    it('should show fallback image on error', async () => {
      render(
        <Image
          src="https://invalid-url.com/image.jpg"
          alt="Test image"
          fallbackSrc="https://via.placeholder.com/300"
          loading="eager"
        />
      );

      const img = screen.getByAltText('Test image');

      // Trigger error event
      fireEvent.error(img);

      await waitFor(() => {
        expect(img.src).toContain('via.placeholder.com');
      });
    });

    it('should show error state when fallback also fails', async () => {
      render(
        <Image
          src="https://invalid-url.com/image.jpg"
          alt="Test image"
          fallbackSrc="https://also-invalid.com/image.jpg"
          loading="eager"
        />
      );

      const img = screen.getByAltText('Test image');

      // Trigger first error
      fireEvent.error(img);

      await waitFor(() => {
        expect(img.src).toContain('also-invalid.com');
      });

      // Trigger second error
      fireEvent.error(img);

      await waitFor(() => {
        const errorState = screen.getByRole('img', { name: 'Test image' });
        expect(errorState).toBeInTheDocument();
        expect(errorState).toHaveTextContent('⚠');
      });
    });
  });

  describe('Lazy Loading', () => {
    it('should use IntersectionObserver for lazy loading', () => {
      render(<Image src="https://via.placeholder.com/300" alt="Test image" loading="lazy" />);

      expect(window.IntersectionObserver).toHaveBeenCalled();
      expect(observeMock).toHaveBeenCalled();
    });

    it('should not use IntersectionObserver for eager loading', () => {
      render(<Image src="https://via.placeholder.com/300" alt="Test image" loading="eager" />);

      expect(window.IntersectionObserver).not.toHaveBeenCalled();
      expect(observeMock).not.toHaveBeenCalled();
    });

    it('should load image when intersecting', async () => {
      let callback: IntersectionObserverCallback | null = null;

      window.IntersectionObserver = vi.fn(function (
        this: IntersectionObserver,
        cb: IntersectionObserverCallback
      ) {
        callback = cb;
        return {
          observe: vi.fn(),
          disconnect: vi.fn(),
          unobserve: vi.fn(),
          root: null,
          rootMargin: '',
          thresholds: [],
          takeRecords: () => [],
        };
      }) as unknown as typeof IntersectionObserver;

      render(<Image src="https://via.placeholder.com/300" alt="Test image" loading="lazy" />);

      // Simulate intersection
      act(() => {
        callback?.(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      });

      await waitFor(() => {
        const img = screen.getByAltText('Test image');
        expect(img).toBeInTheDocument();
      });
    });

    it('should disconnect observer after intersection', async () => {
      const mockDisconnect = vi.fn();
      let callback: IntersectionObserverCallback | null = null;

      window.IntersectionObserver = vi.fn(function (
        this: IntersectionObserver,
        cb: IntersectionObserverCallback
      ) {
        callback = cb;
        return {
          observe: vi.fn(),
          disconnect: mockDisconnect,
          unobserve: vi.fn(),
          root: null,
          rootMargin: '',
          thresholds: [],
          takeRecords: () => [],
        };
      }) as unknown as typeof IntersectionObserver;

      render(<Image src="https://via.placeholder.com/300" alt="Test image" loading="lazy" />);

      // Simulate intersection
      act(() => {
        callback?.(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      });

      await waitFor(() => {
        expect(mockDisconnect).toHaveBeenCalled();
      });
    });
  });

  describe('Object Fit', () => {
    it('should apply cover object-fit by default', () => {
      render(<Image src="https://via.placeholder.com/300" alt="Test image" loading="eager" />);
      const img = screen.getByAltText('Test image');
      expect(img.className).toMatch(/cover/);
    });

    it('should apply contain object-fit', () => {
      render(
        <Image
          src="https://via.placeholder.com/300"
          alt="Test image"
          loading="eager"
          objectFit="contain"
        />
      );
      const img = screen.getByAltText('Test image');
      expect(img.className).toMatch(/contain/);
    });

    it('should apply fill object-fit', () => {
      render(
        <Image
          src="https://via.placeholder.com/300"
          alt="Test image"
          loading="eager"
          objectFit="fill"
        />
      );
      const img = screen.getByAltText('Test image');
      expect(img.className).toMatch(/fill/);
    });

    it('should apply scale-down object-fit', () => {
      render(
        <Image
          src="https://via.placeholder.com/300"
          alt="Test image"
          loading="eager"
          objectFit="scale-down"
        />
      );
      const img = screen.getByAltText('Test image');
      expect(img.className).toMatch(/scale-down/);
    });

    it('should apply none object-fit', () => {
      render(
        <Image
          src="https://via.placeholder.com/300"
          alt="Test image"
          loading="eager"
          objectFit="none"
        />
      );
      const img = screen.getByAltText('Test image');
      expect(img.className).toMatch(/none/);
    });
  });

  describe('Click Handler', () => {
    it('should call onClick when image is clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Image
          src="https://via.placeholder.com/300"
          alt="Test image"
          loading="eager"
          onClick={handleClick}
        />
      );

      const container = screen.getByAltText('Test image').parentElement;
      if (container) {
        await user.click(container);
        expect(handleClick).toHaveBeenCalledTimes(1);
      }
    });

    it('should add clickable class when onClick is provided', () => {
      render(
        <Image
          src="https://via.placeholder.com/300"
          alt="Test image"
          loading="eager"
          onClick={() => {}}
        />
      );

      const container = screen.getByAltText('Test image').parentElement;
      expect(container?.className).toMatch(/clickable/);
    });
  });

  describe('Dimensions', () => {
    it('should apply width and height as numbers', () => {
      render(
        <Image
          src="https://via.placeholder.com/300"
          alt="Test image"
          loading="eager"
          width={300}
          height={200}
        />
      );

      const container = screen.getByAltText('Test image').parentElement;
      expect(container).toHaveStyle({ width: '300px', height: '200px' });
    });

    it('should apply width and height as strings', () => {
      render(
        <Image
          src="https://via.placeholder.com/300"
          alt="Test image"
          loading="eager"
          width="100%"
          height="auto"
        />
      );

      const container = screen.getByAltText('Test image').parentElement;
      expect(container).toHaveStyle({ width: '100%', height: 'auto' });
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to img element', () => {
      const ref = { current: null };
      render(
        <Image
          ref={ref}
          src="https://via.placeholder.com/300"
          alt="Test image"
          loading="eager"
        />
      );

      expect(ref.current).toBeInstanceOf(HTMLImageElement);
    });
  });

  describe('Src Changes', () => {
    it('should reset loading state when src changes', async () => {
      const { rerender } = render(
        <Image src="https://via.placeholder.com/300" alt="Test image" loading="eager" />
      );

      const img = screen.getByAltText('Test image');
      fireEvent.load(img);

      await waitFor(() => {
        expect(img.className).not.toMatch(/hidden/);
      });

      // Change src
      rerender(
        <Image src="https://via.placeholder.com/400" alt="Test image" loading="eager" />
      );

      // Should show loading state again
      await waitFor(() => {
        expect(document.querySelector('[role="status"]')).toBeInTheDocument();
      });
    });
  });

  describe('Memory Cleanup', () => {
    it('should disconnect IntersectionObserver on unmount', () => {
      const mockDisconnect = vi.fn();

      window.IntersectionObserver = vi.fn(function (this: IntersectionObserver) {
        return {
          observe: vi.fn(),
          disconnect: mockDisconnect,
          unobserve: vi.fn(),
          root: null,
          rootMargin: '',
          thresholds: [],
          takeRecords: () => [],
        };
      }) as unknown as typeof IntersectionObserver;

      const { unmount } = render(
        <Image src="https://via.placeholder.com/300" alt="Test image" loading="lazy" />
      );

      unmount();

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });
});

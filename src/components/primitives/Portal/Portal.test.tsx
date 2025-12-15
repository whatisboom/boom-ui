import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Portal } from './Portal';

describe('Portal', () => {
  it('should render children in document.body', () => {
    const { container } = render(
      <Portal>
        <div data-testid="portal-content">Portal Content</div>
      </Portal>
    );

    expect(container.firstChild).toBeNull();
    expect(document.body.querySelector('[data-testid="portal-content"]')).toBeInTheDocument();
  });

  it('should render in custom container', () => {
    const customContainer = document.createElement('div');
    customContainer.id = 'custom-portal';
    document.body.appendChild(customContainer);

    render(
      <Portal container={customContainer}>
        <div data-testid="custom-portal-content">Custom Portal</div>
      </Portal>
    );

    expect(customContainer.querySelector('[data-testid="custom-portal-content"]')).toBeInTheDocument();

    document.body.removeChild(customContainer);
  });

  it('should cleanup on unmount', () => {
    const { unmount } = render(
      <Portal>
        <div data-testid="cleanup-test">Cleanup Test</div>
      </Portal>
    );

    expect(document.body.querySelector('[data-testid="cleanup-test"]')).toBeInTheDocument();

    unmount();

    expect(document.body.querySelector('[data-testid="cleanup-test"]')).not.toBeInTheDocument();
  });
});

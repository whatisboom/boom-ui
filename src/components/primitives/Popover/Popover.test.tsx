import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Popover } from './Popover';

describe('Popover', () => {
  it('should render popover when open', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);

    render(
      <Popover isOpen={true} onClose={vi.fn()} anchorEl={anchor}>
        <div>Popover Content</div>
      </Popover>
    );

    expect(screen.getByText('Popover Content')).toBeInTheDocument();

    document.body.removeChild(anchor);
  });

  it('should not render when closed', () => {
    const anchor = document.createElement('button');

    render(
      <Popover isOpen={false} onClose={vi.fn()} anchorEl={anchor}>
        <div>Popover Content</div>
      </Popover>
    );

    expect(screen.queryByText('Popover Content')).not.toBeInTheDocument();
  });

  it('should close on escape key', () => {
    const onClose = vi.fn();
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);

    render(
      <Popover isOpen={true} onClose={onClose} anchorEl={anchor}>
        <div>Content</div>
      </Popover>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);

    document.body.removeChild(anchor);
  });
});

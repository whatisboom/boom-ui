import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { FormMessage } from './FormMessage';

describe('FormMessage', () => {
  it('should render message content', () => {
    render(<FormMessage type="success">Success message</FormMessage>);
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('should apply type class', () => {
    const { container } = render(<FormMessage type="error">Error</FormMessage>);
    const messageElement = container.firstChild as HTMLElement;
    expect(messageElement.className).toContain('formMessageError');
  });

  it('should call onDismiss when dismiss button clicked', async () => {
    const handleDismiss = vi.fn();
    const user = userEvent.setup();

    render(
      <FormMessage type="info" onDismiss={handleDismiss}>
        Info message
      </FormMessage>
    );

    await user.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(handleDismiss).toHaveBeenCalled();
  });
});

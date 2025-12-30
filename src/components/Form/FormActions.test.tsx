import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormActions } from './FormActions';

describe('FormActions', () => {
  it('should render children', () => {
    render(
      <FormActions>
        <button>Submit</button>
        <button>Cancel</button>
      </FormActions>
    );

    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should apply alignment class', () => {
    const { container } = render(
      <FormActions align="left">
        <button>Submit</button>
      </FormActions>
    );

    const actions = container.firstChild as HTMLElement;
    expect(actions.className).toContain('formActionsLeft');
  });
});

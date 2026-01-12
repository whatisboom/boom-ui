import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { axe } from 'vitest-axe';
import { Box } from './Box';

describe('Box', () => {
  it('should render as div by default', () => {
    render(<Box data-testid="box">Content</Box>);
    expect(screen.getByTestId('box').tagName).toBe('DIV');
  });

  it('should render as specified element with "as" prop', () => {
    render(<Box as="section" data-testid="box">Content</Box>);
    expect(screen.getByTestId('box').tagName).toBe('SECTION');
  });

  it('should apply flex display', () => {
    render(<Box display="flex" data-testid="box">Content</Box>);
    expect(screen.getByTestId('box')).toHaveStyle({ display: 'flex' });
  });

  it('should apply flexDirection', () => {
    render(<Box display="flex" flexDirection="column" data-testid="box">Content</Box>);
    expect(screen.getByTestId('box')).toHaveStyle({ flexDirection: 'column' });
  });

  it('should apply alignItems', () => {
    render(<Box display="flex" alignItems="center" data-testid="box">Content</Box>);
    expect(screen.getByTestId('box')).toHaveStyle({ alignItems: 'center' });
  });

  it('should apply justifyContent', () => {
    render(<Box display="flex" justifyContent="space-between" data-testid="box">Content</Box>);
    expect(screen.getByTestId('box')).toHaveStyle({ justifyContent: 'space-between' });
  });

  it('should apply gap using spacing scale', () => {
    render(<Box display="flex" gap={4} data-testid="box">Content</Box>);
    expect(screen.getByTestId('box')).toHaveStyle({ gap: 'var(--boom-spacing-4)' });
  });

  it('should apply padding using spacing scale', () => {
    render(<Box padding={4} data-testid="box">Content</Box>);
    expect(screen.getByTestId('box')).toHaveStyle({ padding: 'var(--boom-spacing-4)' });
  });

  it('should apply margin using spacing scale', () => {
    render(<Box margin={4} data-testid="box">Content</Box>);
    expect(screen.getByTestId('box')).toHaveStyle({ margin: 'var(--boom-spacing-4)' });
  });

  it('should apply width and height', () => {
    render(<Box width="100px" height="50px" data-testid="box">Content</Box>);
    const box = screen.getByTestId('box');
    expect(box).toHaveStyle({ width: '100px', height: '50px' });
  });

  it('should merge custom className', () => {
    render(<Box className="custom" data-testid="box">Content</Box>);
    expect(screen.getByTestId('box')).toHaveClass('custom');
  });

  it('should merge custom styles', () => {
    render(<Box style={{ color: 'red' }} data-testid="box">Content</Box>);
    expect(screen.getByTestId('box')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<Box>Content</Box>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

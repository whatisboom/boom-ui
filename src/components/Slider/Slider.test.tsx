import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Slider } from './Slider';
import styles from './Slider.module.css';

describe('Slider', () => {
  // Basic Rendering Tests - Single Mode
  it('should render single slider with default props', () => {
    const handleChange = vi.fn();
    render(<Slider mode="single" value={50} onChange={handleChange} />);

    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('aria-valuenow', '50');
  });

  it('should render with label', () => {
    const handleChange = vi.fn();
    render(<Slider label="Volume" value={50} onChange={handleChange} />);

    expect(screen.getByText('Volume')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toHaveAttribute('aria-label', 'Volume');
  });

  it('should display current value in label', () => {
    const handleChange = vi.fn();
    render(<Slider label="Brightness" value={75} onChange={handleChange} />);

    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('should use formatValue for display', () => {
    const handleChange = vi.fn();
    const formatValue = (val: number) => `${val}%`;

    render(
      <Slider
        label="Volume"
        value={50}
        onChange={handleChange}
        formatValue={formatValue}
      />
    );

    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '50%');
  });

  it('should auto-generate id for aria-describedby when not provided', () => {
    const handleChange = vi.fn();
    render(
      <Slider
        label="Volume"
        value={50}
        onChange={handleChange}
        helperText="Adjust volume"
      />
    );

    const slider = screen.getByRole('slider');
    const helperText = screen.getByText('Adjust volume');
    expect(slider).toHaveAttribute('aria-describedby', helperText.id);
    expect(helperText.id).toBeTruthy();
  });

  it('should use provided id for error and helper text ids', () => {
    const handleChange = vi.fn();
    render(
      <Slider
        label="Volume"
        value={50}
        onChange={handleChange}
        id="volume"
        error="Too loud"
      />
    );

    const slider = screen.getByRole('slider');
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage.id).toBe('volume-error');
    expect(slider).toHaveAttribute('aria-describedby', 'volume-error');
  });

  // Range Mode Tests
  it('should render range slider with two handles', () => {
    const handleChange = vi.fn();
    render(<Slider mode="range" value={[25, 75]} onChange={handleChange} />);

    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
    expect(sliders[0]).toHaveAttribute('aria-valuenow', '25');
    expect(sliders[1]).toHaveAttribute('aria-valuenow', '75');
  });

  it('should display range in label', () => {
    const handleChange = vi.fn();
    render(<Slider mode="range" label="Price Range" value={[20, 80]} onChange={handleChange} />);

    expect(screen.getByText('20 - 80')).toBeInTheDocument();
  });

  it('should use formatValue for range display', () => {
    const handleChange = vi.fn();
    const formatValue = (val: number) => `$${val}`;

    render(
      <Slider
        mode="range"
        label="Price"
        value={[20, 80]}
        onChange={handleChange}
        formatValue={formatValue}
      />
    );

    expect(screen.getByText('$20 - $80')).toBeInTheDocument();
  });

  it('should label range handles correctly', () => {
    const handleChange = vi.fn();
    render(<Slider mode="range" label="Temperature" value={[20, 80]} onChange={handleChange} />);

    const sliders = screen.getAllByRole('slider');
    expect(sliders[0]).toHaveAttribute('aria-label', 'Temperature minimum');
    expect(sliders[1]).toHaveAttribute('aria-label', 'Temperature maximum');
  });

  // Size Variants
  it('should render with different sizes', () => {
    const handleChange = vi.fn();
    const { rerender, container } = render(
      <Slider size="sm" value={50} onChange={handleChange} />
    );
    expect(container.querySelector(`.${styles.sm}`)).toBeInTheDocument();

    rerender(<Slider size="md" value={50} onChange={handleChange} />);
    expect(container.querySelector(`.${styles.md}`)).toBeInTheDocument();

    rerender(<Slider size="lg" value={50} onChange={handleChange} />);
    expect(container.querySelector(`.${styles.lg}`)).toBeInTheDocument();
  });

  it('should default to md size', () => {
    const handleChange = vi.fn();
    const { container } = render(<Slider value={50} onChange={handleChange} />);
    expect(container.querySelector(`.${styles.md}`)).toBeInTheDocument();
  });

  // State Props
  it('should render disabled state', () => {
    const handleChange = vi.fn();
    render(<Slider disabled value={50} onChange={handleChange} />);

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-disabled', 'true');
    expect(slider).toHaveAttribute('tabIndex', '-1');
  });

  it('should render readonly state', () => {
    const handleChange = vi.fn();
    render(<Slider readOnly value={50} onChange={handleChange} />);

    expect(screen.getByRole('slider')).toHaveAttribute('aria-readonly', 'true');
  });

  it('should render with error state', () => {
    const handleChange = vi.fn();
    render(<Slider label="Volume" value={50} onChange={handleChange} error="Value too low" />);

    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent('Value too low');
  });

  it('should set aria-invalid when error is present', () => {
    const handleChange = vi.fn();
    render(<Slider label="Volume" value={50} onChange={handleChange} error="Invalid value" />);

    expect(screen.getByRole('slider')).toHaveAttribute('aria-invalid', 'true');
  });

  it('should link error message with aria-describedby', () => {
    const handleChange = vi.fn();
    render(
      <Slider
        label="Volume"
        id="volume"
        value={50}
        onChange={handleChange}
        error="Invalid value"
      />
    );

    const slider = screen.getByRole('slider');
    const errorMessage = screen.getByRole('alert');
    expect(slider).toHaveAttribute('aria-describedby', errorMessage.id);
  });

  it('should render helper text', () => {
    const handleChange = vi.fn();
    render(
      <Slider
        label="Volume"
        value={50}
        onChange={handleChange}
        helperText="Adjust the volume level"
      />
    );

    expect(screen.getByText('Adjust the volume level')).toBeInTheDocument();
  });

  it('should hide helper text when error is present', () => {
    const handleChange = vi.fn();
    render(
      <Slider
        label="Volume"
        value={50}
        onChange={handleChange}
        helperText="Adjust volume"
        error="Too loud"
      />
    );

    expect(screen.queryByText('Adjust volume')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Too loud');
  });

  // Min/Max/Step Configuration
  it('should respect min and max values', () => {
    const handleChange = vi.fn();
    render(<Slider value={50} onChange={handleChange} min={0} max={100} />);

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
  });

  it('should use custom min and max', () => {
    const handleChange = vi.fn();
    render(<Slider value={500} onChange={handleChange} min={100} max={1000} />);

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '100');
    expect(slider).toHaveAttribute('aria-valuemax', '1000');
  });

  // Markers
  it('should render markers when showMarkers is true', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Slider
        value={50}
        onChange={handleChange}
        showMarkers
        min={0}
        max={100}
        step={25}
      />
    );

    const markers = container.querySelectorAll(`.${styles.marker}`);
    expect(markers.length).toBeGreaterThan(0);
  });

  it('should render custom markers', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Slider
        value={50}
        onChange={handleChange}
        showMarkers
        markers={[0, 25, 50, 75, 100]}
      />
    );

    const markers = container.querySelectorAll(`.${styles.marker}`);
    expect(markers).toHaveLength(5);
  });

  // Layout
  it('should render full width', () => {
    const handleChange = vi.fn();
    const { container } = render(<Slider fullWidth value={50} onChange={handleChange} />);

    expect(container.querySelector(`.${styles.fullWidth}`)).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Slider className="custom-slider" value={50} onChange={handleChange} />
    );

    expect(container.querySelector('.custom-slider')).toBeInTheDocument();
  });

  // Keyboard Interaction
  it('should handle arrow key navigation', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Slider value={50} onChange={handleChange} min={0} max={100} step={5} />);

    const slider = screen.getByRole('slider');
    slider.focus();

    await user.keyboard('{ArrowRight}');
    expect(handleChange).toHaveBeenCalledWith(55);

    handleChange.mockClear();
    await user.keyboard('{ArrowLeft}');
    expect(handleChange).toHaveBeenCalledWith(45);
  });

  it('should handle arrow up/down keys', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Slider value={50} onChange={handleChange} step={10} />);

    const slider = screen.getByRole('slider');
    slider.focus();

    await user.keyboard('{ArrowUp}');
    expect(handleChange).toHaveBeenCalledWith(60);

    handleChange.mockClear();
    await user.keyboard('{ArrowDown}');
    expect(handleChange).toHaveBeenCalledWith(40);
  });

  it('should handle Home key to jump to min', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Slider value={50} onChange={handleChange} min={0} max={100} />);

    const slider = screen.getByRole('slider');
    slider.focus();

    await user.keyboard('{Home}');
    expect(handleChange).toHaveBeenCalledWith(0);
  });

  it('should handle End key to jump to max', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Slider value={50} onChange={handleChange} min={0} max={100} />);

    const slider = screen.getByRole('slider');
    slider.focus();

    await user.keyboard('{End}');
    expect(handleChange).toHaveBeenCalledWith(100);
  });

  it('should not respond to keyboard when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Slider disabled value={50} onChange={handleChange} />);

    const slider = screen.getByRole('slider');
    slider.focus();

    await user.keyboard('{ArrowRight}');
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should not respond to keyboard when readonly', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Slider readOnly value={50} onChange={handleChange} />);

    const slider = screen.getByRole('slider');
    slider.focus();

    await user.keyboard('{ArrowRight}');
    expect(handleChange).not.toHaveBeenCalled();
  });

  // Range Mode Keyboard Navigation
  it('should handle keyboard navigation for range start handle', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Slider mode="range" value={[20, 80]} onChange={handleChange} step={5} />);

    const sliders = screen.getAllByRole('slider');
    sliders[0].focus();

    await user.keyboard('{ArrowRight}');
    expect(handleChange).toHaveBeenCalledWith([25, 80]);
  });

  it('should handle keyboard navigation for range end handle', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Slider mode="range" value={[20, 80]} onChange={handleChange} step={5} />);

    const sliders = screen.getAllByRole('slider');
    sliders[1].focus();

    await user.keyboard('{ArrowLeft}');
    expect(handleChange).toHaveBeenCalledWith([20, 75]);
  });

  it('should prevent range start from exceeding end', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Slider mode="range" value={[70, 80]} onChange={handleChange} step={20} />);

    const sliders = screen.getAllByRole('slider');
    sliders[0].focus();

    await user.keyboard('{ArrowRight}');
    // Start should be clamped to not exceed end
    expect(handleChange).toHaveBeenCalledWith([80, 80]);
  });

  it('should prevent range end from going below start', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Slider mode="range" value={[20, 30]} onChange={handleChange} step={20} />);

    const sliders = screen.getAllByRole('slider');
    sliders[1].focus();

    await user.keyboard('{ArrowLeft}');
    // End should be clamped to not go below start
    expect(handleChange).toHaveBeenCalledWith([20, 20]);
  });

  // Accessibility Tests
  it('should have no accessibility violations (single mode)', async () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Slider
        label="Volume"
        value={50}
        onChange={handleChange}
        helperText="Adjust the volume level"
      />
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (range mode)', async () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Slider
        mode="range"
        label="Price Range"
        value={[25, 75]}
        onChange={handleChange}
        helperText="Select your price range"
      />
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations when disabled', async () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Slider
        label="Volume"
        value={50}
        onChange={handleChange}
        disabled
      />
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations with error', async () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Slider
        label="Volume"
        value={50}
        onChange={handleChange}
        error="Value is too high"
      />
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

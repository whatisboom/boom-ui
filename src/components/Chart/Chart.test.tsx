import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { axe } from 'vitest-axe';
import { Chart } from './Chart';

const mockData = [
  { name: 'Jan', sales: 400, revenue: 240 },
  { name: 'Feb', sales: 300, revenue: 139 },
  { name: 'Mar', sales: 200, revenue: 980 },
  { name: 'Apr', sales: 278, revenue: 390 },
  { name: 'May', sales: 189, revenue: 480 },
];

describe('Chart', () => {
  describe('Basic rendering', () => {
    it('should render chart container with role img', () => {
      render(<Chart type="line" data={mockData} ariaLabel="Sales chart" />);
      expect(screen.getByRole('img', { name: /sales chart/i })).toBeInTheDocument();
    });

    it('should use default aria-label when not provided', () => {
      render(<Chart type="bar" data={mockData} />);
      expect(screen.getByRole('img', { name: /bar chart/i })).toBeInTheDocument();
    });

    it('should generate aria-description from data', () => {
      render(<Chart type="line" data={mockData} ariaLabel="Chart" />);
      const chart = screen.getByRole('img');
      expect(chart).toHaveAttribute(
        'aria-description',
        'line chart with 2 data series and 5 data points'
      );
    });

    it('should use custom aria-description when provided', () => {
      render(
        <Chart
          type="line"
          data={mockData}
          ariaLabel="Chart"
          ariaDescription="Custom description"
        />
      );
      const chart = screen.getByRole('img');
      expect(chart).toHaveAttribute('aria-description', 'Custom description');
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <Chart type="line" data={mockData} ariaLabel="Sales chart" />
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

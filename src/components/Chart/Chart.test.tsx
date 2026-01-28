import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { axe } from 'vitest-axe';
import { Chart } from './Chart';
import { ThemeProvider } from '../ThemeProvider';

// Wrapper component for tests
const renderChart = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

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
      renderChart(<Chart type="line" data={mockData} ariaLabel="Sales chart" />);
      expect(screen.getByRole('img', { name: /sales chart/i })).toBeInTheDocument();
    });

    it('should use default aria-label when not provided', () => {
      renderChart(<Chart type="bar" data={mockData} />);
      expect(screen.getByRole('img', { name: /bar chart/i })).toBeInTheDocument();
    });

    it('should generate aria-description from data', () => {
      renderChart(<Chart type="line" data={mockData} ariaLabel="Chart" />);
      const chart = screen.getByRole('img');
      expect(chart).toHaveAttribute(
        'aria-description',
        'line chart with 2 data series and 5 data points'
      );
    });

    it('should use custom aria-description when provided', () => {
      renderChart(
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
      const { container } = renderChart(
        <Chart type="line" data={mockData} ariaLabel="Sales chart" />
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe('Line chart', () => {
    it('should render line chart with recharts elements', () => {
      const { container } = renderChart(
        <Chart type="line" data={mockData} ariaLabel="Sales" />
      );
      // Chart should render responsive container
      expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    });

    it('should render multiple lines for multiple series', () => {
      const { container } = renderChart(
        <Chart type="line" data={mockData} ariaLabel="Sales" />
      );
      // Chart should render responsive container
      expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    });

    it('should hide grid when configured', () => {
      const { container } = renderChart(
        <Chart type="line" data={mockData} grid={{ show: false }} />
      );
      expect(container.querySelector('.recharts-cartesian-grid')).not.toBeInTheDocument();
    });

    it('should hide axes when configured', () => {
      const { container } = renderChart(
        <Chart
          type="line"
          data={mockData}
          axis={{ showXAxis: false, showYAxis: false }}
        />
      );
      expect(container.querySelector('.recharts-xAxis')).not.toBeInTheDocument();
      expect(container.querySelector('.recharts-yAxis')).not.toBeInTheDocument();
    });

    it('should have no accessibility violations', async () => {
      const { container } = renderChart(
        <Chart type="line" data={mockData} ariaLabel="Sales chart" />
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

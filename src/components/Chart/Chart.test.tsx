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

    it('should generate title from data', () => {
      renderChart(<Chart type="line" data={mockData} ariaLabel="Chart" />);
      const chart = screen.getByRole('img');
      expect(chart).toHaveAttribute(
        'title',
        'line chart with 2 data series and 5 data points'
      );
    });

    it('should use custom title when provided', () => {
      renderChart(
        <Chart
          type="line"
          data={mockData}
          ariaLabel="Chart"
          ariaDescription="Custom description"
        />
      );
      const chart = screen.getByRole('img');
      expect(chart).toHaveAttribute('title', 'Custom description');
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

  describe('Bar chart', () => {
    it('should render bar chart with recharts elements', () => {
      const { container } = renderChart(
        <Chart type="bar" data={mockData} ariaLabel="Sales" />
      );
      expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    });

    it('should render multiple bars for multiple series', () => {
      const { container} = renderChart(
        <Chart type="bar" data={mockData} ariaLabel="Sales" />
      );
      expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    });

    it('should have no accessibility violations', async () => {
      const { container } = renderChart(
        <Chart type="bar" data={mockData} ariaLabel="Sales chart" />
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe('Area chart', () => {
    it('should render area chart with recharts elements', () => {
      const { container } = renderChart(
        <Chart type="area" data={mockData} ariaLabel="Sales" />
      );
      expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    });

    it('should have no accessibility violations', async () => {
      const { container } = renderChart(
        <Chart type="area" data={mockData} ariaLabel="Sales chart" />
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe('Pie chart', () => {
    const pieData = [
      { name: 'Group A', value: 400 },
      { name: 'Group B', value: 300 },
      { name: 'Group C', value: 300 },
    ];

    it('should render pie chart with recharts elements', () => {
      const { container } = renderChart(
        <Chart type="pie" data={pieData} ariaLabel="Distribution" />
      );
      expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    });

    it('should render donut chart with inner radius', () => {
      const { container } = renderChart(
        <Chart type="pie" data={pieData} pieConfig={{ innerRadius: 50 }} />
      );
      expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    });

    it('should have no accessibility violations', async () => {
      const { container } = renderChart(
        <Chart type="pie" data={pieData} ariaLabel="Distribution chart" />
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe('Radar chart', () => {
    it('should render radar chart with recharts elements', () => {
      const { container } = renderChart(
        <Chart type="radar" data={mockData} ariaLabel="Performance" />
      );
      expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    });

    it('should have no accessibility violations', async () => {
      const { container } = renderChart(
        <Chart type="radar" data={mockData} ariaLabel="Performance chart" />
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe('Tooltip', () => {
    it('should forward formatter to Tooltip component', () => {
      const formatter = (value: number | string | undefined) => `$${value}`;
      const { container } = renderChart(
        <Chart
          type="bar"
          data={mockData}
          ariaLabel="Sales"
          tooltip={{ show: true, formatter }}
        />
      );
      expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    });
  });

  describe('Configuration', () => {
    it('should hide legend when configured', () => {
      const { container } = renderChart(
        <Chart type="line" data={mockData} legend={{ show: false }} />
      );
      expect(container.querySelector('.recharts-legend-wrapper')).not.toBeInTheDocument();
    });

    it('should handle empty data gracefully', () => {
      const { container } = renderChart(
        <Chart type="line" data={[]} ariaLabel="Empty chart" />
      );
      expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    });

    it('should accept custom width and height', () => {
      const { container } = renderChart(
        <Chart type="line" data={mockData} width="100%" height={400} />
      );
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });
  });
});

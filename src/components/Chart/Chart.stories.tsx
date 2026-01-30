import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chart } from './Chart';

const sampleData = [
  { name: 'Jan', sales: 4000, revenue: 2400, expenses: 2400 },
  { name: 'Feb', sales: 3000, revenue: 1398, expenses: 2210 },
  { name: 'Mar', sales: 2000, revenue: 9800, expenses: 2290 },
  { name: 'Apr', sales: 2780, revenue: 3908, expenses: 2000 },
  { name: 'May', sales: 1890, revenue: 4800, expenses: 2181 },
  { name: 'Jun', sales: 2390, revenue: 3800, expenses: 2500 },
];

const pieData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 278 },
];

const radarData = [
  { name: 'Speed', value: 80, max: 100 },
  { name: 'Strength', value: 120, max: 150 },
  { name: 'Defense', value: 85, max: 100 },
  { name: 'Agility', value: 95, max: 100 },
  { name: 'Intelligence', value: 110, max: 150 },
];

const meta = {
  title: 'Data Visualization/Chart',
  component: Chart,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['line', 'bar', 'area', 'pie', 'radar'],
    },
    width: {
      control: 'text',
    },
    height: {
      control: 'number',
    },
  },
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Line Chart Stories
export const LineChart: Story = {
  args: {
    type: 'line',
    data: sampleData,
    ariaLabel: 'Monthly sales, revenue, and expenses',
  },
};

export const LineChartNoGrid: Story = {
  args: {
    type: 'line',
    data: sampleData,
    grid: { show: false },
    ariaLabel: 'Monthly sales without grid',
  },
};

export const LineChartCustomColors: Story = {
  args: {
    type: 'line',
    data: sampleData,
    colors: {
      seriesColors: {
        sales: '#ff6b6b',
        revenue: '#51cf66',
        expenses: '#ffd43b',
      },
    },
    ariaLabel: 'Monthly data with custom colors',
  },
};

// Bar Chart Stories
export const BarChart: Story = {
  args: {
    type: 'bar',
    data: sampleData,
    ariaLabel: 'Monthly sales, revenue, and expenses as bars',
  },
};

export const BarChartWithLabels: Story = {
  args: {
    type: 'bar',
    data: sampleData,
    axis: {
      xAxisLabel: 'Month',
      yAxisLabel: 'Amount ($)',
    },
    ariaLabel: 'Monthly financial data with axis labels',
  },
};

// Area Chart Stories
export const AreaChart: Story = {
  args: {
    type: 'area',
    data: sampleData,
    ariaLabel: 'Monthly sales, revenue, and expenses as areas',
  },
};

// Pie Chart Stories
export const PieChart: Story = {
  args: {
    type: 'pie',
    data: pieData,
    height: 400,
    ariaLabel: 'Distribution by group',
  },
};

export const DonutChart: Story = {
  args: {
    type: 'pie',
    data: pieData,
    height: 400,
    pieConfig: {
      innerRadius: 50,
      outerRadius: 80,
    },
    ariaLabel: 'Distribution as donut chart',
  },
};

export const PieChartNoLabels: Story = {
  args: {
    type: 'pie',
    data: pieData,
    height: 400,
    pieConfig: {
      showLabels: false,
    },
    legend: { show: true, position: 'right' },
    ariaLabel: 'Distribution without slice labels',
  },
};

// Radar Chart Stories
export const RadarChart: Story = {
  args: {
    type: 'radar',
    data: radarData,
    height: 400,
    ariaLabel: 'Character stats comparison',
  },
};

// Configuration Examples
export const NoLegend: Story = {
  args: {
    type: 'line',
    data: sampleData,
    legend: { show: false },
    ariaLabel: 'Chart without legend',
  },
};

export const NoTooltip: Story = {
  args: {
    type: 'bar',
    data: sampleData,
    tooltip: { show: false },
    ariaLabel: 'Chart without tooltip',
  },
};

export const CustomHeight: Story = {
  args: {
    type: 'area',
    data: sampleData,
    height: 500,
    ariaLabel: 'Chart with custom height',
  },
};

export const NoAnimation: Story = {
  args: {
    type: 'line',
    data: sampleData,
    disableAnimation: true,
    ariaLabel: 'Chart without animations',
  },
};

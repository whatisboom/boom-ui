import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './Breadcrumbs';
import { Box } from '@/components/Box';

const meta = {
  title: 'Components/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Breadcrumbs provide hierarchical navigation showing the current page location within the site structure.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: [] },
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
      <Breadcrumbs.Item current>Product Name</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};

export const WithCustomSeparator: Story = {
  args: { children: [] },
  render: () => (
    <Breadcrumbs separator=">">
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/category">Category</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/subcategory">Subcategory</Breadcrumbs.Item>
      <Breadcrumbs.Item current>Product</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};

export const WithIconSeparator: Story = {
  args: { children: [] },
  render: () => {
    const ChevronIcon = () => (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        style={{ opacity: 0.5 }}
      >
        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    );

    return (
      <Breadcrumbs separator={<ChevronIcon />}>
        <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/category">Category</Breadcrumbs.Item>
        <Breadcrumbs.Item current>Product Name</Breadcrumbs.Item>
      </Breadcrumbs>
    );
  },
};

export const MaxItems: Story = {
  args: { children: [] },
  render: () => (
    <Box display="flex" flexDirection="column" gap={6}>
      <div>
        <p style={{ marginBottom: '8px', color: 'var(--boom-color-text-secondary)' }}>
          maxItems=3 (5 total items)
        </p>
        <Breadcrumbs maxItems={3}>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/category">Category</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/subcategory">Subcategory</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
          <Breadcrumbs.Item current>Product Name</Breadcrumbs.Item>
        </Breadcrumbs>
      </div>

      <div>
        <p style={{ marginBottom: '8px', color: 'var(--boom-color-text-secondary)' }}>
          maxItems=4 (7 total items)
        </p>
        <Breadcrumbs maxItems={4}>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/category">Category</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/subcategory">Subcategory</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/type">Type</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/subtype">Subtype</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
          <Breadcrumbs.Item current>Product Name</Breadcrumbs.Item>
        </Breadcrumbs>
      </div>
    </Box>
  ),
};

export const SingleItem: Story = {
  args: { children: [] },
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.Item current>Home</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};

export const TwoLevels: Story = {
  args: { children: [] },
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item current>About</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};

export const DeepNavigation: Story = {
  args: { children: [] },
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/blog">Blog</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/blog/2024">2024</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/blog/2024/01">January</Breadcrumbs.Item>
      <Breadcrumbs.Item current>How to Build a Design System</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};

export const EcommercePath: Story = {
  args: { children: [] },
  render: () => (
    <Breadcrumbs separator=">">
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/electronics">Electronics</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/electronics/computers">Computers</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/electronics/computers/laptops">Laptops</Breadcrumbs.Item>
      <Breadcrumbs.Item current>MacBook Pro 16&quot;</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};

export const WithCustomElement: Story = {
  args: { children: [] },
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.Item as="button" onClick={() => alert('Go to Home')}>
        Home
      </Breadcrumbs.Item>
      <Breadcrumbs.Item as="button" onClick={() => alert('Go to Products')}>
        Products
      </Breadcrumbs.Item>
      <Breadcrumbs.Item current>Product Name</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};

export const LongItemNames: Story = {
  args: { children: [] },
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/category">
        A Very Long Category Name That Might Wrap
      </Breadcrumbs.Item>
      <Breadcrumbs.Item href="/subcategory">
        Another Long Subcategory Name
      </Breadcrumbs.Item>
      <Breadcrumbs.Item current>
        An Extremely Long Product Name That Demonstrates Text Handling
      </Breadcrumbs.Item>
    </Breadcrumbs>
  ),
};

export const DifferentSeparators: Story = {
  args: { children: [] },
  render: () => (
    <Box display="flex" flexDirection="column" gap={6}>
      <div>
        <p style={{ marginBottom: '8px', color: 'var(--boom-color-text-secondary)' }}>
          Default (/)
        </p>
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
          <Breadcrumbs.Item current>Item</Breadcrumbs.Item>
        </Breadcrumbs>
      </div>

      <div>
        <p style={{ marginBottom: '8px', color: 'var(--boom-color-text-secondary)' }}>
          Greater than (&gt;)
        </p>
        <Breadcrumbs separator=">">
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
          <Breadcrumbs.Item current>Item</Breadcrumbs.Item>
        </Breadcrumbs>
      </div>

      <div>
        <p style={{ marginBottom: '8px', color: 'var(--boom-color-text-secondary)' }}>
          Dash (-)
        </p>
        <Breadcrumbs separator="-">
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
          <Breadcrumbs.Item current>Item</Breadcrumbs.Item>
        </Breadcrumbs>
      </div>

      <div>
        <p style={{ marginBottom: '8px', color: 'var(--boom-color-text-secondary)' }}>
          Bullet (•)
        </p>
        <Breadcrumbs separator="•">
          <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
          <Breadcrumbs.Item current>Item</Breadcrumbs.Item>
        </Breadcrumbs>
      </div>
    </Box>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './Breadcrumbs';
import { BreadcrumbItem } from './BreadcrumbItem';
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
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem current>Product Name</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const WithCustomSeparator: Story = {
  args: { children: [] },
  render: () => (
    <Breadcrumbs separator=">">
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/category">Category</BreadcrumbItem>
      <BreadcrumbItem href="/subcategory">Subcategory</BreadcrumbItem>
      <BreadcrumbItem current>Product</BreadcrumbItem>
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
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem href="/category">Category</BreadcrumbItem>
        <BreadcrumbItem current>Product Name</BreadcrumbItem>
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
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/category">Category</BreadcrumbItem>
          <BreadcrumbItem href="/subcategory">Subcategory</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
          <BreadcrumbItem current>Product Name</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div>
        <p style={{ marginBottom: '8px', color: 'var(--boom-color-text-secondary)' }}>
          maxItems=4 (7 total items)
        </p>
        <Breadcrumbs maxItems={4}>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/category">Category</BreadcrumbItem>
          <BreadcrumbItem href="/subcategory">Subcategory</BreadcrumbItem>
          <BreadcrumbItem href="/type">Type</BreadcrumbItem>
          <BreadcrumbItem href="/subtype">Subtype</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
          <BreadcrumbItem current>Product Name</BreadcrumbItem>
        </Breadcrumbs>
      </div>
    </Box>
  ),
};

export const SingleItem: Story = {
  args: { children: [] },
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem current>Home</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const TwoLevels: Story = {
  args: { children: [] },
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem current>About</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const DeepNavigation: Story = {
  args: { children: [] },
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/blog">Blog</BreadcrumbItem>
      <BreadcrumbItem href="/blog/2024">2024</BreadcrumbItem>
      <BreadcrumbItem href="/blog/2024/01">January</BreadcrumbItem>
      <BreadcrumbItem current>How to Build a Design System</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const EcommercePath: Story = {
  args: { children: [] },
  render: () => (
    <Breadcrumbs separator=">">
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/electronics">Electronics</BreadcrumbItem>
      <BreadcrumbItem href="/electronics/computers">Computers</BreadcrumbItem>
      <BreadcrumbItem href="/electronics/computers/laptops">Laptops</BreadcrumbItem>
      <BreadcrumbItem current>MacBook Pro 16&quot;</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const WithCustomElement: Story = {
  args: { children: [] },
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem as="button" onClick={() => alert('Go to Home')}>
        Home
      </BreadcrumbItem>
      <BreadcrumbItem as="button" onClick={() => alert('Go to Products')}>
        Products
      </BreadcrumbItem>
      <BreadcrumbItem current>Product Name</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const LongItemNames: Story = {
  args: { children: [] },
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/category">
        A Very Long Category Name That Might Wrap
      </BreadcrumbItem>
      <BreadcrumbItem href="/subcategory">
        Another Long Subcategory Name
      </BreadcrumbItem>
      <BreadcrumbItem current>
        An Extremely Long Product Name That Demonstrates Text Handling
      </BreadcrumbItem>
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
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
          <BreadcrumbItem current>Item</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div>
        <p style={{ marginBottom: '8px', color: 'var(--boom-color-text-secondary)' }}>
          Greater than (&gt;)
        </p>
        <Breadcrumbs separator=">">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
          <BreadcrumbItem current>Item</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div>
        <p style={{ marginBottom: '8px', color: 'var(--boom-color-text-secondary)' }}>
          Dash (-)
        </p>
        <Breadcrumbs separator="-">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
          <BreadcrumbItem current>Item</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div>
        <p style={{ marginBottom: '8px', color: 'var(--boom-color-text-secondary)' }}>
          Bullet (•)
        </p>
        <Breadcrumbs separator="•">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/products">Products</BreadcrumbItem>
          <BreadcrumbItem current>Item</BreadcrumbItem>
        </Breadcrumbs>
      </div>
    </Box>
  ),
};

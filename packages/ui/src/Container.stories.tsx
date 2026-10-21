import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from './Container';

const meta = {
  title: 'Primitives/Container',
  component: Container,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: null },
  render: () => (
    <Container className="py-section-sm">
      <div className="rounded-card border border-dashed border-primary-2 bg-white p-4 text-small text-neutral-600">
        Content is centered at max-w-page (1200px) with responsive padding.
      </div>
    </Container>
  ),
};

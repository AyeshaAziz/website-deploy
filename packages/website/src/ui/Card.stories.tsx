import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta = {
  title: 'Primitives/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Card className="w-80">
      <h3 className="font-heading text-h3 text-primary-neg1">Course title</h3>
      <p className="mt-2 text-small text-neutral-600">
        A short summary of the course content that wraps onto a second line.
      </p>
    </Card>
  ),
};

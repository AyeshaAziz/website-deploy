import type { Meta, StoryObj } from '@storybook/react-vite';
import type { BadgeTone } from './Badge';
import { Badge } from './Badge';

const TONES: BadgeTone[] = ['primary', 'gold', 'success', 'danger'];

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { tone: { control: 'select', options: TONES } },
  args: { children: 'Badge', tone: 'primary' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {TONES.map((tone) => (
        <Badge key={tone} tone={tone}>
          {tone}
        </Badge>
      ))}
    </div>
  ),
};

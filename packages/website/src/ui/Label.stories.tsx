import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './Label';

const meta = {
  title: 'Primitives/Label',
  component: Label,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { children: 'Label text' },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

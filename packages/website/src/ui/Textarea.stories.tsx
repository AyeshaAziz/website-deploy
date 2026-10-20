import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './Label';
import { Textarea } from './Textarea';

const meta = {
  title: 'Primitives/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { placeholder: 'Write a message…', rows: 4 },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Textarea {...args} className="w-96" />,
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Disabled textarea' },
  render: (args) => <Textarea {...args} className="w-96" />,
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-96">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" rows={4} placeholder="Write a message…" className="mt-1" />
    </div>
  ),
};

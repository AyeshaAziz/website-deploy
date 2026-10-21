import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';
import { Label } from './Label';

const meta = {
  title: 'Primitives/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { placeholder: 'you@example.com' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Input {...args} className="w-72" />,
};

export const Disabled: Story = {
  args: { disabled: true, value: 'hello@itqa.org' },
  render: (args) => <Input {...args} className="w-72" />,
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-72">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" className="mt-1" />
    </div>
  ),
};

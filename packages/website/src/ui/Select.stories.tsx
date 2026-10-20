import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './Label';
import { Select } from './Select';

const meta = {
  title: 'Primitives/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { defaultValue: 'gm' },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Select {...args} className="w-72">
      <option value="gm">Hifz — General</option>
      <option value="amma">Juz Amma</option>
      <option value="nazirah">Nazirah</option>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-72">
      <Label htmlFor="course">Course</Label>
      <Select id="course" defaultValue="gm" className="mt-1">
        <option value="gm">Hifz — General</option>
        <option value="amma">Juz Amma</option>
        <option value="nazirah">Nazirah</option>
      </Select>
    </div>
  ),
};

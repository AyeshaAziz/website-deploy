import type { Meta, StoryObj } from '@storybook/react-vite';
import { Notice } from './Notice';

const meta = {
  title: 'Primitives/Notice',
  component: Notice,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Notice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: { title: 'Before you register' },
  render: (args) => (
    <Notice {...args} className="w-96">
      <p>Applications must be filled in by a parent or guardian.</p>
      <p>Classes are taught from Monday to Thursday.</p>
    </Notice>
  ),
};

export const Gold: Story = {
  args: { title: 'Registration dates', tone: 'gold' },
  render: (args) => (
    <Notice {...args} className="w-96">
      <p>Semester 1 registration: 1st May – 31st May.</p>
    </Notice>
  ),
};

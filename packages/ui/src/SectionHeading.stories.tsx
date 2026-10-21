import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeading } from './SectionHeading';

const meta = {
  title: 'Primitives/SectionHeading',
  component: SectionHeading,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    title: 'Featured courses',
    subtitle: 'Structured programmes for every level, taught by certified teachers.',
  },
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-[32rem]">
      <SectionHeading {...args} />
    </div>
  ),
};

export const WithArabicSubtitle: Story = {
  args: {
    title: 'About the academy',
    arabicSubtitle: 'أكاديمية التعليم القرآني',
  },
  render: (args) => (
    <div className="w-[32rem]">
      <SectionHeading {...args} />
    </div>
  ),
};

export const Centered: Story = {
  args: { align: 'center' },
  render: (args) => (
    <div className="w-[32rem]">
      <SectionHeading {...args} />
    </div>
  ),
};

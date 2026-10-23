import type { Meta, StoryObj } from '@storybook/react-vite';
import { FALLBACK_COURSES } from '@itqa/core';
import { CourseCard } from './CourseCard';

const meta = {
  title: 'Sections/CourseCard',
  component: CourseCard,
  tags: ['autodocs'],
  args: {
    course: FALLBACK_COURSES[0],
  },
  decorators: [
    (Story) => (
      <div className="max-w-[380px] bg-gradient-to-b from-primary-5 to-primary-2 p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CourseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutImage: Story = {
  args: {
    course: { ...FALLBACK_COURSES[1], imageUrl: null },
  },
};

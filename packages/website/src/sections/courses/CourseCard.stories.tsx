import type { Meta, StoryObj } from '@storybook/react-vite';
import { COURSE_FIXTURES } from '@itqasys/core/fixtures';
import { CourseCard } from './CourseCard';

const meta = {
  title: 'Sections/CourseCard',
  component: CourseCard,
  tags: ['autodocs'],
  args: {
    course: COURSE_FIXTURES[0],
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
    course: { ...COURSE_FIXTURES[1], imageUrl: null },
  },
};

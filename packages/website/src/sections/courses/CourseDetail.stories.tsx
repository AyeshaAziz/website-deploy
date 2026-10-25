import type { Meta, StoryObj } from '@storybook/react-vite';
import { COURSE_FIXTURES } from '@itqasys/core/fixtures';
import { CourseDetail } from './CourseDetail';

const meta = {
  title: 'Sections/CourseDetail',
  component: CourseDetail,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    course: COURSE_FIXTURES[0],
  },
} satisfies Meta<typeof CourseDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutImage: Story = {
  args: {
    course: { ...COURSE_FIXTURES[1], imageUrl: null },
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { FALLBACK_COURSES } from '@itqa/core';
import { CoursesPageSections } from './CoursesPageSections';

const meta = {
  title: 'Sections/CoursesPageSections',
  component: CoursesPageSections,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof CoursesPageSections>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { courses: FALLBACK_COURSES },
};

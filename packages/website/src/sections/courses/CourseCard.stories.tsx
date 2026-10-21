import type { Meta, StoryObj } from '@storybook/react-vite';
import { CourseCard } from './CourseCard';

const meta = {
  title: 'Sections/CourseCard',
  component: CourseCard,
  tags: ['autodocs'],
  args: {
    course: {
      id: '1',
      urlPath: 'naziratul-quran',
      title: "Naziratul-Qur'an",
      summary: 'Recitation',
      imageUrl: '/images/courses/naziratul-quran.png',
    },
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
    course: {
      id: '2',
      urlPath: 'yassarnal-quran',
      title: "Yassarnal-Qur'an",
      summary: 'Qaidah',
      imageUrl: null,
    },
  },
};

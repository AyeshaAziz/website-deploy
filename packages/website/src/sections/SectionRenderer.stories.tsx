import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CourseDTO, ResourceDTO, SectionDTO } from '@itqa/core';
import { SectionRenderer } from './SectionRenderer';

const courses: CourseDTO[] = [
  { id: '1', urlPath: 'naziratul-quran', title: "Naziratul-Qur'an", summary: 'Recitation', imageUrl: '/images/courses/naziratul-quran.png' },
  { id: '2', urlPath: 'yassarnal-quran', title: "Yassarnal-Qur'an", summary: 'Qaidah', imageUrl: '/images/courses/yassarnal-quran.png' },
  { id: '3', urlPath: 'tafsirul-quran', title: "Tafsirul-Qur'an", summary: 'Interpretation', imageUrl: '/images/courses/tafsirul-quran.png' },
  { id: '4', urlPath: 'qawaidul-quran', title: "Qawaidul-Qur'an", summary: 'Grammar', imageUrl: '/images/courses/qawaidul-quran.png' },
  { id: '5', urlPath: 'tarjamatul-quran', title: "Tarjamatul-Qur'an", summary: 'Translation', imageUrl: '/images/courses/tarjamatul-quran.png' },
];

const resources: ResourceDTO[] = [
  { id: '1', title: 'Qaida Noorania', url: '#', kind: 'PDF', description: 'Starter reading guide.' },
  { id: '2', title: 'Tajweed rules', url: '#', kind: 'Article', description: 'Quick reference.' },
];

const section = (type: SectionDTO['type'], content: SectionDTO['content']): SectionDTO => ({
  id: type,
  type,
  order: 0,
  visible: true,
  content,
});

const home = section('HOME', {
  heading: 'Learn the Qur’an, wherever you are',
  subheading: 'Live, certified teachers and a structured curriculum for children and adults.',
  ctaLabel: 'Explore courses',
  ctaHref: '/courses',
});

const text = section('TEXT', {
  heading: 'Our mission',
  body: 'ITQA makes authentic Qur’an education accessible to every learner.\n\nWe combine live instruction with modern tools so progress is steady and measurable.',
});

const featuredCourses = section('FEATURED_COURSES', { heading: 'Featured courses' });
const multimedia = section('MULTIMEDIA', {});
const featuredResources = section('FEATURED_RESOURCES', { heading: 'Study resources' });
const cta = section('CTA', { heading: 'Ready to begin?', label: 'Get started', href: '/contact' });

const meta = {
  title: 'Sections/SectionRenderer',
  component: SectionRenderer,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: { section: home, courses, resources },
} satisfies Meta<typeof SectionRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {
  render: () => <SectionRenderer section={home} courses={courses} resources={resources} />,
};

export const TextBlock: Story = {
  render: () => <SectionRenderer section={text} courses={courses} resources={resources} />,
};

export const FeaturedCourses: Story = {
  render: () => <SectionRenderer section={featuredCourses} courses={courses} resources={resources} />,
};

export const MultimediaSection: Story = {
  render: () => <SectionRenderer section={multimedia} courses={courses} resources={resources} />,
};

export const FeaturedResources: Story = {
  render: () => <SectionRenderer section={featuredResources} courses={courses} resources={resources} />,
};

export const CallToAction: Story = {
  render: () => <SectionRenderer section={cta} courses={courses} resources={resources} />,
};

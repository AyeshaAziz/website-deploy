import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CourseDTO, ResourceDTO, SectionDTO } from '@itqa/shared';
import { SectionRenderer } from './Sections';

const courses: CourseDTO[] = [
  { id: '1', slug: 'hifz-foundation', title: 'Hifz — Foundation', summary: 'Memorise Juz Amma with tajweed and revision.' },
  { id: '2', slug: 'nazirah', title: 'Nazirah', summary: 'Fluency in reading the Qur’an with correct pronunciation.' },
  { id: '3', slug: 'tafseer-basics', title: 'Tafseer Basics', summary: 'Introduction to the meanings of the Qur’an.' },
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

const hero = section('HERO', {
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
const featuredResources = section('FEATURED_RESOURCES', { heading: 'Study resources' });
const cta = section('CTA', { heading: 'Ready to begin?', label: 'Get started', href: '/contact' });

const meta = {
  title: 'Sections/SectionRenderer',
  component: SectionRenderer,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: { section: hero, courses, resources },
} satisfies Meta<typeof SectionRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hero: Story = {
  render: () => <SectionRenderer section={hero} courses={courses} resources={resources} />,
};

export const TextBlock: Story = {
  render: () => <SectionRenderer section={text} courses={courses} resources={resources} />,
};

export const FeaturedCourses: Story = {
  render: () => <SectionRenderer section={featuredCourses} courses={courses} resources={resources} />,
};

export const FeaturedResources: Story = {
  render: () => <SectionRenderer section={featuredResources} courses={courses} resources={resources} />,
};

export const CallToAction: Story = {
  render: () => <SectionRenderer section={cta} courses={courses} resources={resources} />,
};

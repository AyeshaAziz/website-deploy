import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@itqa/ui';
import { getCourse } from '@/lib/content';

export const revalidate = 3600;

type Props = { params: { course: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourse(params.course);
  return course ? { title: course.title, description: course.summary } : {};
}

export default async function CoursePage({ params }: Props) {
  const course = await getCourse(params.course);
  if (!course) notFound();
  return (
    <Container className="py-section-sm">
      <article className="mx-auto max-w-3xl">
        <h1 className="font-heading text-h1 text-primary-neg2">{course.title}</h1>
        <p className="mt-4 text-body text-neutral-700">{course.summary}</p>
        {course.description && <p className="mt-6 text-body text-neutral-800">{course.description}</p>}
      </article>
    </Container>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CourseDetail } from '@itqa/website';
import { getCourse } from '@/lib/courses';

export const revalidate = 3600;

type Props = { params: Promise<{ course: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course: urlPath } = await params;
  const course = await getCourse(urlPath);

  if (!course) return {};

  return {
    title: course.title,
    description: course.description ?? course.summary,
  };
}

export default async function CoursePage({ params }: Props) {
  const { course: urlPath } = await params;
  const course = await getCourse(urlPath);

  if (!course) notFound();

  return <CourseDetail course={course} />;
}

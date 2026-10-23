import type { Metadata } from 'next';
import { CoursesPageSections } from '@itqa/website';
import { getCourses } from '@/lib/content';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Courses',
  description: 'Qur’an courses for children and adults at the International Ta’limul-Qur’an Academy.',
};

export default async function CoursesPage() {
  const courses = await getCourses();
  return <CoursesPageSections courses={courses} />;
}

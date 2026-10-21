import type { Metadata } from 'next';
import { Container, SectionHeading } from '@itqa/ui';
import { CourseCard } from '@itqa/website';
import { getCourses } from '@/lib/content';

export const revalidate = 3600;
export const metadata: Metadata = { title: 'Courses' };

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <Container className="py-section-sm">
      <SectionHeading as="h1" title="Courses" className="mb-6" />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <li key={c.id}>
            <CourseCard course={c} />
          </li>
        ))}
      </ul>
    </Container>
  );
}

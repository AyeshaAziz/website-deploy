import type { ReactNode } from 'react';
import { str } from '@itqasys/core';
import type { CourseDTO, SectionDTO } from '@itqasys/core';
import { Container, ButtonLink } from '@itqa/ui';
import { CourseCard } from './CourseCard';

export interface FeaturedCoursesProps {
  content: SectionDTO['content'];
  courses: CourseDTO[];
}

export function FeaturedCourses({ content, courses }: FeaturedCoursesProps): ReactNode {
  if (courses.length === 0) return null;
  return (
    <section className="bg-courses-section py-8 sm:py-10 border-t border-primary-5">
      <Container>
        <h2 className="mb-5 font-cabin text-h2 font-bold uppercase tracking-wide text-primary-8 sm:mb-7">
          {str(content.heading, 'ITQA Courses')}
        </h2>
        <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {courses.map((course) => (
            <li
              key={course.id}
              className="w-full max-w-[380px] sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <CourseCard course={course} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

import type { ReactNode } from 'react';
import { cn } from '@itqa/core';
import type { CourseDTO } from '@itqa/core';
import { Container } from '@itqa/ui';
import { StudentCoursesCarousel } from './StudentCoursesCarousel';

export interface StudentCoursesProps {
  courses: CourseDTO[];
  heading?: string;
  className?: string;
}

export function StudentCourses({
  courses,
  heading = 'ITQA Courses for Students',
  className,
}: StudentCoursesProps): ReactNode {
  if (courses.length === 0) return null;

  return (
    <section className={cn('bg-primary-neg1 py-10 sm:py-14', className)}>
      <Container>
        <h2 className="text-center font-cabin text-h2 font-bold text-white sm:text-h1">
          {heading}
        </h2>
        <StudentCoursesCarousel courses={courses} className="mt-8" />
      </Container>
    </section>
  );
}

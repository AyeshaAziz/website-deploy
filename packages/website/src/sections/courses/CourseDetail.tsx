import type { ReactNode } from 'react';
import { cn } from '@itqasys/core';
import type { CourseDTO } from '@itqasys/core';
import { ButtonLink, Container } from '@itqa/ui';
import { CourseGlyph } from './CourseGlyph';

export interface CourseDetailProps {
  course: CourseDTO;
  className?: string;
}

export function CourseDetail({ course, className }: CourseDetailProps): ReactNode {
  return (
    <section className={cn('bg-primary-neg1 py-10 sm:py-14', className)}>
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex min-h-72 items-center justify-center rounded-card bg-white p-8 shadow-card">
            {course.imageUrl ? (
              <img
                src={course.imageUrl}
                alt={course.title}
                className="max-h-72 w-full object-contain"
              />
            ) : (
              <CourseGlyph />
            )}
          </div>

          <div className="text-white">
            <p className="font-cabin text-small font-semibold uppercase tracking-wide text-primary-4">
              {course.summary}
            </p>
            <h1 className="mt-3 font-cabin text-h1 font-bold leading-tight">
              {course.title}
            </h1>
            <p className="mt-5 text-body leading-relaxed text-primary-5">
              {course.description ?? course.summary}
            </p>
            <ButtonLink
              href={`/register?course=${encodeURIComponent(course.urlPath)}`}
              variant="gold"
              size="lg"
              className="mt-8"
            >
              Register for this course
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

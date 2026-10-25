'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@itqasys/core';
import type { CourseDTO } from '@itqasys/core';
import { CourseGlyph } from './CourseGlyph';

export interface CourseCardProps {
  course: CourseDTO;
  className?: string;
}

export function CourseCard({ course, className }: CourseCardProps): ReactNode {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(course.imageUrl) && !imageFailed;

  return (
    <a
      href={`/register?course=${encodeURIComponent(course.urlPath)}`}
      aria-label={`Register for ${course.title}`}
      className={cn(
        'group flex h-full items-center gap-4 rounded-card bg-course-card p-4 shadow-lg shadow-primary-7/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-7/25',
        className,
      )}
    >
      <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md sm:h-24 sm:w-24">
        {showImage ? (
          <img
            src={course.imageUrl as string}
            alt=""
            loading="lazy"
            draggable={false}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-contain"
          />
        ) : (
          <CourseGlyph />
        )}
      </span>
      <span className="min-w-0">
        <span className="block font-cabin text-h3 font-bold leading-tight text-primary-7 transition-colors group-hover:text-primary-1">
          {course.title}
        </span>
        <span className="mt-1 block text-small leading-snug text-neutral-600">{course.summary}</span>
      </span>
    </a>
  );
}

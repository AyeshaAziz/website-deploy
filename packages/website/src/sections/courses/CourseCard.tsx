'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@itqa/core';
import type { CourseDTO } from '@itqa/core';

export interface CourseCardProps {
  course: CourseDTO;
  className?: string;
}

function BookGlyph(): ReactNode {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-10 w-10 text-primary-2" fill="none">
      <path
        d="M32 14c-5-3-11-4-17-3v35c6-1 12 0 17 3 5-3 11-4 17-3V11c-6-1-12 0-17 3Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M32 14v35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function CourseCard({ course, className }: CourseCardProps): ReactNode {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(course.imageUrl) && !imageFailed;

  return (
    <a
      href={`/courses/${course.urlPath}`}
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
          <BookGlyph />
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

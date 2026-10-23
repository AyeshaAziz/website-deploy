'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@itqa/core';
import type { CourseDTO } from '@itqa/core';
import { CourseGlyph } from './CourseGlyph';

export interface StudentCourseCardProps {
  course: CourseDTO;
  className?: string;
}

export function StudentCourseCard({ course, className }: StudentCourseCardProps): ReactNode {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(course.imageUrl) && !imageFailed;
  return (
    <article
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-card bg-primary-1 shadow-playlist-card transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-5/25',
        className,
      )}
    >
      <a
        href={`/register?course=${encodeURIComponent(course.urlPath)}`}
        aria-label={`Register for ${course.title}`}
        className="flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-2"
      >
        <div className="bg-primary-8 px-4 py-2 text-center font-cabin text-h3 font-bold text-white">
          <h3>{course.title}</h3>
        </div>
        <div className="flex h-36 items-center justify-center bg-white p-4">
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
        </div>
        <div className="flex flex-1 flex-col bg-primary-1 p-4 text-center">
          <p className="text-small leading-relaxed text-white">
            {course.description ?? course.summary}
          </p>
        </div>
      </a>

      <div className="px-4 pb-4 text-center">
        <a
          href={`/register?course=${encodeURIComponent(course.urlPath)}`}
          aria-label={`Register for ${course.title}`}
          className="inline-flex rounded-card bg-white px-4 py-1.5 text-small font-semibold text-primary-neg1 shadow-sm transition-colors hover:bg-primary-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-5"
        >
          Register
        </a>
      </div>
    </article>
  );
}

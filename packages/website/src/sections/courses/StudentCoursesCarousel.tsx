'use client';

import type { ReactNode } from 'react';
import type { CourseDTO } from '@itqasys/core';
import { Carousel } from '../shared/carousel';
import { StudentCourseCard } from './StudentCourseCard';

export interface StudentCoursesCarouselProps {
  courses: CourseDTO[];
  className?: string;
}

export function StudentCoursesCarousel({
  courses,
  className,
}: StudentCoursesCarouselProps): ReactNode {
  return (
    <Carousel<CourseDTO>
      variant="playlist"
      items={courses}
      getKey={(course) => course.id}
      prevLabel="Previous courses"
      nextLabel="Next courses"
      arrowTone="overlay"
      className={className}
      renderItem={(course) => <StudentCourseCard course={course} />}
    />
  );
}

import type { ReactNode } from 'react';
import { cn } from '@itqa/core';
import type { CourseDTO } from '@itqa/core';
import { ABOUT_CONTENT } from '../about/data';
import { UsefulLinks } from '../about/UsefulLinks';
import coursesData from './courses.json';
import { CoursesBanner } from './CoursesBanner';
import { StudentCourses } from './StudentCourses';

export interface CoursesPageContent {
  banner: {
    heading: string;
    body: string;
  };
  studentCourses: {
    heading: string;
  };
}

const DEFAULT_CONTENT = coursesData as unknown as CoursesPageContent;

export interface CoursesPageSectionsProps {
  courses: CourseDTO[];
  content?: CoursesPageContent;
  className?: string;
}

export function CoursesPageSections({
  courses,
  content = DEFAULT_CONTENT,
  className,
}: CoursesPageSectionsProps): ReactNode {
  return (
    <div className={cn('bg-white', className)}>
      <CoursesBanner heading={content.banner.heading} body={content.banner.body} />
      <StudentCourses courses={courses} heading={content.studentCourses.heading} />
      <div className="py-10 sm:py-14">
        <UsefulLinks title={ABOUT_CONTENT.usefulLinks.title} links={ABOUT_CONTENT.usefulLinks.links} />
      </div>
    </div>
  );
}

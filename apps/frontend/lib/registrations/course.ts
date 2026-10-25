import type { CourseDTO } from '@itqasys/core';
import { getCourse } from '@/lib/courses';

export interface RegistrationCourse {
  course: CourseDTO | null;
}

export async function resolveRegistrationCourse(
  searchParams: Promise<{ course?: string }>,
): Promise<RegistrationCourse> {
  const { course: urlPath } = await searchParams;
  const course = urlPath ? await getCourse(urlPath) : null;

  return { course };
}

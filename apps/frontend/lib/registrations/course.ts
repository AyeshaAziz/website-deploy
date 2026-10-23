import type { CourseDTO } from '@itqa/core';
import { getCourse } from '@/lib/content';

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

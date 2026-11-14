import type { CourseDTO, CourseSitemapEntry } from '@itqasys/core';
import { unstable_rethrow } from 'next/navigation';
import { getCourseService } from './server/courses/factory';

export async function getCourses(): Promise<CourseDTO[]> {
  return getCourseService().list();
}

export async function getCoursesSafe(): Promise<CourseDTO[]> {
  try {
    return await getCourses();
  } catch (error) {
    unstable_rethrow(error);
    console.error('Failed to load courses from database:', error);
    return [];
  }
}

export async function getCourse(urlPath: string): Promise<CourseDTO | null> {
  return getCourseService().get(urlPath);
}

export async function getCourseSitemap(): Promise<CourseSitemapEntry[]> {
  return getCourseService().sitemap();
}

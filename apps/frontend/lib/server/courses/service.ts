import type { CourseDTO, CourseSitemapEntry } from '@itqasys/core';

export interface CourseService {
  list(): Promise<CourseDTO[]>;
  get(urlPath: string): Promise<CourseDTO | null>;
  sitemap(): Promise<CourseSitemapEntry[]>;
}

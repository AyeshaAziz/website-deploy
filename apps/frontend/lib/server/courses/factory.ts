import { SupabaseCourseService } from './supabase';
import type { CourseService } from './service';

const globalForCourses = globalThis as unknown as {
  itqaCourseService?: CourseService;
};

export function getCourseService(): CourseService {
  if (globalForCourses.itqaCourseService) {
    return globalForCourses.itqaCourseService;
  }

  const service = new SupabaseCourseService();
  globalForCourses.itqaCourseService = service;
  return service;
}
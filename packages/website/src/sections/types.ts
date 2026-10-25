import type { CourseDTO, MediaVideoDTO, ResourceDTO } from '@itqasys/core';

export interface SectionData {
  courses: CourseDTO[];
  resources: ResourceDTO[];
  videos?: MediaVideoDTO[];
  playlist?: MediaVideoDTO[];
}

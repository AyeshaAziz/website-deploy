import type { CourseDTO, MediaVideoDTO, ResourceDTO } from '@itqa/core';

export interface SectionData {
  courses: CourseDTO[];
  resources: ResourceDTO[];
  videos?: MediaVideoDTO[];
  playlist?: MediaVideoDTO[];
}

import { z } from 'zod';
import { apiResultSchema } from './registration/response';

export const COURSE_URL_PATH_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const courseUrlPathSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(COURSE_URL_PATH_PATTERN, 'Use a lowercase URL slug.');

export const courseDtoSchema = z.object({
  id: z.string().min(1),
  urlPath: courseUrlPathSchema,
  title: z.string().min(1),
  summary: z.string(),
  description: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
});

export type CourseDTO = z.infer<typeof courseDtoSchema>;

export const courseListSchema = z.array(courseDtoSchema);
export const courseListResponseSchema = apiResultSchema(courseListSchema);
export const courseResponseSchema = apiResultSchema(courseDtoSchema);

export const courseSitemapEntrySchema = z.object({
  urlPath: courseUrlPathSchema,
  updatedAt: z.string().datetime(),
});

export type CourseSitemapEntry = z.infer<typeof courseSitemapEntrySchema>;

export const courseSitemapResponseSchema = apiResultSchema(z.array(courseSitemapEntrySchema));

import { describe, expect, it } from 'vitest';
import { FALLBACK_COURSES } from './fallback-courses';

describe('fallback courses', () => {
  it('uses unique url paths so each course can be resolved', () => {
    const urlPaths = FALLBACK_COURSES.map((course) => course.urlPath);

    expect(new Set(urlPaths).size).toBe(FALLBACK_COURSES.length);
  });

  it('uses unique ids for the course select options', () => {
    const ids = FALLBACK_COURSES.map((course) => course.id);

    expect(new Set(ids).size).toBe(FALLBACK_COURSES.length);
  });
});

import { describe, expect, it } from 'vitest';
import { resolveRegistrationCourse } from './course';

describe('resolveRegistrationCourse', () => {
  it('resolves the course from the url path query', async () => {
    const { course } = await resolveRegistrationCourse(
      Promise.resolve({ course: 'tarjamatul-quran' }),
    );

    expect(course?.title).toBe("Tarjamatul-Qur'an");
  });

  it('returns null without a course query', async () => {
    const { course } = await resolveRegistrationCourse(Promise.resolve({}));

    expect(course).toBeNull();
  });
});

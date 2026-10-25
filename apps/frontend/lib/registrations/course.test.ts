import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getCourse } = vi.hoisted(() => ({ getCourse: vi.fn() }));

vi.mock('@/lib/courses', () => ({ getCourse }));

import { resolveRegistrationCourse } from './course';

const COURSE = {
  id: 'course_tarjamatul_quran',
  urlPath: 'tarjamatul-quran',
  title: "Tarjamatul-Qur'an",
  summary: 'Translation',
};

beforeEach(() => {
  getCourse.mockReset();
});

describe('resolveRegistrationCourse', () => {
  it('resolves the course from the url path query', async () => {
    getCourse.mockResolvedValue(COURSE);

    const { course } = await resolveRegistrationCourse(
      Promise.resolve({ course: 'tarjamatul-quran' }),
    );

    expect(course).toEqual(COURSE);
    expect(getCourse).toHaveBeenCalledWith('tarjamatul-quran');
  });

  it('returns null without a course query', async () => {
    const { course } = await resolveRegistrationCourse(Promise.resolve({}));

    expect(course).toBeNull();
    expect(getCourse).not.toHaveBeenCalled();
  });
});

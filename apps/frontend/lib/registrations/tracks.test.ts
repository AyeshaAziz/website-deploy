import { describe, expect, it } from 'vitest';
import { REGISTRATION_TRACKS } from '@itqasys/core';
import { getFormConfig, getTrackDefinition } from './tracks';

const BASE_FIELDS = [
  'aimsNo',
  'firstName',
  'lastName',
  'tanzeem',
  'country',
  'city',
  'phone',
  'email',
  'confirmEmail',
  'course',
  'courseLanguage',
  'secondLanguage',
  'consent',
  'parentalConsent',
].sort();

describe('registration track registry', () => {
  it('only includes the teacher and student tracks', () => {
    expect([...REGISTRATION_TRACKS]).toEqual(['teacher', 'student']);
  });

  it('builds the course options from the provided courses', () => {
    const config = getFormConfig('student', {
      courses: [{ id: 'c1', urlPath: 'a', title: 'Course One', summary: '' }],
    });
    const course = config.fields.find((field) => field.name === 'course');

    expect(course?.options).toEqual([{ value: 'c1', label: 'Course One' }]);
  });

  it('does not fall back to hardcoded courses', () => {
    const config = getFormConfig('student');
    const course = config.fields.find((field) => field.name === 'course');

    expect(course?.options).toEqual([]);
  });

  it('filters the tanzeem options to the selected group', () => {
    const config = getFormConfig('student', { tanzeem: ['ansar', 'khuddam'] });
    const tanzeem = config.fields.find((field) => field.name === 'tanzeem');

    expect(tanzeem?.options.map((option) => option.value)).toEqual([
      'khuddam',
      'ansar',
    ]);
  });

  for (const track of REGISTRATION_TRACKS) {
    it(`aligns content and schema for ${track}`, () => {
      const definition = getTrackDefinition(track);
      const schemaFields = Object.keys(definition.schema.shape).sort();
      const contentFields = Object.keys(definition.content.fields).sort();
      const expectedFields =
        track === 'teacher'
          ? [
              ...BASE_FIELDS,
              'teachingExperience',
              'role',
              'commitDays',
              'availableTimes',
            ].sort()
          : BASE_FIELDS;

      expect(schemaFields).toEqual(expectedFields);
      expect(contentFields).toEqual(schemaFields);

      const config = getFormConfig(track);
      expect(config.fields).toHaveLength(schemaFields.length);
      expect(config.title).toBe(definition.content.title);
      expect(config.submitLabel).toBe(definition.content.submitLabel);

      for (const field of config.fields) {
        expect(field.label.length).toBeGreaterThan(0);
        for (const option of field.options) {
          expect(option.label.length).toBeGreaterThan(0);
        }
      }
    });
  }
});

import { describe, expect, it } from 'vitest';
import { REGISTRATION_TRACKS } from '@itqa/core';
import { getFormConfig, getTrackDefinition } from './tracks';

describe('registration track registry', () => {
  for (const track of REGISTRATION_TRACKS) {
    it(`aligns content and schema for ${track}`, () => {
      const definition = getTrackDefinition(track);
      const schemaFields = Object.keys(definition.schema.shape).sort();
      const contentFields = Object.keys(definition.content.fields).sort();

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

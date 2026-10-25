import { describe, expect, it } from 'vitest';
import { FIELD_TYPES } from '@itqasys/core/forms';
import {
  fieldRenderers,
  getFieldRenderer,
} from './field-renderer-registry';

describe('field renderer registry', () => {
  it('has a renderer for every field type', () => {
    for (const type of FIELD_TYPES) {
      expect(fieldRenderers[type]).toBeTypeOf('function');
      expect(getFieldRenderer(type)).toBe(fieldRenderers[type]);
    }
  });
});

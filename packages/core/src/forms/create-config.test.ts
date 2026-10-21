import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { createFormConfig } from './create-config';
import { f } from './field-meta';
import type { FormContent } from './types';

const messages: FormContent['messages'] = {
  successTitle: 'Thanks',
  successBody: 'We received it.',
  referenceLabel: 'Reference',
  duplicate: 'Already submitted.',
  rateLimited: 'Too many attempts.',
  validationError: 'Check the form.',
  networkError: 'Try again.',
  submitting: 'Submitting...',
  required: 'Required',
};

const content: FormContent = {
  title: 'Example',
  submitLabel: 'Send',
  fields: {
    second: { label: 'Second' },
    first: { label: 'First', placeholder: 'First name' },
    choice: { label: 'Choice' },
  },
  options: { choice: { a: 'Option A', b: 'Option B' } },
  messages,
};

describe('createFormConfig', () => {
  it('orders fields, resolves labels and enum option labels', () => {
    const schema = z.object({
      second: f(z.string().optional(), { type: 'text', order: 20 }),
      first: f(z.string().min(1), { type: 'text', order: 10 }),
      choice: f(z.enum(['a', 'b']), { type: 'select', order: 30 }),
    });

    const config = createFormConfig(schema, content);

    expect(config.fields.map((field) => field.name)).toEqual([
      'first',
      'second',
      'choice',
    ]);
    expect(config.fields[0]).toMatchObject({
      label: 'First',
      placeholder: 'First name',
      required: true,
    });
    expect(config.fields[1].required).toBe(false);
    expect(config.fields[2].options).toEqual([
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
    ]);
  });

  it('throws when metadata is missing', () => {
    const schema = z.object({ first: z.string() });
    expect(() => createFormConfig(schema, content)).toThrow(/missing form metadata/);
  });

  it('throws when an option label is missing', () => {
    const schema = z.object({
      first: f(z.string(), { type: 'text', order: 10 }),
      second: f(z.string(), { type: 'text', order: 20 }),
      choice: f(z.enum(['a', 'c']), { type: 'select', order: 30 }),
    });

    expect(() => createFormConfig(schema, content)).toThrow(/Missing option label/);
  });
});

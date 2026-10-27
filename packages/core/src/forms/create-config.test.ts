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
    first: { label: 'First', placeholder: 'First name', heading: 'First heading' },
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

    expect(config.fields.map((field) => field.name)).toEqual(['first', 'second', 'choice']);
    expect(config.fields[0]).toMatchObject({
      label: 'First',
      placeholder: 'First name',
      heading: 'First heading',
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

  it('resolves checkboxGroup option values from the inner enum and labels from content', () => {
    const checkboxGroupContent: FormContent = {
      ...content,
      fields: { ...content.fields, days: { label: 'Days' } },
      options: { ...content.options, days: { monday: 'Monday', tuesday: 'Tuesday' } },
    };
    const schema = z.object({
      days: f(z.array(z.enum(['monday', 'tuesday'])).min(1), {
        type: 'checkboxGroup',
        order: 10,
      }),
    });

    const config = createFormConfig(schema, checkboxGroupContent);

    expect(config.fields[0]).toMatchObject({
      name: 'days',
      type: 'checkboxGroup',
      required: true,
      options: [
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
      ],
    });
  });

  it('resolves checkboxGroup options from the object form with details', () => {
    const richContent: FormContent = {
      ...content,
      fields: { ...content.fields, times: { label: 'Times' } },
      options: {
        ...content.options,
        times: {
          '09:00': { label: '09:00 – English/Urdu:', details: ['NL1 – Intermediate Level'] },
          '10:00': { label: '10:00 - Urdu:' },
        },
      },
    };
    const schema = z.object({
      times: f(z.array(z.enum(['09:00', '10:00'])).min(1), {
        type: 'checkboxGroup',
        order: 10,
      }),
    });

    const config = createFormConfig(schema, richContent);

    expect(config.fields[0].options).toEqual([
      { value: '09:00', label: '09:00 – English/Urdu:', details: ['NL1 – Intermediate Level'] },
      { value: '10:00', label: '10:00 - Urdu:', details: undefined },
    ]);
  });

  it('throws when a checkboxGroup option label is missing', () => {
    const partialContent: FormContent = {
      ...content,
      fields: { ...content.fields, days: { label: 'Days' } },
    };
    const schema = z.object({
      days: f(z.array(z.enum(['monday', 'friday'])), { type: 'checkboxGroup', order: 10 }),
    });

    expect(() => createFormConfig(schema, partialContent)).toThrow(/Missing option label/);
  });
});

import { z } from 'zod';
import type { FormContent } from './types';

export const fieldContentSchema = z.object({
  label: z.string().min(1),
  placeholder: z.string().optional(),
  help: z.string().optional(),
});

export const formMessagesSchema = z.object({
  successTitle: z.string().min(1),
  successBody: z.string().min(1),
  referenceLabel: z.string().min(1),
  duplicate: z.string().min(1),
  rateLimited: z.string().min(1),
  validationError: z.string().min(1),
  networkError: z.string().min(1),
  submitting: z.string().min(1),
  required: z.string().min(1),
});

export const formContentSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  submitLabel: z.string().min(1),
  fields: z.record(fieldContentSchema),
  options: z.record(z.record(z.string().min(1))).optional(),
  messages: formMessagesSchema,
}) satisfies z.ZodType<FormContent>;

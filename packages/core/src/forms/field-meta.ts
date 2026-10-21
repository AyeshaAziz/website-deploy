import { z, type ZodTypeAny } from 'zod';
import { FIELD_TYPES, type FieldMeta } from './types';

export const fieldMetaSchema = z.object({
  type: z.enum(FIELD_TYPES),
  order: z.number().int(),
  autoComplete: z.string().optional(),
  rows: z.number().int().positive().optional(),
  accept: z.string().optional(),
  multiple: z.boolean().optional(),
  colSpan: z.union([z.literal(1), z.literal(2)]).optional(),
  options: z.array(z.string()).optional(),
});

/** Attach form metadata to a zod field without coupling the schema to React. */
export function f<T extends ZodTypeAny>(schema: T, meta: FieldMeta): T {
  return schema.describe(JSON.stringify(meta)) as T;
}

export function parseFieldMeta(field: ZodTypeAny, name: string): FieldMeta {
  const description = field.description;
  if (!description) {
    throw new Error(
      `Field "${name}" is missing form metadata. Wrap it with f(schema, { type, order }).`,
    );
  }

  let raw: unknown;
  try {
    raw = JSON.parse(description);
  } catch {
    throw new Error(`Field "${name}" has metadata that is not valid JSON.`);
  }

  const parsed = fieldMetaSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `Field "${name}" has invalid form metadata: ${parsed.error.issues
        .map((issue) => issue.message)
        .join(', ')}`,
    );
  }

  return parsed.data;
}

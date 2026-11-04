import { z, type ZodTypeAny } from 'zod';
import { parseFieldMeta } from './field-meta';
import type { FieldConfig, FieldMeta, FieldOption, FormConfig, FormContent } from './types';

function unwrap(field: ZodTypeAny): ZodTypeAny {
  let current = field;
  while (
    current instanceof z.ZodOptional ||
    current instanceof z.ZodNullable ||
    current instanceof z.ZodDefault ||
    current instanceof z.ZodArray
  ) {
    current = current instanceof z.ZodArray ? current._def.type : current._def.innerType;
  }
  return current;
}

function resolveOptionValues(name: string, field: ZodTypeAny, meta: FieldMeta): string[] {
  if (meta.options) return meta.options;

  const inner = unwrap(field);
  if (inner instanceof z.ZodEnum) return [...inner.options];

  throw new Error(`Field "${name}" of type "${meta.type}" requires an "options" array.`);
}

function resolveOptions(
  name: string,
  field: ZodTypeAny,
  meta: FieldMeta,
  content: FormContent,
): FieldOption[] {
  if (meta.type !== 'select' && meta.type !== 'radio' && meta.type !== 'checkboxGroup' && meta.type !== 'multiSelect') {
    return [];
  }

  return resolveOptionValues(name, field, meta).map((value) => {
    const entry = content.options?.[name]?.[value];
    if (!entry) {
      throw new Error(`Missing option label for field "${name}" value "${value}" in form content.`);
    }
    if (typeof entry === 'string') {
      return { value, label: entry };
    }
    return { value, label: entry.label, details: entry.details };
  });
}

export function createFormConfig(schema: z.AnyZodObject, content: FormContent): FormConfig {
  const fields: FieldConfig[] = [];

  for (const [name, field] of Object.entries(schema.shape) as Array<[string, ZodTypeAny]>) {
    const meta = parseFieldMeta(field, name);
    const fieldContent = content.fields[name];

    if (!fieldContent) {
      throw new Error(`Missing content for field "${name}".`);
    }

    fields.push({
      name,
      type: meta.type,
      order: meta.order,
      label: fieldContent.label,
      placeholder: fieldContent.placeholder,
      help: fieldContent.help,
      heading: fieldContent.heading,
      required: !field.isOptional(),
      options: resolveOptions(name, field, meta, content),
      autoComplete: meta.autoComplete,
      rows: meta.rows,
      accept: meta.accept,
      multiple: meta.multiple,
      colSpan: meta.colSpan,
    });
  }

  const orders = new Map<number, string>();
  for (const field of fields) {
    const existing = orders.get(field.order);
    if (existing) {
      throw new Error(
        `Duplicate field order ${field.order} for "${existing}" and "${field.name}".`,
      );
    }
    orders.set(field.order, field.name);
  }

  return {
    title: content.title,
    description: content.description,
    submitLabel: content.submitLabel,
    fields: fields.sort((a, b) => a.order - b.order),
    messages: content.messages,
  };
}

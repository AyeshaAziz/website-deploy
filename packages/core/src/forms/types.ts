export const FIELD_TYPES = [
  'text',
  'email',
  'tel',
  'number',
  'date',
  'textarea',
  'select',
  'radio',
  'checkbox',
  'file',
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export interface FieldMeta {
  type: FieldType;
  order: number;
  autoComplete?: string;
  rows?: number;
  accept?: string;
  multiple?: boolean;
  colSpan?: 1 | 2;
  options?: string[];
}

export interface FieldContent {
  label: string;
  placeholder?: string;
  help?: string;
}

export interface FormMessages {
  successTitle: string;
  successBody: string;
  referenceLabel: string;
  duplicate: string;
  rateLimited: string;
  validationError: string;
  networkError: string;
  submitting: string;
  required: string;
}

export interface FormContent {
  title: string;
  description?: string;
  submitLabel: string;
  fields: Record<string, FieldContent>;
  options?: Record<string, Record<string, string>>;
  messages: FormMessages;
}

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  name: string;
  type: FieldType;
  order: number;
  label: string;
  placeholder?: string;
  help?: string;
  required: boolean;
  options: FieldOption[];
  autoComplete?: string;
  rows?: number;
  accept?: string;
  multiple?: boolean;
  colSpan?: 1 | 2;
}

export interface FormConfig {
  title: string;
  description?: string;
  submitLabel: string;
  fields: FieldConfig[];
  messages: FormMessages;
}

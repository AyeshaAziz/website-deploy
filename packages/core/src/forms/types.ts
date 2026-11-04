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
  'checkboxGroup',
  'multiSelect',
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
  heading?: string;
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

export interface RichOptionContent {
  label: string;
  details?: string[];
}

export type OptionContent = string | RichOptionContent;

export interface FormContent {
  title: string;
  description?: string;
  submitLabel: string;
  fields: Record<string, FieldContent>;
  options?: Record<string, Record<string, OptionContent>>;
  messages: FormMessages;
}

export interface FieldOption {
  value: string;
  label: string;
  details?: string[];
}

export interface FieldConfig {
  name: string;
  type: FieldType;
  order: number;
  label: string;
  placeholder?: string;
  help?: string;
  heading?: string;
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

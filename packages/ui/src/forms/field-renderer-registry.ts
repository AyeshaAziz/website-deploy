import type { FieldType } from '@itqasys/core/forms';
import { CheckboxField } from './field-renderers/checkbox';
import { DateField } from './field-renderers/date';
import { EmailField } from './field-renderers/email';
import { FileField } from './field-renderers/file';
import { NumberField } from './field-renderers/number';
import { RadioField } from './field-renderers/radio';
import { SelectField } from './field-renderers/select';
import { TelField } from './field-renderers/tel';
import { TextField } from './field-renderers/text';
import { TextareaField } from './field-renderers/textarea';
import type { FieldRendererRegistry } from './types';

export const fieldRenderers: FieldRendererRegistry = {
  text: TextField,
  email: EmailField,
  tel: TelField,
  number: NumberField,
  date: DateField,
  textarea: TextareaField,
  select: SelectField,
  radio: RadioField,
  checkbox: CheckboxField,
  file: FileField,
};

export function getFieldRenderer(type: FieldType) {
  const renderer = fieldRenderers[type];
  if (!renderer) {
    throw new Error(`No field renderer is registered for "${type}".`);
  }
  return renderer;
}

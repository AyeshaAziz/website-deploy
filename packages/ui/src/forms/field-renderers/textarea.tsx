import { Textarea } from '../../Textarea';
import type { FieldRendererProps } from '../types';

export function TextareaField({
  field,
  id,
  registration,
  error,
  describedBy,
  disabled,
}: FieldRendererProps) {
  return (
    <Textarea
      id={id}
      rows={field.rows ?? 4}
      placeholder={field.placeholder}
      aria-invalid={Boolean(error)}
      aria-describedby={describedBy}
      disabled={disabled}
      {...registration}
    />
  );
}

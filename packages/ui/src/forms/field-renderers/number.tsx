import { Input } from '../../Input';
import type { FieldRendererProps } from '../types';

export function NumberField({
  field,
  id,
  registration,
  error,
  describedBy,
  disabled,
}: FieldRendererProps) {
  return (
    <Input
      id={id}
      type="number"
      inputMode="numeric"
      placeholder={field.placeholder}
      autoComplete={field.autoComplete}
      aria-invalid={Boolean(error)}
      aria-describedby={describedBy}
      disabled={disabled}
      {...registration}
    />
  );
}

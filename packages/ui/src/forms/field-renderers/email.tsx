import { Input } from '../../Input';
import type { FieldRendererProps } from '../types';

export function EmailField({
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
      type="email"
      inputMode="email"
      placeholder={field.placeholder}
      autoComplete={field.autoComplete}
      aria-invalid={Boolean(error)}
      aria-describedby={describedBy}
      disabled={disabled}
      {...registration}
    />
  );
}

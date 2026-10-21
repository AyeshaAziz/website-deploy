import { Input } from '../../Input';
import type { FieldRendererProps } from '../types';

export function FileField({
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
      type="file"
      accept={field.accept}
      multiple={field.multiple}
      aria-invalid={Boolean(error)}
      aria-describedby={describedBy}
      disabled={disabled}
      {...registration}
    />
  );
}

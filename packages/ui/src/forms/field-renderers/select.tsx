import { Select } from '../../Select';
import type { FieldRendererProps } from '../types';

export function SelectField({
  field,
  id,
  registration,
  error,
  describedBy,
  disabled,
}: FieldRendererProps) {
  return (
    <Select
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={describedBy}
      disabled={disabled}
      {...registration}
    >
      <option value="">{field.placeholder ?? ''}</option>
      {field.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}

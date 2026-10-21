import type { FieldRendererProps } from '../types';

export function RadioField({
  field,
  registration,
  error,
  describedBy,
  disabled,
}: FieldRendererProps) {
  return (
    <fieldset
      aria-invalid={Boolean(error)}
      aria-describedby={describedBy}
      className="flex flex-wrap gap-x-6 gap-y-2"
    >
      <legend className="sr-only">{field.label}</legend>
      {field.options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 text-body">
          <input
            type="radio"
            value={option.value}
            disabled={disabled}
            className="h-4 w-4 accent-primary-2"
            {...registration}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}

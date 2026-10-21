import type { FieldRendererProps } from '../types';

export function CheckboxField({
  field,
  id,
  registration,
  error,
  describedBy,
  disabled,
}: FieldRendererProps) {
  return (
    <label htmlFor={id} className="flex items-start gap-2 text-small text-neutral-900">
      <input
        id={id}
        type="checkbox"
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        disabled={disabled}
        className="mt-0.5 h-4 w-4 accent-primary-2"
        {...registration}
      />
      <span>
        {field.label}
        {field.required && (
          <span aria-hidden="true" className="ml-1 text-danger">
            *
          </span>
        )}
      </span>
    </label>
  );
}

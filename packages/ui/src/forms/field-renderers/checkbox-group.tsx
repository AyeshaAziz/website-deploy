import { Fragment, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { FieldRendererProps } from '../types';

export function CheckboxGroupField({
  field,
  registration,
  error,
  describedBy,
  disabled,
}: FieldRendererProps) {
  const { setValue } = useFormContext();
  const watched = useWatch({ name: registration.name });
  const values: string[] = Array.isArray(watched)
    ? watched.filter((entry): entry is string => typeof entry === 'string')
    : [];

  useEffect(() => {
    if (watched === undefined) {
      setValue(registration.name, [], { shouldValidate: false });
    }
  }, [watched, registration.name, setValue]);

  const toggle = (value: string, checked: boolean) => {
    const next = checked ? [...values, value] : values.filter((entry) => entry !== value);
    setValue(registration.name, next, { shouldValidate: false, shouldDirty: true });
  };

  const hasDetails = field.options.some((option) => option.details?.length);

  return (
    <fieldset
      aria-invalid={Boolean(error)}
      aria-describedby={describedBy}
      className={
        hasDetails
          ? 'grid gap-x-6 gap-y-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]'
          : 'flex flex-col gap-2'
      }
    >
      <legend className="sr-only">{field.label}</legend>
      {field.options.map((option) => (
        <Fragment key={option.value}>
          <label className="flex items-center gap-2 text-body">
            <input
              type="checkbox"
              name={registration.name}
              value={option.value}
              checked={values.includes(option.value)}
              disabled={disabled}
              onChange={(event) => toggle(option.value, event.target.checked)}
              className="h-4 w-4 accent-primary-2"
            />
            {option.label}
          </label>
          {hasDetails ? (
            option.details?.length ? (
              <div className="text-small text-neutral-600">
                {option.details.map((detail) => (
                  <p key={detail}>{detail}</p>
                ))}
              </div>
            ) : (
              <div aria-hidden="true" />
            )
          ) : null}
        </Fragment>
      ))}
    </fieldset>
  );
}

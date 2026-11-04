'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { fieldClasses } from '../../field';
import type { FieldRendererProps } from '../types';

export function MultiSelectField({
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

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (watched === undefined) {
      setValue(registration.name, [], { shouldValidate: false });
    }
  }, [watched, registration.name, setValue]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = (value: string, checked: boolean) => {
    const next = checked ? [...values, value] : values.filter((entry) => entry !== value);
    setValue(registration.name, next, { shouldValidate: false, shouldDirty: true });
  };

  const selectedLabels = field.options
    .filter((option) => values.includes(option.value))
    .map((option) => option.label);
  const triggerText =
    selectedLabels.length > 0 ? selectedLabels.join(', ') : (field.placeholder ?? 'Select…');

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={`${registration.name}-panel`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        disabled={disabled}
        onClick={() => setOpen((value) => !value)}
        className={fieldClasses('text-left multi-select-trigger')}
      >
        {triggerText}
      </button>
      {open && (
        <div
          id={`${registration.name}-panel`}
          role="listbox"
          className="absolute z-10 mt-1 w-full rounded-card border border-primary-5 bg-white p-2 shadow-card"
        >
          <div className="flex flex-col gap-2">
            {field.options.map((option) => (
              <label key={option.value} className="multi-select-option flex items-center gap-2 text-small">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={values.includes(option.value)}
                  disabled={disabled}
                  onChange={(event) => toggle(option.value, event.target.checked)}
                  className="h-4 w-4 accent-primary-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import type { ReactNode } from 'react';
import { cn } from '@itqasys/core';
import type { FieldConfig } from '@itqasys/core/forms';
import { Label } from '../Label';

export interface FieldWrapperProps {
  field: FieldConfig;
  id: string;
  error?: string;
  hideLabel?: boolean;
  children: ReactNode;
}

export function FieldWrapper({ field, id, error, hideLabel = false, children }: FieldWrapperProps) {
  return (
    <div
      className={cn('flex flex-col gap-1', field.colSpan === 2 && 'sm:col-span-2 lg:col-span-3')}
    >
      {field.heading ? (
        <h2 className="font-heading text-h3 text-primary-neg2">{field.heading}</h2>
      ) : null}

      {!hideLabel && (
        <Label htmlFor={id}>
          {field.label}
          {field.required && (
            <span aria-hidden="true" className="ml-1 text-danger">
              *
            </span>
          )}
        </Label>
      )}

      {children}

      {field.help && (
        <p id={`${id}-help`} className="whitespace-pre-line text-small text-neutral-600">
          {field.help}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} role="alert" className="text-small text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

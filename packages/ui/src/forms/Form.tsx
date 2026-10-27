'use client';

import { useEffect, useId, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormProvider,
  useForm,
  useWatch,
  type DefaultValues,
  type Path,
  type Resolver,
} from 'react-hook-form';
import type { z } from 'zod';
import { cn } from '@itqasys/core';
import type { FormConfig } from '@itqasys/core/forms';
import { Button } from '../Button';
import { FieldWrapper } from './FieldWrapper';
import { getFieldRenderer } from './field-renderer-registry';

export interface FormProps<TSchema extends z.ZodTypeAny> {
  schema: TSchema;
  config: FormConfig;
  onSubmit: (values: z.infer<TSchema>) => void | Promise<void>;
  defaultValues?: Partial<z.infer<TSchema>>;
  fieldErrors?: Record<string, string>;
  watchField?: string;
  onWatchChange?: (value: unknown) => void;
  disabled?: boolean;
  className?: string;
}

export function Form<TSchema extends z.ZodTypeAny>({
  schema,
  config,
  onSubmit,
  defaultValues,
  fieldErrors,
  watchField,
  onWatchChange,
  disabled = false,
  className,
}: FormProps<TSchema>) {
  type Values = z.infer<TSchema>;

  const form = useForm<Values>({
    resolver: zodResolver(schema) as Resolver<Values>,
    defaultValues: defaultValues as DefaultValues<Values> | undefined,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setFocus,
    clearErrors,
  } = form;

  const watchName = watchField ?? config.fields[0]?.name ?? '';
  const watchedValue = useWatch({
    control: form.control,
    name: watchName as Path<Values>,
  });

  useEffect(() => {
    if (watchField) onWatchChange?.(watchedValue);
  }, [watchField, onWatchChange, watchedValue]);

  useEffect(() => {
    if (!fieldErrors) {
      clearErrors();
      return;
    }

    let firstField: string | undefined;
    for (const [name, message] of Object.entries(fieldErrors)) {
      setError(name as Path<Values>, { type: 'server', message });
      firstField ??= name;
    }

    if (firstField) {
      setFocus(firstField as Path<Values>);
    }
  }, [fieldErrors, setError, setFocus, clearErrors]);

  const idPrefix = useId().replace(/:/g, '');
  const errorMap = errors as Record<string, { message?: string } | undefined>;
  const submit = useMemo(
    () => handleSubmit(async (values) => onSubmit(values as Values)),
    [handleSubmit, onSubmit],
  );

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={submit} className={cn('space-y-6', className)}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {config.fields.map((field) => {
            const id = `${idPrefix}-${field.name}`;
            const error = errorMap[field.name]?.message;
            const describedBy =
              [field.help ? `${id}-help` : null, error ? `${id}-error` : null]
                .filter(Boolean)
                .join(' ') || undefined;
            const Renderer = getFieldRenderer(field.type);

            return (
              <FieldWrapper
                key={field.name}
                field={field}
                id={id}
                error={error}
                hideLabel={field.type === 'checkbox'}
              >
                <Renderer
                  field={field}
                  id={id}
                  registration={register(
                    field.name as Path<Values>,
                    field.type === 'number' ? { valueAsNumber: true } : undefined,
                  )}
                  error={error}
                  describedBy={describedBy}
                  disabled={disabled || isSubmitting}
                />
              </FieldWrapper>
            );
          })}
        </div>

        <Button type="submit" variant="brand" disabled={disabled || isSubmitting}>
          {isSubmitting ? config.messages.submitting : config.submitLabel}
        </Button>
      </form>
    </FormProvider>
  );
}

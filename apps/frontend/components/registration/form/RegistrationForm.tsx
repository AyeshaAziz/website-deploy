'use client';

import { useMemo, type ReactNode } from 'react';
import { Form } from '@itqa/ui/forms';
import type { CourseDTO, RegistrationTrack, Tanzeem } from '@itqasys/core';
import { getFormConfig, getTrackDefinition } from '@/lib/registrations/tracks';
import { validateRegistration } from '@/lib/registrations/validate';
import { RegistrationErrorAlert } from './RegistrationErrorAlert';
import { RegistrationSuccess } from './RegistrationSuccess';
import { useRegistrationForm } from './useRegistrationForm';

const COMPACT_FIELDS = [
  '[&_label.block]:text-[12px]',
  '[&_input[type=text]]:h-[26px] [&_input[type=text]]:px-2 [&_input[type=text]]:py-0 [&_input[type=text]]:text-[12px] sm:[&_input[type=text]]:max-w-[146px]',
  '[&_input[type=email]]:h-[26px] [&_input[type=email]]:px-2 [&_input[type=email]]:py-0 [&_input[type=email]]:text-[12px] sm:[&_input[type=email]]:max-w-[146px]',
  '[&_input[type=tel]]:h-[26px] [&_input[type=tel]]:px-2 [&_input[type=tel]]:py-0 [&_input[type=tel]]:text-[12px] sm:[&_input[type=tel]]:max-w-[146px]',
  '[&_select]:h-[26px] [&_select]:px-2 [&_select]:py-0 [&_select]:text-[12px] sm:[&_select]:max-w-[146px]',
  '[&_.multi-select-trigger]:h-[26px] [&_.multi-select-trigger]:px-2 [&_.multi-select-trigger]:py-0 [&_.multi-select-trigger]:text-[12px]',
  '[&_.multi-select-option]:text-[12px]',
].join(' ');

export interface RegistrationFormProps {
  track: RegistrationTrack;
  courses?: CourseDTO[];
  defaultCourse?: string;
  tanzeemOptions?: readonly Tanzeem[];
  defaultTanzeem?: Tanzeem;
  watchField?: string;
  onWatchChange?: (value: unknown) => void;
}

export function RegistrationForm({
  track,
  courses,
  defaultCourse,
  tanzeemOptions,
  defaultTanzeem,
  watchField,
  onWatchChange,
}: RegistrationFormProps): ReactNode {
  const definition = getTrackDefinition(track);
  const config = useMemo(
    () => getFormConfig(track, { courses, tanzeem: tanzeemOptions }),
    [track, courses, tanzeemOptions],
  );
  const defaultValues =
    defaultCourse || defaultTanzeem
      ? {
          ...(defaultCourse ? { course: defaultCourse } : {}),
          ...(defaultTanzeem ? { tanzeem: defaultTanzeem } : {}),
        }
      : undefined;
  const { state, fieldErrors, alertRef, successRef, handleSubmit } = useRegistrationForm({
    track,
    messages: config.messages,
    validate: validateRegistration,
  });

  if (state.status === 'success') {
    return (
      <RegistrationSuccess
        messages={config.messages}
        reference={state.result.reference}
        headingRef={successRef}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {state.status === 'error' ? (
        <RegistrationErrorAlert message={state.message} alertRef={alertRef} />
      ) : null}

      <Form
        schema={definition.schema}
        config={config}
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        fieldErrors={fieldErrors}
        watchField={watchField}
        onWatchChange={onWatchChange}
        className={COMPACT_FIELDS}
      />

      {definition.info ? (
        <p className="mt-6 text-small text-neutral-600">{definition.info.description}</p>
      ) : null}
    </div>
  );
}

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@itqa/ui';
import { Form } from '@itqa/ui/forms';
import type { ApiErrorCode, RegistrationInput, RegistrationResult, RegistrationTrack } from '@itqa/core';
import { submitRegistration } from '@/lib/api/registrations';
import { getFormConfig, getTrackDefinition } from '@/lib/registrations/tracks';

type FormState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; result: RegistrationResult };

function messageFor(
  code: ApiErrorCode,
  config: ReturnType<typeof getFormConfig>,
): string {
  switch (code) {
    case 'DUPLICATE':
      return config.messages.duplicate;
    case 'RATE_LIMITED':
      return config.messages.rateLimited;
    case 'VALIDATION_ERROR':
      return config.messages.validationError;
    default:
      return config.messages.networkError;
  }
}

export function RegistrationForm({ track }: { track: RegistrationTrack }) {
  const definition = getTrackDefinition(track);
  const config = useMemo(() => getFormConfig(track), [track]);
  const [state, setState] = useState<FormState>({ status: 'idle' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>();
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const alertRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (state.status === 'error') alertRef.current?.focus();
    if (state.status === 'success') successRef.current?.focus();
  }, [state]);

  async function handleSubmit(values: unknown) {
    setFieldErrors(undefined);
    setState({ status: 'idle' });

    const result = await submitRegistration(
      { ...(values as object), track } as RegistrationInput,
      idempotencyKey,
    );

    if (result.ok) {
      setState({ status: 'success', result: result.data });
      return;
    }

    if (result.error.fieldErrors) {
      setFieldErrors(result.error.fieldErrors);
    }
    setState({
      status: 'error',
      message: messageFor(result.error.code, config),
    });
  }

  if (state.status === 'success') {
    return (
      <Card className="mx-auto max-w-xl">
        <h2
          ref={successRef}
          tabIndex={-1}
          className="font-heading text-h2 text-primary-neg2"
        >
          {config.messages.successTitle}
        </h2>
        <p className="mt-3 text-body text-neutral-700">{config.messages.successBody}</p>
        <p className="mt-6 text-small text-neutral-600">
          {config.messages.referenceLabel}:{' '}
          <span className="font-semibold text-neutral-900">
            {state.result.reference}
          </span>
        </p>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {state.status === 'error' && (
        <div
          ref={alertRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 rounded-card bg-danger/10 p-3 text-danger"
        >
          {state.message}
        </div>
      )}

      <Form
        schema={definition.schema}
        config={config}
        onSubmit={handleSubmit}
        fieldErrors={fieldErrors}
      />
    </div>
  );
}

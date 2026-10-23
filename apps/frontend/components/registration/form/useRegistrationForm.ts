import { useEffect, useRef, useState, type RefObject } from 'react';
import type {
  RegistrationInput,
  RegistrationResult,
  RegistrationTrack,
} from '@itqa/core';
import type { FormMessages } from '@itqa/core/forms';
import { submitRegistration } from '@/lib/api/registrations';
import { getRegistrationErrorMessage } from '@/lib/registrations/errorMessage';

export type RegistrationFormStatus =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; result: RegistrationResult };

export interface UseRegistrationFormOptions {
  track: RegistrationTrack;
  messages: FormMessages;
  validate?: (values: unknown) => Record<string, string> | undefined;
}

export interface UseRegistrationFormResult {
  state: RegistrationFormStatus;
  fieldErrors: Record<string, string> | undefined;
  alertRef: RefObject<HTMLDivElement | null>;
  successRef: RefObject<HTMLHeadingElement | null>;
  handleSubmit: (values: unknown) => Promise<void>;
}

export function useRegistrationForm({
  track,
  messages,
  validate,
}: UseRegistrationFormOptions): UseRegistrationFormResult {
  const [state, setState] = useState<RegistrationFormStatus>({ status: 'idle' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>();
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const alertRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (state.status === 'error') alertRef.current?.focus();
    if (state.status === 'success') successRef.current?.focus();
  }, [state]);

  async function handleSubmit(values: unknown): Promise<void> {
    setFieldErrors(undefined);
    setState({ status: 'idle' });

    const errors = validate?.(values);
    if (errors && Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

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
      message: getRegistrationErrorMessage(result.error.code, messages),
    });
  }

  return { state, fieldErrors, alertRef, successRef, handleSubmit };
}

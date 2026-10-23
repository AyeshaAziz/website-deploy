import type { ReactNode, Ref } from 'react';
import { Card } from '@itqa/ui';
import type { FormMessages } from '@itqa/core/forms';

export interface RegistrationSuccessProps {
  messages: FormMessages;
  reference: string;
  headingRef: Ref<HTMLHeadingElement>;
}

export function RegistrationSuccess({
  messages,
  reference,
  headingRef,
}: RegistrationSuccessProps): ReactNode {
  return (
    <Card className="mx-auto max-w-xl">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-heading text-h2 text-primary-neg2"
      >
        {messages.successTitle}
      </h2>
      <p className="mt-3 text-body text-neutral-700">{messages.successBody}</p>
      <p className="mt-6 text-small text-neutral-600">
        {messages.referenceLabel}:{' '}
        <span className="font-semibold text-neutral-900">{reference}</span>
      </p>
    </Card>
  );
}

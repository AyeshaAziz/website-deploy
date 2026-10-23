import type { ReactNode, Ref } from 'react';

export interface RegistrationErrorAlertProps {
  message: string;
  alertRef: Ref<HTMLDivElement>;
}

export function RegistrationErrorAlert({
  message,
  alertRef,
}: RegistrationErrorAlertProps): ReactNode {
  return (
    <div
      ref={alertRef}
      tabIndex={-1}
      role="alert"
      className="mb-6 rounded-card bg-danger/10 p-3 text-danger"
    >
      {message}
    </div>
  );
}

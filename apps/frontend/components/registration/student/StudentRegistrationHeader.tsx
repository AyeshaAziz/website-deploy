import type { ReactNode } from 'react';

export interface StudentRegistrationHeaderProps {
  courseTitle?: string;
}

export function StudentRegistrationHeader({
  courseTitle,
}: StudentRegistrationHeaderProps): ReactNode {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-h2 text-primary-neg2">
            ITQA Students Registration
          </h1>
          {courseTitle ? (
            <p className="mt-1 text-small text-primary-1">({courseTitle})</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 space-y-1 text-small text-neutral-700">
        <p>
          Please note that you are requested to register with an email which you
          have not used previously for any other ITQA site.
        </p>
        <p>To enroll for more than one course, please register again.</p>
      </div>
    </>
  );
}

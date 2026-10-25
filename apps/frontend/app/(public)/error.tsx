'use client';

import { useEffect, type ReactNode } from 'react';
import { Button, Container, SectionHeading } from '@itqa/ui';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): ReactNode {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-section-sm">
      <SectionHeading
        as="h1"
        title="Something went wrong"
        subtitle="We could not load this page. Please try again."
      />
      <Button onClick={reset} variant="primary" className="mt-6">
        Try again
      </Button>
    </Container>
  );
}

import type { ReactNode } from 'react';
import { str } from '@itqasys/core';
import type { SectionDTO } from '@itqasys/core';
import { ButtonLink, Container } from '@itqa/ui';

export interface CtaProps {
  content: SectionDTO['content'];
}

export function Cta({ content }: CtaProps): ReactNode {
  return (
    <section className="bg-primary-neg1 py-section-sm text-white">
      <Container className="text-center">
        <h2 className="font-heading text-h2">{str(content.heading)}</h2>
        <ButtonLink href={str(content.href, '/')} variant="gold" size="lg" className="mt-6">
          {str(content.label, 'Learn more')}
        </ButtonLink>
      </Container>
    </section>
  );
}

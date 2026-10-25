import type { ReactNode } from 'react';
import { str } from '@itqasys/core';
import type { SectionDTO } from '@itqasys/core';
import { ButtonLink, Container } from '@itqa/ui';

export interface HomeProps {
  content: SectionDTO['content'];
}

export function Home({ content }: HomeProps): ReactNode {
  return (
    <section className="bg-primary-neg2 py-section-sm text-white">
      <Container>
        <p className="mb-4 h-1 w-16 rounded-full bg-accent-gold" aria-hidden="true" />
        <h1 className="font-heading text-display">{str(content.heading)}</h1>
        <p className="mt-4 max-w-2xl text-body text-primary-5">{str(content.subheading)}</p>
        {str(content.ctaLabel) && (
          <ButtonLink href={str(content.ctaHref, '/')} variant="gold" size="lg" className="mt-8">
            {str(content.ctaLabel)}
          </ButtonLink>
        )}
      </Container>
    </section>
  );
}

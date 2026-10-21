import type { ReactNode } from 'react';
import { str } from '@itqa/core';
import type { SectionDTO } from '@itqa/core';
import { Container, SectionHeading } from '@itqa/ui';

export interface TextProps {
  content: SectionDTO['content'];
}

export function Text({ content }: TextProps): ReactNode {
  const paragraphs = str(content.body).split(/\n{2,}/).filter(Boolean);
  return (
    <section className="py-section-sm">
      <Container>
        <div className="mx-auto max-w-3xl">
          {str(content.heading) && <SectionHeading title={str(content.heading)} className="mb-4" />}
          {paragraphs.map((p, i) => (
            <p key={i} className="mb-4 text-body text-neutral-800">
              {p}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}

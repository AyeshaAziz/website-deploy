import type { ReactNode } from 'react';
import { str } from '@itqa/core';
import type { ResourceDTO, SectionDTO } from '@itqa/core';
import { Container, SectionHeading } from '@itqa/ui';

export interface FeaturedResourcesProps {
  content: SectionDTO['content'];
  resources: ResourceDTO[];
}

export function FeaturedResources({ content, resources }: FeaturedResourcesProps): ReactNode {
  return (
    <section className="py-section-sm">
      <Container>
        <SectionHeading title={str(content.heading, 'Resources')} className="mb-6" />
        <ul className="space-y-3">
          {resources.map((r) => (
            <li key={r.id}>
              <a href={r.url} className="font-medium text-primary-2 hover:text-primary-neg1 hover:underline">
                {r.title}
              </a>
              {r.description && <p className="text-small text-neutral-600">{r.description}</p>}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

import type { ReactNode } from 'react';
import { Container } from '@itqa/ui';
import { UsefulLinkCard } from '../shared/UsefulLinkCard';
import type { UsefulLinksData } from './about.types';

export function UsefulLinks({ title, links }: UsefulLinksData): ReactNode {
  return (
    <Container>
      <h2 className="bg-accent-gray px-4 py-2 text-center font-cabin text-h3 font-bold uppercase tracking-wide text-primary-7">
        {title}
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-3 ">
        {links.map((link, index) => (
          <li key={`${link.title}-${index}`}>
            <UsefulLinkCard link={link} />
          </li>
        ))}
      </ul>
    </Container>
  );
}

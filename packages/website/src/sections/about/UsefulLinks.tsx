import type { ReactNode } from 'react';
import { Container } from '../../ui/Container';
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
            <article className="flex h-full flex-col border border-primary-5 bg-white p-5 text-center shadow-card">
              <h3 className="font-cabin text-h3 font-bold text-primary-7">{link.title}</h3>
              <p className="mt-2 text-small text-neutral-700">{link.description}</p>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="mt-auto pt-4 text-small text-primary-neg1 underline hover:text-primary-1"
              >
                {link.label}
              </a>
            </article>
          </li>
        ))}
      </ul>
    </Container>
  );
}

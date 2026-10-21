import type { ReactNode } from 'react';

export interface LinkCardData {
  title: string;
  description: string;
  href: string;
  label: string;
}

export interface UsefulLinkCardProps {
  link: LinkCardData;
}

export function UsefulLinkCard({ link }: UsefulLinkCardProps): ReactNode {
  return (
    <article className="flex h-full flex-col border-[4px] border-warm-border bg-white p-5 text-center shadow-card">
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
  );
}

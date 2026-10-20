import type { ReactNode } from 'react';
import type { FooterSocialData } from './footer.types';

export function FooterSocial({ title, links }: FooterSocialData): ReactNode {
  return (
    <nav aria-label={title} className="min-w-0">
      <h2 className="text-h3 font-bold text-white">{title}</h2>
      <ul className="mt-4 space-y-2 text-small font-semibold text-white">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="hover:text-accent-gold">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

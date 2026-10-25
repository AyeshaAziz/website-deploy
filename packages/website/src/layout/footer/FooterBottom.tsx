import type { ReactNode } from 'react';
import type { FooterLink, FooterSocialData } from './footer.types';

export function FooterBottom({ content }: { content: FooterSocialData }): ReactNode {
  const { links, title } = content;
  return (
    <footer className="bg-white border-t border-primary-3/5">
      <div className=" flex mx-auto px-4 py-4 text-small text-primary-7">
        <span className="flex-1 px-2">{title}</span>
        <nav aria-label="Footer links" className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-primary-5 transition-colors">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

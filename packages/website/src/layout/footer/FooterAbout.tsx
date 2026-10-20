import type { ReactNode } from 'react';
import type { FooterAboutData } from './footer.types';

export function FooterAbout({ title, body, ctaLabel, ctaHref }: FooterAboutData): ReactNode {
  return (
    <div className="min-w-0">
      <h2 className="text-h3 font-bold text-white">{title}</h2>
      <p className="mt-3 max-w-xs text-small">{body}</p>
      <a
        href={ctaHref}
        className="mt-5 inline-flex items-center border border-white/60 px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
      >
        {ctaLabel}
      </a>
    </div>
  );
}

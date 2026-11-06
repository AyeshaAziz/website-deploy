import type { ReactNode } from 'react';

export function LoginQuotePanel(): ReactNode {
  return (
    <aside className="hidden w-2/5 flex-col items-center justify-center bg-primary-neg2 px-10 py-16 lg:flex">
      <span aria-hidden="true" className="font-heading text-6xl leading-none text-primary-5">
        &ldquo;
      </span>
      <blockquote className="mt-2 font-heading text-h2 text-white lg:text-h1">
        The best among you are those who learn the Qur&rsquo;an and teach it.
      </blockquote>
      <span aria-hidden="true" className="mt-2 font-heading text-6xl leading-none text-primary-5">
        &rdquo;
      </span>
      <p className="mt-4 text-small text-primary-5/80">(Sahih al-Bukhari: 5027)</p>
    </aside>
  );
}

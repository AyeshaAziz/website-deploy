import Link from 'next/link';
import type { ReactNode } from 'react';
import content from '@/content/registration/atfal-nasirat.json';

export function AtfalNasiratPanel(): ReactNode {
  return (
    <div
      aria-live="polite"
      className="relative flex h-full flex-col overflow-hidden bg-primary-neg2/90 p-5 text-primary-6 sm:p-6 lg:justify-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full border border-accent-gold/25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 h-52 w-52 rounded-full border border-white/10"
      />

      <div className="relative">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-accent-gold">
          Registration guide
        </p>
        <h2 className="mt-2 font-heading text-h2 text-white">{content.title}</h2>
        <div className="mt-3 h-px w-12 bg-accent-gold" aria-hidden="true" />
      </div>

      <div className="relative mt-5 grid gap-5 sm:grid-cols-2">
        <ul className="space-y-3">
          {content.paragraphs.map((paragraph) => (
            <li key={paragraph} className="flex gap-2 text-small">
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold"
              />
              <span>{paragraph}</span>
            </li>
          ))}
          <li className="text-small">
            {content.contact.prefix}
            <Link
              href={content.contact.href}
              className="font-semibold text-accent-gold underline underline-offset-2 hover:text-white"
            >
              {content.contact.label}
            </Link>
            {content.contact.suffix}
          </li>
        </ul>

        <div className="rounded-card border border-white/20 bg-white/15 p-3">
          <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent-gold">
            {content.dates.title}
          </h3>
          <p className="mt-1 text-small">{content.dates.note}</p>
          <dl className="mt-3 space-y-2">
            {content.dates.semesters.map((semester) => (
              <div
                key={semester.name}
                className="rounded-sm border border-white/10 bg-white/5 px-2.5 py-2"
              >
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-wide text-primary-4">
                  {semester.name}
                </dt>
                <dd className="mt-0.5 text-small font-semibold text-white">
                  {semester.registration}
                </dd>
                <dd className="text-small">Classes start {semester.classesStart}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

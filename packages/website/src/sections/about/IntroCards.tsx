import type { ReactNode } from 'react';
import { Container } from '@itqa/ui';
import type { AboutIntroData } from './about.types';

const TITLE = 'font-cabin text-h3 font-bold text-primary-7';

export function IntroCards({ about, objectives }: AboutIntroData): ReactNode {
  return (
    <Container>
      <div className="grid gap-6 md:grid-cols-2 ">
        <article className="flex flex-col">
          <h2 className={TITLE}>{about.title}</h2>
          <p className="mt-3 flex-1 bg-accent-gray p-4 text-small leading-relaxed text-primary-neg2">
            {about.body}
          </p>
           
        </article>

        <article className="flex flex-col">
          <h2 className={TITLE}>{objectives.title}</h2>
          <div className="mt-3 flex flex-1 flex-col bg-accent-olive p-4 text-small leading-relaxed text-white">
            <p className="font-semibold">{objectives.preface}</p>
            <blockquote className="mt-2">{objectives.quote}</blockquote>
            <span
              aria-hidden="true"
              className="self-center mt-4 flex w-fit items-center gap-1 rounded-full border border-white/60 px-2 py-1"
            >
              <span className="h-1 w-1 rounded-full bg-white" />
              <span className="h-1 w-1 rounded-full bg-white" />
              <span className="h-1 w-1 rounded-full bg-white" />
            </span>
          </div>
        </article>
      </div>
    </Container>
  );
}

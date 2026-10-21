'use client';

import type { ReactNode } from 'react';
import { Carousel } from '../shared/carousel';
import { UsefulLinkCard } from '../shared/UsefulLinkCard';
import { MediaHeading } from './MediaHeading';
import type { MediaLink, MediaLinksRow } from './media.types';

export function MediaLinks({ row }: { row: MediaLinksRow }): ReactNode {
  return (
    <section aria-labelledby="useful-links">
      <MediaHeading id="useful-links" variant="warm">
        {row.title}
      </MediaHeading>
      <Carousel<MediaLink>
        variant="scroll"
        items={row.links}
        getKey={(link, index) => `${link.title}-${index}`}
        itemClassName="w-[250px] sm:w-[calc((100%-2rem)/3)]"
        prevLabel="Previous useful links"
        nextLabel="Next useful links"
        arrowTone="warm"
        className="mt-6"
        renderItem={(link) => <UsefulLinkCard link={link} />}
      />
    </section>
  );
}

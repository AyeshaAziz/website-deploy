import type { ReactNode } from 'react';
import type { PageDTO } from '@itqasys/core';
import { SectionRenderer } from './SectionRenderer';
import type { SectionData } from './types';

export type PageViewProps = {
  page: PageDTO;
} & SectionData;

export function PageView({ page, courses, resources, videos, playlist }: PageViewProps): ReactNode {
  return (
    <>
      {page.sections.map((s) => (
        <SectionRenderer
          key={s.id}
          section={s}
          courses={courses}
          resources={resources}
          videos={videos}
          playlist={playlist}
        />
      ))}
    </>
  );
}

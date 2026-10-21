import type { ReactNode } from 'react';
import type { SectionDTO } from '@itqa/core';
import { Cta } from './cta';
import { FeaturedCourses } from './courses';
import { Home } from './home';
import { Multimedia } from './multimedia';
import { FeaturedResources } from './resources';
import { Text } from './text';
import type { SectionData } from './types';

export type SectionRendererProps = {
  section: SectionDTO;
} & SectionData;

export function SectionRenderer({
  section,
  courses,
  resources,
  videos = [],
  playlist = [],
}: SectionRendererProps): ReactNode {
  switch (section.type) {
    case 'HOME':
      return <Home content={section.content} />;
    case 'TEXT':
      return <Text content={section.content} />;
    case 'FEATURED_COURSES':
      return <FeaturedCourses content={section.content} courses={courses} />;
    case 'MULTIMEDIA':
      return <Multimedia videos={videos} playlist={playlist} />;
    case 'FEATURED_RESOURCES':
      // return <FeaturedResources content={section.content} resources={resources} />;
    case 'CTA':
      return <Cta content={section.content} />;
    default:
      return null;
  }
}

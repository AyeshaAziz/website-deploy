import type { ReactNode } from 'react';
import { FadeCarousel } from './FadeCarousel';
import { PlaylistTrack } from './PlaylistTrack';
import { ScrollCarousel } from './ScrollCarousel';
import type { CarouselProps } from './carousel.types';

/**
 * One API for every carousel in the site:
 * - `fade`: autoplaying fading slideshow (banner)
 * - `scroll`: horizontal snap row with arrows (videos, links)
 * - `playlist`: overlapping tilted cards (ITQA playlist)
 */
export function Carousel<T = unknown>(props: CarouselProps<T>): ReactNode {
  switch (props.variant) {
    case 'fade':
      return <FadeCarousel {...props} />;
    case 'scroll':
      return <ScrollCarousel {...props} />;
    case 'playlist':
      return <PlaylistTrack {...props} />;
  }
}

import type { ReactNode } from 'react';

export type CarouselArrowTone = 'default' | 'warm' | 'overlay';

export interface CarouselSlide {
  src: string;
  alt: string;
}

export interface FadeCarouselProps {
  variant: 'fade';
  slides: CarouselSlide[];
  intervalMs?: number;
  ariaLabel?: string;
  heightClassName?: string;
  className?: string;
}

export interface ScrollCarouselProps<T> {
  variant: 'scroll';
  items: T[];
  getKey: (item: T, index: number) => string;
  renderItem: (item: T) => ReactNode;
  itemClassName?: string;
  prevLabel?: string;
  nextLabel?: string;
  arrowTone?: CarouselArrowTone;
  className?: string;
}

export interface PlaylistCarouselProps<T> {
  variant: 'playlist';
  items: T[];
  getKey: (item: T, index: number) => string;
  renderItem: (item: T) => ReactNode;
  itemClassName?: string;
  itemPositions?: readonly string[];
  prevLabel?: string;
  nextLabel?: string;
  arrowTone?: CarouselArrowTone;
  className?: string;
}

export type CarouselProps<T = unknown> =
  | FadeCarouselProps
  | ScrollCarouselProps<T>
  | PlaylistCarouselProps<T>;

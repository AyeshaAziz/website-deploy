export * from './content';
export * from './design';
export * from './model';

export const ROLES = ['ADMIN', 'CONTENT_EDITOR'] as const;
export type Role = (typeof ROLES)[number];

export const SECTION_TYPES = [
  'HOME',
  'TEXT',
  'FEATURED_COURSES',
  'MULTIMEDIA',
  'FEATURED_RESOURCES',
  'CTA',
] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

export type PublishStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface SectionDTO {
  id: string;
  type: SectionType;
  order: number;
  visible: boolean;
  content: Record<string, unknown>;
}

export interface PageDTO {
  urlPath: string;
  title: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  sections: SectionDTO[];
}

export interface ResourceDTO {
  id: string;
  title: string;
  url: string;
  kind: string;
  description?: string | null;
}

export interface MediaVideoDTO {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
  publishedAt?: string | null;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** Read a string from CMS JSON content, with a fallback. */
export function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

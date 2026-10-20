export * from './design';
export * from './model';

export const ROLES = ['ADMIN', 'CONTENT_EDITOR'] as const;
export type Role = (typeof ROLES)[number];

export const SECTION_TYPES = [
  'HERO',
  'TEXT',
  'FEATURED_COURSES',
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
  slug: string;
  title: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  sections: SectionDTO[];
}

export interface CourseDTO {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface ResourceDTO {
  id: string;
  title: string;
  url: string;
  kind: string;
  description?: string | null;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** Read a string from CMS JSON content, with a fallback. */
export function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

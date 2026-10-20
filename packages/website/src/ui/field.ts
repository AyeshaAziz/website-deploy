import { cn } from '@itqa/shared';

/** Shared classes for text inputs, textareas and selects. */
export const FIELD_BASE =
  'w-full rounded-card border border-primary-5 bg-white px-3 py-2 text-body text-neutral-900 placeholder:text-neutral-400 focus:border-primary-2';

export function fieldClasses(className?: string): string {
  return cn(FIELD_BASE, className);
}

import type { ReactNode } from 'react';

export function CourseGlyph(): ReactNode {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-10 w-10 text-primary-2" fill="none">
      <path
        d="M32 14c-5-3-11-4-17-3v35c6-1 12 0 17 3 5-3 11-4 17-3V11c-6-1-12 0-17 3Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M32 14v35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

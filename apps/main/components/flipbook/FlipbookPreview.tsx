'use client';

import { type ReactNode } from 'react';
import Image from 'next/image';

interface FlipbookPreviewProps {
  title?: string;
  thumbnail?: string;
  onOpen: () => void;
}

export function FlipbookPreview({ title, thumbnail, onOpen }: FlipbookPreviewProps): ReactNode {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="block w-full max-w-[min(20rem,30vh)] overflow-hidden transition hover:shadow-lg"
    >
      <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-100">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title ?? 'Newsletter cover'}
            width={320}
            height={452}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            <span className="text-small">No preview</span>
          </div>
        )}
      </div>
      <span className="block px-3 py-2 text-center text-small text-primary-neg1">
        {title ?? 'Open flipbook'}
      </span>
    </button>
  );
}

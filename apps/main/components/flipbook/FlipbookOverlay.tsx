'use client';

import { lazy, Suspense, type ReactNode } from 'react';

const FlipbookInner = lazy(() => import('./FlipbookInner'));

interface FlipbookOverlayProps {
  src: string;
  title?: string;
  page: number;
  nextPage: number;
  numPages: number;
  flipping: boolean;
  overlayWidth: number;
  onNavigate: (next: number) => void;
  onLoadSuccess: (numPages: number) => void;
  onClose: () => void;
}

const previewFallback = (
  <div className="flex h-full w-full items-center justify-center">
    <span className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-primary-neg1" />
  </div>
);

export function FlipbookOverlay({
  src,
  title,
  page,
  nextPage,
  numPages,
  flipping,
  overlayWidth,
  onNavigate,
  onLoadSuccess,
  onClose,
}: FlipbookOverlayProps): ReactNode {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-neg1/80 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close flipbook"
        onClick={onClose}
        className="pointer-events-auto absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-neg2 shadow-card hover:bg-primary-6"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <div className="pointer-events-auto flex w-full max-w-3xl flex-col items-center gap-4">
        {title && <h3 className="font-heading text-h3 text-white">{title}</h3>}
        <div style={{ perspective: '1800px' }} className="w-full">
          <div
            className="relative mx-auto w-fit transition-transform duration-500"
            style={{
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
              transform: flipping ? 'rotateY(-180deg)' : 'rotateY(0deg)',
              transition: flipping ? 'transform 500ms ease-in-out' : 'none',
            }}
          >
            <div style={{ backfaceVisibility: 'hidden' }}>
              <Suspense fallback={previewFallback}>
                <FlipbookInner
                  src={src}
                  page={page}
                  width={overlayWidth}
                  onLoadSuccess={onLoadSuccess}
                  className="shadow-card"
                />
              </Suspense>
            </div>
            <div
              className="absolute inset-0"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <Suspense fallback={previewFallback}>
                <FlipbookInner
                  src={src}
                  page={nextPage}
                  width={overlayWidth}
                  onLoadSuccess={onLoadSuccess}
                  className="shadow-card"
                />
              </Suspense>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate(page - 1)}
            disabled={page <= 1 || flipping}
            className="rounded-card border border-white/30 bg-white/10 px-4 py-2 text-small text-white hover:bg-white/20 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-small text-white">
            Page {page} of {numPages || '?'}
          </span>
          <button
            type="button"
            onClick={() => onNavigate(page + 1)}
            disabled={page >= numPages || flipping}
            className="rounded-card border border-white/30 bg-white/10 px-4 py-2 text-small text-white hover:bg-white/20 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

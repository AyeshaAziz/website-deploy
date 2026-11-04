'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@itqasys/core';

const FlipbookInner = dynamic(() => import('./FlipbookInner'), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center text-neutral-600">Loading flipbook…</div>
  ),
});

interface FlipbookProps {
  src: string;
  title?: string;
}

export function Flipbook({ src, title }: FlipbookProps): ReactNode {
  const [open, setOpen] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [flipping, setFlipping] = useState(false);
  const [pageWidth, setPageWidth] = useState(480);
  const containerRef = useRef<HTMLDivElement>(null);

  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setPage(1);
    setNumPages(0);
  }

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setPageWidth(Math.min(el.clientWidth, 720));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  const nextPage = page < numPages ? page + 1 : page;

  const navigate = useCallback((next: number) => {
    if (next < 1 || next > numPages || flipping) return;
    setFlipping(true);
    window.setTimeout(() => {
      setPage(next);
      setFlipping(false);
    }, 500);
  }, [numPages, flipping]);

  const overlayWidth = typeof window !== 'undefined'
    ? Math.min(window.innerWidth * 0.6, window.innerHeight * 0.8 * 0.75)
    : 720;

  const preview = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="block w-full max-w-[min(20rem,30vh)] overflow-hidden rounded-card border border-primary-5 bg-white shadow-card transition hover:shadow-lg"
    >
      <div ref={containerRef} className="aspect-[3/4] w-full">
        <FlipbookInner
          src={src}
          page={1}
          width={pageWidth}
          onLoadSuccess={setNumPages}
          className="h-full w-full"
        />
      </div>
      <span className="block px-3 py-2 text-center text-small text-primary-neg1">
        {title ?? 'Open flipbook'}
      </span>
    </button>
  );

  if (!open) return preview;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close flipbook"
        onClick={() => setOpen(false)}
        className="pointer-events-auto absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-neg2 shadow-card hover:bg-primary-6"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
              <FlipbookInner
                src={src}
                page={page}
                width={overlayWidth}
                onLoadSuccess={setNumPages}
                className="shadow-card"
              />
            </div>
            <div
              className="absolute inset-0"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <FlipbookInner
                src={src}
                page={nextPage}
                width={overlayWidth}
                onLoadSuccess={setNumPages}
                className="shadow-card"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(page - 1)}
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
            onClick={() => navigate(page + 1)}
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

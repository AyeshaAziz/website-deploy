'use client';

import { useCallback, useState, type ReactNode } from 'react';
import { FlipbookPreview } from './FlipbookPreview';
import { FlipbookOverlay } from './FlipbookOverlay';

interface FlipbookProps {
  src: string;
  title?: string;
  thumbnail?: string;
  priority?: boolean;
}

export function Flipbook({ src, title, thumbnail, priority = false }: FlipbookProps): ReactNode {
  const [open, setOpen] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [flipping, setFlipping] = useState(false);

  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setPage(1);
    setNumPages(0);
  }

  const nextPage = page < numPages ? page + 1 : page;

  const navigate = useCallback((next: number) => {
    if (next < 1 || next > numPages || flipping) return;
    setFlipping(true);
    window.setTimeout(() => {
      setPage(next);
      setFlipping(false);
    }, 500);
  }, [numPages, flipping]);

  const overlayWidth =
    typeof window !== 'undefined'
      ? Math.min(window.innerWidth * 0.6, window.innerHeight * 0.8 * 0.75)
      : 720;

  const preview = (
    <FlipbookPreview
      title={title}
      thumbnail={thumbnail}
      onOpen={() => setOpen(true)}
    />
  );

  if (!open) return preview;

  return (
    <FlipbookOverlay
      src={src}
      title={title}
      page={page}
      nextPage={nextPage}
      numPages={numPages}
      flipping={flipping}
      overlayWidth={overlayWidth}
      onNavigate={navigate}
      onLoadSuccess={setNumPages}
      onClose={() => setOpen(false)}
    />
  );
}

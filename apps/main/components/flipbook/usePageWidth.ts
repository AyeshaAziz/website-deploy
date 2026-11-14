import { useEffect, useRef, useState, type RefObject } from 'react';

export function usePageWidth(open: boolean): {
  containerRef: RefObject<HTMLDivElement | null>;
  pageWidth: number;
} {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pageWidth, setPageWidth] = useState(224);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const width = Math.min(entry.contentRect.width, 720);
      if (width <= 0) return;
      setPageWidth((current) => (current === width ? current : width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  return { containerRef, pageWidth };
}

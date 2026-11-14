import { useEffect, useRef, useState, type RefObject } from 'react';

export function useInView(priority: boolean): {
  tileRef: RefObject<HTMLDivElement | null>;
  inView: boolean;
} {
  const tileRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(
    () => priority || (typeof IntersectionObserver === 'undefined'),
  );

  useEffect(() => {
    if (priority || inView) return;
    const el = tileRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [priority, inView]);

  return { tileRef, inView };
}

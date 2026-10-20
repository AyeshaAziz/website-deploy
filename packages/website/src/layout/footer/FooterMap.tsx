import type { ReactNode } from 'react';

export function FooterMap({ src, label }: { src: string; label: string }): ReactNode {
  return (
    <div className="min-h-[220px] min-w-0 overflow-hidden bg-neutral-200">
      <iframe
        title={label}
        src={src}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full min-h-[220px] w-full border-0"
      />
    </div>
  );
}

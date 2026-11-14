import type { ReactNode } from 'react';
import Image from 'next/image';

export function FooterMap({
  src,
  href,
  label,
}: {
  src?: string;
  href: string;
  label: string;
}): ReactNode {
  const imageSrc = src ?? '/images/footer-map.png';

  return (
    <div className="min-h-[220px] min-w-0 overflow-hidden bg-neutral-200">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="block h-full min-h-[220px] w-full"
      >
        <Image
          src={imageSrc}
          alt={label}
          width={400}
          height={220}
          loading="lazy"
          className="h-full min-h-[220px] w-full object-cover"
        />
      </a>
    </div>
  );
}

import type { ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@itqa/core';
import type { ContactAsideContent } from '@/lib/contact/content';

interface ContactAsideProps {
  content: ContactAsideContent;
  email: string;
  className?: string;
}

export function ContactAside({ content, email, className }: ContactAsideProps): ReactNode {
  return (
    <aside aria-labelledby="contact-aside-heading" className={cn('min-w-0', className)}>
      <div className="overflow-hidden rounded-card border border-primary-5">
        <Image
          src={content.image.src}
          alt={content.image.alt}
          width={content.image.width}
          height={content.image.height}
          sizes={content.image.sizes}
          className="h-auto w-full"
        />
      </div>
      <h2 id="contact-aside-heading" className="mt-6 font-heading text-h2 text-primary-neg2">
        {content.heading}
      </h2>
      <p className="mt-2 text-body text-neutral-600">{content.body}</p>
    </aside>
  );
}

import type { ReactNode } from 'react';
import { PageAside } from '@/components/PageAside';
import type { ContactAsideContent } from '@/lib/contact/content';

interface ContactAsideProps {
  content: ContactAsideContent;
  email: string;
  className?: string;
}

export function ContactAside({ content, className }: ContactAsideProps): ReactNode {
  return (
    <PageAside
      image={content.image}
      heading={content.heading}
      body={content.body}
      headingId="contact-aside-heading"
      className={className}
    />
  );
}

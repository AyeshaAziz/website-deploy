import type { ReactNode } from 'react';
import type { FooterContactData } from './footer.types';

export function FooterContact({
  title,
  addressTitle,
  addressLines,
  emailTitle,
  email,
}: FooterContactData): ReactNode {
  return (
    <div className="min-w-0">
      <h2 className="text-h3 font-bold text-white">{title}</h2>
      <h3 className="mt-4 text-small font-bold text-white">{addressTitle}</h3>
      <address className="mt-1 text-small not-italic">
        {addressLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </address>
      <h3 className="mt-4 text-small font-bold text-white">{emailTitle}</h3>
      <a href={`mailto:${email}`} className="mt-1 block break-words text-small hover:text-white">
        {email}
      </a>
    </div>
  );
}

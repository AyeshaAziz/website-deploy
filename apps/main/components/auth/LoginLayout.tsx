import type { ReactNode } from 'react';
import Image from 'next/image';
import { LoginQuotePanel } from './LoginQuotePanel';

interface LoginLayoutProps {
  children: ReactNode;
}

export function LoginLayout({ children }: LoginLayoutProps): ReactNode {
  return (
    <section className="flex w-full">
      <LoginQuotePanel />
      <div className="relative isolate flex min-h-[60vh] flex-1 items-center justify-center px-4 py-section-sm lg:min-h-[70vh]">
        <Image
          src="/images/background/registration-bg.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          priority
          className="-z-10 object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-primary-neg2/40" />
        <div className="w-full max-w-md">{children}</div>
      </div>
    </section>
  );
}

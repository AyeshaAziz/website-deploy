import Image from 'next/image';
import type { ReactNode } from 'react';

export interface RegistrationCardProps {
  children: ReactNode;
  aside?: ReactNode;
}

export function RegistrationCard({ children, aside }: RegistrationCardProps): ReactNode {
  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-card bg-white/70 shadow-card lg:grid lg:grid-cols-[2fr_3fr]">
      {aside ? (
        aside
      ) : (
        <div className="relative h-56 lg:h-auto">
          <Image
            src="/images/form.webp"
            alt="An open, illuminated copy of the Holy Qur'an"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </div>
      )}

      <div className="p-6 sm:p-8">{children}</div>
    </div>
  );
}

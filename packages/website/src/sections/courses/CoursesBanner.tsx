import type { ReactNode } from 'react';
import { Container } from '@itqa/ui';
import { BannerBackground } from '../shared/BannerBackground';

export interface CoursesBannerProps {
  heading: string;
  body: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

export function CoursesBanner({
  body,
  imageSrc,
  imageAlt,
  className,
}: CoursesBannerProps): ReactNode {
  return (
    <BannerBackground
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      className={className}
    >
      <Container className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mt-4 text-body sm:text-h3">{body}</p>
        </div>
      </Container>
    </BannerBackground>
  );
}

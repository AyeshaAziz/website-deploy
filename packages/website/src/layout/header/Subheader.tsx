import type { ReactNode } from 'react';
import type { NavItem } from '@itqasys/core';
import { Container, NavBar } from '@itqa/ui';

export interface SubheaderProps {
  logoUrl?: string;
  secondaryNav?: NavItem[];
  activeHref?: string;
  onNavigate?: (href: string) => void;
}

export function Subheader({
  logoUrl,
  secondaryNav = [],
  activeHref,
  onNavigate,
}: SubheaderProps): ReactNode {
  return (
    <div className="bg-white">
      <Container className="flex justify-center py-3 lg:items-center lg:justify-between lg:py-5">
        {logoUrl && (
          <img
            src={logoUrl}
            alt="International Ta'limul Qur'an Academy"
            width={1512}
            height={368}
            className="h-14 w-auto lg:h-20"
          />
        )}
        <NavBar
          items={secondaryNav}
          activeHref={activeHref}
          onNavigate={onNavigate}
          tone="light"
          size="md"
          divided
          ariaLabel="Secondary"
          className="hidden lg:block"
        />
      </Container>
      <div className="border-t border-primary-5 lg:hidden">
        <Container className="py-2">
          <NavBar
            items={secondaryNav}
            activeHref={activeHref}
            onNavigate={onNavigate}
            tone="light"
            size="sm"
            divided
            ariaLabel="Secondary"
          />
        </Container>
      </div>
    </div>
  );
}

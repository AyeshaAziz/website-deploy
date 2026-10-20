'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { NavItem } from '@itqa/shared';
import { Container } from '../../ui/Container';
import { NavBar } from '../../ui/NavBar';
import { MobileNav } from '../../ui/NavBarMobile';
import { Subheader } from './Subheader';

export interface HeaderProps {
  nav?: NavItem[];
  secondaryNav?: NavItem[];
  activeHref?: string;
  onNavigate?: (href: string) => void;
  logoUrl?: string;
}

export function Header({
  nav = [],
  secondaryNav = [],
  activeHref,
  onNavigate,
  logoUrl,
}: HeaderProps): ReactNode {
  const [menuOpen, setMenuOpen] = useState(false);
  const [internalHref, setInternalHref] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (activeHref === undefined) setInternalHref(window.location.pathname);
  }, [activeHref]);

  const currentHref = activeHref ?? internalHref;

  const navigate = (href: string) => {
    setMenuOpen(false);
    if (href === currentHref) return;
    if (!activeHref) setInternalHref(href);
    if (onNavigate) onNavigate(href);
    else window.location.assign(href);
  };

  return (
    <header className="relative z-20 shadow-header">
      <div className="relative z-30">
        <div className="bg-primary-7 text-white">
          <Container className="flex  items-center justify-between gap-6">
            <NavBar
              items={nav}
              activeHref={currentHref}
              onNavigate={navigate}
              ariaLabel="Main"
              className="hidden lg:block"
            />
            {/* Mobile menu button */}
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((value) => !value)}
              className="flex w-full items-center justify-between py-3 text-small font-semibold uppercase tracking-wide text-white lg:hidden"
            >
              <span>Menu</span>
              <MenuIcon open={menuOpen} />
            </button>
          </Container>
        </div>

        {menuOpen && (
          <>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-20 cursor-default bg-primary-neg2/30 lg:hidden"
            />
            <div
              id="site-menu"
              className="absolute inset-x-0 top-full z-30 max-h-[80vh] overflow-y-auto bg-primary-7 text-white shadow-card lg:hidden"
            >
              <Container className="pb-4">
                <MobileNav items={nav} activeHref={currentHref} onNavigate={navigate} />
              </Container>
            </div>
          </>
        )}
      </div>

      <Subheader
        logoUrl={logoUrl}
        secondaryNav={secondaryNav}
        activeHref={currentHref}
        onNavigate={navigate}
      />
    </header>
  );
}

export const SiteHeader = Header;

function MenuIcon({ open }: { open: boolean }): ReactNode {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

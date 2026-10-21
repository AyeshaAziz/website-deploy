'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Header } from '@itqa/website';
import { NavItem } from '@itqa/core';

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Login', href: '/login' },
  { label: 'Courses', href: '/courses' },
  {
    label: 'Registration',
    options: [
      { label: 'Student Registration - Atfal/Nasirat', href: '/atfalNasirat' },
      { label: 'Student Registration - Ansar', href: '/ansar' },
      { label: 'Student Registration - Khuddam', href: '/khuddam' },
      { label: 'Student Registration - Lajna', href: '/lajna' },
      { label: 'Teachers', href: '/teachersReg' },
    ],
  },
  // { label: 'Volunteers', href: '/volunteers' },
  { label: 'Contact Us', href: '/contact' },
];

const SECONDARY_NAV: NavItem[] = [
  { label: 'ITQA Calendar', href: '/calendar' },
  { label: 'Events', href: '/events' },
  { label: 'Shop', href: '/shop' },
  {
    label: 'Resources',
    href: '/resources',
    options: [{ label: 'Study Materials', href: '/study-materials' }],
  },
  {
    label: 'Multimedia',
    href: '/multimedia',
    options: [{ label: 'Gallery', href: '/multimedia' }],
  },
];
  return (
    <Header
      logoUrl="/images/logo.png"
      nav={PRIMARY_NAV}
      secondaryNav={SECONDARY_NAV}
      activeHref={pathname}
      onNavigate={(href) => {
        if (href !== pathname) router.push(href);
      }}
    />
  );
}

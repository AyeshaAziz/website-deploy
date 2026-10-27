'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Header } from '@itqa/website';
import { NavItem } from '@itqasys/core';

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const PRIMARY_NAV: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    {
      label: 'Registration',
      href: '/register',
      options: [
        { label: 'Teachers', href: '/teacher' },
        {
          label: 'Students',
          options: [
            { label: 'Ansar', href: '/register?group=ansar' },
            { label: 'Lajna', href: '/register?group=lajna' },
            { label: 'Khuddam', href: '/register?group=khuddam' },
            { label: 'Nasirat / Atfal', href: '/register?group=atfal-nasirat' },
          ],
        },
      ],
    },
    // { label: 'Volunteers', href: '/volunteers' },
    { label: 'About', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Login', href: '/login' },
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

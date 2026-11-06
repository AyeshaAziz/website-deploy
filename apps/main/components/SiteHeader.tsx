'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Header } from '@itqa/website';
import { NavItem } from '@itqasys/core';
import { logout } from '@/app/admin/actions';

interface SiteHeaderProps {
  isAuthenticated?: boolean;
}

export function SiteHeader({ isAuthenticated = false }: SiteHeaderProps) {
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
    { label: 'Volunteers', href: '/volunteers' },
    { label: 'About', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    ...(isAuthenticated
      ? [
          { label: 'Dashboard', href: '/admin' },
          { label: 'Logout', href: '/logout' },
        ]
      : [{ label: 'Login', href: '/login' }]),
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
      href: '/gallery',
      options: [{ label: 'Gallery', href: '/gallery' }],
    },
  ];
  return (
    <Header
      logoUrl="/images/logo.png"
      nav={PRIMARY_NAV}
      secondaryNav={SECONDARY_NAV}
      activeHref={pathname}
      onNavigate={(href) => {
        if (href === '/logout') {
          logout();
          return;
        }
        if (href !== pathname) router.push(href);
      }}
    />
  );
}

'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Header } from '@itqa/website';
import { NavItem } from '@itqasys/core';
import { logout } from '@/app/admin/actions';
import { createClientSupabaseClient } from '@/utils/supabase/client';

interface SiteHeaderProps {
  /** Pass a value on dynamic pages. Omit on static pages so the session is read client-side. */
  isAuthenticated?: boolean;
}

export function SiteHeader({ isAuthenticated }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sessionAuthenticated, setSessionAuthenticated] = useState(false);
  const authenticated = isAuthenticated ?? sessionAuthenticated;

  useEffect(() => {
    if (isAuthenticated !== undefined) return;

    let cancelled = false;
    createClientSupabaseClient()
      .auth.getSession()
      .then(({ data }) => {
        if (!cancelled) setSessionAuthenticated(Boolean(data.session));
      })
      .catch(() => {
        if (!cancelled) setSessionAuthenticated(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

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
    ...(authenticated
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

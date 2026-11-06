import { headers } from 'next/headers';
import { Footer } from '@itqa/website';
import { SiteHeader } from '@/components/SiteHeader';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const userId = (await headers()).get('x-user-id');
  return (
    <>
      <SiteHeader isAuthenticated={Boolean(userId)} />
      <main>{children}</main>
      <Footer />
    </>
  );
}

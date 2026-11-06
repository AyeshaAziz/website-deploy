import { headers } from 'next/headers';
import { Footer } from '@itqa/website';
import { SiteHeader } from '@/components/SiteHeader';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const userId = (await headers()).get('x-user-id');
  return (
    <>
      <div className="flex h-dvh flex-col">
        <SiteHeader isAuthenticated={Boolean(userId)} />
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</main>
      </div>
      <Footer />
    </>
  );
}

import { Footer } from '@itqa/website';
import { SiteHeader } from '@/components/SiteHeader';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <Footer />
    </>
  );
}

import { Footer } from '@itqa/website';
import { SiteHeader } from '@/components/SiteHeader';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string; message?: string }> }) {
  const sp = await searchParams;
  return (
    <>
      <SiteHeader />
      <main>
        <SignUpForm error={Boolean(sp?.error)} success={Boolean(sp?.success)} message={sp?.message} />
      </main>
      <Footer />
    </>
  );
}

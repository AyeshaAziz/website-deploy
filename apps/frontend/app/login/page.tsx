import { Footer } from '@itqa/website';
import { SiteHeader } from '@/components/SiteHeader';
import { LoginForm } from '@/components/auth/LoginForm';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; redirect?: string }> }) {
  const sp = await searchParams;
  return (
    <>
      <SiteHeader />
      <main>
        <LoginForm error={Boolean(sp?.error)} redirectTo={sp?.redirect} />
      </main>
      <Footer />
    </>
  );
}

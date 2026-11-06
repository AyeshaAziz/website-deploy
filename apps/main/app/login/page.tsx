import { headers } from 'next/headers';
import { Footer } from '@itqa/website';
import { SiteHeader } from '@/components/SiteHeader';
import { LoginLayout } from '@/components/auth/LoginLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; redirect?: string }> }) {
  const [sp, userId] = await Promise.all([searchParams, headers().then((h) => h.get('x-user-id'))]);
  return (
    <>
      <SiteHeader isAuthenticated={Boolean(userId)} />
      <main>
        <LoginLayout>
          <LoginForm error={Boolean(sp?.error)} redirectTo={sp?.redirect} />
        </LoginLayout>
      </main>
      <Footer />
    </>
  );
}

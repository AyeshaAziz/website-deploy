import Link from 'next/link';
import { Container, SectionHeading, Button } from '@itqa/ui';
import { requireAuth, requireRole } from '@/lib/auth';
import { logout } from './actions';
import { RegistrationsTable } from '@/components/admin/RegistrationsTable';

export default async function AdminDashboard() {
  const session = await requireAuth();
  requireRole(session, ['ADMIN', 'CONTENT_EDITOR']);

  return (
    <Container className="py-section-sm">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <SectionHeading as="h1" title="Admin dashboard" />
          <form action={logout}>
            <Button type="submit" variant="secondary" size="sm">
              Logout
            </Button>
          </form>
        </div>
        <p className="mb-6 text-body text-neutral-700">
          Signed in as {session.email}.
        </p>
        <p className="mb-6 text-small text-neutral-600">
            Create new account{' '}
            <Link href="/signup" className="text-primary-neg1 underline">
              Sign up
            </Link>
          </p>
        <SectionHeading as="h2" title="Registrations" className="mb-4" />
        <RegistrationsTable />
      </div>
    </Container>
  );
}

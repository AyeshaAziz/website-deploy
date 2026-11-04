import Link from 'next/link';
import { Container, SectionHeading, Button } from '@itqa/ui';
import { requireAuth, requireRole } from '@/lib/auth';
import { getRegistrations } from '@/lib/admin/registrations';
import { getEnquiries } from '@/lib/admin/enquiries';
import { DashboardSections } from '@/components/admin/sections/DashboardSections';
import { RegistrationsTable } from '@/components/admin/tables/RegistrationsTable';
import { EnquiriesTable } from '@/components/admin/tables/EnquiriesTable';
import { logout } from './actions';

export default async function AdminDashboard() {
  const session = await requireAuth();
  requireRole(session, ['ADMIN', 'CONTENT_EDITOR']);
  const [rows, enquiries] = await Promise.all([getRegistrations(), getEnquiries()]);
  const pendingCount = rows?.filter((row) => row.status === 'TODO').length ?? 0;
  const pendingEnquiryCount = enquiries?.filter((row) => row.status === 'TODO').length ?? 0;

  return (
    <Container className="py-section-sm">
      <div className="mx-auto max-w-5xl">
        <DashboardSections
          pendingCount={pendingCount}
          enquiryCount={pendingEnquiryCount}
          headerRight={
            <form action={logout}>
              <Button type="submit" variant="secondary" size="sm">
                Logout
              </Button>
            </form>
          }
          intro={
            <p className="mb-6 text-small text-neutral-600">
              Signed in as {session.email}. Create new account{' '}
              <Link href="/signup" className="text-primary-neg1 underline">
                Sign up
              </Link>
            </p>
          }
          registrations={
            <>
              <SectionHeading as="h2" title="Registrations" className="mb-4" />
              {rows === null ? (
                <p role="alert" className="rounded-card bg-danger/10 p-3 text-danger">
                  Could not load registrations.
                </p>
              ) : (
                <RegistrationsTable rows={rows} />
              )}
            </>
          }
          enquiries={
            <>
              <SectionHeading as="h2" title="Enquiries" className="mb-4" />
              {enquiries === null ? (
                <p role="alert" className="rounded-card bg-danger/10 p-3 text-danger">
                  Could not load enquiries.
                </p>
              ) : (
                <EnquiriesTable rows={enquiries} />
              )}
            </>
          }
        />
      </div>
    </Container>
  );
}

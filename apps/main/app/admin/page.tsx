import Link from 'next/link';
import { Container, SectionHeading } from '@itqa/ui';
import { requireAuth, requireRole } from '@/lib/auth';
import { getEnquiries } from '@/lib/services/admin';
import { getRegistrations } from '@/lib/services/admin';
import { DashboardSections } from '@/components/admin/sections/DashboardSections';
import { RegistrationsTable } from '@/components/admin/tables/RegistrationsTable';
import { EnquiriesTable } from '@/components/admin/tables/EnquiriesTable';

export default async function AdminDashboard() {
  const session = await requireAuth();
  requireRole(session, ['ADMIN', 'CONTENT_EDITOR']);
  const [rows, enquiries] = await Promise.all([getRegistrations(), getEnquiries()]);
  const pendingCount = rows?.filter((row) => row.status === 'TODO').length ?? 0;
  const pendingEnquiryCount = enquiries?.filter((row) => row.status === 'TODO').length ?? 0;

  return (
    <Container className="flex min-h-0 flex-1 flex-col py-section-sm">
      <div className="mx-auto flex min-h-0 w-full max-w-1xl flex-1 flex-col">
        <DashboardSections
          pendingCount={pendingCount}
          enquiryCount={pendingEnquiryCount}
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
              <SectionHeading as="h2" title="Registrations" className="mb-4 shrink-0" />
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
              <SectionHeading as="h2" title="Enquiries" className="mb-4 shrink-0" />
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

import { prisma } from '@itqa/database';
import { Card, Container, SectionHeading } from '@itqa/website';
import { requireAuth, requireRole } from '@/lib/auth';
import { logout } from '../actions';

export default async function ContentManagementPage() {
  const session = await requireAuth();
  requireRole(session, ['ADMIN', 'CONTENT_EDITOR']);
  const pages = await prisma.websitePage.findMany({ orderBy: { title: 'asc' } });

  return (
    <Container className="py-section-sm">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <SectionHeading as="h1" title="Content management" />
          <form action={logout}>
            <button type="submit" className="text-small text-primary-neg1 underline">
              Sign out ({session.email})
            </button>
          </form>
        </div>
        <Card className="p-0">
          <ul className="divide-y divide-primary-5">
            {pages.map((p) => (
              <li key={p.id} className="flex items-center justify-between p-4">
                <a href={`/admin/content-management/${p.slug}`} className="font-medium text-primary-neg1 hover:underline">
                  {p.title}
                </a>
                <span className="text-small text-neutral-600">{p.status}</span>
              </li>
            ))}
          </ul>
        </Card>
        {/* TODO: course and resource management, image upload to S3, drag-and-drop ordering */}
      </div>
    </Container>
  );
}

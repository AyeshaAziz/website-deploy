import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/db';
import { Button, Card, Container, SectionHeading, Textarea } from '@itqa/ui';
import { requireAuth, requireRole } from '@/lib/auth';
import { setPageStatus, updateSection } from '../../actions';

export default async function PageEditor({ params }: { params: { page: string } }) {
  const session = await requireAuth();
  requireRole(session, ['ADMIN', 'CONTENT_EDITOR']);

  const { data: page, error } = await supabase.from('websitePage').select('*, sections(order)').eq('urlPath', params.page).single();
  if (!page || error) notFound();

  return (
    <Container className="py-section-sm">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin/content-management" className="text-small text-primary-neg1 underline">
          &larr; All pages
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <SectionHeading as="h1" title={page.title} />
          <span className="text-small text-neutral-600">({page.status})</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          (['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const).map((status) => (
            <form key={status} action={setPageStatus}>
              <input type="hidden" name="urlPath" value={page.urlPath} />
              <input type="hidden" name="status" value={status} />
              <Button type="submit" variant="secondary" size="sm">
                {status === 'PUBLISHED' ? 'Publish' : status === 'DRAFT' ? 'Unpublish' : 'Archive'}
              </Button>
            </form>
          ))}
        </div>

        <div className="mt-8 space-y-6">
          {page.sections.map((s) => (
            <Card key={s.id}>
              <form action={updateSection}>
                <input type="hidden" name="id" value={s.id} />
                <p className="mb-2 text-small font-semibold text-neutral-900">
                  {s.order + 1}. {s.type}
                </p>
                <Textarea
                  name="content"
                  rows={6}
                  defaultValue={JSON.stringify(s.content, null, 2)}
                  className="font-mono text-xs"
                />
                <Button type="submit" size="sm" className="mt-2">
                  Save section
                </Button>
              </form>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
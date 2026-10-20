import type { ReactNode } from 'react';
import { str } from '@itqa/shared';
import type { CourseDTO, PageDTO, ResourceDTO, SectionDTO } from '@itqa/shared';
import { ButtonLink } from '../ui/Button';
import { Card } from '../ui/Card';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

interface Data {
  courses: CourseDTO[];
  resources: ResourceDTO[];
}

function Hero({ content }: { content: SectionDTO['content'] }) {
  return (
    <section className="bg-primary-neg2 py-section-sm text-white">
      <Container>
        <p className="mb-4 h-1 w-16 rounded-full bg-accent-gold" aria-hidden="true" />
        <h1 className="font-heading text-display">{str(content.heading)}</h1>
        <p className="mt-4 max-w-2xl text-body text-primary-5">{str(content.subheading)}</p>
        {str(content.ctaLabel) && (
          <ButtonLink href={str(content.ctaHref, '/')} variant="gold" size="lg" className="mt-8">
            {str(content.ctaLabel)}
          </ButtonLink>
        )}
      </Container>
    </section>
  );
}

function Text({ content }: { content: SectionDTO['content'] }) {
  const paragraphs = str(content.body).split(/\n{2,}/).filter(Boolean);
  return (
    <section className="py-section-sm">
      <Container>
        <div className="mx-auto max-w-3xl">
          {str(content.heading) && <SectionHeading title={str(content.heading)} className="mb-4" />}
          {paragraphs.map((p, i) => (
            <p key={i} className="mb-4 text-body text-neutral-800">
              {p}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeaturedCourses({ content, courses }: { content: SectionDTO['content']; courses: CourseDTO[] }) {
  return (
    <section className="py-section-sm">
      <Container>
        <SectionHeading title={str(content.heading, 'Courses')} className="mb-6" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <li key={c.id}>
              <Card className="h-full">
                <h3 className="font-heading text-h3">
                  <a href={`/courses/${c.slug}`} className="text-primary-neg1 hover:underline">
                    {c.title}
                  </a>
                </h3>
                <p className="mt-2 text-small text-neutral-600">{c.summary}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function FeaturedResources({ content, resources }: { content: SectionDTO['content']; resources: ResourceDTO[] }) {
  return (
    <section className="py-section-sm">
      <Container>
        <SectionHeading title={str(content.heading, 'Resources')} className="mb-6" />
        <ul className="space-y-3">
          {resources.map((r) => (
            <li key={r.id}>
              <a href={r.url} className="font-medium text-primary-2 hover:text-primary-neg1 hover:underline">
                {r.title}
              </a>
              {r.description && <p className="text-small text-neutral-600">{r.description}</p>}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Cta({ content }: { content: SectionDTO['content'] }) {
  return (
    <section className="bg-primary-neg1 py-section-sm text-white">
      <Container className="text-center">
        <h2 className="font-heading text-h2">{str(content.heading)}</h2>
        <ButtonLink href={str(content.href, '/')} variant="gold" size="lg" className="mt-6">
          {str(content.label, 'Learn more')}
        </ButtonLink>
      </Container>
    </section>
  );
}

export function SectionRenderer({ section, courses, resources }: { section: SectionDTO } & Data): ReactNode {
  switch (section.type) {
    case 'HERO':
      return <Hero content={section.content} />;
    case 'TEXT':
      return <Text content={section.content} />;
    case 'FEATURED_COURSES':
      return <FeaturedCourses content={section.content} courses={courses} />;
    case 'FEATURED_RESOURCES':
      return <FeaturedResources content={section.content} resources={resources} />;
    case 'CTA':
      return <Cta content={section.content} />;
    default:
      return null;
  }
}

export function PageView({ page, courses, resources }: { page: PageDTO } & Data): ReactNode {
  return (
    <>
      {page.sections.map((s) => (
        <SectionRenderer key={s.id} section={s} courses={courses} resources={resources} />
      ))}
    </>
  );
}

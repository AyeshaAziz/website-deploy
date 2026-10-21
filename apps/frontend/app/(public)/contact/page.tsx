import type { Metadata } from 'next';
import { Container, SectionHeading } from '@itqa/ui';
import { ContactAside } from '@/components/contact/ContactAside';
import { ContactForm } from '@/components/contact/ContactForm';
import {
  CONTACT_CONTENT,
  CONTACT_DEPARTMENT_LIST,
  GENERAL_CONTACT_DEPARTMENT,
} from '@/lib/contact/content';

const { page, aside, form } = CONTACT_CONTENT;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
};

type Props = { searchParams: Promise<{ sent?: string; error?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <Container className="py-section-sm">
      <SectionHeading as="h1" title={page.heading} className="mb-6" />
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <ContactAside content={aside} email={GENERAL_CONTACT_DEPARTMENT.email} />
        <ContactForm
          departments={CONTACT_DEPARTMENT_LIST}
          copy={form}
          sent={Boolean(params.sent)}
          error={Boolean(params.error)}
        />
      </div>
    </Container>
  );
}

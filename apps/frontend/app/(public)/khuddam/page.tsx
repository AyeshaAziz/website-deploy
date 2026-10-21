import type { Metadata } from 'next';
import { Container, SectionHeading } from '@itqa/ui';
import { RegistrationForm } from '@/components/registration/RegistrationForm';
import { getTrackDefinition } from '@/lib/registrations/tracks';

const TRACK = 'khuddam' as const;

export function generateMetadata(): Metadata {
  const { content } = getTrackDefinition(TRACK);
  return { title: content.title, description: content.description };
}

export default function KhuddamRegistrationPage() {
  const { content } = getTrackDefinition(TRACK);

  return (
    <Container className="py-section-sm">
      <SectionHeading
        as="h1"
        title={content.title}
        subtitle={content.description}
        className="mb-8"
      />
      <RegistrationForm track={TRACK} />
    </Container>
  );
}

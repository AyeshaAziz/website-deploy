import type { Metadata } from 'next';
import { Container, SectionHeading } from '@itqa/ui';
import { RegistrationForm } from '@/components/registration/form/RegistrationForm';
import { getTrackDefinition } from '@/lib/registrations/tracks';
import { getCourses } from '@/lib/courses';

const TRACK = 'teacher' as const;

export function generateMetadata(): Metadata {
  const { content } = getTrackDefinition(TRACK);
  return { title: content.title, description: content.description };
}

export default async function TeacherRegistrationPage() {
  const { content } = getTrackDefinition(TRACK);
  const courses = await getCourses();

  return (
    <Container className="py-section-sm">
      <SectionHeading
        as="h1"
        title={content.title}
        subtitle={content.description}
        className="mb-8"
      />
      <RegistrationForm track={TRACK} courses={courses} />
    </Container>
  );
}

import type { Metadata } from 'next';
import { Container, SectionHeading } from '@itqa/ui';
import { BannerBackground } from '@itqa/website';
import { RegistrationCard } from '@/components/registration/RegistrationCard';
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
    <BannerBackground
      imageSrc="/images/background/registration-bg.webp"
      imageClassName="opacity-100"
    >
      <Container className="py-section-sm lg:py-section-lg">
        <RegistrationCard>
          <SectionHeading
            as="h1"
            title={content.title}
            subtitle={content.description}
            className="mb-8"
          />
          <RegistrationForm track={TRACK} courses={courses} />
        </RegistrationCard>
      </Container>
    </BannerBackground>
  );
}

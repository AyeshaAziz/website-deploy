import type { Metadata } from 'next';
import { Container } from '@itqa/ui';
import { BannerBackground } from '@itqa/website';
import { StudentRegistrationForm } from '@/components/registration/student/StudentRegistrationForm';
import { getCourses } from '@/lib/content';
import { resolveRegistrationCourse } from '@/lib/registrations/course';
import { resolveRegistrationGroup } from '@/lib/registrations/groups';

type Props = { searchParams: Promise<{ course?: string; group?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { course } = await resolveRegistrationCourse(searchParams);

  return {
    title: course ? `Register for ${course.title}` : 'Register',
    description: 'Register with ITQA.',
  };
}

export default async function RegisterPage({ searchParams }: Props) {
  const params = await searchParams;
  const [{ course }, courses] = await Promise.all([
    resolveRegistrationCourse(Promise.resolve(params)),
    getCourses(),
  ]);
  const { allowed, tanzeem } = resolveRegistrationGroup(params.group);

  return (
    <BannerBackground
      imageSrc="/images/background/registration-bg.webp"
      imageClassName="opacity-100"
    >
      <Container className="py-section-sm lg:py-section-lg">
        <StudentRegistrationForm
          key={`${params.group ?? 'all'}:${course?.id ?? 'none'}`}
          courseTitle={course?.title}
          courses={courses}
          defaultCourse={course?.id}
          tanzeemOptions={allowed}
          defaultTanzeem={tanzeem}
        />
      </Container>
    </BannerBackground>
  );
}

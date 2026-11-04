import type { Metadata } from 'next';
import { Card, Container } from '@itqa/ui';
import {
  CoursesOffered,
  EnrolmentProcess,
  TeachersPresentation,
  VolunteerContact,
  VolunteerFaq,
  VolunteerIntro,
} from './sections';

export const metadata: Metadata = {
  title: 'Volunteers - ITQA',
  description: 'Volunteer with ITQA as a Qur\'an teacher.',
};

export default function VolunteersPage() {
  return (
    <Container className="py-section-sm">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <aside className="min-w-0">
          <TeachersPresentation />
        </aside>

        <Card className="min-w-0 bg-white/70 p-5 shadow-lg shadow-primary-7/20">
          <VolunteerIntro />
          <CoursesOffered />
          <EnrolmentProcess />
          <VolunteerFaq />
          <VolunteerContact />
        </Card>
      </div>
    </Container>
  );
}

export type RegistrationStatus = 'TODO' | 'PROCESSED';

export interface AdminRegistrationRow {
  reference: string;
  firstName: string;
  lastName: string;
  track: string;
  course: string;
  courseLanguage: string;
  secondLanguage?: string;
  aimsNo?: string;
  tanzeem: string;
  country: string;
  city: string;
  phone: string;
  email: string;
  teachingExperience?: string;
  teachingRole?: string;
  commitDays?: string;
  availableTimes?: string;
  submittedAt: string;
  createdAt: string;
  status: RegistrationStatus;
}

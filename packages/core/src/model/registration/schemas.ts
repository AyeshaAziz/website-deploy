import { z } from 'zod';
import { f } from '../../forms/field-meta';
import type { RegistrationTrack } from './tracks';

const PHONE_PATTERN = /^[+0-9()\-\s]{7,20}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const firstName = f(z.string().trim().min(1).max(80), {
  type: 'text',
  order: 10,
  autoComplete: 'given-name',
});

const lastName = f(z.string().trim().min(1).max(80), {
  type: 'text',
  order: 20,
  autoComplete: 'family-name',
});

const email = f(z.string().trim().email(), {
  type: 'email',
  order: 30,
  autoComplete: 'email',
});

const phone = f(z.string().trim().regex(PHONE_PATTERN, 'Enter a valid phone number.'), {
  type: 'tel',
  order: 40,
  autoComplete: 'tel',
});

const dateOfBirth = f(z.string().regex(ISO_DATE_PATTERN, 'Enter a valid date.'), {
  type: 'date',
  order: 50,
});

const gender = f(z.enum(['male', 'female']), {
  type: 'radio',
  order: 60,
});

const address = f(z.string().trim().min(1).max(200), {
  type: 'text',
  order: 70,
  autoComplete: 'street-address',
});

const city = f(z.string().trim().min(1).max(80), {
  type: 'text',
  order: 80,
  autoComplete: 'address-level2',
});

const country = f(z.string().trim().min(1).max(80), {
  type: 'text',
  order: 90,
  autoComplete: 'country-name',
});

const consent = f(
  z.literal(true, {
    errorMap: () => ({ message: 'Please accept the privacy policy to continue.' }),
  }),
  { type: 'checkbox', order: 200, colSpan: 2 },
);

const sharedFields = {
  firstName,
  lastName,
  email,
  phone,
  dateOfBirth,
  gender,
  address,
  city,
  country,
  consent,
};

export const atfalNasiratSchema = z.object({
  ...sharedFields,
  category: f(z.enum(['atfal', 'nasirat']), { type: 'radio', order: 110 }),
  guardianName: f(z.string().trim().min(1).max(120), { type: 'text', order: 120 }),
  guardianPhone: f(
    z.string().trim().regex(PHONE_PATTERN, 'Enter a valid phone number.'),
    { type: 'tel', order: 130 },
  ),
  school: f(z.string().trim().min(1).max(120), { type: 'text', order: 140 }),
  grade: f(
    z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
    { type: 'select', order: 150 },
  ),
});

export const ansarSchema = z.object({
  ...sharedFields,
  occupation: f(z.string().trim().min(1).max(120), { type: 'text', order: 110 }),
  employer: f(z.string().trim().max(120).optional(), { type: 'text', order: 120 }),
  bloodGroup: f(
    z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
    { type: 'select', order: 130 },
  ),
  skills: f(z.string().trim().max(500).optional(), { type: 'textarea', order: 140, rows: 4, colSpan: 2 }),
});

export const khuddamSchema = z.object({
  ...sharedFields,
  profession: f(z.string().trim().min(1).max(120), { type: 'text', order: 110 }),
  education: f(
    z.enum(['high-school', 'bachelor', 'master', 'doctorate', 'other']),
    { type: 'select', order: 120 },
  ),
  bloodGroup: f(
    z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
    { type: 'select', order: 130 },
  ),
  skills: f(z.string().trim().max(500).optional(), { type: 'textarea', order: 140, rows: 4, colSpan: 2 }),
});

export const lajnaSchema = z.object({
  ...sharedFields,
  profession: f(z.string().trim().max(120).optional(), { type: 'text', order: 110 }),
  education: f(
    z.enum(['high-school', 'bachelor', 'master', 'doctorate', 'other']),
    { type: 'select', order: 120 },
  ),
  maritalStatus: f(z.enum(['single', 'married', 'widowed', 'divorced']), {
    type: 'select',
    order: 130,
  }),
  skills: f(z.string().trim().max(500).optional(), { type: 'textarea', order: 140, rows: 4, colSpan: 2 }),
});

export const teacherSchema = z.object({
  ...sharedFields,
  qualification: f(z.string().trim().min(1).max(120), { type: 'text', order: 110 }),
  subjects: f(z.string().trim().min(2).max(200), { type: 'text', order: 120 }),
  experienceYears: f(z.number().int().min(0).max(60), { type: 'number', order: 130 }),
  availability: f(z.enum(['weekdays', 'weekends', 'flexible']), {
    type: 'select',
    order: 140,
  }),
  notes: f(z.string().trim().max(500).optional(), { type: 'textarea', order: 150, rows: 4, colSpan: 2 }),
});

export const REGISTRATION_SCHEMAS = {
  atfalNasirat: atfalNasiratSchema,
  ansar: ansarSchema,
  khuddam: khuddamSchema,
  lajna: lajnaSchema,
  teacher: teacherSchema,
} satisfies Record<RegistrationTrack, z.AnyZodObject>;

export type RegistrationValues<T extends RegistrationTrack> = z.infer<
  (typeof REGISTRATION_SCHEMAS)[T]
>;

export const registrationSchema = z.discriminatedUnion('track', [
  atfalNasiratSchema.extend({ track: z.literal('atfalNasirat') }),
  ansarSchema.extend({ track: z.literal('ansar') }),
  khuddamSchema.extend({ track: z.literal('khuddam') }),
  lajnaSchema.extend({ track: z.literal('lajna') }),
  teacherSchema.extend({ track: z.literal('teacher') }),
]);

export type RegistrationInput = z.infer<typeof registrationSchema>;

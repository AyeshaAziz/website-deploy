import { z } from 'zod';
import { f } from '../../forms/field-meta';
import { TANZEEM_OPTIONS } from './tanzeem';
import type { RegistrationTrack } from './tracks';

const PHONE_PATTERN = /^[+0-9()\-\s]{7,20}$/;

const aimsNo = f(z.string().trim().min(1).max(40), {
  type: 'text',
  order: 10,
});

const firstName = f(z.string().trim().min(1).max(80), {
  type: 'text',
  order: 20,
  autoComplete: 'given-name',
});

const lastName = f(z.string().trim().min(1).max(80), {
  type: 'text',
  order: 30,
  autoComplete: 'family-name',
});

const tanzeem = f(z.enum(TANZEEM_OPTIONS), {
  type: 'select',
  order: 40,
});

const country = f(z.string().trim().min(1).max(80), {
  type: 'text',
  order: 50,
  autoComplete: 'country-name',
});

const city = f(z.string().trim().min(1).max(80), {
  type: 'text',
  order: 60,
  autoComplete: 'address-level2',
});

const phoneNumberSchema = z.string().trim().regex(PHONE_PATTERN, 'Enter a valid phone number.');

const phone = f(phoneNumberSchema, {
  type: 'tel',
  order: 70,
  autoComplete: 'tel',
});

const email = f(z.string().trim().email(), {
  type: 'email',
  order: 80,
  autoComplete: 'email',
});

const confirmEmail = f(z.string().trim().email(), {
  type: 'email',
  order: 90,
  autoComplete: 'email',
});

const course = f(z.string().trim().min(1).max(120), {
  type: 'select',
  order: 130,
  options: [],
});

const teachingExperience = f(
  z.enum(['less-than-one-year', 'over-one-year', 'other']),
  {
    type: 'select',
    order: 120,
  },
);

const courseLanguage = f(z.string().trim().min(1).max(60), {
  type: 'text',
  order: 100,
});

const secondLanguage = f(z.string().trim().max(60).optional(), {
  type: 'text',
  order: 110,
});

const role = f(z.enum(['main-teacher']), {
    type: 'select',
  order: 140,
});

const commitDays = f(
  z
    .array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday']))
    .min(1, 'Select at least one day.'),
  { type: 'multiSelect', order: 150 },
);

const availableTimes = f(
  z
    .array(z.enum(['09:00', '10:00', '16:00', '17:00', '18:00', '22:00', '23:00', '00:00']))
    .min(1, 'Select at least one time slot.'),
  { type: 'checkboxGroup', order: 160, colSpan: 2 },
);

const consent = f(
  z.literal(true, {
    errorMap: () => ({ message: 'Please accept the privacy policy to continue.' }),
  }),
  { type: 'checkbox', order: 200, colSpan: 2 },
);

const parentalConsent = f(
  z.literal(true, {
    errorMap: () => ({ message: 'Please accept parental consent to continue.' }),
  }),
  { type: 'checkbox', order: 210, colSpan: 2 },
);

const registrationFields = {
  aimsNo,
  firstName,
  lastName,
  tanzeem,
  country,
  city,
  phone,
  email,
  confirmEmail,
  course,
  courseLanguage,
  secondLanguage,
  consent,
  parentalConsent,
};

export const studentSchema = z.object(registrationFields);

export const teacherSchema = z.object({
  ...registrationFields,
  teachingExperience,
  role,
  commitDays,
  availableTimes,
}).omit({ parentalConsent: true });

export const REGISTRATION_SCHEMAS = {
  teacher: teacherSchema,
  student: studentSchema,
} satisfies Record<RegistrationTrack, z.AnyZodObject>;

export type RegistrationValues<T extends RegistrationTrack> = z.infer<
  (typeof REGISTRATION_SCHEMAS)[T]
>;

export const registrationSchema = z
  .discriminatedUnion('track', [
    teacherSchema.extend({ track: z.literal('teacher') }),
    studentSchema.extend({ track: z.literal('student') }),
  ])
  .refine(
    (values) => values.email === values.confirmEmail,
    {
      message: 'Email addresses must match.',
      path: ['confirmEmail'],
    },
  );

export type RegistrationInput = z.infer<typeof registrationSchema>;

import { z } from 'zod';
import contactJson from '../../content/contact/contact.json';

const nonEmptyString = z.string().trim().min(1);

const departmentSchema = z.object({
  id: nonEmptyString,
  label: nonEmptyString,
  email: z.string().trim().email(),
});

const contactContentSchema = z.object({
  page: z.object({
    title: nonEmptyString,
    description: nonEmptyString,
    heading: nonEmptyString,
  }),
  aside: z.object({
    image: z.object({
      src: nonEmptyString,
      alt: z.string(),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      sizes: nonEmptyString,
    }),
    heading: nonEmptyString,
    body: nonEmptyString,
    emailLabel: nonEmptyString,
  }),
  form: z.object({
    success: nonEmptyString,
    error: nonEmptyString,
    departmentLabel: nonEmptyString,
    departmentHint: nonEmptyString,
    nameLabel: nonEmptyString,
    emailLabel: nonEmptyString,
    messageLabel: nonEmptyString,
    submit: nonEmptyString,
  }),
  departments: z
    .array(departmentSchema)
    .min(1)
    .refine(
      (departments) => new Set(departments.map((department) => department.id)).size === departments.length,
      { message: 'Department ids must be unique' },
    )
    .refine(
      (departments) => new Set(departments.map((department) => department.email)).size === departments.length,
      { message: 'Department emails must be unique' },
    )
    .refine((departments) => departments.some((department) => department.id === 'general'), {
      message: 'A general department is required',
    }),
});

export type ContactContent = z.infer<typeof contactContentSchema>;
export type ContactDepartment = ContactContent['departments'][number];
export type ContactDepartmentId = string;
export type ContactAsideContent = ContactContent['aside'];
export type ContactFormCopy = ContactContent['form'];
export type ContactPageCopy = ContactContent['page'];

export const CONTACT_CONTENT: ContactContent = contactContentSchema.parse(contactJson);

export const CONTACT_DEPARTMENT_LIST: readonly ContactDepartment[] = CONTACT_CONTENT.departments;

export const CONTACT_DEPARTMENTS: Record<string, ContactDepartment> = Object.fromEntries(
  CONTACT_DEPARTMENT_LIST.map((department) => [department.id, department]),
);

export const CONTACT_DEPARTMENT_IDS: string[] = CONTACT_DEPARTMENT_LIST.map(
  (department) => department.id,
);

export function getContactDepartment(id: string): ContactDepartment | undefined {
  return CONTACT_DEPARTMENTS[id];
}

export const GENERAL_CONTACT_DEPARTMENT: ContactDepartment = CONTACT_DEPARTMENTS.general;

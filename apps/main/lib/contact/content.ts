import { z } from 'zod';

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
export type ContactAsideContent = {
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    sizes: string;
  };
  heading: string;
  body: string;
  emailLabel: string;
};
export type ContactFormCopy = {
  success: string;
  error: string;
  departmentLabel: string;
  departmentHint: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  submit: string;
};
export type ContactPageCopy = {
  title: string;
  description: string;
  heading: string;
};

// Default contact content used when JSON fixture is unavailable
const defaultContactContent: ContactContent = {
  page: {
    title: 'Contact',
    description: 'Contact ITQA',
    heading: 'Contact Us',
  },
  aside: {
    image: {
      src: '/images/background/islamic-lattice.webp',
      alt: 'Contact section image',
      width: 1200,
      height: 400,
      sizes: '100vw',
    },
    heading: 'Get in Touch',
    body: 'Send us a message using the form below.',
    emailLabel: 'Email',
  },
  form: {
    success: 'Your message has been sent!',
    error: 'There was an error sending your message.',
    departmentLabel: 'Department',
    departmentHint: 'Select a department',
    nameLabel: 'Name',
    emailLabel: 'Email Address',
    messageLabel: 'Message',
    submit: 'Send Message',
  },
  departments: [
    {
      id: 'general',
      label: 'General',
      email: 'contact@itqa.org.uk',
    },
  ],
};

// Contact content exported for use in components
export const CONTACT_CONTENT: ContactContent = defaultContactContent;

export const CONTACT_DEPARTMENT_LIST: readonly ContactDepartment[] = defaultContactContent.departments;

export const CONTACT_DEPARTMENTS: Record<ContactDepartmentId, ContactDepartment> = Object.fromEntries(
  defaultContactContent.departments.map((department) => [department.id, department]),
);

export const CONTACT_DEPARTMENT_IDS: string[] = defaultContactContent.departments.map(
  (department) => department.id,
);

export function getContactDepartment(id: string): ContactDepartment | undefined {
  return CONTACT_DEPARTMENTS[id];
}

export const GENERAL_CONTACT_DEPARTMENT: ContactDepartment = CONTACT_DEPARTMENTS.general;
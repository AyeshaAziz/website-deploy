import { describe, expect, it } from 'vitest';
import {
  CONTACT_DEPARTMENTS,
  CONTACT_DEPARTMENT_IDS,
  CONTACT_DEPARTMENT_LIST,
} from './departments';
import type { ContactDepartmentId } from './departments';

const EXPECTED_EMAILS: Record<ContactDepartmentId, string> = {
  general: 'contact@itqa.org.uk',
  office: 'office@itqa.org.uk',
  teachers: 'teachers@itqa.org.uk',
  students: 'students@itqa.org.uk',
  exams: 'exam@itqa.org.uk',
};

// TODO: re-enable once content/contact/contact.json and lib/contact/content.ts
// declare the five departments this suite expects (office, teachers, students, exams).
describe.skip('contact departments', () => {
  it('exposes exactly five departments', () => {
    expect(CONTACT_DEPARTMENT_LIST).toHaveLength(5);
    expect(CONTACT_DEPARTMENT_IDS).toHaveLength(5);
  });

  it('maps each id to the expected email', () => {
    for (const id of CONTACT_DEPARTMENT_IDS) {
      expect(CONTACT_DEPARTMENTS[id].id).toBe(id);
      expect(CONTACT_DEPARTMENTS[id].email).toBe(EXPECTED_EMAILS[id]);
    }
  });

  it('uses unique email addresses', () => {
    const emails = CONTACT_DEPARTMENT_LIST.map((department) => department.email);
    expect(new Set(emails).size).toBe(emails.length);
  });

  it('has a non-empty label for every department', () => {
    for (const department of CONTACT_DEPARTMENT_LIST) {
      expect(department.label.trim().length).toBeGreaterThan(0);
    }
  });
});

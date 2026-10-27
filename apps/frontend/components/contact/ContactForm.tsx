import type { ReactNode } from 'react';
import { Button, Card, Input, Label, Select, Textarea } from '@itqa/ui';
import type { ContactDepartment, ContactFormCopy } from '@/lib/contact/content';
import { sendContact } from '@/app/(public)/contact/actions';
import { ContactStatus } from './ContactStatus';

interface ContactFormProps {
  departments: readonly ContactDepartment[];
  copy: ContactFormCopy;
  sent: boolean;
  error: boolean;
}

export function ContactForm({ departments, copy, sent, error }: ContactFormProps): ReactNode {
  return (
    <Card className="min-w-0 bg-white/70 p-5 shadow-lg shadow-primary-7/20">
      <ContactStatus sent={sent} error={error} copy={copy} />
      <form action={sendContact} className="space-y-4">
        <div>
          <Label htmlFor="department">{copy.departmentLabel}</Label>
          <Select
            id="department"
            name="department"
            defaultValue="general"
            required
            className="mt-1"
          >
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.label}
              </option>
            ))}
          </Select>
          <p className="mt-1 text-small text-neutral-600">{copy.departmentHint}</p>
        </div>
        <div>
          <Label htmlFor="name">{copy.nameLabel}</Label>
          <Input id="name" name="name" required maxLength={100} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="email">{copy.emailLabel}</Label>
          <Input id="email" name="email" type="email" required maxLength={200} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="message">{copy.messageLabel}</Label>
          <Textarea id="message" name="message" required maxLength={2000} rows={5} className="mt-1" />
        </div>
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <Button type="submit">{copy.submit}</Button>
      </form>
    </Card>
  );
}

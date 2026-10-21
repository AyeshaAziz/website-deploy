import type { Metadata } from 'next';
import { Button, Container, Input, Label, SectionHeading, Textarea } from '@itqa/ui';
import { sendContact } from './actions';

export const metadata: Metadata = { title: 'Contact' };

type Props = { searchParams: { sent?: string; error?: string } };

export default function ContactPage({ searchParams }: Props) {
  return (
    <Container className="py-section-sm">
      <div className="mx-auto max-w-xl">
        <SectionHeading as="h1" title="Contact us" className="mb-6" />
        {searchParams.sent && (
          <p role="status" className="mb-4 rounded-card bg-success/10 p-3 text-success">
            Thank you, your message was sent.
          </p>
        )}
        {searchParams.error && (
          <p role="alert" className="mb-4 rounded-card bg-danger/10 p-3 text-danger">
            Please check your details and try again.
          </p>
        )}
        <form action={sendContact} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required maxLength={100} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required maxLength={200} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" required maxLength={2000} rows={5} className="mt-1" />
          </div>
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </Container>
  );
}

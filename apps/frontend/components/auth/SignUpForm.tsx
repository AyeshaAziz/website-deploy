import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button, Card, Container, Input, Label, SectionHeading } from '@itqa/ui';
import { signUp } from '@/app/signup/actions';

interface SignUpFormProps {
  error?: boolean;
  success?: boolean;
  message?: string;
}

export function SignUpForm({ error, success, message }: SignUpFormProps): ReactNode {
  return (
    <Container className="py-section-sm">
      <div className="mx-auto max-w-sm">
        <SectionHeading as="h1" title="Create account" className="mb-6" />
        <Card className="p-6">
          {error && (
            <p role="alert" className="mb-4 rounded-card bg-danger/10 p-3 text-danger">
              {message || 'Could not create account. Try a different email or password.'}
            </p>
          )}
          {success && (
            <p role="status" className="mb-4 rounded-card bg-primary-5/10 p-3 text-primary-7">
              Account created. Check your email to confirm, then sign in.
            </p>
          )}
          <form action={signUp} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" autoComplete="name" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full">
              Sign up
            </Button>
          </form>
          <p className="mt-4 text-center text-small text-neutral-600">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-neg1 underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </Container>
  );
}

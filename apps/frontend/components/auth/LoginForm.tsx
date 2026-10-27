import type { ReactNode } from 'react';
import { Button, Card, Container, Input, Label, SectionHeading } from '@itqa/ui';
import { login } from '@/app/admin/actions';

interface LoginFormProps {
  error?: boolean;
  redirectTo?: string;
}

export function LoginForm({ error, redirectTo }: LoginFormProps): ReactNode {
  return (
    <Container className="py-section-sm">
      <div className="mx-auto max-w-sm">
        <SectionHeading as="h1" title="Login" className="mb-6" />
        <Card className="p-6">
          {error && (
            <p role="alert" className="mb-4 rounded-card bg-danger/10 p-3 text-danger">
              Invalid email or password.
            </p>
          )}
          <form action={login} className="space-y-4">
            {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}

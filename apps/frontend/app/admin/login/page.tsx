import { Button, Container, Input, Label, SectionHeading } from '@itqa/website';
import { login } from '../actions';

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <Container className="py-section-sm">
      <div className="mx-auto max-w-sm">
        <SectionHeading as="h1" title="Editor login" className="mb-6" />
        {searchParams.error && (
          <p role="alert" className="mb-4 rounded-card bg-danger/10 p-3 text-danger">
            Invalid email or password.
          </p>
        )}
        <form action={login} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="username" className="mt-1" />
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
          <Button type="submit">Sign in</Button>
        </form>
      </div>
    </Container>
  );
}

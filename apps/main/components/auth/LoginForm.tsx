import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Input, Label } from '@itqa/ui';
import { login } from '@/app/admin/actions';

interface LoginFormProps {
  error?: boolean;
  redirectTo?: string;
}

export function LoginForm({ error, redirectTo }: LoginFormProps): ReactNode {
  return (
    <div className="rounded-card bg-white/70 p-6 shadow-card backdrop-blur">
      <Image
        src="/images/favicon.png"
        alt="ITQA logo"
        width={2000}
        height={500}
        priority
        className="mx-auto h-24 w-auto"
      />
      <h1 className="mt-4 text-center font-heading text-h2 uppercase text-primary-neg2">
        ITQA Login
      </h1>
      {error && (
        <p role="alert" className="mt-4 rounded-card bg-danger/10 p-3 text-danger">
          Invalid email or password.
        </p>
      )}
      <form action={login} className="mt-6 space-y-4 flex flex-col">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/contact" className="text-small text-primary-neg1 underline">
              Forgot Password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1"
          />
        </div>
        <Button type="submit" variant="brand" className="self-center mx-auto sm:w-auto">
          Login
        </Button>
      </form>
    </div>
  );
}

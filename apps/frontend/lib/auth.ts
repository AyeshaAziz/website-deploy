import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import type { Role } from '@itqa/shared';

// Minimal signed-cookie session for editors (JWT + bcrypt, as in the design document).
// Swap for Auth.js later if wanted; keep requireAuth/requireRole as the stable interface.
const COOKIE = 'itqa_session';
const MAX_AGE = 60 * 60 * 8;

export interface Session {
  userId: string;
  email: string;
  role: Role;
}

function secret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new Error('JWT_SECRET must be set (32+ characters)');
  return new TextEncoder().encode(s);
}

export async function createSession(session: Session): Promise<void> {
  const token = await new SignJWT({ email: session.email, role: session.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return { userId: String(payload.sub), email: String(payload.email), role: payload.role as Role };
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

export function requireRole(session: Session, roles: Role[]): void {
  if (!roles.includes(session.role)) throw new Error('Forbidden');
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

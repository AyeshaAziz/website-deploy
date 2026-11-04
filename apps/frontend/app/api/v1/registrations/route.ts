import { NextResponse } from 'next/server';
import {
  apiFailure,
  type ApiResult,
  type RegistrationResult,
} from '@itqasys/core';
import { rateLimit } from '@/lib/rate-limit';
import { getRegistrationService } from '@/lib/server/registrations/factory';

const MAX_PER_HOUR = 10;
const WINDOW_MS = 60 * 60 * 1000;

function statusFor(result: ApiResult<RegistrationResult>): number {
  if (result.ok) return 201;
  switch (result.error.code) {
    case 'VALIDATION_ERROR':
      return 400;
    case 'DUPLICATE':
      return 409;
    case 'RATE_LIMITED':
      return 429;
    default:
      return 502;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (!rateLimit(`registration:${ip}`, MAX_PER_HOUR, WINDOW_MS)) {
    return NextResponse.json(
      apiFailure('RATE_LIMITED', 'Too many registration attempts.', {
        retryAfterSeconds: Math.round(WINDOW_MS / 1000),
      }),
      { status: 429 },
    );
  }

  const idempotencyKey = request.headers.get('idempotency-key')?.trim();
  if (!idempotencyKey) {
    return NextResponse.json(
      apiFailure('VALIDATION_ERROR', 'An Idempotency-Key header is required.'),
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      apiFailure('VALIDATION_ERROR', 'The request body must be valid JSON.'),
      { status: 400 },
    );
  }

  try {
    const result = await getRegistrationService().submit(body, idempotencyKey);
    return NextResponse.json(result, { status: statusFor(result) });
  } catch (error) {
    console.error('Failed to submit registration:', error);
    return NextResponse.json(
      apiFailure('SERVER_ERROR', 'Unable to process registration. Please try again.'),
      { status: 502 },
    );
  }
}

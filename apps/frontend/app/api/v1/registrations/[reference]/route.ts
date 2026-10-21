import { NextResponse } from 'next/server';
import { apiFailure } from '@itqa/core';
import { rateLimit } from '@/lib/rate-limit';
import { getRegistrationService } from '@/lib/server/registrations/factory';

const MAX_PER_MINUTE = 60;
const WINDOW_MS = 60 * 1000;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reference: string }> },
): Promise<NextResponse> {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (!rateLimit(`registration-read:${ip}`, MAX_PER_MINUTE, WINDOW_MS)) {
    return NextResponse.json(
      apiFailure('RATE_LIMITED', 'Too many requests.', {
        retryAfterSeconds: Math.round(WINDOW_MS / 1000),
      }),
      { status: 429 },
    );
  }

  const { reference } = await params;
  const result = await getRegistrationService().get(reference);

  if (!result.ok) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}

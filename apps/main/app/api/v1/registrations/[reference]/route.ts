import { NextResponse } from 'next/server';
import { apiFailure } from '@itqasys/core';
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
  try {
    const result = await getRegistrationService().get(reference);

    if (!result.ok) {
      const status = result.error.code === 'NOT_FOUND' ? 404 : 502;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to load registration:', error);
    return NextResponse.json(
      apiFailure('SERVER_ERROR', 'Unable to load registration. Please try again.'),
      { status: 502 },
    );
  }
}

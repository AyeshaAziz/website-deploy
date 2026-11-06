import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiFailure, apiSuccess } from '@itqasys/core';

const requestSchema = z.object({
  name: z.string().min(1).max(255),
  contentType: z.string().min(1).max(120),
  size: z.number().nonnegative(),
});

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      apiFailure('VALIDATION_ERROR', 'The request body must be valid JSON.'),
      { status: 400 },
    );
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      apiFailure('VALIDATION_ERROR', 'The upload request is invalid.', {
        fieldErrors: { file: 'Name, content type and size are required.' },
      }),
      { status: 400 },
    );
  }

  const id = crypto.randomUUID();
  const url = `/api/v1/uploads/mock/${id}`;

  return NextResponse.json(
    apiSuccess({
      uploadUrl: url,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      document: {
        id,
        name: parsed.data.name,
        url,
        contentType: parsed.data.contentType,
        size: parsed.data.size,
      },
    }),
    { status: 201 },
  );
}

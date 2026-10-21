import { NextResponse } from 'next/server';
import { apiSuccess } from '@itqa/core';

export function GET(): NextResponse {
  return NextResponse.json(
    apiSuccess({
      status: 'ok',
      mode: process.env.REGISTRATION_API_MODE ?? 'mock',
      timestamp: new Date().toISOString(),
    }),
  );
}

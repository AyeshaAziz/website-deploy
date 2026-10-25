import { NextResponse } from 'next/server';
import { apiSuccess } from '@itqasys/core';

export function GET(): NextResponse {
  return NextResponse.json(
    apiSuccess({
      status: 'ok',
      mode: 'supabase',
      timestamp: new Date().toISOString(),
    }),
  );
}
import { NextResponse, type NextRequest } from 'next/server';

// Cheap edge check only. Real authentication and role checks happen in server code.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!req.cookies.get('itqa_session')) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };

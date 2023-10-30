import type { NextRequest, NextFetchEvent } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.FT_SECRET;

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const session = await getToken({ req, secret, raw: true });
  const { pathname } = req.nextUrl;

  if (pathname === '/login' || pathname === '/login/choice' || pathname === '/chat') {
    if (session) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
}

export const config = {
  matcher: ['/', '/login', '/login/choice'],
};

import type { NextRequest, NextFetchEvent } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.FT_SECRET;

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const session = await getToken({ req, secret, raw: true });
  const { pathname } = req.nextUrl;

  if (pathname === '/login') {
    if (session) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (
    pathname === '/chat' ||
    pathname === '/profile' ||
    pathname === '/ranking' ||
    pathname === '/join'
  ) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  console.log(pathname);
}

export const config = {
  matcher: ['/', '/login', '/chat', '/profile/(.*)', '/ranking', '/join'],
};

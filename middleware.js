import { NextResponse } from 'next/server';
import { COOKIE, makeToken, authConfigured } from './lib/auth';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin/login')) return NextResponse.next();

  const token = req.cookies.get(COOKIE)?.value;
  if (!authConfigured() || !token || token !== (await makeToken())) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };

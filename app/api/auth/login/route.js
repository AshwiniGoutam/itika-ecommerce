import { cookies } from 'next/headers';
import { COOKIE, makeToken, authConfigured } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request) {
  if (!authConfigured()) {
    return Response.json({ error: 'Admin login is not set up. Add ADMIN_EMAIL, ADMIN_PASSWORD and AUTH_SECRET to .env.' }, { status: 500 });
  }
  const { email = '', password = '' } = await request.json().catch(() => ({}));
  await new Promise((r) => setTimeout(r, 400)); // slow down guessing
  if (email.trim().toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase() || password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'That email and password don’t match.' }, { status: 401 });
  }
  cookies().set(COOKIE, await makeToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return Response.json({ ok: true });
}

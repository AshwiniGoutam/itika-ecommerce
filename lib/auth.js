// Works in both Edge (middleware) and Node (route handlers) — uses Web Crypto only.
export const COOKIE = 'itika_admin';

export async function makeToken() {
  const raw = `${process.env.ADMIN_EMAIL}|${process.env.ADMIN_PASSWORD}|${process.env.AUTH_SECRET}`;
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function authConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.AUTH_SECRET);
}

export async function isAuthed(request) {
  if (!authConfigured()) return false;
  const token = request.cookies.get(COOKIE)?.value;
  return Boolean(token) && token === (await makeToken());
}

export function unauthorized() {
  return Response.json({ error: 'Sign in to continue.' }, { status: 401 });
}

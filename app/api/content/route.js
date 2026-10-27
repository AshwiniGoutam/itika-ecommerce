import { revalidatePath } from 'next/cache';
import { getContent, saveContent } from '@/lib/store';
import { isAuthed, unauthorized } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({ content: await getContent() });
}

export async function PUT(request) {
  if (!(await isAuthed(request))) return unauthorized();
  const body = await request.json().catch(() => null);
  if (!body || typeof body.content !== 'object' || Array.isArray(body.content)) {
    return Response.json({ error: 'Content must be an object.' }, { status: 400 });
  }
  await saveContent(body.content);
  revalidatePath('/');
  return Response.json({ ok: true });
}

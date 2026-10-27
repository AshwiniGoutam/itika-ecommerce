import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { UPLOAD_DIR } from '@/lib/store';
import { isAuthed, unauthorized } from '@/lib/auth';

export const runtime = 'nodejs';

const TYPES = {
  'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp',
  'image/gif': 'gif', 'image/svg+xml': 'svg', 'image/avif': 'avif',
};

export async function POST(request) {
  if (!(await isAuthed(request))) return unauthorized();
  const form = await request.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string') return Response.json({ error: 'Choose an image to upload.' }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return Response.json({ error: 'Use a PNG, JPG, WEBP, GIF, AVIF or SVG image.' }, { status: 415 });
  if (file.size > 5 * 1024 * 1024) return Response.json({ error: 'Images must be under 5 MB.' }, { status: 413 });

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${randomUUID()}.${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return Response.json({ url: `/api/media/${name}` });
}

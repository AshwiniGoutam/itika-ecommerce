import { promises as fs } from 'fs';
import path from 'path';
import { UPLOAD_DIR } from '@/lib/store';

export const runtime = 'nodejs';

const MIME = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml', avif: 'image/avif' };

// Uploaded files live in /data/uploads (outside /public) so they work after `next build`.
export async function GET(_req, { params }) {
  const name = path.basename(params.name);
  const ext = name.split('.').pop();
  if (!MIME[ext]) return new Response('Not found', { status: 404 });
  try {
    const buf = await fs.readFile(path.join(UPLOAD_DIR, name));
    return new Response(buf, {
      headers: {
        'Content-Type': MIME[ext],
        'Cache-Control': 'public, max-age=31536000, immutable',
        ...(ext === 'svg' ? { 'Content-Security-Policy': "script-src 'none'" } : {}),
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}

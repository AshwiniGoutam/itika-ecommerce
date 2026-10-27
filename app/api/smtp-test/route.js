import { isAuthed, unauthorized } from '@/lib/auth';
import { getTransport, smtpConfigured } from '@/lib/mailer';

export const runtime = 'nodejs';

export async function GET(request) {
  if (!(await isAuthed(request))) return unauthorized();
  return Response.json({
    configured: smtpConfigured(),
    host: process.env.SMTP_HOST || null,
    user: process.env.SMTP_USER || null,
    notifyTo: process.env.LEAD_NOTIFY_TO || process.env.SMTP_USER || null,
  });
}

export async function POST(request) {
  if (!(await isAuthed(request))) return unauthorized();
  if (!smtpConfigured()) return Response.json({ error: 'SMTP is not set up. Add the SMTP_* values to .env.' }, { status: 400 });
  try {
    const t = getTransport();
    await t.verify();
    await t.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.LEAD_NOTIFY_TO || process.env.SMTP_USER,
      subject: 'SMTP test from your website admin',
      text: 'SMTP is working. New leads from your website will arrive at this address.',
    });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: `SMTP error: ${err.message}` }, { status: 500 });
  }
}

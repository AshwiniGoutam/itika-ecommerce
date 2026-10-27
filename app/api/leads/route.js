import { randomUUID } from 'crypto';
import { addLead, getLeads, getContent } from '@/lib/store';
import { sendLeadEmails } from '@/lib/mailer';
import { isAuthed, unauthorized } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// basic per-IP rate limit: 5 enquiries / 10 minutes
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

const clean = (v, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Send the form data as JSON.' }, { status: 400 });
  }

  // honeypot — real people never fill this hidden field
  if (body.website) return Response.json({ ok: true });

  const ip = (request.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  if (limited(ip)) {
    return Response.json({ error: 'Too many enquiries from this network. Try again in a few minutes or call us.' }, { status: 429 });
  }

  const lead = {
    id: randomUUID(),
    name: clean(body.name, 80),
    phone: clean(body.phone, 20).replace(/[^\d+]/g, ''),
    email: clean(body.email, 120).toLowerCase(),
    business: clean(body.business, 120),
    platforms: Array.isArray(body.platforms) ? body.platforms.slice(0, 10).map((p) => clean(p, 40)) : [],
    revenue: clean(body.revenue, 60),
    message: clean(body.message, 2000),
    status: 'new',
    notes: '',
    source: clean(body.source, 60) || 'website',
    createdAt: new Date().toISOString(),
  };

  const errors = {};
  if (lead.name.length < 2) errors.name = 'Enter your name.';
  if (!/^(\+?91)?[6-9]\d{9}$/.test(lead.phone)) errors.phone = 'Enter a valid 10-digit mobile number.';
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errors.email = 'Enter a valid email or leave it empty.';
  if (Object.keys(errors).length) return Response.json({ error: 'Check the highlighted fields.', errors }, { status: 422 });

  await addLead(lead);

  let mail = { skipped: true };
  try {
    const content = await getContent();
    mail = await sendLeadEmails(lead, content.brand);
  } catch (err) {
    console.error('[lead email failed]', err?.message);
    mail = { error: true };
  }

  return Response.json({ ok: true, mail });
}

export async function GET(request) {
  if (!(await isAuthed(request))) return unauthorized();
  return Response.json({ leads: await getLeads() });
}

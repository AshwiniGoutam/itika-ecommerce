import { updateLead, deleteLead } from '@/lib/store';
import { isAuthed, unauthorized } from '@/lib/auth';

export const runtime = 'nodejs';
const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'];

export async function PATCH(request, { params }) {
  if (!(await isAuthed(request))) return unauthorized();
  const body = await request.json().catch(() => ({}));
  const patch = {};
  if (STATUSES.includes(body.status)) patch.status = body.status;
  if (typeof body.notes === 'string') patch.notes = body.notes.slice(0, 5000);
  const lead = await updateLead(params.id, patch);
  if (!lead) return Response.json({ error: 'Lead not found.' }, { status: 404 });
  return Response.json({ lead });
}

export async function DELETE(request, { params }) {
  if (!(await isAuthed(request))) return unauthorized();
  const ok = await deleteLead(params.id);
  return Response.json({ ok });
}

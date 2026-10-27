'use client';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Trash2, Phone, Mail, MessageCircle, X, RefreshCw } from 'lucide-react';
   import { createPortal } from 'react-dom';

export const STATUSES = [
  { id: 'new', label: 'New', cls: 'bg-orange/15 text-orange-dark' },
  { id: 'contacted', label: 'Contacted', cls: 'bg-blue-100 text-blue-700' },
  { id: 'qualified', label: 'Qualified', cls: 'bg-violet-100 text-violet-700' },
  { id: 'won', label: 'Won', cls: 'bg-emerald-100 text-emerald-700' },
  { id: 'lost', label: 'Lost', cls: 'bg-ink/10 text-ink/60' },
];

export function StatusBadge({ status }) {
  const s = STATUSES.find((x) => x.id === status) || STATUSES[0];
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}

function toCSV(rows) {
  const cols = ['createdAt', 'name', 'phone', 'email', 'business', 'platforms', 'revenue', 'message', 'status', 'notes'];
  const esc = (v) => `"${String(Array.isArray(v) ? v.join(', ') : v ?? '').replace(/"/g, '""')}"`;
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
}

export default function Leads({ leads, setLeads, api, notify, reload }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState(null);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return leads.filter((l) =>
      (filter === 'all' || l.status === filter) &&
      (!s || [l.name, l.phone, l.email, l.business, l.message].some((v) => String(v || '').toLowerCase().includes(s)))
    );
  }, [leads, q, filter]);

  const open = leads.find((l) => l.id === openId);

  async function patch(id, body) {
    try {
      const { lead } = await api(`/api/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      setLeads((ls) => ls.map((l) => (l.id === id ? lead : l)));
      notify(body.notes !== undefined ? 'Notes saved' : 'Status updated');
    } catch (e) { notify(e.message, 'err'); }
  }

  async function remove(id) {
    if (!confirm('Delete this lead permanently?')) return;
    try {
      await api(`/api/leads/${id}`, { method: 'DELETE' });
      setLeads((ls) => ls.filter((l) => l.id !== id));
      setOpenId(null);
      notify('Lead deleted');
    } catch (e) { notify(e.message, 'err'); }
  }

  function exportCSV() {
    const blob = new Blob(['\ufeff' + toCSV(shown)], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `itika-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, email, business…" className="w-full rounded-xl border border-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange" />
        </div>
        <button onClick={reload} className="flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm font-medium hover:border-ink/30"><RefreshCw className="h-4 w-4" /> Refresh</button>
        <button onClick={exportCSV} disabled={!shown.length} className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"><Download className="h-4 w-4" /> Export CSV</button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[{ id: 'all', label: 'All' }, ...STATUSES].map((s) => {
          const n = s.id === 'all' ? leads.length : leads.filter((l) => l.status === s.id).length;
          return (
            <button key={s.id} onClick={() => setFilter(s.id)} className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${filter === s.id ? 'bg-ink text-white' : 'bg-white text-ink/60 hover:text-ink'}`}>
              {s.label} <span className="opacity-60">{n}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl bg-white">
        {shown.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink/50">{leads.length ? 'No leads match this search or filter.' : 'No leads yet. Enquiries from the website form will appear here.'}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-ink/5 text-xs text-ink/50">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Marketplaces</th>
                  <th className="px-5 py-3 font-medium">Received</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {shown.map((l) => (
                  <tr key={l.id} onClick={() => setOpenId(l.id)} className="cursor-pointer transition hover:bg-paper/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold">{l.name}</p>
                      <p className="text-xs text-ink/50">{l.business || '—'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p>{l.phone}</p>
                      <p className="text-xs text-ink/50">{l.email || '—'}</p>
                    </td>
                    <td className="px-5 py-4 text-ink/70">{(l.platforms || []).join(', ') || '—'}</td>
                    <td className="px-5 py-4 text-ink/70">{new Date(l.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <select value={l.status} onChange={(e) => patch(l.id, { status: e.target.value })} className="rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-xs font-semibold outline-none focus:border-orange">
                        {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

       {createPortal( <AnimatePresence>
        {open && <LeadDrawer key={open.id} lead={open} onClose={() => setOpenId(null)} patch={patch} remove={remove} />}
      </AnimatePresence>,
     document.body )}
    </div>
  );
}

function LeadDrawer({ lead, onClose, patch, remove }) {
  const [notes, setNotes] = useState(lead.notes || '');
  const phone = lead.phone.replace(/^\+?91/, '');
  const rows = [
    ['Phone', lead.phone], ['Email', lead.email], ['Business', lead.business],
    ['Marketplaces', (lead.platforms || []).join(', ')], ['Monthly sales', lead.revenue],
    ['Received', new Date(lead.createdAt).toLocaleString('en-IN')], ['Source', lead.source],
  ];
  return (
    <>
      <motion.div className="fixed inset-0 z-40 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.aside
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 32, stiffness: 300 }}
      >
        <div className="flex items-start justify-between border-b border-ink/5 p-6">
          <div>
            <h2 className="font-display text-xl font-bold">{lead.name}</h2>
            <div className="mt-2"><StatusBadge status={lead.status} /></div>
          </div>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5 text-ink/50" /></button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-2">
            <a href={`tel:${lead.phone}`} className="flex flex-col items-center gap-1 rounded-xl bg-paper py-3 text-xs font-semibold hover:bg-orange hover:text-white"><Phone className="h-4 w-4" />Call</a>
            <a href={`https://wa.me/91${phone}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 rounded-xl bg-paper py-3 text-xs font-semibold hover:bg-orange hover:text-white"><MessageCircle className="h-4 w-4" />WhatsApp</a>
            <a href={lead.email ? `mailto:${lead.email}` : undefined} className={`flex flex-col items-center gap-1 rounded-xl bg-paper py-3 text-xs font-semibold ${lead.email ? 'hover:bg-orange hover:text-white' : 'pointer-events-none opacity-40'}`}><Mail className="h-4 w-4" />Email</a>
          </div>
          <dl className="space-y-3 text-sm">
            {rows.filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="flex gap-4"><dt className="w-28 shrink-0 text-ink/50">{k}</dt><dd className="font-medium">{v}</dd></div>
            ))}
          </dl>
          {lead.message && (
            <div>
              <p className="text-sm text-ink/50">Message</p>
              <p className="mt-2 whitespace-pre-wrap rounded-xl bg-paper p-4 text-sm">{lead.message}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-ink/50">Status</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button key={s.id} onClick={() => patch(lead.id, { status: s.id })} className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition ${lead.status === s.id ? 'bg-ink text-white ring-ink' : 'ring-ink/10 hover:ring-ink/30'}`}>{s.label}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-ink/50">Private notes</p>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Call summary, follow-up date…" className="mt-2 min-h-[110px] w-full rounded-xl border border-ink/10 p-3 text-sm outline-none focus:border-orange" />
            <button onClick={() => patch(lead.id, { notes })} disabled={notes === (lead.notes || '')} className="mt-2 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Save notes</button>
          </div>
        </div>
        <div className="border-t border-ink/5 p-4">
          <button onClick={() => remove(lead.id)} className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Delete lead</button>
        </div>
      </motion.aside>
    </>
  );
}

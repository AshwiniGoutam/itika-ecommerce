'use client';
import { Inbox, Sparkles, CalendarDays, Trophy } from 'lucide-react';
import { StatusBadge } from './Leads';

const DAY = 86400000;

export default function Overview({ leads, goLeads }) {
  const now = Date.now();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const stats = [
    { label: 'Total leads', value: leads.length, icon: Inbox },
    { label: 'New (not contacted)', value: leads.filter((l) => l.status === 'new').length, icon: Sparkles },
    { label: 'Last 7 days', value: leads.filter((l) => now - new Date(l.createdAt) < 7 * DAY).length, icon: CalendarDays },
    { label: 'Won', value: leads.filter((l) => l.status === 'won').length, icon: Trophy },
  ];

  const days = Array.from({ length: 14 }, (_, i) => {
    const start = today.getTime() - (13 - i) * DAY;
    return {
      label: new Date(start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      count: leads.filter((l) => { const t = new Date(l.createdAt).getTime(); return t >= start && t < start + DAY; }).length,
    };
  });
  const max = Math.max(1, ...days.map((d) => d.count));

  const byPlatform = {};
  leads.forEach((l) => (l.platforms || []).forEach((p) => (byPlatform[p] = (byPlatform[p] || 0) + 1)));
  const platformRows = Object.entries(byPlatform).sort((a, b) => b[1] - a[1]);
  const pmax = Math.max(1, ...platformRows.map((r) => r[1]));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }, i) => (
          <div key={label} className={`rounded-2xl p-5 ${i === 1 ? 'bg-orange text-white' : 'bg-white'}`}>
            <Icon className={`h-5 w-5 ${i === 1 ? 'text-white' : 'text-orange'}`} />
            <p className="mt-4 font-display text-3xl font-bold">{value}</p>
            <p className={`text-sm ${i === 1 ? 'text-white/80' : 'text-ink/55'}`}>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl bg-white p-6">
          <p className="font-display font-bold">Leads, last 14 days</p>
          <div className="mt-6 flex h-48 items-end gap-2">
            {days.map((d) => (
              <div key={d.label} className="group flex flex-1 flex-col items-center gap-2">
                <span className="text-[11px] font-semibold text-ink/60 opacity-0 group-hover:opacity-100">{d.count}</span>
                <div className="w-full rounded-t-md bg-navy transition-all group-hover:bg-orange" style={{ height: `${(d.count / max) * 150 + 4}px` }} />
                <span className="hidden text-[10px] text-ink/40 sm:block">{d.label.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6">
          <p className="font-display font-bold">Marketplaces requested</p>
          {platformRows.length === 0 && <p className="mt-6 text-sm text-ink/50">Marketplace interest appears here once leads come in.</p>}
          <div className="mt-6 space-y-4">
            {platformRows.map(([p, n]) => (
              <div key={p}>
                <div className="flex justify-between text-sm"><span className="font-medium">{p}</span><span className="text-ink/50">{n}</span></div>
                <div className="mt-1.5 h-2 rounded-full bg-paper"><div className="h-2 rounded-full bg-orange" style={{ width: `${(n / pmax) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <p className="font-display font-bold">Latest leads</p>
          <button onClick={goLeads} className="text-sm font-semibold text-orange hover:underline">See all leads</button>
        </div>
        {leads.length === 0 ? (
          <p className="mt-6 text-sm text-ink/50">No leads yet. Enquiries from the website form will show up here.</p>
        ) : (
          <ul className="mt-4 divide-y divide-ink/5">
            {leads.slice(0, 6).map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-navy text-xs font-bold text-white">{l.name.slice(0, 2).toUpperCase()}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{l.name} {l.business && <span className="font-normal text-ink/50">· {l.business}</span>}</p>
                  <p className="text-xs text-ink/50">{l.phone} · {new Date(l.createdAt).toLocaleString('en-IN')}</p>
                </div>
                <StatusBadge status={l.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

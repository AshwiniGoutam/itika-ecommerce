'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Inbox, PenSquare, Mail, LogOut, ExternalLink, Menu, X, Loader2 } from 'lucide-react';
import Overview from './Overview';
import Leads from './Leads';
import ContentEditor from './ContentEditor';
import SmtpPanel from './SmtpPanel';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Inbox },
  { id: 'content', label: 'Website content', icon: PenSquare },
  { id: 'email', label: 'Email (SMTP)', icon: Mail },
];

export default function AdminApp() {
  const router = useRouter();
  const [tab, setTab] = useState('overview');
  const [leads, setLeads] = useState(null);
  const [content, setContent] = useState(null);
  const [toast, setToast] = useState(null);
  const [nav, setNav] = useState(false);

  const notify = useCallback((msg, type = 'ok') => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const api = useCallback(async (url, opts) => {
    const res = await fetch(url, opts);
    if (res.status === 401) {
      router.replace('/admin/login');
      throw new Error('Signed out');
    }
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || 'Request failed');
    return json;
  }, [router]);

  const loadLeads = useCallback(() => api('/api/leads').then((j) => setLeads(j.leads)).catch(() => {}), [api]);

  useEffect(() => {
    loadLeads();
    api('/api/content').then((j) => setContent(j.content)).catch(() => {});
    const t = setInterval(loadLeads, 30000); // refresh leads every 30s
    return () => clearInterval(t);
  }, [api, loadLeads]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
  }

  const newCount = (leads || []).filter((l) => l.status === 'new').length;

  const Sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-6 py-6">
        <p className="font-display text-xl font-extrabold tracking-[0.08em] text-white">ITIKA<span className="text-orange">.</span></p>
        <p className="text-xs text-white/45">Admin panel</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setTab(id); setNav(false); }}
            className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${tab === id ? 'text-white' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}
          >
            {tab === id && <motion.span layoutId="admin-tab" className="absolute inset-0 rounded-xl bg-white/10" />}
            <Icon className="relative h-[18px] w-[18px]" />
            <span className="relative">{label}</span>
            {id === 'leads' && newCount > 0 && (
              <span className="relative ml-auto rounded-full bg-orange px-2 py-0.5 text-[11px] font-bold text-white">{newCount}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white">
          <ExternalLink className="h-[18px] w-[18px]" /> View website
        </a>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white">
          <LogOut className="h-[18px] w-[18px]" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-navy-deep lg:block">{Sidebar}</aside>

      <AnimatePresence>
        {nav && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNav(false)} />
            <motion.aside className="fixed inset-y-0 left-0 z-50 w-64 bg-navy-deep lg:hidden" initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
              <button onClick={() => setNav(false)} className="absolute right-3 top-5 text-white/60" aria-label="Close menu"><X /></button>
              {Sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-ink/5 bg-paper/85 px-5 py-4 backdrop-blur lg:px-10">
          <button onClick={() => setNav(true)} className="lg:hidden" aria-label="Open menu"><Menu /></button>
          <h1 className="font-display text-lg font-bold">{TABS.find((t) => t.id === tab)?.label}</h1>
        </header>

        <main className="px-5 py-8 lg:px-10">
          {!leads || !content ? (
            <div className="grid h-64 place-items-center text-ink/50"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                {tab === 'overview' && <Overview leads={leads} goLeads={() => setTab('leads')} />}
                {tab === 'leads' && <Leads leads={leads} setLeads={setLeads} api={api} notify={notify} reload={loadLeads} />}
                {tab === 'content' && <ContentEditor content={content} setContent={setContent} api={api} notify={notify} />}
                {tab === 'email' && <SmtpPanel api={api} notify={notify} />}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-xl ${toast.type === 'err' ? 'bg-red-600' : 'bg-navy'}`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Loader2, Send } from 'lucide-react';

export default function SmtpPanel({ api, notify }) {
  const [info, setInfo] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { api('/api/smtp-test').then(setInfo).catch(() => {}); }, [api]);

  async function test() {
    setBusy(true);
    try {
      await api('/api/smtp-test', { method: 'POST' });
      notify(`Test email sent to ${info?.notifyTo}`);
    } catch (e) { notify(e.message, 'err'); }
    setBusy(false);
  }

  if (!info) return <Loader2 className="h-5 w-5 animate-spin text-ink/40" />;

  return (
    <div className="max-w-2xl space-y-5">
      <div className="rounded-2xl bg-white p-6">
        <div className="flex items-center gap-3">
          {info.configured ? <CheckCircle2 className="h-6 w-6 text-emerald-600" /> : <AlertTriangle className="h-6 w-6 text-orange" />}
          <p className="font-display font-bold">{info.configured ? 'SMTP is set up' : 'SMTP is not set up yet'}</p>
        </div>
        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex gap-4"><dt className="w-36 text-ink/50">SMTP server</dt><dd className="font-medium">{info.host || '—'}</dd></div>
          <div className="flex gap-4"><dt className="w-36 text-ink/50">Sending account</dt><dd className="font-medium">{info.user || '—'}</dd></div>
          <div className="flex gap-4"><dt className="w-36 text-ink/50">Lead alerts go to</dt><dd className="font-medium">{info.notifyTo || '—'}</dd></div>
        </dl>
        <button onClick={test} disabled={!info.configured || busy} className="mt-6 flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send test email
        </button>
      </div>
      <div className="rounded-2xl bg-white p-6 text-sm leading-relaxed text-ink/70">
        <p className="font-display font-bold text-ink">How email works</p>
        <p className="mt-2">Every new enquiry is saved here and emailed to the address above. The person who filled the form also gets a thank-you email if they gave one.</p>
        <p className="mt-2">SMTP settings live in the server&apos;s <code className="rounded bg-paper px-1.5 py-0.5">.env</code> file so passwords never sit in the browser. For Gmail, turn on 2-step verification and create an App Password to use as <code className="rounded bg-paper px-1.5 py-0.5">SMTP_PASS</code>.</p>
      </div>
    </div>
  );
}

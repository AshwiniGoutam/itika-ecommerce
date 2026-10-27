'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(json.error || 'Sign in failed.');
    router.replace('/admin');
    router.refresh();
  }

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-4">
      <div className="absolute inset-0 grid-lines" />
      <form onSubmit={submit} className="relative w-full max-w-sm rounded-3xl border border-line bg-white p-8 text-ink shadow-xl shadow-navy/10">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-orange text-white"><Lock className="h-5 w-5" /></span>
        <h1 className="mt-5 font-display text-2xl font-normal">Admin sign in</h1>
        <p className="mt-1 text-sm text-ink/55">Manage leads and website content.</p>
        <label className="mt-6 block text-sm font-medium text-ink/70">Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="username" className="mt-1.5 w-full rounded-xl border border-ink/10 bg-paper px-4 py-3 outline-none focus:border-orange focus:ring-4 focus:ring-orange/15" />
        </label>
        <label className="mt-4 block text-sm font-medium text-ink/70">Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required autoComplete="current-password" className="mt-1.5 w-full rounded-xl border border-ink/10 bg-paper px-4 py-3 outline-none focus:border-orange focus:ring-4 focus:ring-orange/15" />
        </label>
        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="btn-primary mt-6 w-full justify-center disabled:opacity-70">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

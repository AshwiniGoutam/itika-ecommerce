'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, Instagram, MessageCircle, Loader2, Check, ArrowUpRight } from 'lucide-react';
import HL from './HL';

const ease = [0.22, 1, 0.36, 1];
const EMPTY = { name: '', phone: '', email: '', business: '', platforms: [], revenue: '', message: '', website: '' };

function Field({ label, error, children, optional }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-sm text-ink/65">
        {label}
        {optional && <span className="text-xs font-normal text-ink/40">Optional</span>}
      </span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 block text-xs font-medium text-red-600">
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

const input = (err) =>
  `w-full rounded-xl border bg-paper/70 px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink/35 focus:bg-white focus:ring-4 ${
    err ? 'border-red-400 focus:ring-red-100' : 'border-line focus:border-orange focus:ring-orange/15'
  }`;

export default function Contact({ data, brand, platforms }) {
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | done
  const [formError, setFormError] = useState('');
  const [ticket, setTicket] = useState('IT-0000');
  useEffect(() => setTicket(`IT-${Math.floor(1000 + Math.random() * 9000)}`), [state]);

  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));
  const toggle = (p) =>
    setF((v) => ({ ...v, platforms: v.platforms.includes(p) ? v.platforms.filter((x) => x !== p) : [...v.platforms, p] }));

  function validate() {
    const e = {};
    if (f.name.trim().length < 2) e.name = 'Enter your name.';
    if (!/^(\+?91)?[6-9]\d{9}$/.test(f.phone.replace(/[^\d+]/g, ''))) e.phone = 'Enter a valid 10-digit mobile number.';
    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email or leave it empty.';
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function submit(e) {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;
    setState('sending');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, source: 'website-form' }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(json.errors || {});
        setFormError(json.error || 'The enquiry didn’t go through. Try again or call us.');
        setState('idle');
        return;
      }
      setState('done');
      setF(EMPTY);
    } catch {
      setFormError('No connection. Check your internet and send again.');
      setState('idle');
    }
  }

  const contacts = [
    brand.phone && { icon: Phone, label: 'Call us', value: brand.phone, href: `tel:${brand.phone}` },
    brand.email && { icon: Mail, label: 'Email', value: brand.email, href: `mailto:${brand.email}` },
    brand.whatsapp && { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with us', href: `https://wa.me/${brand.whatsapp}` },
    brand.instagram && { icon: Instagram, label: 'Instagram', value: brand.instagramHandle || 'Follow us', href: brand.instagram },
  ].filter(Boolean);

  return (
    <section id="contact" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="grid-lines absolute inset-0 opacity-60" />
      <div className="absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full bg-orange/15 blur-[140px]" />
      <div className="container-x relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <h2 className="font-display text-4xl font-light leading-[1.08] tracking-tight text-navy sm:text-[3.6rem]">
            <HL text={data.title} />
          </h2>
          <p className="mt-6 max-w-md text-lg text-ink/60">{data.subtitle}</p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {contacts.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition hover:border-orange/50 hover:shadow-md"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-orange/10 text-orange transition group-hover:bg-orange group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-ink/50">{label}</span>
                  <span className="block truncate font-medium text-ink">{value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ticket-style form */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 1.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease }}
          className="relative"
        >
          <div className="overflow-hidden rounded-[28px] border border-line bg-white text-ink shadow-[0_50px_100px_-40px_rgba(10,26,74,.45)]">
            <div className="flex items-center justify-between bg-navy px-6 py-4 text-white sm:px-8">
              <span className="font-display text-sm font-normal">Growth enquiry</span>
              <span className="font-display text-sm font-light tabular-nums text-orange-light">#{ticket}</span>
            </div>

            <AnimatePresence mode="wait">
              {state === 'done' ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease }} className="px-8 py-16 text-center">
                  <svg viewBox="0 0 80 80" className="mx-auto h-24 w-24">
                    <motion.circle cx="40" cy="40" r="36" fill="none" stroke="#FF6A13" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease }} />
                    <motion.path d="M24 41 L35 52 L57 29" fill="none" stroke="#0A1A4A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.5, ease }} />
                  </svg>
                  <h3 className="mt-6 font-display text-2xl font-normal text-navy">{data.successTitle}</h3>
                  <p className="mx-auto mt-3 max-w-sm text-ink/65">{data.successMessage}</p>
                  <button onClick={() => setState('idle')} className="mt-8 text-sm font-semibold text-orange underline-offset-4 hover:underline">
                    Send another enquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5 px-6 py-7 sm:px-8 sm:py-8">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your name" error={errors.name}>
                      <input className={input(errors.name)} value={f.name} onChange={set('name')} placeholder="Rohit Sharma" autoComplete="name" />
                    </Field>
                    <Field label="Mobile number" error={errors.phone}>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-ink/45">+91</span>
                        <input className={`${input(errors.phone)} pl-12`} value={f.phone} onChange={set('phone')} placeholder="98765 43210" inputMode="tel" autoComplete="tel" />
                      </div>
                    </Field>
                    <Field label="Email" error={errors.email} optional>
                      <input className={input(errors.email)} value={f.email} onChange={set('email')} placeholder="you@brand.com" type="email" autoComplete="email" />
                    </Field>
                    <Field label="Brand / business name" optional>
                      <input className={input()} value={f.business} onChange={set('business')} placeholder="Your store name" />
                    </Field>
                  </div>

                  <div>
                    <span className="mb-2 block text-sm text-ink/65">Where do you sell (or want to)?</span>
                    <div className="flex flex-wrap gap-2">
                      {platforms.map((p) => {
                        const on = f.platforms.includes(p);
                        return (
                          <button
                            type="button"
                            key={p}
                            onClick={() => toggle(p)}
                            aria-pressed={on}
                            className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
                              on ? 'border-navy bg-navy text-white' : 'border-line text-ink/70 hover:border-ink/40'
                            }`}
                          >
                            <AnimatePresence initial={false}>
                              {on && (
                                <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="overflow-hidden">
                                  <Check className="h-3.5 w-3.5 text-orange" strokeWidth={3} />
                                </motion.span>
                              )}
                            </AnimatePresence>
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Field label="Monthly online sales" optional>
                    <select className={input()} value={f.revenue} onChange={set('revenue')}>
                      <option value="">Select a range</option>
                      {(data.revenueOptions || []).map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </Field>

                  <Field label="What do you need help with?" optional>
                    <textarea className={`${input()} min-h-[96px] resize-y`} value={f.message} onChange={set('message')} placeholder="E.g. my listings get views but few orders…" />
                  </Field>

                  {formError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{formError}</p>}

                  <div className="-mx-6 border-t-2 border-dashed border-ink/10 sm:-mx-8" />

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <div className="barcode h-10 w-32 opacity-70" aria-hidden />
                    <button type="submit" disabled={state === 'sending'} className="btn-primary disabled:opacity-70">
                      {state === 'sending' ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <>{data.buttonText} <ArrowUpRight className="h-4 w-4" /></>}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

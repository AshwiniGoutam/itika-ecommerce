'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Phone } from 'lucide-react';
import HL from './HL';

export default function Faq({ data, brand }) {
  const items = data.items || [];
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-paper py-24 text-ink sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="h-section"><HL text={data.title} /></h2>
          {brand.phone && (
            <a href={`tel:${brand.phone}`} className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white p-4 pr-6 shadow-sm ring-1 ring-line transition hover:ring-orange/40">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange text-white"><Phone className="h-5 w-5" /></span>
              <span>
                <span className="block text-sm text-ink/55">Have a different question?</span>
                <span className="block font-medium">Call {brand.phone}</span>
              </span>
            </a>
          )}
        </div>
        <div className="divide-y divide-line border-y border-line">
          {items.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q + i}>
                <button onClick={() => setOpen(on ? -1 : i)} aria-expanded={on} className="flex w-full items-center justify-between gap-6 py-6 text-left">
                  <span className="font-display text-lg font-light text-navy sm:text-xl">{f.q}</span>
                  <motion.span animate={{ rotate: on ? 45 : 0, backgroundColor: on ? '#FF6A13' : '#0A1A4A' }} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white">
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden">
                      <p className="max-w-2xl pb-6 leading-relaxed text-ink/60">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

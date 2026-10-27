'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { getIcon } from '@/lib/icons';
import HL from './HL';

const ease = [0.22, 1, 0.36, 1];

export default function Services({ data }) {
  const items = data.items || [];
  const [open, setOpen] = useState(0);

  return (
    <section id="services" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 className="h-section"><HL text={data.title} /></h2>
          <p className="max-w-md text-lg text-ink/60 lg:justify-self-end">{data.subtitle}</p>
        </div>

        <div className="mt-14 border-t border-line">
          {items.map((s, i) => {
            const Icon = getIcon(s.icon);
            const on = open === i;
            return (
              <div key={s.title + i} className="relative overflow-hidden border-b border-line" onMouseEnter={() => setOpen(i)}>
                <motion.div
                  className="absolute inset-0 origin-left bg-navy"
                  initial={false}
                  animate={{ scaleX: on ? 1 : 0 }}
                  transition={{ duration: 0.6, ease }}
                />
                <button
                  onClick={() => setOpen(on ? -1 : i)}
                  aria-expanded={on}
                  className="relative flex w-full items-center gap-5 py-7 text-left sm:gap-8 sm:px-6 sm:py-9"
                >
                  <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl transition-colors duration-500 ${on ? 'bg-white text-navy' : 'bg-paper text-orange'}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="flex-1">
                    <span className={`block font-display text-2xl font-light transition-colors duration-500 sm:text-4xl lg:text-[2.9rem] ${on ? 'text-white' : 'text-navy'}`}>{s.title}</span>
                    <span className={`mt-1 block text-sm transition-colors duration-500 sm:text-base ${on ? 'text-white/75' : 'text-ink/50'}`}>{s.tag}</span>
                  </span>
                  <motion.span animate={{ rotate: on ? 45 : 0 }} transition={{ duration: 0.4 }} className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors duration-500 ${on ? 'border-white/35 text-white' : 'border-ink/15 text-ink'}`}>
                    <Plus className="h-5 w-5" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease }}
                      className="relative overflow-hidden"
                    >
                      <div className="grid gap-6 pb-9 sm:px-6 sm:pl-[7.5rem] lg:grid-cols-[1fr_1.1fr]">
                        <p className="max-w-md text-base leading-relaxed text-white/80 sm:text-lg">{s.desc}</p>
                        <div className="flex flex-wrap content-start gap-2">
                          {(s.points || []).map((pt) => (
                            <span key={pt} className="rounded-full border border-white/20 px-4 py-2 text-sm text-white">{pt}</span>
                          ))}
                        </div>
                      </div>
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

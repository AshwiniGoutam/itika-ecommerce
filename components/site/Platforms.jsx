'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowUpRight } from 'lucide-react';
import HL from './HL';

const ease = [0.22, 1, 0.36, 1];

export default function Platforms({ data }) {
  const items = data.items || [];
  const [active, setActive] = useState(0);
  const p = items[active] || {};

  return (
    <section id="platforms" className="relative bg-paper pb-24 pt-32 text-ink sm:pb-32 sm:pt-40">
      <div className="container-x">
        <div className="max-w-3xl">
          <h2 className="h-section"><HL text={data.title} /></h2>
          <p className="mt-4 max-w-xl text-lg text-ink/60">{data.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <div role="tablist" aria-label="Marketplaces" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {items.map((it, i) => {
              const on = i === active;
              return (
                <button
                  key={it.name + i}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`group relative flex shrink-0 items-center gap-4 rounded-2xl px-5 py-4 text-left transition-colors lg:px-6 lg:py-5 ${on ? 'text-white' : 'text-ink/40 hover:text-ink'}`}
                >
                  {on && (
                    <motion.span layoutId="platform-pill" className="absolute inset-0 rounded-2xl bg-navy" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                  )}
                  <span className="relative h-3 w-3 shrink-0 rounded-full" style={{ background: it.color || '#FF6A13' }} />
                  <span className="relative font-display text-xl font-light sm:text-2xl lg:text-[2.1rem]">{it.name}</span>
                  <ArrowUpRight className={`relative ml-auto hidden h-6 w-6 transition-all lg:block ${on ? 'rotate-45 text-orange opacity-100' : 'opacity-0'}`} />
                </button>
              );
            })}
          </div>

          <div className="relative min-h-[440px] overflow-hidden rounded-[32px] border border-line bg-white p-8 text-ink shadow-[0_30px_60px_-40px_rgba(10,26,74,.35)] sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease }}
                className="relative z-10"
              >
                <div className="flex items-center justify-between gap-4">
                  {p.logo ? (
                    <img src={p.logo} alt={p.name} className="h-12 w-auto max-w-[180px] object-contain" />
                  ) : (
                    <span className="font-display text-5xl font-normal sm:text-6xl" style={{ color: p.color }}>{p.name}</span>
                  )}
                </div>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/65">{p.desc}</p>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {(p.highlights || []).map((h, i) => (
                    <motion.li
                      key={h}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
                      className="flex items-start gap-3 rounded-xl bg-paper p-3.5 text-sm text-ink/80"
                    >
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full" style={{ background: p.color }}>
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </span>
                      {h}
                    </motion.li>
                  ))}
                </ul>
                <a href="#contact" className="btn-primary mt-9">Grow my {p.name} store</a>
              </motion.div>
            </AnimatePresence>

            <motion.div
              key={`glow-${active}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 0.25, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full blur-[100px]"
              style={{ background: p.color }}
            />
            <span aria-hidden className="pointer-events-none absolute -bottom-8 right-6 select-none font-display text-[9rem] font-light leading-none text-navy/[0.05]">
              {String(active + 1).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import Logo from './Logo';
import { INTRO } from './Preloader';

const LINKS = [
  ['Marketplaces', '#platforms'],
  ['Services', '#services'],
  ['Results', '#results'],
  ['Process', '#process'],
  ['FAQ', '#faq'],
];

export default function Navbar({ brand }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <motion.header
      initial={{ y: -120 }}
      animate={{ y: 0 }}
      transition={{ delay: INTRO + 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 sm:px-5 ${
          scrolled ? 'border border-line bg-white/85 shadow-lg shadow-navy/5 backdrop-blur-xl' : 'border border-transparent'
        }`}
      >
        <a href="#top" aria-label="Home"><Logo brand={brand} /></a>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} className="group relative px-4 py-2 text-sm font-medium text-ink/60 transition-colors hover:text-ink">
              {label}
              <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-orange transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {brand.phone && (
            <a href={`tel:${brand.phone}`} className="flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink">
              <Phone className="h-4 w-4 text-orange" /> {brand.phone}
            </a>
          )}
          <a href="#contact" className="btn-primary !px-5 !py-2.5 !text-sm">Free audit</a>
        </div>

        <button onClick={() => setOpen((o) => !o)} className="grid h-10 w-10 place-items-center rounded-xl border border-ink/15 bg-white text-ink lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-line bg-white/95 p-3 shadow-xl backdrop-blur-xl lg:hidden"
          >
            {LINKS.map(([label, href], i) => (
              <motion.a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="block rounded-xl px-4 py-3 font-display text-lg font-light text-ink hover:bg-paper"
              >
                {label}
              </motion.a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full justify-center">Get a free audit</a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

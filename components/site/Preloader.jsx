'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';

export const INTRO = 1.7; // seconds until the hero starts its entrance
const ease = [0.76, 0, 0.24, 1];

export default function Preloader({ name }) {
  const [done, setDone] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    const c = animate(0, 100, { duration: 1.3, ease: 'easeInOut', onUpdate: (v) => setN(Math.round(v)) });
    const t = setTimeout(() => {
      setDone(true);
      document.documentElement.style.overflow = '';
    }, 1500);
    return () => { c.stop(); clearTimeout(t); document.documentElement.style.overflow = ''; };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="pre"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease }}
          style={{ clipPath: 'inset(0 0 0% 0)' }}
        >
          <div className="flex overflow-hidden font-display text-5xl font-normal tracking-[0.14em] text-navy sm:text-7xl">
            {name.split('').map((ch, i) => (
              <motion.span
                key={i}
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                {ch}
              </motion.span>
            ))}
          </div>
          <div className="mt-8 h-[2px] w-56 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full bg-orange" style={{ width: `${n}%` }} />
          </div>
          <p className="mt-4 font-display text-sm font-light tabular-nums text-ink/50">{n}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

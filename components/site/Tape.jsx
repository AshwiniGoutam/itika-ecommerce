'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Two crossing "sale tapes" — a nod to marketplace sale banners.
export default function Tape({ items = [] }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-20%', '0%']);
  const row = [...items, ...items, ...items];

  const Strip = ({ dark }) =>
    row.map((t, i) => (
      <span key={i} className="flex shrink-0 items-center gap-6 px-6">
        <span className={`font-display text-2xl font-light sm:text-4xl ${i % 2 && !dark ? 'text-outline' : ''}`}>{t}</span>
        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${dark ? 'text-orange' : 'text-white'}`} fill="currentColor" aria-hidden>
          <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
        </svg>
      </span>
    ));

  return (
    <div ref={ref} className="relative z-10 -my-10 overflow-hidden py-14" aria-hidden>
      <div className="-rotate-[3deg] scale-110 bg-orange py-4 text-white shadow-xl shadow-orange/20">
        <motion.div style={{ x: x1 }} className="flex whitespace-nowrap">
          <Strip />
        </motion.div>
      </div>
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 rotate-[2deg] scale-110 bg-navy py-3 text-white">
        <motion.div style={{ x: x2 }} className="flex whitespace-nowrap">
          <Strip dark />
        </motion.div>
      </div>
    </div>
  );
}

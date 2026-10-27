'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { words } from '@/lib/highlight';

function Word({ w, progress, range }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`mr-[0.25em] inline-block ${w.hl ? 'text-orange' : ''}`}>
      {w.w}
    </motion.span>
  );
}

// Words light up one by one as you scroll through the section.
export default function Statement({ text = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const list = words(text);
  return (
    <section className="bg-paper py-28 text-navy sm:py-40">
      <div ref={ref} className="container-x">
        <p className="max-w-5xl font-display text-[1.7rem] font-light leading-[1.3] tracking-tight sm:text-[2.8rem] lg:text-[3.3rem]">
          {list.map((w, i) => (
            <Word key={i} w={w} progress={scrollYProgress} range={[i / list.length, (i + 1) / list.length]} />
          ))}
        </p>
      </div>
    </section>
  );
}

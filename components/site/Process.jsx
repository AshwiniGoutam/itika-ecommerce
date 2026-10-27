'use client';
import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import HL from './HL';

export default function Process({ data }) {
  const items = data.items || [];
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <section id="process" className="bg-paper py-24 text-ink sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="h-section"><HL text={data.title} /></h2>
          <p className="mt-5 max-w-sm text-lg text-ink/60">Four steps, starting with a free audit of your store.</p>
          <a href="#contact" className="btn-primary mt-8">Start with step one</a>
        </div>

        <ol ref={ref} className="relative">
          <span className="absolute bottom-6 left-[27px] top-6 w-[2px] bg-ink/10" aria-hidden />
          <motion.span style={{ scaleY: fill }} className="absolute bottom-6 left-[27px] top-6 w-[2px] origin-top bg-orange" aria-hidden />
          {items.map((s, i) => (
            <motion.li
              key={s.title + i}
              initial={{ opacity: 0.3 }}
              whileInView={{ opacity: 1 }}
              viewport={{ margin: '-45% 0px -45% 0px' }}
              transition={{ duration: 0.4 }}
              className="relative flex gap-6 pb-14 last:pb-0 sm:gap-8"
            >
              <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-navy font-display text-lg font-light text-white shadow-lg shadow-navy/20">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="pt-2">
                <h3 className="font-display text-xl font-normal text-navy sm:text-2xl">{s.title}</h3>
                <p className="mt-3 max-w-lg leading-relaxed text-ink/60">{s.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

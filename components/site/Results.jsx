'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import HL from './HL';

const ease = [0.22, 1, 0.36, 1];
const HEIGHTS = [38, 56, 76, 100];
const STYLES = [
  'bg-white text-navy ring-1 ring-line',
  'bg-orange text-white',
  'bg-[#DCE3F2] text-navy',
  'bg-navy text-white',
];

function Counter({ value, suffix, run }) {
  const target = Number(value) || 0;
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    const c = animate(0, target, { duration: 2, ease, onUpdate: setN });
    return () => c.stop();
  }, [run, target]);
  const shown = Number.isInteger(target) ? Math.round(n).toLocaleString('en-IN') : n.toFixed(1);
  return <>{shown}{suffix}</>;
}

// Each stat is a bar in a rising chart — the same growth story as the brand.
export default function Results({ data }) {
  const items = data.items || [];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const h = (i) => HEIGHTS[Math.round((i / Math.max(items.length - 1, 1)) * (HEIGHTS.length - 1))];

  return (
    <section id="results" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="grid-lines absolute inset-0 opacity-70" />
      <div className="container-x relative">
        <div className="max-w-2xl">
          <h2 className="h-section"><HL text={data.title} /></h2>
          <p className="mt-4 text-lg text-ink/60">{data.subtitle}</p>
        </div>

        <div ref={ref} className="relative mt-16">
          <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-[420px] w-full md:block" aria-hidden>
            <motion.path
              d="M 60 330 C 250 300, 400 250, 520 190 S 800 60, 960 20"
              fill="none" stroke="#FF6A13" strokeWidth="2.5" strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ delay: 0.6, duration: 1.8, ease }}
            />
          </svg>

          <div className="grid h-[600px] grid-cols-2 grid-rows-2 items-end gap-4 md:h-[420px] md:grid-cols-4 md:grid-rows-1 md:gap-6">
            {items.map((s, i) => (
              <div key={s.label + i} className="flex h-full flex-col justify-end">
                <motion.div
                  className={`flex min-h-[150px] flex-col justify-between rounded-t-[28px] rounded-b-xl p-5 sm:p-6 ${STYLES[i % STYLES.length]}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={inView ? { height: `${h(i)}%`, opacity: 1 } : {}}
                  transition={{ delay: i * 0.15, duration: 1.1, ease }}
                >
                  <p className="font-display text-4xl font-light tracking-tight sm:text-5xl lg:text-6xl">
                    <Counter value={s.value} suffix={s.suffix} run={inView} />
                  </p>
                  <p className="mt-3 text-sm opacity-75 sm:text-base">{s.label}</p>
                </motion.div>
              </div>
            ))}
          </div>
          <div className="mt-px h-px bg-ink/15" />
        </div>
      </div>
    </section>
  );
}

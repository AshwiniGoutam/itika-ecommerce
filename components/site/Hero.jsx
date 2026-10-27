'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll, animate } from 'framer-motion';
import { Phone, ShoppingCart, BadgeCheck, TrendingUp, Star, ArrowUpRight } from 'lucide-react';
import { words } from '@/lib/highlight';
import Magnetic from './Magnetic';
import { INTRO } from './Preloader';

const ease = [0.22, 1, 0.36, 1];

function Rotator({ list }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (list.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % list.length), 2200);
    return () => clearInterval(t);
  }, [list.length]);
  if (!list.length) return null;
  return (
    <span className="relative inline-grid h-[1.35em] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.55, ease }}
          className="col-start-1 row-start-1 font-normal text-orange"
        >
          {list[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Count({ to = 0, prefix = '', delay = 0 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const c = animate(0, to, { duration: 2, delay, ease, onUpdate: setV });
    return () => c.stop();
  }, [to, delay]);
  return <>{prefix}{Math.round(v)}</>;
}

const BARS = [40, 55, 48, 80, 98, 132];
const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

function Chart() {
  const pts = BARS.map((h, i) => [38 + i * 64, 160 - h - 6]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  const d0 = INTRO + 0.9;
  return (
    <svg viewBox="0 0 400 170" className="mt-4 w-full overflow-visible">
      <defs>
        <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF6A13" stopOpacity=".22" />
          <stop offset="100%" stopColor="#FF6A13" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[40, 80, 120].map((y) => <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="rgba(10,26,74,.07)" />)}
      {BARS.map((h, i) => (
        <motion.rect
          key={i}
          x={20 + i * 64}
          width="36"
          rx="6"
          fill={i === BARS.length - 1 ? '#FF6A13' : i % 2 ? '#0A1A4A' : '#DCE3F2'}
          initial={{ height: 0, y: 160 }}
          animate={{ height: h, y: 160 - h }}
          transition={{ delay: d0 + i * 0.09, duration: 0.9, ease }}
        />
      ))}
      <motion.path
        d={`${line} L358,160 L38,160 Z`}
        fill="url(#area)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: d0 + 1, duration: 0.8 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="#FF6A13"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: d0 + 0.5, duration: 1.4, ease }}
      />
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: d0 + 1.8, type: 'spring' }}>
        <circle cx={pts[5][0]} cy={pts[5][1]} r="10" fill="#FF6A13" opacity=".25">
          <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={pts[5][0]} cy={pts[5][1]} r="5" fill="#fff" stroke="#FF6A13" strokeWidth="3" />
      </motion.g>
    </svg>
  );
}

function Floating({ children, className, delay = 0, float = 10, dur = 5 }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: INTRO + delay, duration: 0.8, ease }}
    >
      <motion.div animate={{ y: [0, -float, 0] }} transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut' }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

function Visual({ hero, platforms, rx, ry }) {
  const score = Number(hero.dashScore) || 0;
  const C = 2 * Math.PI * 18;
  return (
    <motion.div style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }} className="relative mx-auto aspect-square w-full max-w-[540px]">
      <motion.div
        className="absolute inset-[4%] rounded-full border border-dashed border-ink/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-[18%] rounded-full bg-orange/15 blur-[90px]" />

      {/* main dashboard card */}
      <motion.div
        initial={{ opacity: 0, y: 70, rotate: -4 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: INTRO + 0.35, duration: 1.1, ease }}
        className="glass-card absolute left-[7%] right-[7%] top-[17%] rounded-[28px] p-5 shadow-[0_40px_80px_-30px_rgba(10,26,74,.35)] sm:p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-orange" />
          </div>
          <span className="text-xs text-ink/50">Store revenue, last 6 months</span>
        </div>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-ink/50">Total sales</p>
            <p className="font-display text-3xl font-normal text-navy sm:text-4xl">{hero.dashRevenue}</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
            <TrendingUp className="h-4 w-4" /> {hero.dashGrowth}
          </span>
        </div>
        <Chart />
        <div className="mt-1 grid grid-cols-6 text-center text-[10px] text-ink/40">
          {MONTHS.map((m) => <span key={m}>{m}</span>)}
        </div>
      </motion.div>

      <Floating className="left-0 top-[3%] sm:-left-[4%]" delay={1.2} float={12}>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-ink shadow-xl shadow-navy/10">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange text-white"><ShoppingCart className="h-5 w-5" /></span>
          <div>
            <p className="text-[11px] text-ink/50">New orders</p>
            <p className="font-display text-base font-normal">{hero.dashOrders}</p>
          </div>
        </div>
      </Floating>

      <Floating className="right-0 top-[6%] sm:-right-[3%]" delay={1.4} float={8} dur={6}>
        <div className="flex items-center gap-3 rounded-2xl bg-navy px-4 py-3 shadow-xl shadow-navy/20">
          <svg viewBox="0 0 44 44" className="h-11 w-11 -rotate-90">
            <circle cx="22" cy="22" r="18" stroke="rgba(255,255,255,.15)" strokeWidth="4" fill="none" />
            <motion.circle
              cx="22" cy="22" r="18" stroke="#FF6A13" strokeWidth="4" fill="none" strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C * (1 - score / 100) }}
              transition={{ delay: INTRO + 1.6, duration: 1.6, ease }}
            />
          </svg>
          <div>
            <p className="text-[11px] text-white/60">Listing quality</p>
            <p className="font-display text-base font-normal text-white"><Count to={score} delay={INTRO + 1.6} />/100</p>
          </div>
        </div>
      </Floating>

      <Floating className="bottom-[8%] left-[2%]" delay={1.6} float={9} dur={5.5}>
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-800 shadow-lg shadow-emerald-900/10">
          <BadgeCheck className="h-5 w-5" /> Buy Box won
        </div>
      </Floating>

      <Floating className="bottom-[2%] right-[4%]" delay={1.8} float={11} dur={6.5}>
        <div className="rounded-2xl border border-line bg-white p-3 shadow-xl shadow-navy/10">
          <p className="mb-2 px-1 text-[11px] text-ink/50">Live on</p>
          <div className="flex max-w-[220px] flex-wrap gap-1.5">
            {platforms.map((p) => (
              <span key={p} className="rounded-full bg-paper px-2.5 py-1 text-[11px] font-medium text-ink/80">{p}</span>
            ))}
          </div>
        </div>
      </Floating>
    </motion.div>
  );
}

export default function Hero({ hero, brand, platforms }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 80, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 80, damping: 18 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const arrowY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const lines = [hero.titleLine1, hero.titleLine2].filter(Boolean);
  let wi = 0;

  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="relative isolate min-h-[100svh] overflow-hidden bg-white pb-16 pt-28 sm:pt-32 lg:pb-24"
    >
      {/* ambient background */}
      <div className="grid-lines absolute inset-0 -z-10" />
      <motion.div
        className="absolute -left-40 top-1/3 -z-10 h-[520px] w-[520px] rounded-full bg-[#DCE5FF] opacity-70 blur-[120px]"
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-32 -top-32 -z-10 h-[460px] w-[460px] rounded-full bg-orange/20 blur-[140px]"
        animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* the signature: one growth arrow sweeping across the whole hero */}
      <motion.svg style={{ y: arrowY }} viewBox="0 0 1440 900" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 -z-[5] h-full w-full" aria-hidden>
        <motion.path
          d="M -40 860 C 300 820, 520 700, 760 560 S 1180 260, 1390 110"
          fill="none" stroke="#FF6A13" strokeWidth="70" strokeLinecap="round" opacity=".07"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: INTRO, duration: 2.2, ease }}
        />
        <motion.path
          d="M -40 860 C 300 820, 520 700, 760 560 S 1180 260, 1390 110"
          fill="none" stroke="#FF6A13" strokeWidth="2" strokeLinecap="round" opacity=".75"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: INTRO, duration: 2.2, ease }}
        />
        <motion.path
          d="M 1340 112 L 1392 108 L 1372 158"
          fill="none" stroke="#FF6A13" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: INTRO + 2.1, duration: 0.4 }}
        />
      </motion.svg>

      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
        <motion.div style={{ y: textY, opacity: fade }}>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: INTRO, duration: 0.7, ease }}
            className="inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-white py-1.5 pl-2 pr-4 text-sm text-ink/70 shadow-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange" />
            </span>
            {hero.badge}
          </motion.span>

          <h1 className="mt-7 font-display text-[2.4rem] font-light leading-[1.08] tracking-[-0.02em] text-navy sm:text-6xl lg:text-[3.7rem] xl:text-[4.3rem]">
            {lines.map((line, li) => (
              <span key={li} className="block">
                {words(line).map((w) => {
                  const k = wi++;
                  return (
                    <span key={k} className="mr-[0.22em] inline-block overflow-hidden pb-[0.1em] align-bottom last:mr-0">
                      <motion.span
                        className={`inline-block ${w.hl ? 'text-orange-grad font-normal' : ''}`}
                        initial={{ y: '115%', rotate: 6 }}
                        animate={{ y: '0%', rotate: 0 }}
                        transition={{ delay: INTRO + 0.15 + k * 0.08, duration: 1, ease }}
                      >
                        {w.w}
                      </motion.span>
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: INTRO + 0.6, duration: 0.8, ease }}
            className="mt-6 font-display text-lg font-light text-navy sm:text-xl"
          >
            {hero.rotatingPrefix} <Rotator list={platforms} /> {hero.rotatingSuffix}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: INTRO + 0.75, duration: 0.8, ease }}
            className="mt-4 max-w-xl text-base leading-relaxed text-ink/60 sm:text-lg"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: INTRO + 0.9, duration: 0.8, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <a href="#contact" className="btn-primary group">
                {hero.ctaPrimary}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
            {brand.phone && (
              <Magnetic strength={0.2}>
                <a href={`tel:${brand.phone}`} className="btn-ghost">
                  <Phone className="h-4 w-4 text-orange" /> {hero.ctaSecondary} {brand.phone}
                </a>
              </Magnetic>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: INTRO + 1.1, duration: 0.8 }}
            className="mt-10 flex items-center gap-4"
          >
            <div className="flex -space-x-2">
              {['#FF9A4D', '#5B7BFF', '#F43397', '#22C55E'].map((c, i) => (
                <span key={i} className="grid h-9 w-9 place-items-center rounded-full border-2 border-white text-xs font-medium text-white" style={{ background: c }}>
                  {'RPAS'[i]}
                </span>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5 text-orange">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
              </div>
              <p className="mt-0.5 text-sm text-ink/55">{hero.trustText}</p>
            </div>
          </motion.div>
        </motion.div>

        <Visual hero={hero} platforms={platforms} rx={rx} ry={ry} />
      </div>
    </section>
  );
}

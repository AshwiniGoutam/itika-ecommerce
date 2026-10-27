'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Logo from './Logo';

export default function Footer({ brand, footer }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const y = useTransform(scrollYProgress, [0, 1], ['40%', '0%']);
  const year = new Date().getFullYear();

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-line bg-paper pt-20">
      <div className="container-x grid gap-10 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo brand={brand} />
          <p className="mt-5 max-w-sm text-ink/55">{footer.about}</p>
        </div>
        <div>
          <p className="font-display text-sm font-normal text-navy">Explore</p>
          <ul className="mt-4 space-y-2.5 text-ink/60">
            {[['Marketplaces', '#platforms'], ['Services', '#services'], ['Process', '#process'], ['FAQ', '#faq'], ['Free audit', '#contact']].map(([l, h]) => (
              <li key={h}><a href={h} className="transition hover:text-orange">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-display text-sm font-normal text-navy">Contact</p>
          <ul className="mt-4 space-y-2.5 text-ink/60">
            {brand.phone && <li><a href={`tel:${brand.phone}`} className="hover:text-orange">{brand.phone}</a></li>}
            {brand.email && <li><a href={`mailto:${brand.email}`} className="break-all hover:text-orange">{brand.email}</a></li>}
            {brand.instagram && <li><a href={brand.instagram} target="_blank" rel="noreferrer" className="hover:text-orange">{brand.instagramHandle || 'Instagram'}</a></li>}
          </ul>
        </div>
      </div>

      <div className="container-x flex flex-wrap items-center justify-between gap-3 border-t border-line py-6 text-sm text-ink/45">
        <span>© {year} {footer.copyright}</span>
        <a href="#top" className="hover:text-ink">Back to top</a>
      </div>

      <div className="pointer-events-none select-none overflow-hidden" aria-hidden>
        <motion.p style={{ y }} className="text-center font-display text-[24vw] font-light leading-[0.8] tracking-tight text-navy/[0.06]">
          {brand.name || 'ITIKA'}
        </motion.p>
      </div>
    </footer>
  );
}

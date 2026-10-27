'use client';
import { Star } from 'lucide-react';
import HL from './HL';

function Card({ t }) {
  const initials = (t.name || '?').split(' ').map((p) => p[0]).slice(0, 2).join('');
  return (
    <figure className="w-[320px] shrink-0 rounded-3xl border border-line bg-white p-7 shadow-sm sm:w-[400px]">
      <div className="flex gap-0.5 text-orange">
        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
      </div>
      <blockquote className="mt-5 text-lg leading-relaxed text-ink/80">“{t.quote}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        {t.avatar ? (
          <img src={t.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <span className="grid h-11 w-11 place-items-center rounded-full bg-paper text-sm font-medium text-navy">{initials}</span>
        )}
        <span>
          <span className="block font-medium text-ink">{t.name}</span>
          <span className="block text-sm text-ink/50">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Testimonials({ data }) {
  const items = data.items || [];
  if (!items.length) return null;
  const row = [...items, ...items];
  return (
    <section className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="container-x">
        <h2 className="h-section max-w-2xl"><HL text={data.title} /></h2>
      </div>
      <div className="marquee-pause relative mt-14 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee flex w-max gap-5" style={{ '--speed': `${items.length * 9}s` }}>
          {row.map((t, i) => <Card key={i} t={t} />)}
        </div>
      </div>
    </section>
  );
}

'use client';
import { MotionConfig } from 'framer-motion';
import Preloader from './Preloader';
import Navbar from './Navbar';
import Hero from './Hero';
import Tape from './Tape';
import Platforms from './Platforms';
import Services from './Services';
import Statement from './Statement';
import Results from './Results';
import Process from './Process';
import Testimonials from './Testimonials';
import Faq from './Faq';
import Contact from './Contact';
import Footer from './Footer';
import { ScrollProgress, CursorGlow, WhatsAppFab } from './Extras';

export default function Site({ content: c = {} }) {
  const brand = c.brand || {};
  const platformNames = (c.platforms?.items || []).map((p) => p.name);
  return (
    <MotionConfig reducedMotion="user">
      <Preloader name={brand.name || 'ITIKA'} />
      <ScrollProgress />
      <CursorGlow />
      <Navbar brand={brand} />
      <main id="top">
        <Hero hero={c.hero || {}} brand={brand} platforms={platformNames} />
        <Tape items={c.tape?.items || platformNames} />
        <Platforms data={c.platforms || {}} />
        <Services data={c.services || {}} />
        <Statement text={c.statement?.text} />
        <Results data={c.results || {}} />
        <Process data={c.process || {}} />
        <Testimonials data={c.testimonials || {}} />
        <Faq data={c.faq || {}} brand={brand} />
        <Contact data={c.contact || {}} brand={brand} platforms={platformNames} />
      </main>
      <Footer brand={brand} footer={c.footer || {}} />
      <WhatsAppFab brand={brand} />
    </MotionConfig>
  );
}
